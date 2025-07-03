"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          if (resolvedTheme == "light") {
            setTheme("dark");
          } else {
            setTheme("light");
          }
        }}
      >
        {resolvedTheme === "dark" ? <Moon /> : <Sun />}
      </Button>
    </div>
  );
}
