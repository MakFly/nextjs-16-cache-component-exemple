import { NextRequest, NextResponse } from "next/server"
import type { RouteContext } from "next"

// Dynamic route handler with generateStaticParams
export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }]
}

export async function GET(
  request: NextRequest,
  context: RouteContext<"/api/demo/[id]">
) {
  const { id } = await context.params

  return NextResponse.json({
    id,
    message: `Static API route for ID: ${id}`,
    timestamp: new Date().toISOString(),
  })
}

