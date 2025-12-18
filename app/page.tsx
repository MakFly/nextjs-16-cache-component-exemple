import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DevRefreshButton, HardReloadButton } from "@/components/dev-tools"
import { AuthHeader } from "@/components/auth/auth-header"
import {
  FileText,
  Users,
  Timer,
  Search,
  MessageSquare,
  LayoutDashboard,
  GalleryHorizontalEnd,
  Database,
} from "lucide-react"

const demos = [
  {
    title: "Posts",
    description: "Cached & dynamic components with timestamps",
    href: "/posts",
    icon: FileText,
    badges: ["use cache", "cacheTag", "revalidateTag"],
    color: "text-green-600",
  },
  {
    title: "Users",
    description: "Same pattern with user data",
    href: "/users",
    icon: Users,
    badges: ["use cache", "connection()"],
    color: "text-blue-600",
  },
  {
    title: "cacheLife Demo",
    description: "Compare different cache durations side by side",
    href: "/cache-demo",
    icon: Timer,
    badges: ["seconds", "minutes", "hours", "days", "weeks", "max"],
    color: "text-orange-600",
  },
  {
    title: "Search (nuqs)",
    description: "Type-safe URL state with nuqs",
    href: "/search",
    icon: Search,
    badges: ["nuqs", "URL state", "dynamic"],
    color: "text-purple-600",
  },
  {
    title: "TanStack Query",
    description: "SSR, mutations, infinite scroll examples",
    href: "/tanstack-query",
    icon: Database,
    badges: ["SSR", "Mutations", "Infinite", "Optimistic"],
    color: "text-red-600",
  },
  {
    title: "Server Actions",
    description: "Forms with useOptimistic & toast notifications",
    href: "/actions-demo",
    icon: MessageSquare,
    badges: ["useOptimistic", "Server Actions", "Toast"],
    color: "text-pink-600",
  },
  {
    title: "Dashboard",
    description: "Nested layout with cached sidebar",
    href: "/dashboard",
    icon: LayoutDashboard,
    badges: ["Nested Layout", "Cached Sidebar"],
    color: "text-cyan-600",
  },
  {
    title: "Gallery",
    description: "Parallel routes with modal overlay",
    href: "/gallery",
    icon: GalleryHorizontalEnd,
    badges: ["@modal", "Intercepting Routes"],
    color: "text-amber-600",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/" className="font-semibold">
            Next.js 16 Demo
          </Link>
          <AuthHeader />
        </div>
      </nav>

      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <header className="text-center mb-12">
          <Badge className="mb-4">Next.js 16 - Cache Components</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Cache Components Demo
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Explore <code className="bg-muted px-2 py-1 rounded">use cache</code>,
            Server Actions, useOptimistic, parallel routes, and more
          </p>
          <div className="flex justify-center gap-3">
            <DevRefreshButton />
            <HardReloadButton />
          </div>
        </header>

        {/* Quick Explanation */}
        <div className="max-w-4xl mx-auto mb-12 p-6 bg-muted/50 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Cache Components Patterns</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex gap-2 items-start">
              <Badge variant="outline" className="text-green-600 border-green-600 shrink-0">
                use cache
              </Badge>
              <p className="text-xs text-muted-foreground">
                Cached static shell, instant on repeat visits
              </p>
            </div>
            <div className="flex gap-2 items-start">
              <Badge variant="outline" className="text-orange-600 border-orange-600 shrink-0">
                dynamic
              </Badge>
              <p className="text-xs text-muted-foreground">
                Streams fresh content at request time
              </p>
            </div>
            <div className="flex gap-2 items-start">
              <Badge variant="outline" className="text-purple-600 border-purple-600 shrink-0">
                cacheLife
              </Badge>
              <p className="text-xs text-muted-foreground">
                Control TTL: seconds, minutes, hours, days
              </p>
            </div>
            <div className="flex gap-2 items-start">
              <Badge variant="outline" className="text-blue-600 border-blue-600 shrink-0">
                cacheTag
              </Badge>
              <p className="text-xs text-muted-foreground">
                Tag for on-demand revalidation
              </p>
            </div>
          </div>
        </div>

        {/* Demos Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto mb-16">
          {demos.map((demo) => (
            <Link key={demo.href} href={demo.href} className="group">
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-muted ${demo.color}`}>
                      <demo.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {demo.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="mt-2">
                    {demo.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {demo.badges.map((badge) => (
                      <Badge key={badge} variant="secondary" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Code Pattern */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-center">Basic Pattern</h2>
          <div className="bg-zinc-950 text-zinc-100 p-6 rounded-xl text-sm font-mono overflow-x-auto">
            <pre>{`// Cached component - instant on repeat visits
async function CachedData() {
  "use cache"
  cacheLife("hours")
  cacheTag("my-tag")

  const data = await fetch("...")
  return <div>{data}</div>
}

// Dynamic component - fresh on every request
async function DynamicData() {
  await connection() // opt out of cache
  const data = await fetch("...")
  return <div>{data}</div>
}

// Revalidate on demand (Server Action)
async function updateData() {
  "use server"
  await saveToDb()
  revalidateTag("my-tag", "default")
}`}</pre>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-sm text-muted-foreground">
          <p>
            Built with Next.js 16 &middot; React 19 &middot; Tailwind CSS 4 &middot; shadcn/ui
          </p>
        </footer>
      </div>
    </div>
  )
}
