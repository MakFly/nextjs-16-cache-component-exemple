import { NextRequest, NextResponse } from "next/server"
import { revalidateTag } from "next/cache"

// GET - Basic example
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const name = searchParams.get("name") || "World"

  return NextResponse.json({
    message: `Hello, ${name}!`,
    method: "GET",
    timestamp: new Date().toISOString(),
  })
}

// POST - With body parsing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    return NextResponse.json(
      {
        message: "Data received",
        received: body,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    )
  }
}

// PUT - Update example
export async function PUT(request: NextRequest) {
  const body = await request.json()

  return NextResponse.json({
    message: "Resource updated",
    data: body,
    timestamp: new Date().toISOString(),
  })
}

// DELETE - Delete example
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get("id")

  return NextResponse.json({
    message: `Resource ${id} deleted`,
    timestamp: new Date().toISOString(),
  })
}

// PATCH - Partial update
export async function PATCH(request: NextRequest) {
  const body = await request.json()

  return NextResponse.json({
    message: "Resource partially updated",
    updates: body,
    timestamp: new Date().toISOString(),
  })
}

