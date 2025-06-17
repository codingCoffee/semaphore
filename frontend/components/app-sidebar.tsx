"use client";

import * as React from "react";
import { useZero } from "@/components/zero-provider";
import { useQuery } from "@rocicorp/zero/react";
import {
  BookOpen,
  Bot,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavProjects } from "@/components/nav-chats";
import { NavUser } from "@/components/nav-user";
import { Team } from "@/components/team";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const z = useZero();

  const [chats] = useQuery(z.query.Chat.orderBy("createdAt", "desc"));
  const user = {
    name: "Ameya Shenoy",
    email: "shenoy.ameya@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Team />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects chats={chats} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
