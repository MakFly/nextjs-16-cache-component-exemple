import { NextRequest } from "next/server"

// Streaming response example
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const messages = [
        "Hello",
        " from",
        " a",
        " streaming",
        " response!",
      ]

      for (const message of messages) {
        controller.enqueue(encoder.encode(message))
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  })
}

