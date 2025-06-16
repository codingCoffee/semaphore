import { db } from "@/db/index";
import { LLMResponse } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function main() {
  const message = "hi how are you?";
  const model = "openai/gpt-4o-mini";
  const chatId = "4219d8b6-3ac5-405b-9240-39c29a3cb352";

  const LLMResponseInstances = await db
    .insert(LLMResponse)
    .values({
      chat: chatId,
      llm: model,
      question: message,
      answer: "",
    })
    .returning({
      id: LLMResponse.id,
    });
  const LLMResponseInstance = LLMResponseInstances[0];

  try {
    const response = await fetch(
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

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const reader = response.body?.getReader();
    if (!reader) throw new Error("Failed to get response reader");

    let completeResponse = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += new TextDecoder().decode(value);
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
  } catch (error) {
    console.error("Error:", error);
  }

  // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  // const reader = openRouterResponse.body?.getReader();
  // const decoder = new TextDecoder();
  // let aiResponse = "";
  //
  // const stream = new ReadableStream({
  //   async start(controller) {
  //     while (true) {
  //       const { done, value } = await reader!.read();
  //       if (done) break;
  //
  //       const chunk = decoder.decode(value);
  //       console.log("chunk:", chunk);
  //       aiResponse += chunk;
  //       console.log("aiResponse", aiResponse);
  //
  //       // Save each chunk to database
  //       console.log("pushing to db");
  //       await db
  //         .insert(LLMResponse)
  //         .values({
  //           id: LLMResponseInstance.id,
  //         })
  //         .onConflictDoUpdate({
  //           target: LLMResponse.id,
  //           set: {
  //             answer: aiResponse,
  //           },
  //         });
  //       console.log("pushed to db");
  //
  //       controller.enqueue(value);
  //     }
  //     controller.close();
  //   },
  // });
}

main();
