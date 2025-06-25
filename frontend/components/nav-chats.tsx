"use client";

import Link from "next/link";
import {
  Pen,
  Share,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";

export function NavProjects({ chats }: { chats: any[] }) {
  const { isMobile } = useSidebar();
  const chatTitlePlaceholder = " * * * ";

  const pathname = usePathname();
  let chatId = null;
  if (pathname.startsWith("/c/")) {
    chatId = pathname.split("/")[2];
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      <SidebarMenu>
        {chats.map((item) => (
          <SidebarMenuItem
            key={item.id}
            className={`${chatId === item.id ? "bg-gray-200 dark:bg-gray-900 rounded-md" : ""}`}
          >
            <SidebarMenuButton asChild>
              <Link href={`/c/${item.id}`}>
                {item.title === chatTitlePlaceholder ? (
                  <Icon icon="svg-spinners:pulse-multiple" />
                ) : (
                  <span>{item.title}</span>
                )}
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Share className="text-muted-foreground" />
                  <span>Share</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Pen className="text-muted-foreground" />
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
