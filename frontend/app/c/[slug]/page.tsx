"use client";

import { useZero } from "@/components/zero-provider";
import { useQuery } from "@rocicorp/zero/react";

import { ArrowUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ModelDropdown } from "@/components/ModelDropdown";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col justify-end items-center">
      <div className="w-[40%] border-2 border-black-500 rounded-t-3xl p-1">
        <div className="border-2 border-black-500 rounded-t-3xl">
          <div>
            <Textarea
              placeholder="Type your message here..."
              className="resize-none border-none focus:outline-none focus:ring-0 focus:ring-offset-0 border-0 focus:shadow-none"
            />
            <div className="flex justify-between">
              <div className="flex items-center">
                <ModelDropdown />
                <div>Search</div>
                <div>Atachment</div>
              </div>
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <ArrowUp className="size-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
