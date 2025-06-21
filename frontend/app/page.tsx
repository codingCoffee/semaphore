"use client";

import { useRef } from "react";
import { BottomMessageTextArea } from "@/components/BottomMessageTextArea";
import { Sparkles } from "lucide-react";

export default function Home() {
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="flex flex-col items-center space-y-2 mt-16">
        <div className="p-3 rounded-full">
          <Sparkles className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-semibold text-center">
          How can <span className="text-red-500">Semaphore</span> help you
          today?
        </h1>
        <p className="text-gray-400 text-center max-w-lg">
          I'm an AI assistant, designed to help answer questions, provide
          insights, and facilitate communication seamlessly.
          <br />
          <br />
          You can ask me anything, from drafting an email to details about my
          creator!
          <br />
          <br />
          Chats with are public when logged out. Login to make sure your chats
          are only visible to you.
        </p>
      </div>

      <BottomMessageTextArea endOfMessagesRef={endOfMessagesRef} />
    </div>
  );
}
