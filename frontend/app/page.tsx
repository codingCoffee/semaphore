"use client";

import { BottomMessageTextArea } from "@/components/BottomMessageTextArea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="flex flex-col items-center space-y-2 mt-16">
        <div className="p-3 rounded-full">
          <Sparkles className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-semibold text-center">
          How can I help you today?
        </h1>
        <p className="text-gray-400 text-center max-w-lg">
          I'm Semaphore, an AI assistant, designed to help answer questions,
          provide insights, and facilitate communication seamlessly.
          <br />
          <br />
          You can ask me anything, from drafting an email to details about my
          creator!
        </p>
      </div>

      <BottomMessageTextArea endOfMessagesRef={null} />
    </div>
  );
}
