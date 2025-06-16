"use client";

import * as React from "react";
import { SquareDashedBottomCode } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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
      <Link href="/">
        <div className="flex gap-2">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <SquareDashedBottomCode className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Semaphore Chat</span>
            <span className="truncate text-xs">by codingcoffee</span>
          </div>
        </div>
      </Link>
    </SidebarMenu>
  );
}
