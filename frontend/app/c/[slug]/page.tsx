"use client";

import { useEffect, useRef } from "react";
import { Separator } from "@/components/ui/separator";

import { useZero, useQuery } from "@rocicorp/zero/react";

import { usePathname } from "next/navigation";
import { BottomMessageTextArea } from "@/components/BottomMessageTextArea";
import { Icon } from "@iconify/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Link from "next/link";
import { Button } from "@/components/ui/button";

import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function ChatPage() {
  const pathname = usePathname();
  let chatId = pathname.split("/")[2].slice(-36);

  const z = useZero();

  const [LLMResponseInstances] = useQuery(
    z.query.llmResponse
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
    <>
      {LLMResponseInstances.length > 0 ? (
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
                    <div>
                      <MarkdownRenderer markdown={item.answer} />
                      <Separator className="my-2" />
                      <div className="flex justify-between text-gray-400 text-xs">
                        <div>{item.llm}</div>
                        <div>
                          {new Date(item.createdAt).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Icon icon="svg-spinners:pulse-multiple" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <BottomMessageTextArea endOfMessagesRef={endOfMessagesRef} />
        </div>
      ) : (
        <div className="flex flex-1 flex-col justify-center items-center pt-10 pb-40">
          <div className="md:w-[786px] w-[95%]">
            <div className="flex flex-1 flex-col items-center">
              <p>This chat is either private or does not exist!</p>
              <div className="pt-5">
                <Button variant="outline">
                  <Link href="/" className="cursor-pointer">
                    <div className="cursor-pointer">Start a new chat</div>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* This div will act as the scroll target */}
      <div ref={endOfMessagesRef} />
    </>
  );
}
