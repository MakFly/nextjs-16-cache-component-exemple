import { cacheLife, cacheTag } from "next/cache"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Modal } from "@/components/modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { delay, type Post, type Comment } from "@/lib/api"
import type { User } from "@/lib/queries"
import { ExternalLink } from "lucide-react"

async function getPost(id: string): Promise<Post | null> {
  "use cache"
  cacheLife("hours")
  cacheTag(`post-${id}`)

  await delay(300)
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
  if (!res.ok) return null
  return res.json()
}

async function getAuthor(userId: number): Promise<User | null> {
  "use cache"
  cacheLife("hours")
  cacheTag("users")

  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
  if (!res.ok) return null
  return res.json()
}

async function getPostComments(postId: string): Promise<Comment[]> {
  "use cache"
  cacheLife("minutes")
  cacheTag(`comments-${postId}`)

  await delay(500)
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
  return res.json()
}

export default async function PostModal({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [post, comments] = await Promise.all([
    getPost(id),
    getPostComments(id),
  ])

  if (!post) {
    notFound()
  }

  const author = await getAuthor(post.userId)

  return (
    <Modal>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <Badge variant="secondary" className="mb-2">Post #{id}</Badge>
            <h2 className="text-2xl font-bold">{post.title}</h2>
            <p className="text-muted-foreground mt-1">
              By {author?.name || `User ${post.userId}`}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              Modal View
            </Badge>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/posts/${id}`}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Full Page
              </Link>
            </Button>
          </div>
        </div>

        {/* Content */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed">{post.body}</p>
          </CardContent>
        </Card>

        {/* Comments Preview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Comments ({comments.length})</CardTitle>
              <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                cached
              </Badge>
            </div>
            <CardDescription className="font-mono text-xs">
              {new Date().toLocaleTimeString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {comments.slice(0, 3).map((comment) => (
                <div key={comment.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
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
              {comments.length > 3 && (
                <p className="text-sm text-muted-foreground text-center">
                  +{comments.length - 3} more comments
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Modal>
  )
}
