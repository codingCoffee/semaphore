"use client";

import { useEffect, useRef } from "react";

import { useZero, useQuery } from "@rocicorp/zero/react";

import { usePathname } from "next/navigation";
import { BottomMessageTextArea } from "@/components/BottomMessageTextArea";
import { Icon } from "@iconify/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function ChatPage() {
  const pathname = usePathname();
  let chatId = pathname.split("/")[2];

  const z = useZero();

  const [LLMResponseInstances] = useQuery(
    z.query.llmResponses
      .related("creator")
      .where("chatId", chatId)
      .orderBy("createdAt", "asc"),
  );

  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [LLMResponseInstances]);

  return (
    <div className="flex flex-1 flex-col justify-end items-center pt-10 pb-40">
      <div className="md:w-[786px] w-[95%]">
        {LLMResponseInstances.map((item) => (
          <div key={item.id}>
            <div className="flex justify-end gap-1">
              <div className="max-w-[90%] dark:bg-red-900 bg-red-200 p-2 rounded-lg markdown">
                <MarkdownRenderer markdown={item.question} />
              </div>
              <div>
                <Avatar className="h-10 w-10 max-h-10 mt-4 rounded-full">
                  <AvatarImage
                    src={
                      item.creator?.image ||
                      `https://api.dicebear.com/9.x/notionists/svg?flip=true&nose=variant01&backgroundColor=fecaca,7f1d1d&backgroundType=gradientLinear&seed=${item.creator?.id}`
                    }
                    alt={item.question?.user?.name || "Anonymous User"}
                  />
                  <AvatarFallback>
                    <img
                      src={`https://api.dicebear.com/9.x/notionists/svg?flip=true&nose=variant01&backgroundColor=fecaca,7f1d1d&backgroundType=gradientLinear&seed=${item.creator?.id}`}
                      alt={item.question?.user?.name || "Anonymous User"}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="p-5 pt-10 rounded-lg markdown">
              {item.answer ? (
                <MarkdownRenderer markdown={item.answer} />
              ) : (
                <Icon icon="svg-spinners:pulse-multiple" />
              )}
            </div>
          </div>
        ))}
        {/* This div will act as the scroll target */}
        <div ref={endOfMessagesRef} />
      </div>

      <BottomMessageTextArea endOfMessagesRef={endOfMessagesRef} />
    </div>
  );
}
