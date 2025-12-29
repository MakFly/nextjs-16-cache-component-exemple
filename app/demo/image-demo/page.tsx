import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, ImageIcon, Loader2 } from "lucide-react"

export default function ImageDemoPage() {
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
          <h1 className="text-3xl font-bold mb-2">Image Optimization Demo</h1>
          <p className="text-muted-foreground">
            Next.js 16 Image component with new features
          </p>
          <div className="flex gap-2 mt-3">
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              next/image
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Optimization
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              Next.js 16
            </Badge>
          </div>
        </header>

        {/* Image Examples */}
        <div className="space-y-6 mb-6">
          {/* Basic Image */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Image</CardTitle>
              <CardDescription>Standard optimized image</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
                  alt="Mountain landscape"
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>

          {/* Priority Image */}
          <Card>
            <CardHeader>
              <CardTitle>Priority Image</CardTitle>
              <CardDescription>Above-the-fold image with priority loading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800"
                  alt="Forest"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </CardContent>
          </Card>

          {/* Responsive Image */}
          <Card>
            <CardHeader>
              <CardTitle>Responsive Image</CardTitle>
              <CardDescription>Image with sizes attribute for responsive loading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200"
                  alt="Ocean"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next.js 16 Changes */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Next.js 16 Image Changes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">minimumCacheTTL</h3>
              <p className="text-sm text-muted-foreground">
                Default changed from 60 seconds to 4 hours (14400 seconds)
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">imageSizes</h3>
              <p className="text-sm text-muted-foreground">
                Removed 16px from default sizes array
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">qualities</h3>
              <p className="text-sm text-muted-foreground">
                Default changed to only [75] instead of all qualities
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Local IP Restriction</h3>
              <p className="text-sm text-muted-foreground">
                Local IP optimization blocked by default. Use dangerouslyAllowLocalIP for private networks.
              </p>
            </div>
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
              <h3 className="font-semibold mb-2">Basic Usage</h3>
              <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg text-xs overflow-x-auto">
{`import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority // For above-the-fold images
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Fill with Sizes</h3>
              <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg text-xs overflow-x-auto">
{`<div className="relative w-full h-64">
  <Image
    src="/image.jpg"
    alt="Description"
    fill
    sizes="(max-width: 768px) 100vw, 50vw"
    className="object-cover"
  />
</div>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Next.js 16 Config</h3>
              <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg text-xs overflow-x-auto">
{`// next.config.ts
const nextConfig = {
  images: {
    minimumCacheTTL: 14400, // 4 hours (default)
    imageSizes: [32, 48, 64, 96, 128, 256, 384], // No 16px
    qualities: [75], // Default
    dangerouslyAllowLocalIP: false, // Default
  },
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

