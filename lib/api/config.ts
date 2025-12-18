import type { ApiConfig } from "./types"

// ============================================
// API Endpoints
// ============================================

export const API_ENDPOINTS = {
  // Auth
  login: "/auth/login",
  logout: "/auth/logout",
  refresh: "/auth/refresh",
  me: "/auth/me",
  register: "/auth/register",

  // Users
  users: "/users",
  user: (id: string | number) => `/users/${id}`,

  // Posts
  posts: "/posts",
  post: (id: number) => `/posts/${id}`,
  postComments: (postId: number) => `/posts/${postId}/comments`,

  // Comments
  comments: "/comments",
  comment: (id: number) => `/comments/${id}`,

  // Todos
  todos: "/todos",
  todo: (id: number) => `/todos/${id}`,
  userTodos: (userId: number) => `/users/${userId}/todos`,

  // Albums
  albums: "/albums",
  album: (id: number) => `/albums/${id}`,
  userAlbums: (userId: number) => `/users/${userId}/albums`,
} as const

// ============================================
// Cookie Configuration
// ============================================

const isProduction = process.env.NODE_ENV === "production"

export const COOKIE_CONFIG = {
  accessToken: {
    name: "access_token",
    maxAge: 15 * 60, // 15 minutes
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
  },
  refreshToken: {
    name: "refresh_token",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
  },
} as const

// ============================================
// Default Configuration
// ============================================

export const defaultConfig: ApiConfig = {
  // Use JSONPlaceholder as default for demo, override with env var for real API
  baseUrl:
    process.env.NEXT_PUBLIC_API_URL || "https://jsonplaceholder.typicode.com",
  timeout: 30000,
  autoRefresh: true,
  // Enable mock in development when MOCK_API=true
  mockEnabled:
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_MOCK_API === "true",
}

// ============================================
// Helper Functions
// ============================================

/**
 * Check if we're running on the server or client
 */
export function getContext(): "server" | "client" {
  return typeof window === "undefined" ? "server" : "client"
}

/**
 * Check if mock mode is enabled
 */
export function isMockEnabled(): boolean {
  return defaultConfig.mockEnabled ?? false
}
