import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cacheLife, cacheTag } from "next/cache"
import { delay } from "@/lib/api"
import { RefreshCw, Clock, Zap } from "lucide-react"

// Time-based revalidation (ISR)
async function getTimeBasedData() {
  "use cache"
  cacheLife("seconds", 10) // Revalidate every 10 seconds
  cacheTag("isr-time-based")

  await delay(500)
  return {
    timestamp: new Date().toISOString(),
    type: "Time-based ISR",
    message: "This data revalidates every 10 seconds",
  }
}

// On-demand revalidation (via revalidateTag)
async function getOnDemandData() {
  "use cache"
  cacheLife("hours")
  cacheTag("isr-on-demand")

  await delay(500)
  return {
    timestamp: new Date().toISOString(),
    type: "On-demand ISR",
    message: "This data revalidates when you call revalidateTag",
  }
}

function TimeBasedData() {
  return (
    <Suspense fallback={<ISRSkeleton />}>
      <TimeBasedDataContent />
    </Suspense>
  )
}

async function TimeBasedDataContent() {
  const data = await getTimeBasedData()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Time-based ISR
        </CardTitle>
        <CardDescription>Revalidates automatically every 10 seconds</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm font-mono">{data.timestamp}</p>
          <p className="text-sm text-muted-foreground">{data.message}</p>
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Auto-revalidate
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

function OnDemandData() {
  return (
    <Suspense fallback={<ISRSkeleton />}>
      <OnDemandDataContent />
    </Suspense>
  )
}

async function OnDemandDataContent() {
  const data = await getOnDemandData()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-green-600" />
          On-demand ISR
        </CardTitle>
        <CardDescription>Revalidates when you trigger it</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm font-mono">{data.timestamp}</p>
          <p className="text-sm text-muted-foreground">{data.message}</p>
          <Badge variant="outline" className="text-green-600 border-green-600">
            Manual revalidate
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

function ISRSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4 mt-2" />
      </CardContent>
    </Card>
  )
}

export default function ISRDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">Back</Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold mb-2">ISR Patterns Demo</h1>
          <p className="text-muted-foreground">
            Incremental Static Regeneration: Time-based vs On-demand
          </p>
          <div className="flex gap-2 mt-3">
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              Time-based
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-600">
              On-demand
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              cacheLife
            </Badge>
          </div>
        </header>

        {/* Comparison */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <TimeBasedData />
          <OnDemandData />
        </div>

        {/* Code Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Code Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Time-based ISR</h3>
              <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg text-xs overflow-x-auto">
{`async function getData() {
  "use cache"
  cacheLife("seconds", 10) // Revalidate every 10 seconds
  cacheTag("my-tag")
  
  const data = await fetchData()
  return data
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">On-demand ISR</h3>
              <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg text-xs overflow-x-auto">
{`async function getData() {
  "use cache"
  cacheLife("hours") // Long cache
  cacheTag("my-tag")
  
  const data = await fetchData()
  return data
}

// In a Server Action:
"use server"
import { revalidateTag } from 'next/cache'

export async function updateData() {
  await saveToDb()
  revalidateTag("my-tag", "default") // Trigger revalidation
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

