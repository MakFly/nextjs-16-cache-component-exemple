"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Code, Send, Trash2, RefreshCw, Download } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function RouteHandlersDemoPage() {
  const [getResult, setGetResult] = useState<any>(null)
  const [postData, setPostData] = useState("")
  const [streamingText, setStreamingText] = useState("")

  async function handleGET() {
    try {
      const res = await fetch("/api/demo?name=Next.js")
      const data = await res.json()
      setGetResult(data)
      toast.success("GET request successful")
    } catch (error) {
      toast.error("GET request failed")
    }
  }

  async function handlePOST() {
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: postData || "Hello from POST!" }),
      })
      const data = await res.json()
      toast.success("POST request successful")
      setPostData("")
      console.log("POST response:", data)
    } catch (error) {
      toast.error("POST request failed")
    }
  }

  async function handlePUT() {
    try {
      const res = await fetch("/api/demo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: 1, name: "Updated Resource" }),
      })
      const data = await res.json()
      toast.success("PUT request successful")
      console.log("PUT response:", data)
    } catch (error) {
      toast.error("PUT request failed")
    }
  }

  async function handleDELETE() {
    try {
      const res = await fetch("/api/demo?id=123", {
        method: "DELETE",
      })
      const data = await res.json()
      toast.success("DELETE request successful")
      console.log("DELETE response:", data)
    } catch (error) {
      toast.error("DELETE request failed")
    }
  }

  async function handleStreaming() {
    setStreamingText("")
    try {
      const res = await fetch("/api/demo/streaming")
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) return

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        setStreamingText((prev) => prev + chunk)
      }

      toast.success("Streaming complete")
    } catch (error) {
      toast.error("Streaming failed")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">Back</Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold mb-2">Route Handlers Demo</h1>
          <p className="text-muted-foreground">
            Next.js 16 API Routes (Route Handlers) with all HTTP methods
          </p>
          <div className="flex gap-2 mt-3">
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              GET
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-600">
              POST
            </Badge>
            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
              PUT
            </Badge>
            <Badge variant="outline" className="text-red-600 border-red-600">
              DELETE
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              Streaming
            </Badge>
          </div>
        </header>

        {/* GET Example */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              GET Request
            </CardTitle>
            <CardDescription>Basic GET request with query parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleGET}>Test GET /api/demo</Button>
            {getResult && (
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(getResult, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>

        {/* POST Example */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              POST Request
            </CardTitle>
            <CardDescription>POST request with JSON body</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter message..."
                value={postData}
                onChange={(e) => setPostData(e.target.value)}
              />
              <Button onClick={handlePOST}>Send POST</Button>
            </div>
          </CardContent>
        </Card>

        {/* PUT & DELETE */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                PUT Request
              </CardTitle>
              <CardDescription>Update resource</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handlePUT} variant="outline" className="w-full">
                Test PUT
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                DELETE Request
              </CardTitle>
              <CardDescription>Delete resource</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleDELETE} variant="destructive" className="w-full">
                Test DELETE
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Streaming Example */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Streaming Response</CardTitle>
            <CardDescription>Server-sent streaming data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleStreaming}>Start Streaming</Button>
            {streamingText && (
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                {streamingText}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Code Examples */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Code Examples
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">app/api/demo/route.ts</h3>
              <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg text-xs overflow-x-auto">
{`import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello' })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ received: body }, { status: 201 })
}

export async function PUT(request: NextRequest) {
  // Update logic
}

export async function DELETE(request: NextRequest) {
  // Delete logic
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Dynamic Route: app/api/demo/[id]/route.ts</h3>
              <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg text-xs overflow-x-auto">
{`import type { RouteContext } from 'next'

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }]
}

export async function GET(
  request: NextRequest,
  context: RouteContext<'/api/demo/[id]'>
) {
  const { id } = await context.params
  return NextResponse.json({ id })
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

