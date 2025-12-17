import { cacheLife } from "next/cache"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { delay } from "@/lib/api"

// CACHED COMPONENT - Part of static shell
export async function UserStats() {
  "use cache"
  cacheLife("hours")

  // Simulate API delay (500ms)
  await delay(500)

  const res = await fetch("https://jsonplaceholder.typicode.com/users")
  const users = await res.json()

  const uniqueCities = new Set(users.map((u: { address: { city: string } }) => u.address.city)).size
  const uniqueCompanies = new Set(users.map((u: { company: { name: string } }) => u.company.name)).size

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card size="sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{users.length}</div>
          <p className="text-xs text-green-600 mt-1">Cached</p>
        </CardContent>
      </Card>
      <Card size="sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Cities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{uniqueCities}</div>
          <p className="text-xs text-green-600 mt-1">Cached</p>
        </CardContent>
      </Card>
      <Card size="sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Generated At
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold font-mono">{new Date().toLocaleTimeString()}</div>
          <p className="text-xs text-green-600 mt-1">Cached for hours</p>
        </CardContent>
      </Card>
    </div>
  )
}

export function UserStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} size="sm">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-20" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-9 w-12" />
            <Skeleton className="h-3 w-12 mt-1" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
