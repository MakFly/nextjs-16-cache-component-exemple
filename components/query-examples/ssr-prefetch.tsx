"use client"

import { useEffect, useRef } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { queryKeys, fetchPosts } from "@/lib/queries"
import type { Post } from "@/lib/api"

interface SSRPrefetchExampleProps {
  initialData: Post[]
}

export function SSRPrefetchExample({ initialData }: SSRPrefetchExampleProps) {
  const queryClient = useQueryClient()
  const prevDataRef = useRef<string>("")

  // Sync initialData with cache when props change (e.g., with Activity preservation)
  useEffect(() => {
    const currentKey = JSON.stringify(initialData.map((p) => p.id))
    if (prevDataRef.current && prevDataRef.current !== currentKey) {
      // Server data changed, update the cache
      queryClient.setQueryData(queryKeys.posts.list({}), initialData)
    }
    prevDataRef.current = currentKey
  }, [initialData, queryClient])

  const {
    data: posts,
    isFetching,
    dataUpdatedAt,
    refetch,
  } = useQuery({
    queryKey: queryKeys.posts.list({}),
    queryFn: () => fetchPosts({ limit: 5 }),
    initialData, // Hydrate with server data
    staleTime: 60 * 1000, // Consider fresh for 1 minute
  })

  return (
    <Card className="border-green-200 dark:border-green-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              SSR Prefetch + Hydration
              {isFetching && (
                <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </CardTitle>
            <CardDescription>
              Data fetched on server, hydrated on client
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-600">
            SSR + Client
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
            Refetch
          </Button>
          {dataUpdatedAt && (
            <span className="text-xs text-muted-foreground font-mono">
              Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg mb-4 text-sm">
          <p className="text-green-700 dark:text-green-300">
            <strong>How it works:</strong> Data was fetched on the server and passed as{" "}
            <code className="bg-green-100 dark:bg-green-900 px-1 rounded">initialData</code>.
            The client picks it up instantly with no loading state!
          </p>
        </div>

        <div className="space-y-3">
          {posts?.map((post: Post) => (
            <div
              key={post.id}
              className="p-3 border border-border rounded-lg"
            >
              <div className="flex items-center justify-between mb-1">
                <Badge variant="secondary" className="text-xs">#{post.id}</Badge>
              </div>
              <p className="font-medium line-clamp-1">{post.title}</p>
            </div>
          ))}
        </div>

        {/* Code example */}
        <div className="mt-4 pt-4 border-t">
          <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
{`// Server Component (page.tsx)
const posts = await fetchPosts({ limit: 5 })
return <SSRPrefetchExample initialData={posts} />

// Client Component
const { data } = useQuery({
  queryKey: ['posts', 'list', {}],
  queryFn: () => fetchPosts({ limit: 5 }),
  initialData: props.initialData, // No loading state!
  staleTime: 60 * 1000,
})`}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}
