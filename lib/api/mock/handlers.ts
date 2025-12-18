import type { ApiResponse } from "../types"
import { ApiException } from "../types"
import { mockAuth } from "./data/auth"
import {
  mockPosts,
  mockComments,
  mockJsonUsers,
  mockTodos,
  mockAlbums,
} from "./data/posts"

// ============================================
// Mock Handler Type
// ============================================

export interface MockHandler<T = unknown> {
  /** Match function to determine if this handler should respond */
  match: (endpoint: string, options: RequestInit) => boolean
  /** Response generator function */
  response: (endpoint: string, options: RequestInit) => Promise<T>
  /** Optional delay to simulate network latency (ms) */
  delay?: number
}

// ============================================
// Mock Handlers
// ============================================

export const mockHandlers: MockHandler[] = [
  // ==========================================
  // Auth Handlers
  // ==========================================
  {
    match: (endpoint, options) =>
      endpoint === "/auth/login" && options.method === "POST",
    delay: 800,
    response: async (_, options) => {
      const body = JSON.parse(options.body as string)
      const result = mockAuth.login(body.email, body.password)

      if (!result) {
        throw new ApiException("Invalid credentials", 401, "INVALID_CREDENTIALS")
      }

      return result
    },
  },
  {
    match: (endpoint, options) =>
      endpoint === "/auth/refresh" && options.method === "POST",
    delay: 300,
    response: async () => mockAuth.refresh(),
  },
  {
    match: (endpoint) => endpoint === "/auth/me",
    delay: 200,
    response: async () => mockAuth.getUser("1"),
  },
  {
    match: (endpoint, options) =>
      endpoint === "/auth/logout" && options.method === "POST",
    delay: 100,
    response: async () => ({ success: true }),
  },
  {
    match: (endpoint, options) =>
      endpoint === "/auth/register" && options.method === "POST",
    delay: 800,
    response: async (_, options) => {
      const body = JSON.parse(options.body as string)
      // Simulate registration - create a new user
      const newUser = {
        id: String(Date.now()),
        email: body.email,
        name: body.name,
        role: "user" as const,
        createdAt: new Date().toISOString(),
      }
      return {
        user: newUser,
        tokens: {
          accessToken: `mock_access_${newUser.id}_${Date.now()}`,
          refreshToken: `mock_refresh_${newUser.id}_${Date.now()}`,
          expiresAt: Math.floor(Date.now() / 1000) + 15 * 60,
          refreshExpiresAt: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
        },
      }
    },
  },

  // ==========================================
  // Posts Handlers
  // ==========================================
  {
    match: (endpoint, options) =>
      endpoint === "/posts" && options.method === "GET",
    delay: 500,
    response: async () => mockPosts,
  },
  {
    match: (endpoint, options) =>
      /^\/posts\/\d+$/.test(endpoint) && options.method === "GET",
    delay: 300,
    response: async (endpoint) => {
      const id = parseInt(endpoint.split("/")[2])
      const post = mockPosts.find((p) => p.id === id)
      if (!post) {
        throw new ApiException("Post not found", 404, "NOT_FOUND")
      }
      return post
    },
  },
  {
    match: (endpoint, options) =>
      endpoint === "/posts" && options.method === "POST",
    delay: 600,
    response: async (_, options) => {
      const body = JSON.parse(options.body as string)
      return {
        id: mockPosts.length + 1,
        ...body,
      }
    },
  },
  {
    match: (endpoint, options) =>
      /^\/posts\/\d+$/.test(endpoint) &&
      (options.method === "PUT" || options.method === "PATCH"),
    delay: 400,
    response: async (endpoint, options) => {
      const id = parseInt(endpoint.split("/")[2])
      const body = JSON.parse(options.body as string)
      const post = mockPosts.find((p) => p.id === id)
      if (!post) {
        throw new ApiException("Post not found", 404, "NOT_FOUND")
      }
      return { ...post, ...body }
    },
  },
  {
    match: (endpoint, options) =>
      /^\/posts\/\d+$/.test(endpoint) && options.method === "DELETE",
    delay: 300,
    response: async () => ({}),
  },

  // ==========================================
  // Comments Handlers
  // ==========================================
  {
    match: (endpoint) => /^\/posts\/\d+\/comments$/.test(endpoint),
    delay: 400,
    response: async (endpoint) => {
      const postId = parseInt(endpoint.split("/")[2])
      return mockComments.filter((c) => c.postId === postId)
    },
  },
  {
    match: (endpoint) => endpoint === "/comments",
    delay: 400,
    response: async () => mockComments,
  },

  // ==========================================
  // Users Handlers
  // ==========================================
  {
    match: (endpoint) => endpoint === "/users",
    delay: 400,
    response: async () => mockJsonUsers,
  },
  {
    match: (endpoint) => /^\/users\/\d+$/.test(endpoint),
    delay: 200,
    response: async (endpoint) => {
      const id = endpoint.split("/")[2]
      const user = mockJsonUsers.find((u) => u.id === id)
      if (!user) {
        throw new ApiException("User not found", 404, "NOT_FOUND")
      }
      return user
    },
  },

  // ==========================================
  // Todos Handlers
  // ==========================================
  {
    match: (endpoint) => endpoint === "/todos",
    delay: 300,
    response: async () => mockTodos,
  },
  {
    match: (endpoint) => /^\/users\/\d+\/todos$/.test(endpoint),
    delay: 300,
    response: async (endpoint) => {
      const userId = parseInt(endpoint.split("/")[2])
      return mockTodos.filter((t) => t.userId === userId)
    },
  },

  // ==========================================
  // Albums Handlers
  // ==========================================
  {
    match: (endpoint) => endpoint === "/albums",
    delay: 300,
    response: async () => mockAlbums,
  },
  {
    match: (endpoint) => /^\/users\/\d+\/albums$/.test(endpoint),
    delay: 300,
    response: async (endpoint) => {
      const userId = parseInt(endpoint.split("/")[2])
      return mockAlbums.filter((a) => a.userId === userId)
    },
  },
]
