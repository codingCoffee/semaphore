"use client";

import React, { RefObject } from "react";

import { usePathname, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowUp, Paperclip, Search } from "lucide-react";
import { AutosizeTextArea } from "@/components/AutoResizeTextArea";
import { useCallback, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import models from "@/data/openrouterModels.json";

type BottomMessageTextAreaProps = {
  endOfMessagesRef: RefObject<HTMLDivElement>;
};

export function BottomMessageTextArea({
  endOfMessagesRef,
}: BottomMessageTextAreaProps) {
  const pathname = usePathname();
  let chatId = null;
  if (pathname.startsWith("/c/")) {
    chatId = pathname.split("/")[2];
  }

  const [aiModel, setAIModel] = useState("google/gemma-3-12b-it:free");
  const [input, setInput] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (isDisabled) {
        return;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: input,
          chatId: chatId,
          model: aiModel,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        setInput("");
        const requiredPathname = `/c/${data.id}`;
        if (pathname !== requiredPathname) {
          redirect(requiredPathname);
        } else {
          if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }
      } else {
        console.error("Failed to create chat thread");
      }
    },
    [input],
  );

  return (
    <div className="md:w-[786px] w-[95%] border-2 border-black-500 rounded-t-3xl p-1 fixed bottom-0 z-20 backdrop-blur-3xl">
      <div className="border-2 border-black-500 rounded-t-3xl">
        <div>
          <form onSubmit={handleSubmit}>
            <AutosizeTextArea
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setIsDisabled(e.target.value === "");
              }}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                  e.preventDefault(); // Prevent the default action
                  document.querySelector('button[type="submit"]')?.click(); // Trigger the submit button click
                }
              }}
            />
            <div className="flex justify-between gap-5 items-center">
              <div className="flex items-center gap-5 p-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">{aiModel}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Available Models</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={aiModel}
                      onValueChange={setAIModel}
                    >
                      {models
                        .filter(
                          (model) =>
                            model.id?.includes("openai") ||
                            model.id?.includes("google"),
                        )
                        .map((model) => (
                          <DropdownMenuRadioItem
                            key={model.id}
                            value={model.id}
                          >
                            {model.name?.split("/").pop()}
                          </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      className={`cursor-pointer ${isDisabled ? "pointer-events-none opacity-50" : ""}`}
                      disabled={isDisabled}
                      type="submit"
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isDisabled ? "Message requires text" : "Send"}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
