import { connection } from "next/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { delay } from "@/lib/api"

// DYNAMIC COMPONENT - Streams at request time (not cached)
// Uses connection() to defer to request time
export async function PostComments() {
  await connection() // Explicitly defer to request time

  // Simulate API delay (2500ms)
  await delay(2500)

  const res = await fetch("https://jsonplaceholder.typicode.com/comments")
  const comments = await res.json()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Comments</CardTitle>
            <CardDescription>{comments.length} total comments</CardDescription>
          </div>
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            dynamic
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {comments.slice(0, 5).map((comment: { id: number; name: string; email: string; body: string }) => (
            <div
              key={comment.id}
              className="border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {comment.email.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium line-clamp-1">{comment.name}</p>
                  <p className="text-xs text-muted-foreground">{comment.email}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 ml-11">
                {comment.body}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function PostCommentsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-28 mt-1" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3 mb-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <div className="ml-11 space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
