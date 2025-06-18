import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { asc, eq } from "drizzle-orm";
import { after } from "next/server";

import { Chat, LLMResponse } from "@/db/schema";

const chatTitlePlaceholder = " * * * ";

async function updateChatTitleBackgroundTask(
  LLMResponseInstance: any,
  message: string,
) {
  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://semaphore.chat",
      "X-Title": "Semaphore Chat",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Summerize the user's query to generate a concise and descriptive title (max 10 words) capturing its main topic and intent. Always start the response with the most relevant emoji",
        },
        { role: "user", content: message },
      ],
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
  const llmResponses = await db
    .select()
    .from(LLMResponse)
    .where(eq(LLMResponse.chatId, LLMResponseInstance.chatId))
    .orderBy(asc(LLMResponse.createdAt));
  const messages = [
    {
      role: "system",
      content: `You are the a helpful assistant, named Semaphore created by Ameya Shenoy.

Whenever referencing yourself add the link https://semaphore.chat on your name. And whenever referencing Ameya Shenoy, add the link https://codingcoffee.dev on his name`,
    },
  ];
  for (const interaction of llmResponses) {
    messages.push({
      role: "user",
      content: interaction.question,
    });
    if (interaction.answer) {
      messages.push({
        role: "assistant",
        content: interaction.answer,
      });
    }
  }

  const openRouterResponse = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://semaphore.chat",
        "X-Title": "Semaphore Chat",
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
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
  }
}

export async function POST(req: Request) {
  let { message, model, chatId } = await req.json();

  let ChatInstance = null;
  if (chatId === null) {
    const ChatInstances = await db
      .insert(Chat)
      .values({
        title: chatTitlePlaceholder,
        isPublic: false,
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
      updateChatTitleBackgroundTask(LLMResponseInstance, message);
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
