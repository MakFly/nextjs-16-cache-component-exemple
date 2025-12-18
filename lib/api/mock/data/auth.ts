import type { User, AuthTokens, LoginResponse } from "../../types"

// ============================================
// Mock Users
// ============================================

export const mockUsers: User[] = [
  {
    id: "1",
    email: "user@example.com",
    name: "Demo User",
    role: "user",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    createdAt: "2024-01-01T00:00:00Z",
  },
]

// ============================================
// Token Generation
// ============================================

function generateTokens(userId: string): AuthTokens {
  const now = Math.floor(Date.now() / 1000)
  return {
    accessToken: `mock_access_${userId}_${Date.now()}`,
    refreshToken: `mock_refresh_${userId}_${Date.now()}`,
    expiresAt: now + 15 * 60, // 15 minutes
    refreshExpiresAt: now + 7 * 24 * 60 * 60, // 7 days
  }
}

// ============================================
// Mock Auth Functions
// ============================================

export const mockAuth = {
  /**
   * Mock login - validates email/password and returns user + tokens
   * Default password for all users: "password"
   */
  login: (email: string, password: string): LoginResponse | null => {
    const user = mockUsers.find((u) => u.email === email)

    if (!user || password !== "password") {
      return null
    }

    return {
      user,
      tokens: generateTokens(user.id),
    }
  },

  /**
   * Mock token refresh - returns new tokens
   */
  refresh: (userId: string = "1"): { tokens: AuthTokens } => {
    return {
      tokens: generateTokens(userId),
    }
  },

  /**
   * Get current user by ID
   */
  getUser: (userId: string): User | null => {
    return mockUsers.find((u) => u.id === userId) ?? null
  },

  /**
   * Get user by email
   */
  getUserByEmail: (email: string): User | null => {
    return mockUsers.find((u) => u.email === email) ?? null
  },
}
