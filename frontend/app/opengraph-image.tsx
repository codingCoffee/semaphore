
import { ImageResponse } from 'next/og'

// Image metadata
export const contentType = 'image/png'

async function loadGoogleFont (font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`
  const css = await (await fetch(url)).text()
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)

  if (resource) {
    const response = await fetch(resource[1])
    if (response.status == 200) {
      return await response.arrayBuffer()
    }
  }

  throw new Error('failed to load font data')
}

export default async function Image({ params }: { params: { slug: string } }) {
  const text = 'Semaphore'

  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full items-center justify-between bg-red-100 p-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        }}
      >
        <div tw="flex text-9xl text-center">
          <span tw="text-red-500">{text}</span>
        </div>
        <div tw="flex items-center justify-between w-full text-4xl text-gray-500 text-center">
          The simplest no-nonsense AI chat app, designed to help answer questions, provide insights, and facilitate communication seamlessly
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Space Grotesk',
          data: await loadGoogleFont('Space Grotesk', text),
          style: 'normal'
        },
      ],
    }
  )
}
