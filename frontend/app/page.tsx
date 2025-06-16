"use client";

import { useZero } from "@/components/zero-provider";
import { useQuery } from "@rocicorp/zero/react";

import { Button } from "@/components/ui/button";
import { ArrowUp, Paperclip, Search } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ModelDropdown } from "@/components/ModelDropdown";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useCallback, useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");

  const z = useZero();
  const [LLMResponseInstances] = useQuery(
    z.query.LLMResponse.orderBy("createdAt", "asc"),
  );
  console.log(LLMResponseInstances);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: input,
          chatId: "4219d8b6-3ac5-405b-9240-39c29a3cb352",
        }),
        headers: { "Content-Type": "application/json" },
      });
    },
    [input],
  );

  return (
    <div className="flex flex-1 flex-col justify-end items-center">
      <div className="w-[40%]">
        {LLMResponseInstances.map((item) => (
          <div key={item.id}>
            <div className="flex justify-end">
              <div className="bg-red-200 p-2 rounded-lg">{item.question}</div>
            </div>
            <div className="p-2 rounded-lg">{item.answer}</div>
          </div>
        ))}
      </div>

      <div className="w-[40%] border-2 border-black-500 rounded-t-3xl p-1">
        <div className="border-2 border-black-500 rounded-t-3xl">
          <div>
            <form onSubmit={handleSubmit}>
              <Textarea
                placeholder="Type your message here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="resize-none border-none focus:outline-none focus:ring-0 focus:ring-offset-0 border-0 focus:shadow-none"
              />
              <div className="flex justify-between">
                <div className="flex items-center gap-5">
                  <ModelDropdown />
                  <Search className="p-1" />
                  <Paperclip className="p-1" />
                </div>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Button type="submit">
                    <ArrowUp className="size-4" />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
