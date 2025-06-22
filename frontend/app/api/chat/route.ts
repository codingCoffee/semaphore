import { db } from "@/db/index";
import { asc, eq } from "drizzle-orm";
import { after } from "next/server";
import { auth } from "@/lib/auth";

import { SearxngClient } from "@agentic/searxng";
import axios from "axios";
import * as cheerio from "cheerio";

import { chats, llmResponses } from "@/db/schema";

const chatTitlePlaceholder = " * * * ";

/**
 * Fetches the content of a website and returns its main text content.
 * @param url The website URL to crawl.
 * @returns The main text content of the website as a string.
 */
async function crawlAndExtractText(url: string): Promise<string> {
  console.log(`Trying to scrape: ${url}`);
  try {
    // Fetch the HTML
    const response = await axios.get(url);
    const html = response.data;

    // Parse the HTML and extract text
    const $ = cheerio.load(html);
    // Remove script and style tags to get clean text
    $("script, style").remove();
    // Extract text from the body
    const text = $("body").text();

    return text;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Failed to fetch ${url}: ${error}`);
    } else {
      console.error("An unexpected error occurred");
    }
    return "";
  }
}

async function getContextFromUrls(urls: string[]): Promise<string> {
  let result = "";
  for (const url of urls) {
    const text = await crawlAndExtractText(url);
    result += text;
  }
  return result;
}

async function updateChatTitleBackgroundTask(
  LLMResponseInstance: any,
  message: string,
  byokKey: string | null,
) {
  const openRouterKeyToUse = byokKey || process.env.OPENROUTER_API_KEY;
  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openRouterKeyToUse}`,
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
  byokKey: string | null,
  isSearchQuery: boolean,
) {
  const openRouterKeyToUse = byokKey || process.env.OPENROUTER_API_KEY;

  let openRouterResponse;
  const messages = [
    {
      role: "system",
      content: `You are the a helpful assistant, named Semaphore created by Ameya Shenoy.

Whenever referencing yourself add the link https://semaphore.chat on your name. And whenever referencing Ameya Shenoy, add the link https://codingcoffee.dev on his name`,
    },
  ];

  if (isSearchQuery) {
    const searxng = new SearxngClient();
    const res = await searxng.search({
      query: message,
      engines: ["google"],
    });
    const limRes = res.results.slice(0, 3);

    let context = await getContextFromUrls(limRes.map((res) => res.url));

    messages.push({
      role: "user",
      content: `Answer this user's query from the given context. Alwawys provide references to URLs while responding.

QUERY: ${message}


---
CONTEXT: ${context}

---
`,
    });
    openRouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openRouterKeyToUse}`,
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
  } else {
    const llmResponseInstances = await db
      .select()
      .from(llmResponses)
      .where(eq(llmResponses.chatId, LLMResponseInstance.chatId))
      .orderBy(asc(llmResponses.createdAt));
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
    openRouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openRouterKeyToUse}`,
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
  }

  if (!openRouterResponse.ok) {
    console.error(openRouterResponse);
    throw new Error(`HTTP error! status: ${openRouterResponse.status}`);
  }
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
  await db
    .update(llmResponses)
    .set({
      isPending: false,
    })
    .where(eq(llmResponses.id, LLMResponseInstance.id));
}

export async function POST(req: Request) {
  let { message, model, chatId, byokKey, isSearchQuery } = await req.json();
  const session = await auth();

  let chatInstance = null;
  if (chatId === null) {
    const chatInstances = await db
      .insert(chats)
      .values({
        title: chatTitlePlaceholder,
        isPublic: false,
        createdBy: session?.user.id,
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
      createdBy: session?.user.id,
    })
    .returning({
      id: llmResponses.id,
      chatId: llmResponses.chatId,
    });
  const LLMResponseInstance = LLMResponseInstances[0];

  after(() => {
    if (chatInstance && chatInstance.title === chatTitlePlaceholder) {
      updateChatTitleBackgroundTask(LLMResponseInstance, message, byokKey);
    }
    callOpenRouterBackgroundTask(
      LLMResponseInstance,
      model,
      message,
      byokKey,
      isSearchQuery,
    );
  });

  return Response.json({
    id: chatId,
    message: "Request received, background task scheduled",
  });
  // return new NextResponse(stream, {
  //   headers: { "Content-Type": "text/event-stream" },
  // });
}
