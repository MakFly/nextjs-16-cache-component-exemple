import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { delay } from "@/lib/api"
import { Code, Layers, Zap } from "lucide-react"

// Simulate different loading times
async function getFastData() {
  await delay(500)
  return { data: "Fast data loaded", time: "500ms" }
}

async function getMediumData() {
  await delay(1000)
  return { data: "Medium data loaded", time: "1000ms" }
}

async function getSlowData() {
  await delay(2000)
  return { data: "Slow data loaded", time: "2000ms" }
}

function FastComponent() {
  return (
    <Suspense fallback={<StreamingSkeleton label="Fast" />}>
      <FastContent />
    </Suspense>
  )
}

async function FastContent() {
  const result = await getFastData()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-green-600" />
          Fast Component
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{result.data}</p>
        <Badge variant="outline" className="mt-2 text-green-600 border-green-600">
          {result.time}
        </Badge>
      </CardContent>
    </Card>
  )
}

function MediumComponent() {
  return (
    <Suspense fallback={<StreamingSkeleton label="Medium" />}>
      <MediumContent />
    </Suspense>
  )
}

async function MediumContent() {
  const result = await getMediumData()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-yellow-600" />
          Medium Component
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{result.data}</p>
        <Badge variant="outline" className="mt-2 text-yellow-600 border-yellow-600">
          {result.time}
        </Badge>
      </CardContent>
    </Card>
  )
}

function SlowComponent() {
  return (
    <Suspense fallback={<StreamingSkeleton label="Slow" />}>
      <SlowContent />
    </Suspense>
  )
}

async function SlowContent() {
  const result = await getSlowData()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5 text-red-600" />
          Slow Component
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{result.data}</p>
        <Badge variant="outline" className="mt-2 text-red-600 border-red-600">
          {result.time}
        </Badge>
      </CardContent>
    </Card>
  )
}

function StreamingSkeleton({ label }: { label: string }) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-24 mt-2" />
        <p className="text-xs text-muted-foreground mt-2">Loading {label}...</p>
      </CardContent>
    </Card>
  )
}

// Nested Suspense boundaries
function NestedStreaming() {
  return (
    <Suspense fallback={<StreamingSkeleton label="Outer" />}>
      <div className="space-y-4">
        <FastComponent />
        <Suspense fallback={<StreamingSkeleton label="Nested" />}>
          <div className="grid gap-4 md:grid-cols-2">
            <MediumComponent />
            <SlowComponent />
          </div>
        </Suspense>
      </div>
    </Suspense>
  )
}

export default function StreamingDemoPage() {
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
          <h1 className="text-3xl font-bold mb-2">Advanced Streaming Demo</h1>
          <p className="text-muted-foreground">
            Nested Suspense boundaries and progressive hydration
          </p>
          <div className="flex gap-2 mt-3">
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              Suspense
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Streaming
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              Progressive
            </Badge>
          </div>
        </header>

        {/* Explanation */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              Components stream independently based on their loading times.
              Fast components appear first, slow ones stream in progressively.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Nested Streaming Demo */}
        <NestedStreaming />

        {/* Code Examples */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Code Examples
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Nested Suspense Boundaries</h3>
              <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg text-xs overflow-x-auto">
{`function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <FastComponent />
      <Suspense fallback={<Skeleton />}>
        <SlowComponent />
      </Suspense>
    </Suspense>
  )
}

// Each Suspense boundary streams independently
// Fast components render first, slow ones stream in`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Out-of-Order Streaming</h3>
              <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg text-xs overflow-x-auto">
{`// Components render as soon as their data is ready
// Not necessarily in DOM order

<Suspense fallback={<Skeleton />}>
  <SlowComponent /> {/* Renders last */}
</Suspense>

<Suspense fallback={<Skeleton />}>
  <FastComponent /> {/* Renders first */}
</Suspense>`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

