"use client";

import * as React from "react";
import { SquareDashedBottomCode } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { SidebarMenu } from "@/components/ui/sidebar";
import Link from "next/link";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function Team() {
  return (
    <SidebarMenu>
      <div className="flex gap-2">
        <Link href="/">
          <div className="bg-red-200 dark:bg-red-900 text-black dark:text-white flex aspect-square size-8 items-center justify-center rounded-lg">
            <SquareDashedBottomCode className="size-4" />
          </div>
        </Link>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <Link href="/">
            <span className="truncate font-medium">Semaphore Chat (Alpha)</span>
          </Link>
          <HoverCard>
            <HoverCardTrigger asChild>
              <span className="truncate text-xs hover:underline">
                by @codingcoffee
              </span>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between gap-4">
                <Avatar>
                  <AvatarImage src="https://avatars.githubusercontent.com/u/13611153?v=4" />
                  <AvatarFallback>VC</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Ameya Shenoy</h4>
                  <p className="text-sm">
                    I write code sometimes. Other times I'm busy writing todo
                    lists.
                  </p>
                  <div className="flex flex-col text-muted-foreground text-xs">
                    <Link
                      href="https://codingcoffee.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      codingcoffee.dev
                    </Link>
                    <Link
                      href="mailto:shenoy.ameya@gmail.com"
                      className="hover:underline"
                    >
                      shenoy.ameya@gmail.com
                    </Link>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </SidebarMenu>
  );
}
