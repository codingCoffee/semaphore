"use client";

import React, { RefObject } from "react";

import { usePathname, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowUp, Paperclip, Search } from "lucide-react";
import { AutosizeTextArea } from "@/components/AutoResizeTextArea";
import { useCallback, useState } from "react";

import Link from "next/link";

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
  endOfMessagesRef: RefObject<HTMLDivElement | null>;
};

export function BottomMessageTextArea({
  endOfMessagesRef,
}: BottomMessageTextAreaProps) {
  const pathname = usePathname();
  let chatId = null;
  if (pathname.startsWith("/c/")) {
    chatId = pathname.split("/")[2];
  }

  const [aiModel, setAIModel] = useState("openai/gpt-4.1-nano");
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
        setIsDisabled(true);
        const requiredPathname = `/c/${data.id}`;
        if (pathname !== requiredPathname) {
          redirect(requiredPathname);
        } else {
          if (endOfMessagesRef && endOfMessagesRef.current) {
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
    <div className="md:w-[786px] w-[95%] fixed bottom-0 z-20 pb-5">
      <div className="rounded-3xl backdrop-blur-3xl p-5">
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
                  document
                    .querySelector<HTMLButtonElement>('button[type="submit"]')
                    ?.click(); // Trigger the submit button click
                }
              }}
            />
            <div className="flex justify-between gap-5 items-center">
              <div className="flex items-center gap-5 p-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="md:max-w-96 max-w-40 truncate"
                    >
                      {aiModel}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-100">
                    <DropdownMenuLabel>Available Models</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={aiModel}
                      onValueChange={setAIModel}
                    >
                      {models
                        .filter(
                          (model) =>
                            model.architecture?.input_modalities?.includes(
                              "text",
                            ) &&
                            parseFloat(model.pricing?.prompt || "1") <=
                              0.0000001,
                        )
                        .sort((a, b) => (a.name > b.name ? 1 : -1))
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
              <div className="flex">
                <div className="p-1">
                  <Link href="/">
                    <Button variant="outline" className="cursor-pointer">
                      New Chat
                    </Button>
                  </Link>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-1">
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
