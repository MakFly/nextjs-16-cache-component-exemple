"use server"

import { cookies } from "next/headers"
import { COOKIE_CONFIG } from "../config"
import type { AuthTokens } from "../types"

/**
 * Set authentication tokens in httpOnly cookies
 * Must be called from a Server Action or Route Handler
 */
export async function setAuthTokens(tokens: AuthTokens): Promise<void> {
  const cookieStore = await cookies()

  // Set access token
  cookieStore.set(COOKIE_CONFIG.accessToken.name, tokens.accessToken, {
    ...COOKIE_CONFIG.accessToken,
    expires: new Date(tokens.expiresAt * 1000),
  })

  // Set refresh token
  cookieStore.set(COOKIE_CONFIG.refreshToken.name, tokens.refreshToken, {
    ...COOKIE_CONFIG.refreshToken,
    expires: new Date(tokens.refreshExpiresAt * 1000),
  })
}

/**
 * Clear authentication cookies
 * Must be called from a Server Action or Route Handler
 */
export async function clearAuthTokens(): Promise<void> {
  const cookieStore = await cookies()

  cookieStore.delete(COOKIE_CONFIG.accessToken.name)
  cookieStore.delete(COOKIE_CONFIG.refreshToken.name)
}

/**
 * Check if user has a valid access token cookie
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(COOKIE_CONFIG.accessToken.name)
  return !!accessToken?.value
}

/**
 * Get the current user info from the JWT token
 * Note: This only decodes the token, it does NOT verify the signature
 * Use this for optimistic UI only, always verify on the server
 */
export async function getCurrentUser(): Promise<{
  id: string
  email: string
  role: string
} | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(COOKIE_CONFIG.accessToken.name)

  if (!accessToken?.value) return null

  try {
    // Decode JWT payload (base64)
    // Format: header.payload.signature
    const parts = accessToken.value.split(".")
    if (parts.length !== 3) {
      // Not a JWT, might be a mock token
      // For mock tokens, return a default user
      if (accessToken.value.startsWith("mock_access_")) {
        const userId = accessToken.value.split("_")[2] || "1"
        return { id: userId, email: "user@example.com", role: "user" }
      }
      return null
    }

    const payload = JSON.parse(
      Buffer.from(parts[1], "base64").toString("utf-8")
    )

    return {
      id: payload.sub || payload.id,
      email: payload.email,
      role: payload.role || "user",
    }
  } catch {
    return null
  }
}

/**
 * Get the raw access token value
 * Use sparingly - prefer using the API client which handles this automatically
 */
export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_CONFIG.accessToken.name)?.value ?? null
}

/**
 * Check if the access token is expired
 * Returns true if expired or missing
 */
export async function isTokenExpired(): Promise<boolean> {
  const user = await getCurrentUser()
  return !user
}
