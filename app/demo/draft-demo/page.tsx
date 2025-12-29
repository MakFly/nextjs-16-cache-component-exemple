import { Suspense } from "react"
import Link from "next/link"
import { draftMode } from "next/headers"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Code, Eye, EyeOff } from "lucide-react"

async function getDraftData() {
  const { isEnabled } = await draftMode()

  // Simulate fetching draft vs published content
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (isEnabled) {
    return {
      title: "Draft Post (Preview Mode)",
      content: "This is draft content visible only in draft mode.",
      status: "draft",
    }
  }

  return {
    title: "Published Post",
    content: "This is the published content visible to everyone.",
    status: "published",
  }
}

async function DraftContent() {
  const data = await getDraftData()
  const { isEnabled } = await draftMode()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isEnabled ? (
            <>
              <Eye className="h-5 w-5 text-orange-600" />
              Draft Mode Active
            </>
          ) : (
            <>
              <EyeOff className="h-5 w-5 text-green-600" />
              Published Mode
            </>
          )}
        </CardTitle>
        <CardDescription>
          {isEnabled
            ? "You're viewing draft content"
            : "You're viewing published content"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">{data.title}</h3>
            <p className="text-sm text-muted-foreground">{data.content}</p>
          </div>
          <Badge variant={isEnabled ? "default" : "outline"}>
            {data.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function DraftDemoPage() {
  const { isEnabled } = await draftMode()

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
          <h1 className="text-3xl font-bold mb-2">Draft Mode Demo</h1>
          <p className="text-muted-foreground">
            Preview unpublished content with Next.js Draft Mode
          </p>
          <div className="flex gap-2 mt-3">
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              draftMode()
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              Preview
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              CMS Integration
            </Badge>
          </div>
        </header>

        {/* Status Banner */}
        {isEnabled && (
          <Card className="mb-6 border-orange-500 bg-orange-50 dark:bg-orange-950">
            <CardContent className="pt-6">
              <p className="text-sm font-semibold text-orange-900 dark:text-orange-100">
                Draft Mode is enabled. You're viewing unpublished content.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        <Suspense fallback={<Skeleton className="h-48 w-full" />}>
          <DraftContent />
        </Suspense>

        {/* Code Examples */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Code Examples
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Enable Draft Mode (API Route)</h3>
              <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg text-xs overflow-x-auto">
{`// app/api/draft/route.ts
import { draftMode } from 'next/headers'

export async function GET(request: Request) {
  const { enable } = await draftMode()
  enable()
  
  return new Response('Draft mode enabled', {
    headers: { 'Set-Cookie': '...' }
  })
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Use Draft Mode (Server Component)</h3>
              <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg text-xs overflow-x-auto">
{`import { draftMode } from 'next/headers'

export default async function Page() {
  const { isEnabled } = await draftMode() // ← Async in Next.js 16
  
  const content = isEnabled 
    ? await getDraftContent()
    : await getPublishedContent()
  
  return <div>{content}</div>
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

