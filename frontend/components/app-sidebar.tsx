"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import { useStorage } from "../providers/StorageProvider";

import * as React from "react";
import { useZero, useQuery } from "@rocicorp/zero/react";

import { Button } from "@/components/ui/button";

import { login } from "@/lib/actions/auth";
import { NavUser } from "@/components/nav-user";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { NavProjects } from "@/components/nav-chats";
import { Team } from "@/components/team";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { getValue, setValue } = useStorage();

  const [byokKey, setByok] = useState("");
  const z = useZero();
  const { status, data: session } = useSession();

  const [chats] = useQuery(
    z.query.chats
      .where("deletedAt", "IS", null)
      .where("createdBy", "IS", session?.user.id || null)
      .orderBy("createdAt", "desc"),
  );

  const saveBYOK = (value: string) => {
    setValue("byokKey", value);
  };

  useEffect(() => {
    setByok(getValue("byokKey"));
  }, [getValue]);

  const isValidByokKey =
    byokKey && byokKey.startsWith("sk-or-v1-") && byokKey.length == 73;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Team />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects chats={chats} />
      </SidebarContent>
      <SidebarFooter className="pb-10">
        <Dialog>
          <form>
            <DialogTrigger asChild>
              <Button
                className={`truncate w-full h-[3rem] cursor-pointer ${byokKey ? (isValidByokKey ? "bg-green-200" : "bg-red-200") : ""}`}
                variant="outline"
              >
                Bring Your Own Keys
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Bring Your Own Keys</DialogTitle>
                <DialogDescription>
                  If you don't know what this is. Do not use it.
                  <br />
                  <br />
                  You can use your own OpenRouter Keys, which will be stored
                  locally in your browser's local storage. These keys will be
                  sent to the server when making calls to the LLM but will not
                  be stored or retained by us.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="openrouter-customer-key">
                    OpenRouter Key
                  </Label>
                  <Input
                    id="openrouter-customer-key"
                    name="openrouter-customer-key"
                    placeholder="sk-or-v1-..."
                    value={byokKey}
                    className={
                      isValidByokKey
                        ? "border-green-200 focus-visible:ring-green-500"
                        : "border-red-200 focus-visible:ring-red-500"
                    }
                    onChange={(e) => {
                      saveBYOK(e.target.value);
                      setByok(e.target.value);
                    }}
                  />
                </div>
              </div>
            </DialogContent>
          </form>
        </Dialog>
        {status === "authenticated" ? (
          <NavUser />
        ) : (
          <div className="flex w-full justify-center items-center">
            <Button className="w-full h-[3rem] cursor-pointer" onClick={() => login()}>
              <LogIn />
              Continue with Google
            </Button>
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
