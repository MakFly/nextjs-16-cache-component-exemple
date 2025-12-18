// ============================================
// Configuration Types
// ============================================

export interface ApiConfig {
  /** Base URL for API requests */
  baseUrl: string
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number
  /** Enable automatic token refresh on 401 (default: true) */
  autoRefresh?: boolean
  /** Enable mock mode for development */
  mockEnabled?: boolean
  /** Callback when authentication fails (refresh token expired) */
  onUnauthorized?: () => void
  /** Callback when tokens are refreshed */
  onTokenRefreshed?: (tokens: AuthTokens) => void
}

export interface RequestConfig extends Omit<RequestInit, 'body'> {
  /** Skip authentication for this request */
  skipAuth?: boolean
  /** Custom timeout for this request */
  timeout?: number
  /** Number of retries on failure */
  retries?: number
  /** Request body (will be JSON stringified) */
  body?: unknown
}

// ============================================
// Authentication Types
// ============================================

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  /** Unix timestamp (seconds) when access token expires */
  expiresAt: number
  /** Unix timestamp (seconds) when refresh token expires */
  refreshExpiresAt: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  tokens: AuthTokens
}

export interface RefreshResponse {
  tokens: AuthTokens
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: "user" | "admin"
  createdAt: string
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  data: T
  status: number
  headers: Headers
}

export interface ApiErrorData {
  message: string
  code: string
  status: number
  details?: Record<string, unknown>
}

export class ApiException extends Error {
  public readonly status: number
  public readonly code: string
  public readonly details?: Record<string, unknown>

  constructor(
    message: string,
    status: number,
    code: string,
    details?: Record<string, unknown>
  ) {
    super(message)
    this.name = "ApiException"
    this.status = status
    this.code = code
    this.details = details
  }
}

// ============================================
// Data Types (matching JSONPlaceholder)
// ============================================

export interface Post {
  id: number
  userId: number
  title: string
  body: string
}

export interface Comment {
  id: number
  postId: number
  name: string
  email: string
  body: string
}

export interface Todo {
  id: number
  userId: number
  title: string
  completed: boolean
}

export interface Album {
  id: number
  userId: number
  title: string
}

/**
 * JSONPlaceholder User type (different from auth User)
 * Used for demo data from jsonplaceholder.typicode.com
 */
export interface JsonPlaceholderUser {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
  }
  address: {
    city: string
    street: string
  }
}

// ============================================
// Utility Types
// ============================================

export type RuntimeContext = "server" | "client"

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

// ============================================
// Utility Functions
// ============================================

/**
 * Utility to add artificial delay for demonstrating streaming
 */
export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
