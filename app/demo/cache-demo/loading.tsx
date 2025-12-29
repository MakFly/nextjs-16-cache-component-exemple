import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

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

export default function CacheDemoLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">Back</Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold">cacheLife Comparison</h1>
          <p className="text-muted-foreground mt-1">
            Different cache durations side by side - watch how timestamps change
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline">Refresh page to see cached vs fresh</Badge>
          </div>
        </header>

        {/* Cache Duration Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CacheSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
