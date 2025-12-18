import type {
  ApiConfig,
  RequestConfig,
  ApiResponse,
  AuthTokens,
} from "./types"
import { ApiException } from "./types"
import { defaultConfig, getContext, COOKIE_CONFIG, API_ENDPOINTS } from "./config"
import { getMockResponse } from "./mock"

// ============================================
// Client-side Token Memory Store
// ============================================

const tokenStore = {
  accessToken: null as string | null,
  expiresAt: 0,
}

// ============================================
// Token Management Functions
// ============================================

async function getAccessToken(): Promise<string | null> {
  if (getContext() === "server") {
    // Server: read from httpOnly cookies
    try {
      const { cookies } = await import("next/headers")
      const cookieStore = await cookies()
      return cookieStore.get(COOKIE_CONFIG.accessToken.name)?.value ?? null
    } catch {
      return null
    }
  } else {
    // Client: use memory store (cookies are httpOnly, not accessible from JS)
    return tokenStore.accessToken
  }
}

/**
 * Update the client-side token store
 * Called after successful login or token refresh
 */
export function setClientToken(accessToken: string, expiresAt: number): void {
  if (getContext() === "client") {
    tokenStore.accessToken = accessToken
    tokenStore.expiresAt = expiresAt
  }
}

/**
 * Clear the client-side token store
 * Called on logout
 */
export function clearClientToken(): void {
  if (getContext() === "client") {
    tokenStore.accessToken = null
    tokenStore.expiresAt = 0
  }
}

// ============================================
// API Client Class
// ============================================

export class ApiClient {
  private config: ApiConfig
  private refreshPromise: Promise<AuthTokens | null> | null = null

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  /**
   * Core request method
   */
  async request<T>(
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      skipAuth = false,
      timeout = this.config.timeout,
      retries = 0,
      body,
      ...fetchOptions
    } = options

    // Check mock mode first
    if (this.config.mockEnabled) {
      const mockResponse = await getMockResponse<T>(endpoint, {
        ...fetchOptions,
        body: body ? JSON.stringify(body) : undefined,
      })
      if (mockResponse) return mockResponse
    }

    const url = `${this.config.baseUrl}${endpoint}`

    // Build headers
    const headers = new Headers(fetchOptions.headers)

    if (!headers.has("Content-Type") && body) {
      headers.set("Content-Type", "application/json")
    }

    // Add auth header if needed
    if (!skipAuth) {
      const token = await getAccessToken()
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
    }

    // Build fetch options
    const requestInit: RequestInit = {
      ...fetchOptions,
      headers,
      credentials: "include", // Always send cookies
      body: body ? JSON.stringify(body) : undefined,
    }

    // Add timeout via AbortController
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    requestInit.signal = controller.signal

    try {
      const response = await fetch(url, requestInit)
      clearTimeout(timeoutId)

      // Handle 401 with auto-refresh
      if (response.status === 401 && this.config.autoRefresh && !skipAuth) {
        const newTokens = await this.refreshTokens()
        if (newTokens) {
          // Retry original request with new token
          headers.set("Authorization", `Bearer ${newTokens.accessToken}`)
          const retryResponse = await fetch(url, { ...requestInit, headers })
          return this.parseResponse<T>(retryResponse)
        } else {
          // Refresh failed, trigger logout callback
          this.config.onUnauthorized?.()
          throw new ApiException("Session expired", 401, "SESSION_EXPIRED")
        }
      }

      return this.parseResponse<T>(response)
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof ApiException) throw error

      // Handle abort (timeout)
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new ApiException("Request timeout", 408, "TIMEOUT")
      }

      // Retry logic for network errors
      if (retries > 0) {
        return this.request<T>(endpoint, { ...options, retries: retries - 1 })
      }

      throw new ApiException(
        error instanceof Error ? error.message : "Network error",
        0,
        "NETWORK_ERROR"
      )
    }
  }

  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    // Handle non-JSON responses
    const contentType = response.headers.get("content-type")
    const isJson = contentType?.includes("application/json")

    if (!response.ok) {
      let errorData: { message?: string; code?: string; details?: Record<string, unknown> } = {}

      if (isJson) {
        try {
          errorData = await response.json()
        } catch {
          // Ignore JSON parse errors
        }
      }

      throw new ApiException(
        errorData.message || response.statusText,
        response.status,
        errorData.code || "API_ERROR",
        errorData.details
      )
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return {
        data: undefined as T,
        status: response.status,
        headers: response.headers,
      }
    }

    const data = isJson ? await response.json() : await response.text()
    return {
      data,
      status: response.status,
      headers: response.headers,
    }
  }

  /**
   * Token refresh with request deduplication
   */
  private async refreshTokens(): Promise<AuthTokens | null> {
    // Deduplicate concurrent refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = this.performRefresh()

    try {
      const tokens = await this.refreshPromise
      return tokens
    } finally {
      this.refreshPromise = null
    }
  }

  private async performRefresh(): Promise<AuthTokens | null> {
    try {
      // The refresh token is sent automatically via httpOnly cookie
      const response = await this.request<{ tokens: AuthTokens }>(
        API_ENDPOINTS.refresh,
        {
          method: "POST",
          skipAuth: true, // Don't use access token for refresh
        }
      )

      const { tokens } = response.data

      // Update client-side memory store
      setClientToken(tokens.accessToken, tokens.expiresAt)

      this.config.onTokenRefreshed?.(tokens)
      return tokens
    } catch {
      return null
    }
  }

  // ============================================
  // Convenience Methods
  // ============================================

  async get<T>(endpoint: string, options?: RequestConfig): Promise<T> {
    const response = await this.request<T>(endpoint, {
      ...options,
      method: "GET",
    })
    return response.data
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestConfig
  ): Promise<T> {
    const response = await this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body,
    })
    return response.data
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestConfig
  ): Promise<T> {
    const response = await this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body,
    })
    return response.data
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestConfig
  ): Promise<T> {
    const response = await this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body,
    })
    return response.data
  }

  async delete<T>(endpoint: string, options?: RequestConfig): Promise<T> {
    const response = await this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    })
    return response.data
  }
}

// ============================================
// Singleton Instance
// ============================================

export const api = new ApiClient()

/**
 * Create a new API client with custom configuration
 */
export function createApiClient(config?: Partial<ApiConfig>): ApiClient {
  return new ApiClient(config)
}
