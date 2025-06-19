"use client";

import { useEffect, useRef } from "react";

import { useZero, useQuery } from "@rocicorp/zero/react";

import { usePathname } from "next/navigation";
import { BottomMessageTextArea } from "@/components/BottomMessageTextArea";

import { Sparkles } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const pathname = usePathname();
  let chatId = pathname.split("/")[2];

  const z = useZero();

  const [LLMResponseInstances] = useQuery(
    z.query.llmResponses.where("chatId", chatId).orderBy("createdAt", "asc"),
  );

  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [LLMResponseInstances]);

  console.log("LLMResponseInstances:", LLMResponseInstances)

  return (
    <div className="flex flex-1 flex-col justify-end items-center pt-10 pb-40">
      {LLMResponseInstances.length > 0 ? (
        <>
          <div className="md:w-[786px] w-[95%]">
            {LLMResponseInstances.map((item) => (
              <div key={item.id}>
                <div className="flex justify-end">
                  <div className="dark:bg-red-900 bg-red-200 p-2 rounded-lg markdown">
                    <MarkdownRenderer markdown={item.question} />
                  </div>
                </div>
                <div className="p-5 pt-10 rounded-lg markdown">
                  <MarkdownRenderer markdown={item.answer ? item.answer : ""} />
                </div>
              </div>
            ))}
            {/* This div will act as the scroll target */}
            <div ref={endOfMessagesRef} />
          </div>

          <BottomMessageTextArea endOfMessagesRef={endOfMessagesRef} />
        </>
      ) : (
        <div className="flex flex-col h-full items-center space-y-2 mt-16">
          <div className="p-3 rounded-full">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-semibold text-center">
            This Chat Doesn't Exist
          </h1>
          <p className="text-gray-400 text-center max-w-lg">
            I'm Semaphore, an AI assistant, designed to help answer questions,
            provide insights, and facilitate communication seamlessly.
            <br />
            <br />
            You can ask me anything, from drafting an email to details about my
            creator!
          </p>
          <Link href="/">
            <Button variant="outline" className="cursor-pointer">
              Start a New Chat
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
