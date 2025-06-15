"use client";

import { useZero } from "@/components/zero-provider";
import Image from "next/image";
import { useQuery } from "@rocicorp/zero/react";

export default function Home() {
  const z = useZero();

  const [llmResponses] = useQuery(z.query.LLMResponse);

  console.log(llmResponses);

  return (
    <div>
      {llmResponses &&
        llmResponses.map((response) => (
          <div key={response.id}>
            <h3>Question: {response.question}</h3>
            <p>Answer: {response.answer}</p>
          </div>
        ))}
    </div>
  );
}
