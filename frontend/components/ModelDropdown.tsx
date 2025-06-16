import * as React from "react";

import { promises as fs } from "fs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import models from "@/data/openrouterModels.json";

export function ModelDropdown() {
  const [aiModel, setAIModel] = React.useState("o1-mini-2024-09-12");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{aiModel}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Available Models</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={aiModel} onValueChange={setAIModel}>
          {models
            .filter(
              (model) =>
                model.id?.includes("openai") || model.id?.includes("google"),
            )
            .map((model) => (
              <DropdownMenuRadioItem key={model.id} value={model.id}>
                {model.name?.split("/").pop()}
              </DropdownMenuRadioItem>
            ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
