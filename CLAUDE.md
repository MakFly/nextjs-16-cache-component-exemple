# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev      # Start development server at localhost:3000
bun build    # Production build
bun start    # Start production server
bun lint     # Run ESLint
```

## Architecture

This is a Next.js 16 demo app showcasing **cache components** (`cacheComponents: true` in next.config.ts). It demonstrates multiple Next.js 16 features through various example pages.

### Key Patterns

**Cached Components** - Use `"use cache"` directive with `cacheLife()` and `cacheTag()`:
```tsx
async function MyComponent() {
  "use cache"
  cacheLife("hours")
  cacheTag("my-tag")
  const data = await fetchData()
  return <div>{data}</div>
}
```

**Dynamic Components** - Use `connection()` to opt out of caching:
```tsx
async function DynamicComponent() {
  await connection() // defer to request time
  const data = await fetchData()
  return <div>{data}</div>
}
```

**Cache Invalidation** - Server Actions with `revalidateTag(tag, profile)`:
```tsx
"use server"
import { revalidateTag } from "next/cache"
export async function invalidate() {
  revalidateTag("my-tag", "default")
}
```

**Skeleton Pattern** - Each async component exports a corresponding skeleton for Suspense fallbacks.

### Demo Pages

| Route | Features |
|-------|----------|
| `/posts` | Cached + dynamic components, timestamps, revalidateTag |
| `/users` | Same pattern with user data |
| `/posts/[id]` | generateStaticParams, cached post detail |
| `/cache-demo` | cacheLife comparison (seconds/minutes/hours/days/weeks/max) |
| `/search` | **nuqs** for type-safe URL state, dynamic rendering |
| `/actions-demo` | useOptimistic, Server Actions, toast notifications |
| `/dashboard` | Nested layout with cached sidebar |
| `/gallery` | Parallel routes with @modal intercepting route |
| `/tanstack-query` | **TanStack Query** SSR, mutations, infinite scroll |

### Structure

- `app/` - Routes with page.tsx, loading.tsx, layout.tsx
- `components/` - Reusable components
  - `components/ui/` - shadcn/ui (radix-vega style)
  - `components/posts/`, `components/users/` - Domain components with skeletons
  - `components/toast/` - Sonner toast notifications
  - `components/messages/` - Message form with useOptimistic
  - `components/query-examples/` - TanStack Query examples
  - `components/search/` - Search with nuqs (debounced + manual tabs)
- `lib/api/` - **API Client Layer** (see API Architecture below)
- `lib/api.ts` - Legacy cached data functions
- `lib/actions.ts` - Server Actions for mutations and revalidation
- `lib/queries.ts` - TanStack Query keys and fetch functions
- `lib/query-client.ts` - Shared QueryClient factory (prevents duplicate refetches)
- `lib/utils.ts` - `cn()` utility for Tailwind class merging
- `hooks/` - Custom React hooks (useDebounce)

### Key Libraries

| Library | Usage |
|---------|-------|
| **nuqs** | Type-safe URL query state (`useQueryState`, `createSearchParamsCache`) |
| **@tanstack/react-query** | Data fetching, caching, mutations, SSR |
| **shadcn/ui** | UI components (radix-vega style) |
| **Tailwind CSS v4** | Styling |
| **Lucide** | Icons |

### TanStack Query Patterns

**IMPORTANT: Preventing Duplicate Refetches**

Always use `getQueryClient()` from `lib/query-client.ts` instead of `new QueryClient()`. This ensures consistent `staleTime` configuration between server and client, preventing immediate refetches after SSR hydration.

```tsx
// ❌ BAD - causes duplicate refetch (staleTime defaults to 0)
const queryClient = new QueryClient()

// ✅ GOOD - uses shared config with staleTime: 60s
import { getQueryClient } from "@/lib/query-client"
const queryClient = getQueryClient()
```

```tsx
// SSR with initialData (simple)
const posts = await fetchPosts() // server
<ClientComponent initialData={posts} />

// useQuery with initialData
const { data } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  initialData: props.initialData,
  staleTime: 60 * 1000, // Prevent immediate refetch
})

// SSR with HydrationBoundary (streaming)
const queryClient = getQueryClient() // ← Use shared client!
await queryClient.prefetchQuery({ queryKey, queryFn })
<HydrationBoundary state={dehydrate(queryClient)}>
  <Suspense><Component /></Suspense>
</HydrationBoundary>

// Optimistic mutations
const mutation = useMutation({
  mutationFn: createPost,
  onMutate: async (newPost) => {
    await queryClient.cancelQueries({ queryKey })
    const previous = queryClient.getQueryData(queryKey)
    queryClient.setQueryData(queryKey, old => [newPost, ...old])
    return { previous }
  },
  onError: (err, vars, ctx) => queryClient.setQueryData(queryKey, ctx.previous),
  onSettled: () => queryClient.invalidateQueries({ queryKey }),
})
```

### nuqs Usage

```tsx
// Client-side
const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''))

// Server-side parsing
const cache = createSearchParamsCache({ q: parseAsString.withDefault('') })
const { q } = await cache.parse(searchParams)
```

### Notes

- `revalidateTag()` in Next.js 16 requires two arguments: `(tag, profile)`
- Timestamps in cached components must be captured after async data fetch inside `"use cache"` boundary
- Parallel routes use `@modal` folder convention with `(..)` for route interception
- Path alias: `@/*` maps to project root

---

## API Architecture 2025

### Overview

The `lib/api/` directory contains a **universal API client** that works in both Server Components and Client Components, with built-in authentication, auto token refresh, and mock system.

```
lib/api/
├── index.ts          # Barrel exports
├── client.ts         # ApiClient class (universal)
├── types.ts          # TypeScript types
├── config.ts         # Configuration & endpoints
├── server.ts         # Server Component utilities
├── auth/
│   ├── index.ts      # Server Actions: login, logout, register
│   └── tokens.ts     # Cookie management (httpOnly)
├── mock/
│   ├── index.ts      # Mock system entry
│   ├── handlers.ts   # Mock request handlers
│   └── data/         # Mock data (users, posts, etc.)
└── hooks/
    ├── use-api.ts    # useApiQuery, useApiMutation
    └── use-auth.ts   # useAuth hook
```

### Quick Start

**Client Component (with hooks):**
```tsx
"use client"
import { useAuth, useApiQuery } from "@/lib/api"

function Profile() {
  const { user, logout, isLoggingOut } = useAuth()
  const { data: posts } = useApiQuery(['posts'], { endpoint: '/posts' })

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <Button onClick={logout}>Logout</Button>
    </div>
  )
}
```

**Server Component (with cache):**
```tsx
import { cachedApi, getCurrentUser } from "@/lib/api"
import { redirect } from "next/navigation"

async function Dashboard() {
  "use cache"
  cacheLife("minutes")
  cacheTag("dashboard")

  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const posts = await cachedApi.getPosts()
  return <PostList posts={posts} />
}
```

**Direct API calls:**
```tsx
import { api } from "@/lib/api"

// GET
const posts = await api.get<Post[]>('/posts')

// POST
const newPost = await api.post<Post>('/posts', { title: 'Hello', body: '...' })

// With options
const data = await api.get('/protected', { skipAuth: true, timeout: 5000 })
```

### Authentication

**Tokens stored in httpOnly cookies** (secure, SSR compatible)

```tsx
// Login (Server Action)
import { login } from "@/lib/api"

const result = await login({ email: 'user@example.com', password: 'password' })
if (result.success) {
  // Cookies set automatically, redirect to dashboard
}

// Logout
import { logout } from "@/lib/api"
await logout() // Clears cookies

// Check auth status (Server Component)
import { isAuthenticated, getCurrentUser } from "@/lib/api"

const isLoggedIn = await isAuthenticated()
const user = await getCurrentUser() // { id, email, role } or null
```

**useAuth hook (Client Component):**
```tsx
const {
  user,              // Current user or null
  isLoading,         // Loading state
  isAuthenticated,   // Boolean
  login,             // (credentials) => void
  logout,            // () => void
  isLoggingIn,       // Boolean
  isLoggingOut,      // Boolean
} = useAuth()
```

### Auto Token Refresh

Enabled by default (`autoRefresh: true`). On 401 response:
1. Automatically calls `/auth/refresh`
2. Updates cookies with new tokens
3. Retries the original request
4. If refresh fails, calls `onUnauthorized` callback

```tsx
// Disable for specific client
const client = createApiClient({ autoRefresh: false })
```

### Mock System

Enable mock mode for development without a real backend:

```bash
# .env.local
NEXT_PUBLIC_MOCK_API=true
```

**Mock credentials:**
- Email: `user@example.com` or `admin@example.com`
- Password: `password`

Mock handlers are in `lib/api/mock/handlers.ts`. Add custom handlers:
```tsx
{
  match: (endpoint, options) => endpoint === '/custom' && options.method === 'GET',
  delay: 300,
  response: async () => ({ data: 'mock data' }),
}
```

### TanStack Query Integration

**useApiQuery** - Wrapper for GET requests:
```tsx
const { data, isLoading, error } = useApiQuery<Post[]>(
  ['posts'],
  { endpoint: '/posts' }
)
```

**useApiMutation** - Wrapper for mutations:
```tsx
const createPost = useApiMutation<Post, CreatePostData>({
  endpoint: '/posts',
  method: 'POST',
  invalidateKeys: [['posts']], // Auto-invalidate on success
})

createPost.mutate({ title: 'New Post', body: '...' })
```

**useOptimisticMutation** - Built-in optimistic updates:
```tsx
const deletePost = useOptimisticMutation<Post[], number>({
  endpoint: (id) => `/posts/${id}`,
  method: 'DELETE',
  optimisticQueryKey: ['posts'],
  getOptimisticData: (deletedId, posts) =>
    posts?.filter(p => p.id !== deletedId) ?? [],
})
```

### Configuration

```tsx
// lib/api/config.ts
export const defaultConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://jsonplaceholder.typicode.com',
  timeout: 30000,
  autoRefresh: true,
  mockEnabled: process.env.NEXT_PUBLIC_MOCK_API === 'true',
}

// Custom client with different config
import { createApiClient } from "@/lib/api"

const customApi = createApiClient({
  baseUrl: 'https://other-api.com',
  timeout: 10000,
  autoRefresh: false,
})
```

### API Endpoints

All endpoints are defined in `lib/api/config.ts`:
```tsx
import { API_ENDPOINTS } from "@/lib/api"

API_ENDPOINTS.posts           // '/posts'
API_ENDPOINTS.post(1)         // '/posts/1'
API_ENDPOINTS.postComments(1) // '/posts/1/comments'
API_ENDPOINTS.users           // '/users'
API_ENDPOINTS.login           // '/auth/login'
// etc.
```
