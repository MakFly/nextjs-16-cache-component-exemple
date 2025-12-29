import Link from "next/link"
import { PostStatsSkeleton } from "@/components/posts/post-stats"
import { PostListSkeleton } from "@/components/posts/post-list"
import { PostCommentsSkeleton } from "@/components/posts/post-comments"
import { PostAuthorsSkeleton } from "@/components/posts/post-authors"
import { Button } from "@/components/ui/button"

export default function PostsLoading() {
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
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground mt-1">
            4 components loading independently - watch them stream in!
          </p>
        </header>

        {/* Stats Skeleton */}
        <section className="mb-6">
          <PostStatsSkeleton />
        </section>

        {/* Main Grid Skeletons */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PostListSkeleton />
          </div>
          <div className="space-y-6">
            <PostCommentsSkeleton />
            <PostAuthorsSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}
