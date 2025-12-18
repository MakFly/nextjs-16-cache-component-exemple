// ============================================
// API Client Exports
// ============================================

export { api, ApiClient, createApiClient, setClientToken, clearClientToken } from "./client"
export { API_ENDPOINTS, COOKIE_CONFIG, defaultConfig, getContext, isMockEnabled } from "./config"

// ============================================
// Type Exports
// ============================================

export type {
  // Config types
  ApiConfig,
  RequestConfig,
  // Auth types
  AuthTokens,
  LoginCredentials,
  LoginResponse,
  RefreshResponse,
  User,
  // Response types
  ApiResponse,
  ApiErrorData,
  // Data types
  Post,
  Comment,
  Todo,
  Album,
  JsonPlaceholderUser,
  // Utility types
  RuntimeContext,
  HttpMethod,
} from "./types"

export { ApiException, delay } from "./types"

// Backwards compatibility: alias JsonPlaceholderUser as User for demo components
// The auth User type is exported above, but components using JSONPlaceholder data
// can import JsonPlaceholderUser or use the legacy User type from lib/api.ts

// ============================================
// Auth Exports
// ============================================

// Server Actions from auth/index.ts
export { login, logout, register, getMe, type AuthResult, type RegisterData } from "./auth"

// Token utilities from auth/tokens.ts (these are also Server Actions)
export {
  isAuthenticated,
  getCurrentUser,
  getAccessToken,
  isTokenExpired,
  setAuthTokens,
  clearAuthTokens,
} from "./auth/tokens"

// ============================================
// Hooks Exports
// ============================================

export { useApiQuery, useApiMutation, useOptimisticMutation } from "./hooks/use-api"
export { useAuth, type UseAuthReturn } from "./hooks/use-auth"

// ============================================
// Server Exports
// ============================================

export { cachedApi, cachedFetch, serverApi } from "./server"

// ============================================
// Mock Exports (for testing/development)
// ============================================

export { getMockResponse, mockUsers, mockPosts, mockComments, mockTodos, mockAlbums } from "./mock"
