
import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

import { db } from "@/db/index";
import { chat } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function Image({ params }: { params: { slug: string } }) {
  let chatId = params.slug.slice(-36);

  const chatInstance = await db
    .select()
    .from(chat)
    .where(eq(chat.id, chatId))
    .limit(1)
    .then(results => results[0])

  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full items-center justify-between bg-red-100 p-20">
        <div tw="text-7xl">{chatInstance.title}</div>
        <div tw="flex items-center justify-between w-full">
          <div tw="text-6xl text-red-500">semaphore.chat</div>
          <div tw="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
            {">"}
          </div>
        </div>
      </div>
    )
  )
}
