"use client"

import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw } from "lucide-react"
import { queryKeys, fetchCommentsByPost } from "@/lib/queries"
import type { Comment } from "@/lib/api"

interface HydrationBoundaryExampleProps {
  postId: number
}

// This component uses useSuspenseQuery for SSR streaming
export function HydrationBoundaryExample({ postId }: HydrationBoundaryExampleProps) {
  const {
    data: comments,
    isFetching,
    dataUpdatedAt,
  } = useSuspenseQuery({
    queryKey: queryKeys.comments.byPost(postId),
    queryFn: () => fetchCommentsByPost(postId),
    staleTime: 60 * 1000,
  })

  return (
    <Card className="border-purple-200 dark:border-purple-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              useSuspenseQuery + HydrationBoundary
              {isFetching && (
                <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </CardTitle>
            <CardDescription>
              Streaming SSR with Suspense boundaries
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-purple-600 border-purple-600">
            Suspense SSR
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg mb-4 text-sm">
          <p className="text-purple-700 dark:text-purple-300">
            <strong>How it works:</strong> Server prefetches data and streams it with{" "}
            <code className="bg-purple-100 dark:bg-purple-900 px-1 rounded">HydrationBoundary</code>.
            Suspense boundary shows loading on server, then hydrates on client.
          </p>
        </div>

        {dataUpdatedAt && (
          <p className="text-xs text-muted-foreground font-mono mb-4">
            Data from: {new Date(dataUpdatedAt).toLocaleTimeString()}
          </p>
        )}

        <div className="space-y-3">
          {comments.slice(0, 3).map((comment: Comment) => (
            <div
              key={comment.id}
              className="p-3 border border-border rounded-lg"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                  {comment.email.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-sm font-medium line-clamp-1">{comment.name}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 ml-8">
                {comment.body}
              </p>
            </div>
          ))}
        </div>

        {/* Code example */}
        <div className="mt-4 pt-4 border-t">
          <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
{`// lib/query-client.ts (shared!)
export function getQueryClient() {
  // Returns QueryClient with staleTime: 60s
  // Server: new client per request
  // Browser: singleton for persistence
}

// Server Component
const queryClient = getQueryClient() // ← No duplicate refetch!
await queryClient.prefetchQuery({
  queryKey: ['comments', 'post', postId],
  queryFn: () => fetchCommentsByPost(postId),
})

return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <Suspense fallback={<Loading />}>
      <Comments postId={postId} />
    </Suspense>
  </HydrationBoundary>
)`}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}
