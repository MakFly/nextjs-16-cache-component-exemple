import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Image as ImageIcon, FileText, Search } from "lucide-react"

export default function MetadataDemoPage() {
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
          <h1 className="text-3xl font-bold mb-2">Metadata & SEO Demo</h1>
          <p className="text-muted-foreground">
            Next.js 16 Metadata API with dynamic generation and OG images
          </p>
          <div className="flex gap-2 mt-3">
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              generateMetadata
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-600">
              opengraph-image
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              sitemap.ts
            </Badge>
          </div>
        </header>

        {/* Explanation */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Metadata API Features</CardTitle>
            <CardDescription>
              Next.js 16 provides powerful SEO and metadata capabilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 mt-0.5 text-blue-600" />
              <div>
                <h3 className="font-semibold mb-1">generateMetadata</h3>
                <p className="text-sm text-muted-foreground">
                  Generate metadata dynamically based on route params. Async params support in Next.js 16.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ImageIcon className="h-5 w-5 mt-0.5 text-green-600" />
              <div>
                <h3 className="font-semibold mb-1">OG Images</h3>
                <p className="text-sm text-muted-foreground">
                  Generate Open Graph images dynamically using ImageResponse API.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Search className="h-5 w-5 mt-0.5 text-purple-600" />
              <div>
                <h3 className="font-semibold mb-1">Sitemap & Robots</h3>
                <p className="text-sm text-muted-foreground">
                  Generate sitemaps and robots.txt dynamically for better SEO.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Example Links */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Try It Out</CardTitle>
            <CardDescription>
              Visit these pages to see metadata in action
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/demo/posts-demo/1">
                <FileText className="h-4 w-4 mr-2" />
                Post with generateMetadata
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/demo/posts-demo/1" target="_blank">
                <ImageIcon className="h-4 w-4 mr-2" />
                View OG Image (check page source)
              </Link>
            </Button>
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
              <h3 className="font-semibold mb-2">generateMetadata (Next.js 16 - Async Params)</h3>
              <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg text-xs overflow-x-auto">
{`import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params // ← Must await in Next.js 16
  const post = await getPost(id)

  return {
    title: post.title,
    description: post.body.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.body,
      type: 'article',
    },
  }
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">opengraph-image.tsx</h3>
              <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg text-xs overflow-x-auto">
{`import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params // ← Async params
  const post = await getPost(id)

  return new ImageResponse(
    <div style={{ fontSize: 60, background: 'white' }}>
      {post.title}
    </div>,
    { ...size }
  )
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

