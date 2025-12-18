// Server-only utilities for cached data fetching
// These functions are designed to work with Next.js 16 Cache Components

import { ApiClient } from "./client"
import { API_ENDPOINTS } from "./config"
import type { Post, User, Comment, Todo, Album } from "./types"

// Create a server-specific client (no auto-refresh needed in cached context)
const serverApi = new ApiClient({ autoRefresh: false })

// ============================================
// Pre-built Cached Fetchers
// ============================================

/**
 * Cached API functions for Server Components
 * Use these with "use cache" directive for optimal caching
 *
 * @example
 * async function PostsPage() {
 *   "use cache"
 *   cacheLife("minutes")
 *   cacheTag("posts")
 *
 *   const posts = await cachedApi.getPosts()
 *   return <PostList posts={posts} />
 * }
 */
export const cachedApi = {
  // ==========================================
  // Posts
  // ==========================================

  /**
   * Get all posts
   */
  getPosts: async (): Promise<Post[]> => {
    return serverApi.get<Post[]>(API_ENDPOINTS.posts)
  },

  /**
   * Get a single post by ID
   */
  getPost: async (id: number): Promise<Post> => {
    return serverApi.get<Post>(API_ENDPOINTS.post(id))
  },

  /**
   * Get posts by user ID
   */
  getPostsByUser: async (userId: number): Promise<Post[]> => {
    const posts = await serverApi.get<Post[]>(API_ENDPOINTS.posts)
    return posts.filter((p) => p.userId === userId)
  },

  // ==========================================
  // Users
  // ==========================================

  /**
   * Get all users
   */
  getUsers: async (): Promise<User[]> => {
    return serverApi.get<User[]>(API_ENDPOINTS.users)
  },

  /**
   * Get a single user by ID
   */
  getUser: async (id: string | number): Promise<User> => {
    return serverApi.get<User>(API_ENDPOINTS.user(id))
  },

  // ==========================================
  // Comments
  // ==========================================

  /**
   * Get comments for a post
   */
  getComments: async (postId: number): Promise<Comment[]> => {
    return serverApi.get<Comment[]>(API_ENDPOINTS.postComments(postId))
  },

  /**
   * Get all comments
   */
  getAllComments: async (): Promise<Comment[]> => {
    return serverApi.get<Comment[]>(API_ENDPOINTS.comments)
  },

  // ==========================================
  // Todos
  // ==========================================

  /**
   * Get all todos
   */
  getTodos: async (): Promise<Todo[]> => {
    return serverApi.get<Todo[]>(API_ENDPOINTS.todos)
  },

  /**
   * Get todos for a user
   */
  getTodosByUser: async (userId: number): Promise<Todo[]> => {
    return serverApi.get<Todo[]>(API_ENDPOINTS.userTodos(userId))
  },

  // ==========================================
  // Albums
  // ==========================================

  /**
   * Get all albums
   */
  getAlbums: async (): Promise<Album[]> => {
    return serverApi.get<Album[]>(API_ENDPOINTS.albums)
  },

  /**
   * Get albums for a user
   */
  getAlbumsByUser: async (userId: number): Promise<Album[]> => {
    return serverApi.get<Album[]>(API_ENDPOINTS.userAlbums(userId))
  },
}

// ============================================
// Generic Cached Fetch (for custom endpoints)
// ============================================

/**
 * Generic cached fetch for custom endpoints
 * Use with "use cache" directive in your Server Component
 *
 * @example
 * async function CustomData() {
 *   "use cache"
 *   cacheLife("hours")
 *   cacheTag("custom-data")
 *
 *   const data = await cachedFetch('/custom/endpoint')
 *   return <div>{data}</div>
 * }
 */
export async function cachedFetch<T>(endpoint: string): Promise<T> {
  return serverApi.get<T>(endpoint)
}

// Re-export server API client for advanced use cases
export { serverApi }
