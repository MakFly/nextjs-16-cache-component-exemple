"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2, ChevronDown } from "lucide-react"
import { fetchPosts } from "@/lib/queries"
import type { Post } from "@/lib/api"

const PAGE_SIZE = 5

export function InfiniteQueryExample() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["posts", "infinite"],
    queryFn: ({ pageParam }) =>
      fetchPosts({ offset: pageParam * PAGE_SIZE, limit: PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // If we got less than PAGE_SIZE, we're done
      if (lastPage.length < PAGE_SIZE) return undefined
      return allPages.length
    },
  })

  const allPosts = data?.pages.flatMap((page) => page) ?? []
  const totalLoaded = allPosts.length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Infinite Scroll
              {isFetchingNextPage && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </CardTitle>
            <CardDescription>
              useInfiniteQuery with pagination ({totalLoaded} loaded)
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Client-side
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-destructive text-center py-8">Failed to load posts</p>
        ) : (
          <>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {allPosts.map((post: Post, index: number) => (
                <div
                  key={`${post.id}-${index}`}
                  className="p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="secondary" className="text-xs">#{post.id}</Badge>
                    <span className="text-xs text-muted-foreground">
                      Page {Math.floor(index / PAGE_SIZE) + 1}
                    </span>
                  </div>
                  <p className="font-medium line-clamp-1">{post.title}</p>
                </div>
              ))}
            </div>

            {hasNextPage && (
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 mr-2" />
                )}
                Load More
              </Button>
            )}

            {!hasNextPage && totalLoaded > 0 && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                No more posts to load
              </p>
            )}
          </>
        )}

        {/* Code example */}
        <div className="mt-4 pt-4 border-t">
          <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
{`const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['posts', 'infinite'],
  queryFn: ({ pageParam }) => fetchPosts({
    offset: pageParam * PAGE_SIZE,
    limit: PAGE_SIZE,
  }),
  initialPageParam: 0,
  getNextPageParam: (lastPage, allPages) => {
    if (lastPage.length < PAGE_SIZE) return undefined
    return allPages.length
  },
})`}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}
