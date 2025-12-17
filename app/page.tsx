import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-16 px-4">
        {/* Hero Section */}
        <header className="text-center mb-16">
          <Badge className="mb-4">Next.js 16 - Cache Components</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            SSR Loading Demo
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Demonstration of <code className="bg-muted px-2 py-1 rounded">use cache</code> directive
            with <code className="bg-muted px-2 py-1 rounded">cacheLife</code> and streaming Suspense
          </p>
        </header>

        {/* Explanation */}
        <div className="max-w-3xl mx-auto mb-12 p-6 bg-muted/50 rounded-xl">
          <h2 className="text-lg font-semibold mb-3">How Cache Components work</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex gap-3">
              <Badge variant="outline" className="text-green-600 border-green-600 shrink-0 h-fit">
                use cache
              </Badge>
              <p className="text-sm text-muted-foreground">
                Content is cached and becomes part of the <strong>static shell</strong>.
                Instant on subsequent requests.
              </p>
            </div>
            <div className="flex gap-3">
              <Badge variant="outline" className="text-orange-600 border-orange-600 shrink-0 h-fit">
                dynamic
              </Badge>
              <p className="text-sm text-muted-foreground">
                Content <strong>streams at request time</strong>.
                Shows skeleton then streams the actual content.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Posts</CardTitle>
              <CardDescription>
                4 components with mixed caching strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between">
                  <span>PostStats</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">cached</Badge>
                </div>
                <div className="flex justify-between">
                  <span>PostList</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">cached</Badge>
                </div>
                <div className="flex justify-between">
                  <span>PostComments</span>
                  <Badge variant="outline" className="text-orange-600 border-orange-600">dynamic</Badge>
                </div>
                <div className="flex justify-between">
                  <span>PostAuthors</span>
                  <Badge variant="outline" className="text-orange-600 border-orange-600">dynamic</Badge>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/posts">View Posts</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Users</CardTitle>
              <CardDescription>
                4 components with mixed caching strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between">
                  <span>UserStats</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">cached</Badge>
                </div>
                <div className="flex justify-between">
                  <span>UserList</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">cached</Badge>
                </div>
                <div className="flex justify-between">
                  <span>UserTodos</span>
                  <Badge variant="outline" className="text-orange-600 border-orange-600">dynamic</Badge>
                </div>
                <div className="flex justify-between">
                  <span>UserAlbums</span>
                  <Badge variant="outline" className="text-orange-600 border-orange-600">dynamic</Badge>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/users">View Users</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Code Example */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-center">Code Pattern</h2>
          <div className="bg-zinc-950 text-zinc-100 p-6 rounded-xl text-sm font-mono overflow-x-auto">
            <pre>{`// Cached component - part of static shell
async function CachedData() {
  "use cache"
  cacheLife("hours")
  cacheTag("my-data")

  const data = await fetch("...")
  return <div>{data}</div>
}

// Dynamic component - streams at request time
async function DynamicData() {
  await connection() // defer to request time
  const data = await fetch("...")
  return <div>{data}</div>
}

// Page with both patterns
export default function Page() {
  return (
    <>
      <Suspense fallback={<Skeleton />}>
        <CachedData />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <DynamicData />
      </Suspense>
    </>
  )
}`}</pre>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-semibold mb-4">Built with</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {["Next.js 16", "Cache Components", "use cache", "cacheLife", "Suspense", "Streaming SSR"].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
