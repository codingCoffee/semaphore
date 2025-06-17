import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { eq } from "drizzle-orm";
import { after } from "next/server";

import { Chat, LLMResponse } from "@/db/schema";

const chatTitlePlaceholder = " * * * ";

async function updateChatTitle(LLMResponseInstance: any, message: string) {
  const content = `Generate a concise, descriptive title (max 10 words) for the user query below to an LLM, summarizing its main topic and intent.

${message}
`;
  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://codingcoffee.dev",
      "X-Title": "Semaphore Chat",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: content }],
      stream: false,
    }),
  });

  const data = await resp.json();
  await db
    .update(Chat)
    .set({
      title: data.choices[0].message.content,
    })
    .where(eq(Chat.id, LLMResponseInstance.chatId));
}

async function callOpenRouterBackgroundTask(
  LLMResponseInstance: any,
  model: string,
  message: string,
) {
  const openRouterResponse = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://codingcoffee.dev",
        "X-Title": "Semaphore Chat",
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: message }],
        stream: true,
      }),
    },
  );

  if (!openRouterResponse.ok)
    throw new Error(`HTTP error! status: ${openRouterResponse.status}`);
  const reader = openRouterResponse.body?.getReader();
  if (!reader) throw new Error("Failed to get response reader");

  const decoder = new TextDecoder();
  let completeResponse = "";
  let buffer = "";

  const stream = new ReadableStream({
    async start(controller) {
      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        buffer += decoder.decode(value);
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === "data: [DONE]") continue;

          try {
            const json = JSON.parse(trimmed.replace("data: ", ""));
            const delta = json.choices[0]?.delta;
            const chunk = delta?.content;
            if (chunk) {
              console.log("Received chunk:", chunk);
              completeResponse += chunk;
              await db
                .update(LLMResponse)
                .set({
                  answer: completeResponse,
                })
                .where(eq(LLMResponse.id, LLMResponseInstance.id));
            }
            console.log("completeResponse: ", completeResponse);
          } catch (e) {
            console.error("Error parsing chunk:", e);
          }
        }
        controller.enqueue(value);
      }
      controller.close();
    },
  });
}

export async function POST(req: Request) {
  let { message, chatId } = await req.json();
  const model = "openai/gpt-4o-mini";

  let ChatInstance = null;
  if (chatId === null) {
    const ChatInstances = await db
      .insert(Chat)
      .values({
        title: chatTitlePlaceholder,
        is_public: false,
        createdBy: "cceae8f8-042e-44a4-9139-799fbee1cbbb",
      })
      .returning({
        id: Chat.id,
        title: Chat.title,
      });
    ChatInstance = ChatInstances[0];
    chatId = ChatInstance.id;
  }

  const LLMResponseInstances = await db
    .insert(LLMResponse)
    .values({
      chatId: chatId,
      llm: model,
      question: message,
      answer: "",
    })
    .returning({
      id: LLMResponse.id,
      chatId: LLMResponse.chatId,
    });
  const LLMResponseInstance = LLMResponseInstances[0];

  after(() => {
    if (ChatInstance && ChatInstance.title === chatTitlePlaceholder) {
      updateChatTitle(LLMResponseInstance, message);
    }
    callOpenRouterBackgroundTask(LLMResponseInstance, model, message);
  });

  return Response.json({
    id: chatId,
    message: "Request received, background task scheduled",
  });
  // return new NextResponse(stream, {
  //   headers: { "Content-Type": "text/event-stream" },
  // });
}
