import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cacheLife, cacheTag } from "next/cache"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { delay, type Post, type Comment, type User } from "@/lib/api"

// Pre-render first 10 posts at build time
export async function generateStaticParams() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts")
  const posts: Post[] = await res.json()

  return posts.slice(0, 10).map((post) => ({
    id: String(post.id),
  }))
}

// Cached post data
async function getPost(id: string): Promise<Post | null> {
  "use cache"
  cacheLife("hours")
  cacheTag(`post-${id}`)

  await delay(500)
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
  if (!res.ok) return null
  return res.json()
}

// Cached author data
async function getAuthor(userId: number): Promise<User | null> {
  "use cache"
  cacheLife("hours")
  cacheTag("users")

  await delay(300)
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
  if (!res.ok) return null
  return res.json()
}

// Cached comments
async function getPostComments(postId: string): Promise<Comment[]> {
  "use cache"
  cacheLife("minutes")
  cacheTag(`comments-${postId}`)

  await delay(1500)
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
  return res.json()
}

async function PostContent({ id }: { id: string }) {
  "use cache"
  cacheLife("hours")

  const post = await getPost(id)

  if (!post) {
    notFound()
  }

  const author = await getAuthor(post.userId)
  const generatedAt = new Date().toLocaleTimeString()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{post.title}</CardTitle>
            <CardDescription className="mt-2">
              By {author?.name || `User ${post.userId}`} &middot;
              <span className="font-mono ml-1">{generatedAt}</span>
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-600">
            use cache
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{post.body}</p>
      </CardContent>
    </Card>
  )
}

function PostContentSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-2/3 mt-2" />
      </CardContent>
    </Card>
  )
}

async function PostCommentsList({ postId }: { postId: string }) {
  "use cache"
  cacheLife("minutes")

  const comments = await getPostComments(postId)
  const generatedAt = new Date().toLocaleTimeString()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Comments ({comments.length})</CardTitle>
            <CardDescription className="font-mono">
              {generatedAt}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-600">
            use cache
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {comment.email.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium line-clamp-1">{comment.name}</p>
                  <p className="text-xs text-muted-foreground">{comment.email}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground ml-11">
                {comment.body}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function PostCommentsListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-20 mt-1" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-b border-border pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-3 mb-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40 mt-1" />
                </div>
              </div>
              <Skeleton className="h-4 w-full ml-11" />
              <Skeleton className="h-4 w-2/3 ml-11 mt-1" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/posts">Back to Posts</Link>
            </Button>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">Post #{id}</Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              generateStaticParams
            </Badge>
          </div>
        </header>

        {/* Post Content */}
        <section className="mb-6">
          <Suspense fallback={<PostContentSkeleton />}>
            <PostContent id={id} />
          </Suspense>
        </section>

        {/* Comments */}
        <section>
          <Suspense fallback={<PostCommentsListSkeleton />}>
            <PostCommentsList postId={id} />
          </Suspense>
        </section>
      </div>
    </div>
  )
}
