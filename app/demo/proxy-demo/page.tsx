"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Info, Shield, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ProxyDemoPage() {
  const [headers, setHeaders] = useState<Record<string, string>>({})

  useEffect(() => {
    // Fetch headers from current page
    fetch("/api/demo")
      .then((res) => {
        const proxyHeader = res.headers.get("x-proxy-processed")
        const methodHeader = res.headers.get("x-request-method")
        const pathHeader = res.headers.get("x-request-path")

        setHeaders({
          "x-proxy-processed": proxyHeader || "Not found",
          "x-request-method": methodHeader || "Not found",
          "x-request-path": pathHeader || "Not found",
        })
      })
      .catch(() => {
        setHeaders({ error: "Failed to fetch headers" })
      })
  }, [])

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
          <h1 className="text-3xl font-bold mb-2">Proxy (ex-Middleware) Demo</h1>
          <p className="text-muted-foreground">
            Next.js 16 renamed middleware to proxy for clarity
          </p>
          <div className="flex gap-2 mt-3">
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              proxy.ts
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              Request Interception
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Headers Manipulation
            </Badge>
          </div>
        </header>

        {/* Explanation */}
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>What changed in Next.js 16?</AlertTitle>
          <AlertDescription className="mt-2">
            <p>
              <strong>Before:</strong> <code className="bg-muted px-1 rounded">middleware.ts</code>
            </p>
            <p>
              <strong>After:</strong> <code className="bg-muted px-1 rounded">proxy.ts</code>
            </p>
            <p className="mt-2">
              The rename clarifies that proxy runs at the network boundary and focuses on routing.
              Edge runtime is NOT supported in proxy (use middleware.ts if you need edge).
            </p>
          </AlertDescription>
        </Alert>

        {/* Proxy Headers Demo */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Proxy Headers
            </CardTitle>
            <CardDescription>
              Headers added by proxy.ts to all requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(headers).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-muted rounded">
                  <code className="text-sm font-mono">{key}:</code>
                  <code className="text-sm font-mono text-muted-foreground">{value}</code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Use Cases */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Common Use Cases</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Authentication Guards
              </h3>
              <p className="text-sm text-muted-foreground">
                Redirect unauthenticated users to login page
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Header Manipulation
              </h3>
              <p className="text-sm text-muted-foreground">
                Add custom headers, modify request/response headers
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                URL Rewriting
              </h3>
              <p className="text-sm text-muted-foreground">
                Rewrite URLs, handle redirects, A/B testing
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Code Example */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Code Example
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg text-xs overflow-x-auto">
{`import { type NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  // Auth guard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const cookie = request.cookies.get('auth-token')
    if (!cookie) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Add custom headers
  const response = NextResponse.next()
  response.headers.set('x-proxy-processed', 'true')
  
  return response
}`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

