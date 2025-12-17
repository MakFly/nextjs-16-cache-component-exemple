import { connection } from "next/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { delay } from "@/lib/api"

// DYNAMIC COMPONENT - Streams at request time
export async function UserAlbums() {
  await connection() // Defer to request time

  // Simulate API delay (3500ms)
  await delay(3500)

  const [albumsRes, usersRes] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/albums"),
    fetch("https://jsonplaceholder.typicode.com/users"),
  ])

  const albums = await albumsRes.json()
  const users = await usersRes.json()

  // Group albums by user
  const albumsByUser = albums.reduce((acc: Record<number, number>, album: { userId: number }) => {
    acc[album.userId] = (acc[album.userId] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  const userMap = users.reduce((acc: Record<number, { name: string }>, user: { id: number; name: string }) => {
    acc[user.id] = user
    return acc
  }, {} as Record<number, { name: string }>)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Photo Albums</CardTitle>
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            dynamic
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(albumsByUser).slice(0, 5).map(([userId, count]) => {
            const user = userMap[Number(userId)]
            return (
              <div
                key={userId}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-xs font-medium">
                    {user?.name?.split(" ").map((n: string) => n[0]).join("") || "?"}
                  </div>
                  <span className="text-sm font-medium">{user?.name || `User ${userId}`}</span>
                </div>
                <Badge variant="secondary">{count} albums</Badge>
              </div>
            )
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            Total: {albums.length} albums across {users.length} users
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function UserAlbumsSkeleton() {
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
            <div key={i} className="flex items-center justify-between p-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </CardContent>
    </Card>
  )
}
