import type { Post, User, Comment, Todo } from "./api"

// ============================================
// QUERY KEYS - Consistent key factory pattern
// ============================================

export const queryKeys = {
  // Posts
  posts: {
    all: ["posts"] as const,
    lists: () => [...queryKeys.posts.all, "list"] as const,
    list: (filters: { userId?: number; search?: string }) =>
      [...queryKeys.posts.lists(), filters] as const,
    details: () => [...queryKeys.posts.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.posts.details(), id] as const,
  },

  // Users
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: () => [...queryKeys.users.lists()] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
  },

  // Comments
  comments: {
    all: ["comments"] as const,
    byPost: (postId: number) => [...queryKeys.comments.all, "post", postId] as const,
  },

  // Todos
  todos: {
    all: ["todos"] as const,
    byUser: (userId: number) => [...queryKeys.todos.all, "user", userId] as const,
  },
}

// ============================================
// FETCH FUNCTIONS - Used by queries
// ============================================

const API_BASE = "https://jsonplaceholder.typicode.com"

// Posts
export async function fetchPosts(options?: {
  userId?: number
  search?: string
  limit?: number
  offset?: number
}): Promise<Post[]> {
  const url = new URL(`${API_BASE}/posts`)
  if (options?.userId) url.searchParams.set("userId", String(options.userId))

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error("Failed to fetch posts")

  let posts: Post[] = await res.json()

  // Client-side filtering for search (JSONPlaceholder doesn't support search)
  if (options?.search) {
    const search = options.search.toLowerCase()
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(search) ||
        p.body.toLowerCase().includes(search)
    )
  }

  // Pagination
  if (options?.offset !== undefined || options?.limit !== undefined) {
    const start = options?.offset ?? 0
    const end = options?.limit ? start + options.limit : undefined
    posts = posts.slice(start, end)
  }

  return posts
}

export async function fetchPost(id: number): Promise<Post> {
  const res = await fetch(`${API_BASE}/posts/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch post ${id}`)
  return res.json()
}

// Users
export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/users`)
  if (!res.ok) throw new Error("Failed to fetch users")
  return res.json()
}

export async function fetchUser(id: number): Promise<User> {
  const res = await fetch(`${API_BASE}/users/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch user ${id}`)
  return res.json()
}

// Comments
export async function fetchCommentsByPost(postId: number): Promise<Comment[]> {
  const res = await fetch(`${API_BASE}/posts/${postId}/comments`)
  if (!res.ok) throw new Error(`Failed to fetch comments for post ${postId}`)
  return res.json()
}

// Todos
export async function fetchTodosByUser(userId: number): Promise<Todo[]> {
  const res = await fetch(`${API_BASE}/users/${userId}/todos`)
  if (!res.ok) throw new Error(`Failed to fetch todos for user ${userId}`)
  return res.json()
}

// ============================================
// MUTATION FUNCTIONS
// ============================================

export async function createPost(data: {
  title: string
  body: string
  userId: number
}): Promise<Post> {
  // Simulate network delay for demo
  await new Promise((r) => setTimeout(r, 1000))

  // Simulate random failure (15% chance) to demo rollback
  if (Math.random() < 0.15) {
    throw new Error("Random server error - post will be rolled back!")
  }

  const res = await fetch(`${API_BASE}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to create post")
  return res.json()
}

export async function updatePost(
  id: number,
  data: Partial<Pick<Post, "title" | "body">>
): Promise<Post> {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Failed to update post ${id}`)
  return res.json()
}

export async function deletePost(id: number): Promise<void> {
  // Simulate network delay for demo
  await new Promise((r) => setTimeout(r, 800))

  // Simulate random failure (10% chance) to demo rollback
  if (Math.random() < 0.1) {
    throw new Error("Random server error - post will be restored!")
  }

  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error(`Failed to delete post ${id}`)
}

export async function toggleTodo(
  id: number,
  completed: boolean
): Promise<Todo> {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  })
  if (!res.ok) throw new Error(`Failed to toggle todo ${id}`)
  return res.json()
}
