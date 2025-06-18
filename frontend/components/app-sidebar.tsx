"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import * as React from "react";
import { useZero } from "@/components/zero-provider";
import { Button } from "@/components/ui/button";
import { useQuery } from "@rocicorp/zero/react";

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [byokKey, setByok] = useState("");
  const z = useZero();

  const [chats] = useQuery(z.query.Chat.orderBy("createdAt", "desc"));

  const saveBYOK = () => {
    console.log(byokKey);
  };

  const { status } = useSession();

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
              <Button className="w-full h-[3rem]" variant="outline">
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
                  <Label htmlFor="openrouter-customer-key">Key</Label>
                  <Input
                    id="openrouter-customer-key"
                    name="openrouter-customer-key"
                    placeholder="sk-or-v1-..."
                    onChange={(e) => setByok(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>

                <DialogClose asChild>
                  <Button
                    type="submit"
                    className="cursor-pointer"
                    onClick={() => saveBYOK()}
                  >
                    Save
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
        {status === "authenticated" ? (
          <NavUser />
        ) : (
          <div className="flex w-full justify-center items-center">
            <Button className="w-full h-[3rem]" onClick={() => login()}>
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
