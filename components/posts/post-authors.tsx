import { connection } from "next/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { delay } from "@/lib/api"

// DYNAMIC COMPONENT - Streams at request time
export async function PostAuthors() {
  await connection() // Defer to request time

  // Simulate API delay (3500ms)
  await delay(3500)

  const [usersRes, postsRes] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/users"),
    fetch("https://jsonplaceholder.typicode.com/posts"),
  ])

  const users = await usersRes.json()
  const posts = await postsRes.json()

  // Count posts per user
  const postCounts = posts.reduce((acc: Record<number, number>, post: { userId: number }) => {
    acc[post.userId] = (acc[post.userId] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Top Authors</CardTitle>
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            dynamic
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users.slice(0, 5).map((user: { id: number; name: string; username: string }, index: number) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user.name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  @{user.username}
                </p>
              </div>
              <Badge variant="outline">{postCounts[user.id] || 0} posts</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function PostAuthorsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
