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

This is a Next.js 16 demo app showcasing the **cache components** feature (`cacheComponents: true` in next.config.ts). It demonstrates mixing cached and dynamic content with streaming.

### Key Patterns

**Cached Components** - Use `"use cache"` directive with `cacheLife()` and `cacheTag()` from `next/cache`:
```tsx
export async function MyComponent() {
  "use cache"
  cacheLife("hours")
  cacheTag("my-tag")
  // ... fetch and render
}
```

**Skeleton Pattern** - Each async component exports a corresponding skeleton for Suspense fallbacks:
```tsx
// post-stats.tsx exports both:
export async function PostStats() { ... }
export function PostStatsSkeleton() { ... }
```

**Loading States** - Route-level `loading.tsx` files compose skeleton components to show instant loading UI.

### Structure

- `app/posts/`, `app/users/` - Demo routes showing cached vs dynamic components
- `components/posts/`, `components/users/` - Domain components with skeleton variants
- `components/ui/` - shadcn/ui components (radix-vega style)
- `lib/api.ts` - Cached data fetching functions using JSONPlaceholder API
- `lib/utils.ts` - `cn()` utility for Tailwind class merging

### UI Stack

- shadcn/ui with radix-vega style
- Tailwind CSS v4
- Lucide icons
- Path alias: `@/*` maps to project root
