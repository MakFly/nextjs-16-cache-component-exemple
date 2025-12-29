import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"
export const alt = "Post Image"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  // Fetch post data
  const postRes = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
  if (!postRes.ok) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 60,
            background: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Post Not Found
        </div>
      ),
      { ...size }
    )
  }

  const post = await postRes.json()

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: "linear-gradient(to bottom, #667eea, #764ba2)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: "bold",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          {post.title}
        </div>
        <div
          style={{
            fontSize: 32,
            opacity: 0.9,
            textAlign: "center",
          }}
        >
          Post #{id}
        </div>
      </div>
    ),
    { ...size }
  )
}

