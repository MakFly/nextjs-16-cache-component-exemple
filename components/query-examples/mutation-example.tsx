"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/toast"
import { Loader2, Plus, Trash2, Sparkles } from "lucide-react"
import { queryKeys, fetchPosts, createPost, deletePost } from "@/lib/queries"
import type { Post } from "@/lib/api"

// Extended post type to track optimistic state
type OptimisticPost = Post & { isOptimistic?: boolean; isDeleting?: boolean }

export function MutationExample() {
  const [newTitle, setNewTitle] = useState("")
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set())

  // Query for posts
  const { data: posts, isLoading } = useQuery({
    queryKey: queryKeys.posts.list({ userId: 1 }),
    queryFn: () => fetchPosts({ userId: 1, limit: 5 }),
  })

  // Create mutation with optimistic update
  const createMutation = useMutation({
    mutationFn: createPost,
    // Optimistic update
    onMutate: async (newPost) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.list({ userId: 1 }) })

      // Snapshot previous value
      const previousPosts = queryClient.getQueryData(queryKeys.posts.list({ userId: 1 }))

      // Optimistically update with visual marker
      queryClient.setQueryData(queryKeys.posts.list({ userId: 1 }), (old: OptimisticPost[] | undefined) => {
        const optimisticPost: OptimisticPost = {
          id: Date.now(), // Temp ID
          ...newPost,
          isOptimistic: true, // Mark as optimistic for UI
        }
        return old ? [optimisticPost, ...old] : [optimisticPost]
      })

      return { previousPosts }
    },
    onError: (err, newPost, context) => {
      // Rollback on error
      queryClient.setQueryData(
        queryKeys.posts.list({ userId: 1 }),
        context?.previousPosts
      )
      addToast({ type: "error", title: "Failed to create post", description: "The post was rolled back" })
    },
    onSuccess: () => {
      addToast({ type: "success", title: "Post created!", description: "Optimistic update confirmed by server" })
      setNewTitle("")
    },
    onSettled: () => {
      // Refetch to sync with server (removes optimistic marker)
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.list({ userId: 1 }) })
    },
  })

  // Delete mutation with optimistic update
  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onMutate: async (deletedId) => {
      setDeletingIds((prev) => new Set(prev).add(deletedId))
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.list({ userId: 1 }) })
      const previousPosts = queryClient.getQueryData(queryKeys.posts.list({ userId: 1 }))

      // Optimistically remove with animation delay
      queryClient.setQueryData(queryKeys.posts.list({ userId: 1 }), (old: OptimisticPost[] | undefined) =>
        old?.filter((p) => p.id !== deletedId)
      )

      return { previousPosts, deletedId }
    },
    onError: (err, deletedId, context) => {
      setDeletingIds((prev) => {
        const next = new Set(prev)
        next.delete(deletedId)
        return next
      })
      queryClient.setQueryData(
        queryKeys.posts.list({ userId: 1 }),
        context?.previousPosts
      )
      addToast({ type: "error", title: "Failed to delete post", description: "The post was restored" })
    },
    onSuccess: (_, deletedId) => {
      setDeletingIds((prev) => {
        const next = new Set(prev)
        next.delete(deletedId)
        return next
      })
      addToast({ type: "success", title: "Post deleted!" })
    },
  })

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return
    createMutation.mutate({
      title: newTitle,
      body: "Created via TanStack Query mutation",
      userId: 1,
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mutations + Optimistic Updates</CardTitle>
            <CardDescription>
              Create/delete with instant UI feedback
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-pink-600 border-pink-600">
            Mutations
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Create form */}
        <form onSubmit={handleCreate} className="flex gap-2 mb-4">
          <Input
            placeholder="New post title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={createMutation.isPending || !newTitle.trim()}>
            {createMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </form>

        {/* Posts list */}
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {(posts as OptimisticPost[] | undefined)?.map((post) => (
              <div
                key={post.id}
                className={`flex items-center gap-3 p-3 border rounded-lg group transition-all duration-300 ${
                  post.isOptimistic
                    ? "border-pink-500 bg-pink-50 dark:bg-pink-950/20 border-dashed animate-pulse"
                    : "border-border hover:border-muted-foreground/50"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{post.title}</p>
                    {post.isOptimistic && (
                      <Badge variant="secondary" className="text-xs bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300 shrink-0">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Optimistic
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ID: {post.isOptimistic ? "pending..." : post.id}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMutation.mutate(post.id)}
                  disabled={deleteMutation.isPending || post.isOptimistic}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                >
                  {deleteMutation.isPending && deleteMutation.variables === post.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
            {posts?.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No posts yet. Create one above!
              </p>
            )}
          </div>
        )}

        {/* Code example */}
        <div className="mt-4 pt-4 border-t">
          <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
{`const mutation = useMutation({
  mutationFn: createPost,
  onMutate: async (newPost) => {
    await queryClient.cancelQueries({ queryKey })
    const previous = queryClient.getQueryData(queryKey)
    // Optimistic update
    queryClient.setQueryData(queryKey, old => [...])
    return { previous }
  },
  onError: (err, vars, context) => {
    queryClient.setQueryData(queryKey, context.previous)
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey })
  },
})`}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}
