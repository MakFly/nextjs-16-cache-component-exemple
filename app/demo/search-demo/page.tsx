import { Suspense } from "react"
import Link from "next/link"
import { connection } from "next/server"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SearchInput } from "@/components/search/search-input"
import { delay, type Post } from "@/lib/api"
import { createSearchParamsCache, parseAsString } from "nuqs/server"

// Define search params schema for server-side parsing
const searchParamsCache = createSearchParamsCache({
  q: parseAsString.withDefault(""),
})

async function SearchResults({ query }: { query: string }) {
  // Using searchParams makes this dynamic (not cached)
  await connection()

  await delay(800)

  const res = await fetch("https://jsonplaceholder.typicode.com/posts")
  const allPosts: Post[] = await res.json()

  const filteredPosts = query
    ? allPosts.filter((post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.body.toLowerCase().includes(query.toLowerCase())
      )
    : allPosts.slice(0, 12)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {query ? `Results for "${query}"` : "All Posts"}
            </CardTitle>
            <CardDescription>
              {filteredPosts.length} posts found &middot;
              <span className="font-mono ml-1">{new Date().toLocaleTimeString()}</span>
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            dynamic
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">No posts found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="block border border-border rounded-lg p-4 hover:bg-muted/50 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">User {post.userId}</Badge>
                  <span className="text-xs text-muted-foreground">#{post.id}</span>
                </div>
                <h3 className="font-medium line-clamp-1 mb-1">
                  {query ? highlightMatch(post.title, query) : post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.body}</p>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function highlightMatch(text: string, query: string) {
  if (!query) return text
  const parts = text.split(new RegExp(`(${query})`, "gi"))
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 dark:bg-yellow-900 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

function SearchResultsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32 mt-1" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  // Parse search params using nuqs server cache
  const { q } = await searchParamsCache.parse(searchParams)

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
          <h1 className="text-3xl font-bold">Search with nuqs</h1>
          <p className="text-muted-foreground mt-1">
            Type-safe URL state management with nuqs
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              nuqs
            </Badge>
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              dynamic rendering
            </Badge>
            <Badge variant="outline">
              Shareable URLs
            </Badge>
          </div>
        </header>

        {/* Search Input */}
        <div className="mb-6">
          <Suspense fallback={<Skeleton className="h-10 w-full" />}>
            <SearchInput />
          </Suspense>
        </div>

        {/* Results */}
        <Suspense key={q} fallback={<SearchResultsSkeleton />}>
          <SearchResults query={q} />
        </Suspense>
      </div>
    </div>
  )
}
