import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DevRefreshButton, HardReloadButton } from "@/components/dev-tools"
import { AuthHeader } from "@/components/auth/auth-header"
import { FeatureCard } from "@/components/landing/feature-card"
import { CodeBlock } from "@/components/landing/code-block"
import { Footer } from "@/components/landing/footer"
import {
  FileText,
  Users,
  Timer,
  Search,
  MessageSquare,
  LayoutDashboard,
  GalleryHorizontalEnd,
  Database,
  Zap,
  Code,
  Settings,
  ArrowDown,
  BookOpen,
  AlertTriangle,
  RefreshCw,
  Shield,
  Image as ImageIcon,
  Layers,
  Eye,
  Sparkles,
  Globe,
  FileEdit,
  Package,
  ShieldCheck,
  Image,
  Code2,
  Upload,
} from "lucide-react"

const demoCategories = [
  {
    title: "Cache Components",
    description: "Next.js 16 Cache Components features",
    demos: [
      {
        title: "Posts",
        description: "Cached & dynamic components with timestamps",
        href: "/demo/posts-demo",
        icon: FileText,
        badges: ["use cache", "cacheTag", "revalidateTag"],
        color: "text-green-600",
        isNew: false,
      },
      {
        title: "Users",
        description: "Same pattern with user data",
        href: "/demo/users-demo",
        icon: Users,
        badges: ["use cache", "connection()"],
        color: "text-blue-600",
        isNew: false,
      },
      {
        title: "cacheLife Demo",
        description: "Compare different cache durations side by side",
        href: "/demo/cache-demo",
        icon: Timer,
        badges: ["seconds", "minutes", "hours", "days", "weeks", "max"],
        color: "text-orange-600",
        isNew: false,
      },
      {
        title: "updateTag vs revalidateTag",
        description: "Read-your-writes semantics comparison",
        href: "/demo/update-tag-demo",
        icon: RefreshCw,
        badges: ["updateTag", "revalidateTag", "refresh"],
        color: "text-green-600",
        isNew: true,
      },
    ],
  },
  {
    title: "Routing & Navigation",
    description: "Advanced routing patterns",
    demos: [
      {
        title: "Gallery",
        description: "Parallel routes with modal overlay",
        href: "/demo/gallery-demo",
        icon: GalleryHorizontalEnd,
        badges: ["@modal", "Intercepting Routes"],
        color: "text-amber-600",
        isNew: false,
      },
      {
        title: "Dashboard",
        description: "Nested layout with cached sidebar",
        href: "/demo/dashboard-demo",
        icon: LayoutDashboard,
        badges: ["Nested Layout", "Cached Sidebar"],
        color: "text-cyan-600",
        isNew: false,
      },
      {
        title: "Search (nuqs)",
        description: "Type-safe URL state with nuqs",
        href: "/demo/search-demo",
        icon: Search,
        badges: ["nuqs", "URL state", "dynamic"],
        color: "text-purple-600",
        isNew: false,
      },
      {
        title: "Proxy (ex-Middleware)",
        description: "Request interception and headers manipulation",
        href: "/demo/proxy-demo",
        icon: Shield,
        badges: ["proxy.ts", "Headers", "Auth Guard"],
        color: "text-purple-600",
        isNew: true,
      },
    ],
  },
  {
    title: "Data Fetching",
    description: "Server Actions, mutations, and data patterns",
    demos: [
      {
        title: "Server Actions",
        description: "Forms with useOptimistic & toast notifications",
        href: "/demo/actions-demo",
        icon: MessageSquare,
        badges: ["useOptimistic", "Server Actions", "Toast"],
        color: "text-pink-600",
        isNew: false,
      },
      {
        title: "TanStack Query",
        description: "SSR, mutations, infinite scroll examples",
        href: "/demo/tanstack-query-demo",
        icon: Database,
        badges: ["SSR", "Mutations", "Infinite", "Optimistic"],
        color: "text-red-600",
        isNew: false,
      },
      {
        title: "Route Handlers",
        description: "API routes with all HTTP methods",
        href: "/demo/route-handlers-demo",
        icon: Code,
        badges: ["GET", "POST", "PUT", "DELETE", "Streaming"],
        color: "text-blue-600",
        isNew: true,
      },
    ],
  },
  {
    title: "Error Handling & Edge Cases",
    description: "Error boundaries and edge case handling",
    demos: [
      {
        title: "Error Handling",
        description: "Error boundaries and error recovery",
        href: "/demo/error-demo",
        icon: AlertTriangle,
        badges: ["error.tsx", "global-error.tsx", "not-found.tsx"],
        color: "text-red-600",
        isNew: true,
      },
    ],
  },
  {
    title: "Performance & Optimization",
    description: "ISR, streaming, and optimization patterns",
    demos: [
      {
        title: "ISR Patterns",
        description: "Time-based vs on-demand revalidation",
        href: "/demo/isr-demo",
        icon: Timer,
        badges: ["Time-based", "On-demand", "ISR"],
        color: "text-blue-600",
        isNew: true,
      },
      {
        title: "Advanced Streaming",
        description: "Nested Suspense boundaries and progressive hydration",
        href: "/demo/streaming-demo",
        icon: Layers,
        badges: ["Suspense", "Streaming", "Progressive"],
        color: "text-green-600",
        isNew: true,
      },
      {
        title: "Image Optimization",
        description: "Next.js 16 image features and patterns",
        href: "/demo/image-demo",
        icon: ImageIcon,
        badges: ["next/image", "Optimization", "Next.js 16"],
        color: "text-purple-600",
        isNew: true,
      },
    ],
  },
  {
    title: "Forms & State",
    description: "Form validation, state management, and file uploads",
    demos: [
      {
        title: "React Hook Form + Zod",
        description: "Form validation avec schéma Zod partagé",
        href: "/demo/rhf-demo",
        icon: FileEdit,
        badges: ["RHF", "Zod", "shadcn"],
        color: "text-blue-600",
        isNew: true,
      },
      {
        title: "Zustand",
        description: "State management léger avec persist",
        href: "/demo/zustand-demo",
        icon: Package,
        badges: ["Zustand", "Persist", "DevTools"],
        color: "text-green-600",
        isNew: true,
      },
      {
        title: "next-safe-action",
        description: "Server Actions type-safe avec Zod",
        href: "/demo/safe-action-demo",
        icon: ShieldCheck,
        badges: ["Type-safe", "Zod", "Middleware"],
        color: "text-purple-600",
        isNew: true,
      },
      {
        title: "use() Hook",
        description: "Promise unwrapping React 19",
        href: "/demo/use-hook-demo",
        icon: Code2,
        badges: ["use(promise)", "use(context)"],
        color: "text-green-600",
        isNew: true,
      },
      {
        title: "File Uploads",
        description: "Upload avec Server Actions et progress",
        href: "/demo/upload-demo",
        icon: Upload,
        badges: ["Server Actions", "Drag & Drop", "Progress"],
        color: "text-blue-600",
        isNew: true,
      },
    ],
  },
  {
    title: "React 19.2 Features",
    description: "New React features in Next.js 16",
    demos: [
      {
        title: "React 19 Features",
        description: "useEffectEvent, Activity",
        href: "/demo/react19-features-demo",
        icon: Sparkles,
        badges: ["useEffectEvent", "Activity"],
        color: "text-purple-600",
        isNew: true,
      },
    ],
  },
  {
    title: "SEO & Metadata",
    description: "Metadata API and SEO optimization",
    demos: [
      {
        title: "Metadata & SEO",
        description: "generateMetadata, OG images, sitemap",
        href: "/demo/metadata-demo",
        icon: Globe,
        badges: ["generateMetadata", "OG Images", "Sitemap"],
        color: "text-blue-600",
        isNew: true,
      },
      {
        title: "Draft Mode",
        description: "Preview unpublished content",
        href: "/demo/draft-demo",
        icon: Eye,
        badges: ["draftMode()", "Preview", "CMS"],
        color: "text-orange-600",
        isNew: true,
      },
    ],
  },
]

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Instant page loads with cached static shell",
    iconColor: "text-yellow-500",
  },
  {
    icon: Code,
    title: "Simple API",
    description: "Just add 'use cache' directive",
    iconColor: "text-blue-500",
  },
  {
    icon: Settings,
    title: "Full Control",
    description: "Cache life, tags, and revalidation",
    iconColor: "text-purple-500",
  },
]

const patterns = [
  {
    badge: "use cache",
    description: "Cached static shell, instant on repeat visits",
    color: "text-green-600 border-green-600",
  },
  {
    badge: "dynamic",
    description: "Streams fresh content at request time",
    color: "text-orange-600 border-orange-600",
  },
  {
    badge: "cacheLife",
    description: "Control TTL: seconds, minutes, hours, days",
    color: "text-purple-600 border-purple-600",
  },
  {
    badge: "cacheTag",
    description: "Tag for on-demand revalidation",
    color: "text-blue-600 border-blue-600",
  },
]

const codeExample = `// Cached component - instant on repeat visits
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
}`

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
          <Link href="/" className="font-semibold text-lg flex items-center gap-2">
            <Code className="h-5 w-5" />
            Next.js 16 Demo
          </Link>
          <AuthHeader />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 max-w-7xl py-20 md:py-24">
        <div className="text-center mb-16">
          <Badge className="mb-6 text-sm px-4 py-1">Next.js 16 - Cache Components</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Build Faster with Cache Components
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Explore the power of <code className="bg-muted px-2 py-1 rounded text-foreground">use cache</code>,
            Server Actions, useOptimistic, parallel routes, and more Next.js 16 features
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <a href="#demos">
                Explore Demos
                <ArrowDown className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer">
                <BookOpen className="mr-2 h-4 w-4" />
                View Docs
              </a>
            </Button>
          </div>
          <div className="flex justify-center gap-2 opacity-60">
            <DevRefreshButton />
            <HardReloadButton />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 max-w-7xl py-16 md:py-20">
        <div className="grid gap-6 md:grid-cols-3 mb-16">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      {/* Patterns Explanation */}
      <section className="container mx-auto px-4 max-w-7xl py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Cache Components Patterns</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          {patterns.map((pattern) => (
            <Card key={pattern.badge} className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
              <CardHeader>
                <Badge variant="outline" className={`${pattern.color} w-fit mb-3`}>
                  {pattern.badge}
                </Badge>
                <CardDescription className="text-sm leading-relaxed">
                  {pattern.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Demos by Category */}
      <section id="demos" className="container mx-auto px-4 max-w-7xl py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Interactive Demos</h2>
        <div className="space-y-16">
          {demoCategories.map((category) => (
            <div key={category.title}>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category.demos.map((demo) => (
                  <Link key={demo.href} href={demo.href} className="group">
                    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg bg-muted ${demo.color}`}>
                            <demo.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center gap-2">
                              {demo.title}
                              {demo.isNew && (
                                <Badge variant="default" className="text-xs">
                                  New
                                </Badge>
                              )}
                            </CardTitle>
                          </div>
                        </div>
                        <CardDescription className="mt-2">
                          {demo.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1.5">
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
            </div>
          ))}
        </div>
      </section>

      {/* Code Example */}
      <section className="container mx-auto px-4 max-w-4xl py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Basic Pattern</h2>
        <CodeBlock code={codeExample} />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

