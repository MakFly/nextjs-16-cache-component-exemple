"use client"

import { useState } from "react"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { useDebounce } from "@/hooks/use-debounce"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Loader2 } from "lucide-react"
import { queryKeys, fetchPosts } from "@/lib/queries"
import type { Post } from "@/lib/api"

export function SearchQueryExample() {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)

  const {
    data: posts,
    isLoading,
    isFetching,
    isPlaceholderData,
  } = useQuery({
    queryKey: queryKeys.posts.list({ search: debouncedSearch }),
    queryFn: () => fetchPosts({ search: debouncedSearch, limit: 6 }),
    placeholderData: keepPreviousData, // Keep old data while fetching
    enabled: true,
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Search with Debounce
              {isFetching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </CardTitle>
            <CardDescription>
              Debounced search + keepPreviousData for smooth UX
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Client-side
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className={`transition-opacity ${isPlaceholderData ? "opacity-50" : ""}`}>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : posts?.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No posts found for "{debouncedSearch}"
            </p>
          ) : (
            <div className="space-y-3">
              {posts?.map((post: Post) => (
                <div
                  key={post.id}
                  className="p-3 border border-border rounded-lg"
                >
                  <p className="font-medium line-clamp-1">{post.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">{post.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Code example */}
        <div className="mt-4 pt-4 border-t">
          <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
{`const debouncedSearch = useDebounce(search, 300)

const { data } = useQuery({
  queryKey: ['posts', 'list', { search: debouncedSearch }],
  queryFn: () => fetchPosts({ search: debouncedSearch }),
  placeholderData: keepPreviousData,
})`}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}
