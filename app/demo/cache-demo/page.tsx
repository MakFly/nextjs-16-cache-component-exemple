import { Suspense } from "react"
import Link from "next/link"
import { cacheLife } from "next/cache"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { delay } from "@/lib/api"
import { RevalidateButton } from "@/components/revalidate-button"
import { revalidateAll } from "@/lib/actions"

// Different cache durations for comparison
async function SecondsCache() {
  "use cache"
  cacheLife("seconds")

  await delay(500)
  const time = new Date().toLocaleTimeString()

  return (
    <Card className="border-red-200 dark:border-red-900">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Seconds</CardTitle>
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
            ~1s TTL
          </Badge>
        </div>
        <CardDescription>Revalidates after ~1 second</CardDescription>
      </CardHeader>
      <CardContent>
        <code className="text-2xl font-mono font-bold">{time}</code>
        <p className="text-xs text-muted-foreground mt-2">
          Use for: real-time-ish data, stock prices
        </p>
      </CardContent>
    </Card>
  )
}

async function MinutesCache() {
  "use cache"
  cacheLife("minutes")

  await delay(500)
  const time = new Date().toLocaleTimeString()

  return (
    <Card className="border-orange-200 dark:border-orange-900">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Minutes</CardTitle>
          <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
            ~5m TTL
          </Badge>
        </div>
        <CardDescription>Revalidates after ~5 minutes</CardDescription>
      </CardHeader>
      <CardContent>
        <code className="text-2xl font-mono font-bold">{time}</code>
        <p className="text-xs text-muted-foreground mt-2">
          Use for: social feeds, notifications
        </p>
      </CardContent>
    </Card>
  )
}

async function HoursCache() {
  "use cache"
  cacheLife("hours")

  await delay(500)
  const time = new Date().toLocaleTimeString()

  return (
    <Card className="border-green-200 dark:border-green-900">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Hours</CardTitle>
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            ~1h TTL
          </Badge>
        </div>
        <CardDescription>Revalidates after ~1 hour</CardDescription>
      </CardHeader>
      <CardContent>
        <code className="text-2xl font-mono font-bold">{time}</code>
        <p className="text-xs text-muted-foreground mt-2">
          Use for: blog posts, product pages
        </p>
      </CardContent>
    </Card>
  )
}

async function DaysCache() {
  "use cache"
  cacheLife("days")

  await delay(500)
  const time = new Date().toLocaleTimeString()

  return (
    <Card className="border-blue-200 dark:border-blue-900">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Days</CardTitle>
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            ~1d TTL
          </Badge>
        </div>
        <CardDescription>Revalidates after ~1 day</CardDescription>
      </CardHeader>
      <CardContent>
        <code className="text-2xl font-mono font-bold">{time}</code>
        <p className="text-xs text-muted-foreground mt-2">
          Use for: static content, documentation
        </p>
      </CardContent>
    </Card>
  )
}

async function WeeksCache() {
  "use cache"
  cacheLife("weeks")

  await delay(500)
  const time = new Date().toLocaleTimeString()

  return (
    <Card className="border-purple-200 dark:border-purple-900">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Weeks</CardTitle>
          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
            ~1w TTL
          </Badge>
        </div>
        <CardDescription>Revalidates after ~1 week</CardDescription>
      </CardHeader>
      <CardContent>
        <code className="text-2xl font-mono font-bold">{time}</code>
        <p className="text-xs text-muted-foreground mt-2">
          Use for: rarely changing data, configs
        </p>
      </CardContent>
    </Card>
  )
}

async function MaxCache() {
  "use cache"
  cacheLife("max")

  await delay(500)
  const time = new Date().toLocaleTimeString()

  return (
    <Card className="border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Max</CardTitle>
          <Badge variant="secondary">Forever</Badge>
        </div>
        <CardDescription>Never revalidates automatically</CardDescription>
      </CardHeader>
      <CardContent>
        <code className="text-2xl font-mono font-bold">{time}</code>
        <p className="text-xs text-muted-foreground mt-2">
          Use for: immutable content, hashed assets
        </p>
      </CardContent>
    </Card>
  )
}

function CacheSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-40 mt-1" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-3 w-48 mt-2" />
      </CardContent>
    </Card>
  )
}

export default function CacheDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">Back</Link>
            </Button>
            <RevalidateButton action={revalidateAll} label="Revalidate All" />
          </div>
          <h1 className="text-3xl font-bold">cacheLife Comparison</h1>
          <p className="text-muted-foreground mt-1">
            Different cache durations side by side - watch how timestamps change
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline">Refresh page to see cached vs fresh</Badge>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Same timestamp = cached
            </Badge>
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              New timestamp = revalidated
            </Badge>
          </div>
        </header>

        {/* Cache Duration Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Suspense fallback={<CacheSkeleton />}>
            <SecondsCache />
          </Suspense>
          <Suspense fallback={<CacheSkeleton />}>
            <MinutesCache />
          </Suspense>
          <Suspense fallback={<CacheSkeleton />}>
            <HoursCache />
          </Suspense>
          <Suspense fallback={<CacheSkeleton />}>
            <DaysCache />
          </Suspense>
          <Suspense fallback={<CacheSkeleton />}>
            <WeeksCache />
          </Suspense>
          <Suspense fallback={<CacheSkeleton />}>
            <MaxCache />
          </Suspense>
        </div>

        {/* Code Example */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`async function MyComponent() {
  "use cache"
  cacheLife("hours") // seconds | minutes | hours | days | weeks | max

  const data = await fetchData()
  return <div>{data}</div>
}`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
