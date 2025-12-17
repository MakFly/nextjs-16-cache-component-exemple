import { cacheLife, cacheTag } from "next/cache"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { delay } from "@/lib/api"

// CACHED COMPONENT with tag for revalidation
export async function PostList() {
  "use cache"
  cacheLife("minutes")
  cacheTag("post-list")

  // Simulate API delay (1500ms)
  await delay(1500)

  const res = await fetch("https://jsonplaceholder.typicode.com/posts")
  const posts = await res.json()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Latest Posts</CardTitle>
          <Badge variant="outline" className="text-green-600 border-green-600">
            use cache
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {posts.slice(0, 6).map((post: { id: number; userId: number; title: string; body: string }) => (
            <div
              key={post.id}
              className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">User {post.userId}</Badge>
                <span className="text-xs text-muted-foreground">#{post.id}</span>
              </div>
              <h3 className="font-medium line-clamp-1 mb-1">{post.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{post.body}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function PostListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
