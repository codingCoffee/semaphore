"use client";

import { useZero } from "@/components/zero-provider";
import { useQuery } from "@rocicorp/zero/react";

import { usePathname } from "next/navigation";
import { BottomMessageTextArea } from "@/components/BottomMessageTextArea";

import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function ChatPage() {
  const pathname = usePathname();
  let chatId = pathname.split("/")[2];

  const z = useZero();
  const [LLMResponseInstances] = useQuery(
    z.query.LLMResponse.where("chatId", chatId).orderBy("createdAt", "asc"),
  );

  return (
    <div className="flex flex-1 flex-col justify-end items-center">
      <div className="w-[47%]">
        {LLMResponseInstances.map((item) => (
          <div key={item.id}>
            <div className="flex justify-end">
              <div className="dark:bg-red-900 bg-red-200 p-2 rounded-lg">
                {item.question}
              </div>
            </div>
            <div className="p-5 pt-10 rounded-lg markdown">
              <MarkdownRenderer markdown={item.answer} />
            </div>
          </div>
        ))}
      </div>

      <BottomMessageTextArea />
    </div>
  );
}
