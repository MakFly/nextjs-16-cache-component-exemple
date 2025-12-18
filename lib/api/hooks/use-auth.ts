"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { api, setClientToken, clearClientToken } from "../client"
import { API_ENDPOINTS } from "../config"
import {
  login as loginAction,
  logout as logoutAction,
  register as registerAction,
  type RegisterData,
} from "../auth"
import type { User, LoginCredentials, ApiException } from "../types"

// ============================================
// Query Keys
// ============================================

const AUTH_QUERY_KEY = ["auth", "user"] as const

// ============================================
// useAuth Hook
// ============================================

export interface UseAuthReturn {
  /** Current authenticated user (undefined if loading, null if not authenticated) */
  user: User | null | undefined
  /** Whether the auth state is being loaded */
  isLoading: boolean
  /** Whether user is authenticated */
  isAuthenticated: boolean
  /** Auth error if any */
  error: ApiException | null

  // Login
  login: (credentials: LoginCredentials) => void
  loginAsync: (credentials: LoginCredentials) => Promise<{ success: boolean; user?: User; error?: string }>
  isLoggingIn: boolean
  loginError: Error | null

  // Logout
  logout: () => void
  logoutAsync: () => Promise<void>
  isLoggingOut: boolean

  // Register
  register: (data: RegisterData) => void
  registerAsync: (data: RegisterData) => Promise<{ success: boolean; user?: User; error?: string }>
  isRegistering: boolean
  registerError: Error | null

  // Utilities
  refetch: () => void
}

/**
 * Authentication hook with login, logout, and user state management
 *
 * @example
 * function Profile() {
 *   const { user, isLoading, logout, isLoggingOut } = useAuth()
 *
 *   if (isLoading) return <Spinner />
 *   if (!user) return <LoginForm />
 *
 *   return (
 *     <div>
 *       <p>Welcome, {user.name}</p>
 *       <Button onClick={logout} disabled={isLoggingOut}>
 *         Logout
 *       </Button>
 *     </div>
 *   )
 * }
 */
export function useAuth(): UseAuthReturn {
  const router = useRouter()
  const queryClient = useQueryClient()

  // ==========================================
  // Current User Query
  // ==========================================
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery<User | null, ApiException>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      try {
        return await api.get<User>(API_ENDPOINTS.me)
      } catch {
        return null
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })

  // ==========================================
  // Login Mutation
  // ==========================================
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const result = await loginAction(credentials)
      if (!result.success) {
        throw new Error(result.error || "Login failed")
      }
      return result
    },
    onSuccess: (result) => {
      if (result.data) {
        // Update cache with user data
        queryClient.setQueryData(AUTH_QUERY_KEY, result.data)
        // Navigate to dashboard
        router.push("/dashboard")
      }
    },
  })

  // ==========================================
  // Logout Mutation
  // ==========================================
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await logoutAction()
      clearClientToken()
    },
    onSuccess: () => {
      // Clear user from cache
      queryClient.setQueryData(AUTH_QUERY_KEY, null)
      // Clear all cached data (might contain auth-dependent data)
      queryClient.clear()
      // Navigate to home
      router.push("/")
    },
  })

  // ==========================================
  // Register Mutation
  // ==========================================
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const result = await registerAction(data)
      if (!result.success) {
        throw new Error(result.error || "Registration failed")
      }
      return result
    },
    onSuccess: (result) => {
      if (result.data) {
        queryClient.setQueryData(AUTH_QUERY_KEY, result.data)
        router.push("/dashboard")
      }
    },
  })

  // ==========================================
  // Return Value
  // ==========================================
  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    error: error ?? null,

    // Login
    login: loginMutation.mutate,
    loginAsync: async (credentials) => {
      try {
        const result = await loginMutation.mutateAsync(credentials)
        return { success: true, user: result.data }
      } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : "Login failed" }
      }
    },
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    // Logout
    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,

    // Register
    register: registerMutation.mutate,
    registerAsync: async (data) => {
      try {
        const result = await registerMutation.mutateAsync(data)
        return { success: true, user: result.data }
      } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : "Registration failed" }
      }
    },
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    // Utilities
    refetch: () => refetch(),
  }
}
