import { cacheLife, cacheTag } from "next/cache"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { delay } from "@/lib/api"

// CACHED COMPONENT with tag for revalidation
export async function UserList() {
  "use cache"
  cacheLife("minutes")
  cacheTag("user-list")

  // Simulate API delay (1500ms)
  await delay(1500)

  const res = await fetch("https://jsonplaceholder.typicode.com/users")
  const users = await res.json()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              Generated: <span className="font-mono">{new Date().toLocaleTimeString()}</span>
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-600">
            use cache
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {users.map((user: { id: number; name: string; email: string }) => (
            <div
              key={user.id}
              className="flex items-center gap-4 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold shrink-0">
                {user.name.split(" ").map((n: string) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user.name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {user.email.toLowerCase()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function UserListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-48 mt-1" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3 border border-border rounded-lg">
              <Skeleton className="h-12 w-12 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
