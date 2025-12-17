import { QueryClient, isServer } from "@tanstack/react-query"

// Default options to prevent duplicate refetches with SSR
const DEFAULT_STALE_TIME = 60 * 1000 // 1 minute

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Prevents immediate refetch after SSR hydration
        staleTime: DEFAULT_STALE_TIME,
        // Keep unused data in cache for 5 minutes (default)
        gcTime: 5 * 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

/**
 * Get or create a QueryClient.
 * - Server: Creates a new QueryClient for each request (isolation)
 * - Browser: Reuses a singleton QueryClient (persistence across navigations)
 */
export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: reuse the same query client
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient()
    }
    return browserQueryClient
  }
}
