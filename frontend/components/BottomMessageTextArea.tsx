"use client";

import React, { RefObject } from "react";

import { usePathname, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Globe, ArrowUp, BadgePlus } from "lucide-react";
import { AutosizeTextArea } from "@/components/AutoResizeTextArea";
import { useCallback, useState } from "react";
import { useStorage } from "../providers/StorageProvider";
import { LOCAL_STORAGE_KEYS } from "@/constants/localStorageKeys";

import { Toggle } from "@/components/ui/toggle";

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
  endOfMessagesRef: RefObject<HTMLDivElement | null> | null;
};

export function BottomMessageTextArea({
  endOfMessagesRef,
}: BottomMessageTextAreaProps) {
  const pathname = usePathname();

  const { setValue, getValue } = useStorage();
  const [isSearchQuery, setIsSearchQuery] = useState(false);

  let chatId = null;
  if (pathname.startsWith("/c/")) {
    chatId = pathname.split("/")[2];
  }

  const [aiModel, setAIModel] = useState(
    getValue(LOCAL_STORAGE_KEYS.AI_MODEL) || "openai/gpt-4.1-nano",
  );
  const [input, setInput] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  const setAiModelInStorage = (value: string) => {
    setAIModel(value);
    setValue(LOCAL_STORAGE_KEYS.AI_MODEL, value);
  };

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
          byokKey: getValue(LOCAL_STORAGE_KEYS.BYOK_KEY),
          isSearchQuery: isSearchQuery,
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
                } else if (e.shiftKey && e.key === "Enter") {
                  e.preventDefault(); // Prevent the default action of the Enter key
                  setInput((prev) => prev + "\n"); // Add a new line to the input
                } else if (e.key === "Enter") {
                  e.preventDefault(); // Prevent the default action
                  document
                    .querySelector<HTMLButtonElement>('button[type="submit"]')
                    ?.click(); // Trigger the submit button click
                }
              }}
            />
            <div className="flex justify-between gap-5 items-center">
              <div className="flex items-center p-1 gap-1">
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
                      onValueChange={setAiModelInStorage}
                    >
                      {models
                        .filter(
                          (model) =>
                            model.architecture?.input_modalities?.includes(
                              "text",
                            ) &&
                            parseFloat(model.pricing?.prompt || "1") <=
                              0.0000001 &&
                            [
                              "agentica-org/deepcoder-14b-preview:free",
                              "meta-llama/llama-3.2-3b-instruct",
                              "openai/gpt-4.1-nano",
                              "deepseek/deepseek-r1-distill-llama-8b",
                              "sao10k/l3-lunaris-8b",
                              "mistralai/mistral-small-3.1-24b-instruct",
                              "google/gemma-3-27b-it",
                              "deepseek/deepseek-r1:free",
                              "google/gemini-2.0-flash-001",
                            ].includes(model.id),
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-1">
                      <Toggle
                        aria-label="Search Internet"
                        variant="outline"
                        pressed={isSearchQuery}
                        onPressedChange={setIsSearchQuery}
                        className={`p-0 m-0 data-[state=on]:bg-red-200 dark:data-[state=on]:bg-red-900`}
                      >
                        <Globe />
                      </Toggle>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Web Search (Beta)</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center cursor-pointer">
                <div className="p-1 cursor-pointer">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="p-1">
                        <Toggle
                          aria-label="Start New Chat"
                          variant="outline"
                          className={`p-0 m-0`}
                        >
                          <Link href="/" className="cursor-pointer">
                            <div className="cursor-pointer">
                              <BadgePlus className="cursor-pointer" />
                            </div>
                          </Link>
                        </Toggle>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Start a New Chat</p>
                    </TooltipContent>
                  </Tooltip>
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
