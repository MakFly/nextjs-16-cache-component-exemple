import { Suspense } from "react"
import Link from "next/link"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/query-client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Client components
import { BasicQueryExample } from "@/components/query-examples/basic-query"
import { SearchQueryExample } from "@/components/query-examples/search-query"
import { DependentQueryExample } from "@/components/query-examples/dependent-query"
import { MutationExample } from "@/components/query-examples/mutation-example"
import { InfiniteQueryExample } from "@/components/query-examples/infinite-query"
import { SSRPrefetchExample } from "@/components/query-examples/ssr-prefetch"
import { HydrationBoundaryExample } from "@/components/query-examples/hydration-boundary"

import { queryKeys, fetchPosts, fetchCommentsByPost } from "@/lib/queries"

// SSR prefetch data on server
async function getSSRData() {
  const posts = await fetchPosts({ limit: 5 })
  return posts
}

// Prefetch for HydrationBoundary example
async function getPrefetchedQueryClient() {
  // Use shared QueryClient with default staleTime to prevent duplicate refetches
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: queryKeys.comments.byPost(1),
    queryFn: () => fetchCommentsByPost(1),
  })

  return queryClient
}

function HydrationExampleSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64 mt-1" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default async function TanStackQueryPage() {
  // Fetch data on server for SSR example
  const [ssrPosts, queryClient] = await Promise.all([
    getSSRData(),
    getPrefetchedQueryClient(),
  ])

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
          <h1 className="text-3xl font-bold">TanStack Query Examples</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive examples: SSR, client-side, mutations, infinite scroll
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline" className="text-green-600 border-green-600">
              SSR Prefetch
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              Client Queries
            </Badge>
            <Badge variant="outline" className="text-pink-600 border-pink-600">
              Mutations
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              Suspense SSR
            </Badge>
          </div>
        </header>

        {/* Info Card */}
        <Card className="mb-8 border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">TanStack Query Patterns</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 mb-2">
                SSR + initialData
              </Badge>
              <p className="text-muted-foreground text-xs">
                Fetch on server, pass as prop. Instant hydration, no flash.
              </p>
            </div>
            <div>
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 mb-2">
                HydrationBoundary
              </Badge>
              <p className="text-muted-foreground text-xs">
                Prefetch + dehydrate. Works with Suspense for streaming.
              </p>
            </div>
            <div>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 mb-2">
                Client-only
              </Badge>
              <p className="text-muted-foreground text-xs">
                Standard useQuery. Shows loading state, good for dynamic data.
              </p>
            </div>
            <div>
              <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300 mb-2">
                Optimistic Updates
              </Badge>
              <p className="text-muted-foreground text-xs">
                Instant UI feedback. Rollback on error, refetch on settle.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Examples Grid */}
        <div className="space-y-8">
          {/* SSR Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500" />
              Server-Side Rendering
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <SSRPrefetchExample initialData={ssrPosts} />
              <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<HydrationExampleSkeleton />}>
                  <HydrationBoundaryExample postId={1} />
                </Suspense>
              </HydrationBoundary>
            </div>
          </section>

          {/* Client-Side Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-500" />
              Client-Side Queries
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <BasicQueryExample />
              <SearchQueryExample />
            </div>
          </section>

          {/* Advanced Patterns Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-purple-500" />
              Advanced Patterns
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <DependentQueryExample />
              <InfiniteQueryExample />
            </div>
          </section>

          {/* Mutations Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-pink-500" />
              Mutations
            </h2>
            <MutationExample />
          </section>
        </div>

        {/* Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>When to use what?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4">Pattern</th>
                    <th className="text-left py-2 pr-4">Use Case</th>
                    <th className="text-left py-2">Pros</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-medium">initialData</td>
                    <td className="py-2 pr-4 text-muted-foreground">SEO-critical, fast first paint</td>
                    <td className="py-2 text-muted-foreground">Simple, no extra setup</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-medium">HydrationBoundary</td>
                    <td className="py-2 pr-4 text-muted-foreground">Complex prefetch, streaming</td>
                    <td className="py-2 text-muted-foreground">Works with Suspense, dedupes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-medium">Client useQuery</td>
                    <td className="py-2 pr-4 text-muted-foreground">User-specific, dynamic data</td>
                    <td className="py-2 text-muted-foreground">Simple, flexible</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-medium">useSuspenseQuery</td>
                    <td className="py-2 pr-4 text-muted-foreground">SSR streaming, cleaner code</td>
                    <td className="py-2 text-muted-foreground">No isLoading checks</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">useMutation</td>
                    <td className="py-2 pr-4 text-muted-foreground">Create, update, delete</td>
                    <td className="py-2 text-muted-foreground">Optimistic updates, rollback</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
