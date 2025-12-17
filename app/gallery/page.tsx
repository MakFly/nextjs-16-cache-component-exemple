import { Suspense } from "react"
import Link from "next/link"
import { cacheLife, cacheTag } from "next/cache"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { delay, type Post } from "@/lib/api"

async function PostGallery() {
  "use cache"
  cacheLife("minutes")
  cacheTag("gallery")

  await delay(800)

  const res = await fetch("https://jsonplaceholder.typicode.com/posts")
  const posts: Post[] = await res.json()

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {posts.slice(0, 12).map((post) => (
        <Link
          key={post.id}
          href={`/gallery/post/${post.id}`}
          scroll={false}
          className="group"
        >
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
            <CardHeader className="pb-3">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary/30">#{post.id}</span>
              </div>
              <CardTitle className="text-base line-clamp-1 group-hover:text-primary transition-colors">
                {post.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">{post.body}</p>
              <Badge variant="secondary" className="mt-3">User {post.userId}</Badge>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

function PostGallerySkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <Card key={i} className="h-full">
          <CardHeader className="pb-3">
            <Skeleton className="aspect-video rounded-lg mb-3" />
            <Skeleton className="h-5 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mt-1" />
            <Skeleton className="h-5 w-16 mt-3 rounded-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">Back</Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Post Gallery</h1>
          <p className="text-muted-foreground mt-1">
            Parallel routes demo - click a card to open modal overlay
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              @modal parallel route
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Gallery = cached
            </Badge>
            <Badge variant="outline">
              Modal = intercepted route
            </Badge>
          </div>
        </header>

        {/* Gallery Grid */}
        <Suspense fallback={<PostGallerySkeleton />}>
          <PostGallery />
        </Suspense>
      </div>
    </div>
  )
}
