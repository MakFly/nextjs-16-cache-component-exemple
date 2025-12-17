import { cacheLife } from "next/cache"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { delay } from "@/lib/api"

// CACHED COMPONENT - Part of static shell after first build
// Uses "use cache" with cacheLife for automatic caching
export async function PostStats() {
  "use cache"
  cacheLife("hours") // Cache for hours

  // Simulate API delay (500ms)
  await delay(500)

  const res = await fetch("https://jsonplaceholder.typicode.com/posts")
  const posts = await res.json()
  const uniqueUsers = new Set(posts.map((p: { userId: number }) => p.userId)).size

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card size="sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{posts.length}</div>
          <p className="text-xs text-green-600 mt-1">Cached</p>
        </CardContent>
      </Card>
      <Card size="sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Unique Authors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{uniqueUsers}</div>
          <p className="text-xs text-green-600 mt-1">Cached</p>
        </CardContent>
      </Card>
      <Card size="sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Avg Posts/User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{Math.round(posts.length / uniqueUsers)}</div>
          <p className="text-xs text-green-600 mt-1">Cached</p>
        </CardContent>
      </Card>
    </div>
  )
}

export function PostStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} size="sm">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-3 w-12 mt-1" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
