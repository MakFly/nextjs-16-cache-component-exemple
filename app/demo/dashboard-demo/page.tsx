import { Suspense } from "react"
import { connection } from "next/server"
import { cacheLife } from "next/cache"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { delay } from "@/lib/api"

// DYNAMIC COMPONENT - Real-time activity feed
async function ActivityFeed() {
  await connection()
  await delay(1200)

  const activities = [
    { id: 1, user: "Alice", action: "created a new post", time: "2 min ago" },
    { id: 2, user: "Bob", action: "commented on your photo", time: "5 min ago" },
    { id: 3, user: "Charlie", action: "started following you", time: "12 min ago" },
    { id: 4, user: "Diana", action: "liked your post", time: "18 min ago" },
    { id: 5, user: "Eve", action: "sent you a message", time: "25 min ago" },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Activity Feed</CardTitle>
            <CardDescription className="font-mono">
              {new Date().toLocaleTimeString()}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            dynamic
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                {activity.user[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// CACHED COMPONENT - Popular content
async function PopularContent() {
  "use cache"
  cacheLife("hours")

  await delay(800)

  const posts = [
    { id: 1, title: "Getting Started with Next.js 16", views: 12500 },
    { id: 2, title: "Cache Components Deep Dive", views: 8900 },
    { id: 3, title: "Server Actions Best Practices", views: 6700 },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Popular Content</CardTitle>
            <CardDescription className="font-mono">
              {new Date().toLocaleTimeString()}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-600">
            use cache
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {posts.map((post, i) => (
            <div key={post.id} className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-muted flex items-center justify-center font-medium text-sm">
                #{i + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{post.title}</p>
                <p className="text-xs text-muted-foreground">{post.views.toLocaleString()} views</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityFeedSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-4 w-20 mt-1" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-16 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function PopularContentSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-20 mt-1" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded" />
              <div className="flex-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-20 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-muted-foreground">
          Nested layout demo - sidebar is cached, content mixes cached & dynamic
        </p>
        <div className="flex gap-2 mt-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            Sidebar = cached layout
          </Badge>
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            Activity = dynamic
          </Badge>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<ActivityFeedSkeleton />}>
          <ActivityFeed />
        </Suspense>
        <Suspense fallback={<PopularContentSkeleton />}>
          <PopularContent />
        </Suspense>
      </div>
    </div>
  )
}
