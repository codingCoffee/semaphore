"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";
import { dropAllDatabases } from "@rocicorp/zero";
import { useRouter } from "next/navigation";

import { useSession } from "@/components/session-provider";
import { jwtDecode } from "jwt-decode";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser() {
  const { isMobile } = useSidebar();
  const session = useSession();
  const jwt = session?.data?.jwt;

  let decoded: { [key: string]: any } = {};
  if (jwt) {
    try {
      decoded = jwtDecode(jwt);
    } catch (error) {
      console.error("Failed to decode JWT:", error);
    }
  } else {
    console.error("No JWT found in session.");
  }

  const router = useRouter();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={decoded.image || "/avatars/shadcn.jpg"}
                  alt={decoded.name || ":)"}
                />
                <AvatarFallback className="rounded-lg">:)</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{decoded.name}</span>
                <span className="truncate text-xs">{decoded.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={decoded.image || "/avatars/shdcn.jpg"}
                    alt={decoded.name || ":)"}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{decoded.name}</span>
                  <span className="truncate text-xs">{decoded.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                const { dropped, errors } = await dropAllDatabases();
                session.logout();
                router.replace("/");
              }}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
