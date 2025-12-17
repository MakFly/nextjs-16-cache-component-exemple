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
  - `components/toast/` - Toast notification system
  - `components/messages/` - Message form with useOptimistic
  - `components/query-examples/` - TanStack Query examples
  - `components/search/` - Search with nuqs
- `lib/api.ts` - Cached data functions using JSONPlaceholder API
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
