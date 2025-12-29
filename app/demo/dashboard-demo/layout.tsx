import { Suspense, type ReactNode } from "react"
import Link from "next/link"
import { cacheLife } from "next/cache"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { delay } from "@/lib/api"
import { Home, FileText, Users, Settings, BarChart3, Bell } from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

// CACHED SIDEBAR - Part of static shell
async function Sidebar() {
  "use cache"
  cacheLife("hours")

  await delay(300)

  return (
    <aside className="w-64 border-r border-border bg-muted/30 p-4 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold">Dashboard</h2>
        <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
          cached
        </Badge>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2">Sidebar generated at:</p>
        <code className="text-xs font-mono">{new Date().toLocaleTimeString()}</code>
      </div>
    </aside>
  )
}

function SidebarSkeleton() {
  return (
    <aside className="w-64 border-r border-border bg-muted/30 p-4 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
      <nav className="space-y-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </nav>
    </aside>
  )
}

// CACHED STATS WIDGET
async function QuickStats() {
  "use cache"
  cacheLife("minutes")

  await delay(500)

  const stats = [
    { label: "Active Users", value: "2,847" },
    { label: "Revenue", value: "$48.2K" },
    { label: "Orders", value: "1,234" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      {stats.map((stat) => (
        <Card key={stat.label} size="sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function QuickStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} size="sm">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-20" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </Suspense>

      <main className="flex-1 p-6">
        <div className="mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>

        <Suspense fallback={<QuickStatsSkeleton />}>
          <QuickStats />
        </Suspense>

        {children}
      </main>
    </div>
  )
}
