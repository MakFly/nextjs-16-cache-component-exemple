"use server"

import { revalidateTag } from "next/cache"
import { api } from "../client"
import { API_ENDPOINTS } from "../config"
import { setAuthTokens, clearAuthTokens } from "./tokens"
import type { LoginCredentials, LoginResponse, User } from "../types"

// ============================================
// Action Result Type
// ============================================

export interface AuthResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

// ============================================
// Login Action
// ============================================

/**
 * Server Action: Authenticate user and set cookies
 */
export async function login(
  credentials: LoginCredentials
): Promise<AuthResult<User>> {
  try {
    const response = await api.post<LoginResponse>(
      API_ENDPOINTS.login,
      credentials,
      { skipAuth: true }
    )

    // Set tokens in httpOnly cookies
    await setAuthTokens(response.tokens)

    // Revalidate auth-dependent cached data
    revalidateTag("auth", "default")

    return { success: true, data: response.user }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    }
  }
}

// ============================================
// Logout Action
// ============================================

/**
 * Server Action: Clear auth cookies and invalidate session
 */
export async function logout(): Promise<AuthResult> {
  try {
    // Try to call logout endpoint (ignore errors)
    await api.post(API_ENDPOINTS.logout).catch(() => {})
  } catch {
    // Ignore errors - we'll clear cookies anyway
  }

  // Clear auth cookies
  await clearAuthTokens()

  // Revalidate cached data
  revalidateTag("auth", "default")

  return { success: true }
}

// ============================================
// Get Current User Action
// ============================================

/**
 * Server Action: Get the currently authenticated user
 */
export async function getMe(): Promise<AuthResult<User>> {
  try {
    const user = await api.get<User>(API_ENDPOINTS.me)
    return { success: true, data: user }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get user",
    }
  }
}

// ============================================
// Register Action (if needed)
// ============================================

export interface RegisterData {
  email: string
  password: string
  name: string
}

/**
 * Server Action: Register a new user
 */
export async function register(data: RegisterData): Promise<AuthResult<User>> {
  try {
    const response = await api.post<LoginResponse>(
      API_ENDPOINTS.register,
      data,
      { skipAuth: true }
    )

    // Set tokens in httpOnly cookies
    await setAuthTokens(response.tokens)

    // Revalidate auth-dependent cached data
    revalidateTag("auth", "default")

    return { success: true, data: response.user }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Registration failed",
    }
  }
}

// Note: Token utilities (isAuthenticated, getCurrentUser, etc.) are exported
// directly from lib/api/index.ts since they are Server Actions and can't be
// re-exported from this "use server" file (only async functions can be exported)
