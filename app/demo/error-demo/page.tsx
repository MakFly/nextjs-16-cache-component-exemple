"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Code, Info } from "lucide-react"
import Link from "next/link"

// Component that throws an error
function ErrorThrower({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("This is a simulated error for demonstration purposes!")
  }
  return <div className="text-green-600">✓ Component rendered successfully</div>
}

export default function ErrorDemoPage() {
  const [shouldThrow, setShouldThrow] = useState(false)

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
          <h1 className="text-3xl font-bold mb-2">Error Handling Demo</h1>
          <p className="text-muted-foreground">
            Next.js 16 error boundaries and error handling patterns
          </p>
          <div className="flex gap-2 mt-3">
            <Badge variant="outline" className="text-red-600 border-red-600">
              error.tsx
            </Badge>
            <Badge variant="outline" className="text-red-600 border-red-600">
              global-error.tsx
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              not-found.tsx
            </Badge>
          </div>
        </header>

        {/* Explanation */}
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Error Boundaries in Next.js 16</AlertTitle>
          <AlertDescription className="mt-2">
            Next.js provides three types of error boundaries:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                <code className="bg-muted px-1 rounded">error.tsx</code> - Catches errors in route segments
              </li>
              <li>
                <code className="bg-muted px-1 rounded">global-error.tsx</code> - Catches errors in root layout
              </li>
              <li>
                <code className="bg-muted px-1 rounded">not-found.tsx</code> - Custom 404 page
              </li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Error Boundary Demo */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Error Boundary Test</CardTitle>
            <CardDescription>
              Click the button below to trigger an error. The error will be caught by the error boundary.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setShouldThrow(true)}
              variant="destructive"
              disabled={shouldThrow}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Throw Error
            </Button>

            {shouldThrow && (
              <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <p className="text-sm text-destructive font-semibold mb-2">
                  Error thrown! Check the error boundary above.
                </p>
                <p className="text-xs text-muted-foreground">
                  In a real app, this would trigger the error.tsx component.
                </p>
              </div>
            )}

            {!shouldThrow && <ErrorThrower shouldThrow={false} />}
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
              <h3 className="font-semibold mb-2">error.tsx (Route Segment)</h3>
              <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg text-xs overflow-x-auto">
{`"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">not-found.tsx</h3>
              <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg text-xs overflow-x-auto">
{`import { notFound } from 'next/navigation'

export default function NotFound() {
  return (
    <div>
      <h2>404 - Not Found</h2>
      <p>This page doesn't exist</p>
    </div>
  )
}

// Usage in a component:
async function PostPage({ params }) {
  const post = await getPost(params.id)
  if (!post) {
    notFound() // Triggers not-found.tsx
  }
  return <div>{post.title}</div>
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

