import { api, API_ENDPOINTS } from "./api"
import type { Post, Comment, Todo, JsonPlaceholderUser } from "./api"

// Re-export User type for backwards compatibility
export type User = JsonPlaceholderUser

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
    byPost: (postId: number) =>
      [...queryKeys.comments.all, "post", postId] as const,
  },

  // Todos
  todos: {
    all: ["todos"] as const,
    byUser: (userId: number) =>
      [...queryKeys.todos.all, "user", userId] as const,
  },
}

// ============================================
// FETCH FUNCTIONS - Using new API client
// ============================================

// Posts
export async function fetchPosts(options?: {
  userId?: number
  search?: string
  limit?: number
  offset?: number
}): Promise<Post[]> {
  let posts = await api.get<Post[]>(API_ENDPOINTS.posts)

  // Filter by userId
  if (options?.userId) {
    posts = posts.filter((p) => p.userId === options.userId)
  }

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
  return api.get<Post>(API_ENDPOINTS.post(id))
}

// Users
export async function fetchUsers(): Promise<User[]> {
  return api.get<User[]>(API_ENDPOINTS.users)
}

export async function fetchUser(id: number): Promise<User> {
  return api.get<User>(API_ENDPOINTS.user(id))
}

// Comments
export async function fetchCommentsByPost(postId: number): Promise<Comment[]> {
  return api.get<Comment[]>(API_ENDPOINTS.postComments(postId))
}

// Todos
export async function fetchTodosByUser(userId: number): Promise<Todo[]> {
  return api.get<Todo[]>(API_ENDPOINTS.userTodos(userId))
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

  return api.post<Post>(API_ENDPOINTS.posts, data)
}

export async function updatePost(
  id: number,
  data: Partial<Pick<Post, "title" | "body">>
): Promise<Post> {
  return api.patch<Post>(API_ENDPOINTS.post(id), data)
}

export async function deletePost(id: number): Promise<void> {
  // Simulate network delay for demo
  await new Promise((r) => setTimeout(r, 800))

  // Simulate random failure (10% chance) to demo rollback
  if (Math.random() < 0.1) {
    throw new Error("Random server error - post will be restored!")
  }

  await api.delete(API_ENDPOINTS.post(id))
}

export async function toggleTodo(id: number, completed: boolean): Promise<Todo> {
  return api.patch<Todo>(API_ENDPOINTS.todo(id), { completed })
}
