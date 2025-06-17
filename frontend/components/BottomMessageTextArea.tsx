"use client";

import { usePathname, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowUp, Paperclip, Search } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ModelDropdown } from "@/components/ModelDropdown";
import { useCallback, useState } from "react";

export function BottomMessageTextArea() {
  const pathname = usePathname();
  let chatId = null;
  if (pathname.startsWith("/c/")) {
    chatId = pathname.split("/")[2];
  }

  const [input, setInput] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: input,
          chatId: chatId,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        redirect(`/c/${data.id}`);
      } else {
        console.error("Failed to create chat thread");
      }
    },
    [input],
  );

  return (
    <div className="w-[47%] border-2 border-black-500 rounded-t-3xl p-1">
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
  );
}
