import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { asc, eq } from "drizzle-orm";
import { after } from "next/server";

import { chats, llmResponses } from "@/db/schema";

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
    .update(chats)
    .set({
      title: data.choices[0].message.content,
    })
    .where(eq(chats.id, LLMResponseInstance.chatId));
}

async function callOpenRouterBackgroundTask(
  LLMResponseInstance: any,
  model: string,
  message: string,
) {
  const llmResponseInstances = await db
    .select()
    .from(llmResponses)
    .where(eq(llmResponses.chatId, LLMResponseInstance.chatId))
    .orderBy(asc(llmResponses.createdAt));
  const messages = [
    {
      role: "system",
      content: `You are the a helpful assistant, named Semaphore created by Ameya Shenoy.

Whenever referencing yourself add the link https://semaphore.chat on your name. And whenever referencing Ameya Shenoy, add the link https://codingcoffee.dev on his name`,
    },
  ];
  for (const interaction of llmResponseInstances) {
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
        const trimmedData = trimmed.replace("data: ", "");
        if (trimmedData === ": OPENROUTER PROCESSING") continue;
        const json = JSON.parse(trimmedData);
        const delta = json.choices[0]?.delta;
        const chunk = delta?.content;
        if (chunk) {
          completeResponse += chunk;
          await db
            .update(llmResponses)
            .set({
              answer: completeResponse,
            })
            .where(eq(llmResponses.id, LLMResponseInstance.id));
        }
      } catch (e) {
        console.error("Error parsing chunk:", e);
      }
    }
  }
}

export async function POST(req: Request) {
  let { message, model, chatId } = await req.json();

  let chatInstance = null;
  if (chatId === null) {
    const chatInstances = await db
      .insert(chats)
      .values({
        title: chatTitlePlaceholder,
        isPublic: false,
      })
      .returning({
        id: chats.id,
        title: chats.title,
      });
    chatInstance = chatInstances[0];
    chatId = chatInstance.id;
  }

  const LLMResponseInstances = await db
    .insert(llmResponses)
    .values({
      chatId: chatId,
      llm: model,
      question: message,
      answer: "",
    })
    .returning({
      id: llmResponses.id,
      chatId: llmResponses.chatId,
    });
  const LLMResponseInstance = LLMResponseInstances[0];

  after(() => {
    if (chatInstance && chatInstance.title === chatTitlePlaceholder) {
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
