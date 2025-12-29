# Next.js Easy Loading Layout & Features Demo

A comprehensive Next.js 16 application demonstrating modern caching patterns, server actions, and advanced state management techniques. This project serves as a reference implementation for "Easy Loading Layouts" and other Next.js 16 features.

## 🚀 Features

- **Next.js 16 Core Features**
  - **Cached Components**: implementation of `"use cache"` with `cacheLife` and `cacheTag`.
  - **Server Actions**: Mutations and cache invalidation patterns.
  - **Parallel Routes**: Advanced routing with `@modal` intercepting routes.
  - **Streaming & Suspense**: Optimized loading states with Skeletons.

- **State Management & Data Fetching**
  - **TanStack Query**: Integrated with SSR, hydration boundaries, and optimistic updates.
  - **Nuqs**: Type-safe URL query state management.
  - **Universal API Client**: Custom API layer that works in both Server and Client components with auto-refresh and auth handling.

- **UI/UX**
  - **Shadcn/UI**: Beautiful, accessible components based on Radix UI.
  - **Tailwind CSS v4**: The latest utility-first CSS framework.
  - **Lucide Icons**: Consistent and crisp iconography.
  - **Toast Notifications**: Integrated with server actions for user feedback.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **URL State**: [Nuqs](https://nuqs.47ng.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd next-appnext-easy-loading-layout
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
├── app/                  # App Router pages and layouts
│   ├── (auth)/           # Authentication routes (login/register)
│   ├── dashboard/        # Dashboard layout example
│   ├── gallery/          # Parallel routes example
│   ├── tanstack-query/   # Data fetching examples
│   └── ...
├── components/           # Reusable UI components
│   ├── ui/               # Shadcn UI primitives
│   ├── auth/             # Auth related components
│   └── ...
├── lib/                  # Utilities and libraries
│   ├── api/              # Universal API client & Mock system
│   ├── hooks/            # Custom React hooks
│   └── ...
└── public/               # Static assets
```

## 🧩 Key Patterns & Architecture

### Cached Components
The project uses the new Next.js 16 cache directives:
```tsx
async function MyComponent() {
  "use cache"
  cacheLife("hours")
  cacheTag("my-tag")
  const data = await fetchData()
  return <div>{data}</div>
}
```

### Universal API Client
Located in `lib/api/`, this client handles requests for both server and client environments. It includes:
- Automatic token management (httpOnly cookies)
- Auto-refresh on 401 errors
- Mock API system for development

To enable the mock system locally, create a `.env.local`:
```env
NEXT_PUBLIC_MOCK_API=true
```

**Mock Credentials:**
- Email: `user@example.com`
- Password: `password`

### TanStack Query Integration
We use a shared `QueryClient` configuration to ensure consistency between server and client, preventing duplicate refetches during hydration.

```tsx
// Example usage
const { data } = useApiQuery(['posts'], { endpoint: '/posts' })
```

## 📜 Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run start`: Start the production server.
- `npm run lint`: Run ESLint to check for code quality.

## 📚 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.