import type { ApiResponse } from "../types"
import { mockHandlers } from "./handlers"

/**
 * Get a mock response for the given endpoint and options
 * Returns null if no handler matches (fallback to real API)
 */
export async function getMockResponse<T>(
  endpoint: string,
  options: RequestInit
): Promise<ApiResponse<T> | null> {
  for (const handler of mockHandlers) {
    if (handler.match(endpoint, options)) {
      // Simulate network delay
      if (handler.delay) {
        await new Promise((r) => setTimeout(r, handler.delay))
      }

      try {
        const data = (await handler.response(endpoint, options)) as T
        return {
          data,
          status: 200,
          headers: new Headers({ "Content-Type": "application/json" }),
        }
      } catch (error) {
        // Re-throw ApiException as-is
        throw error
      }
    }
  }

  // No handler matched, return null to fallback to real API
  return null
}

// Re-export mock data for direct access if needed
export { mockAuth, mockUsers } from "./data/auth"
export {
  mockPosts,
  mockComments,
  mockJsonUsers,
  mockTodos,
  mockAlbums,
} from "./data/posts"
