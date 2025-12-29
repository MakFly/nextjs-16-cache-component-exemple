import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PromiseUnwrapDemo } from "@/components/use-hook/promise-unwrap"
import { ContextReadDemo } from "@/components/use-hook/context-read"
import { Code, Zap } from "lucide-react"

// Server Component qui crée une Promise
async function getUserData(userId: number) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {
    id: userId,
    name: `Server User ${userId}`,
    email: `server-user${userId}@example.com`,
  }
}

export default async function UseHookDemoPage() {
  // Dans un Server Component, on peut utiliser await directement
  const serverUser = await getUserData(1)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <header className="mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">← Retour</Link>
          </Button>
          <h1 className="text-3xl font-bold mt-4 mb-2 flex items-center gap-2">
            <Zap className="h-8 w-8 text-blue-600" />
            use() Hook (React 19)
          </h1>
          <p className="text-muted-foreground">
            Unwrap des Promises et lire des Context de manière conditionnelle dans Client Components
          </p>
          <div className="flex gap-2 mt-3">
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              use(promise)
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-600">
              use(context)
            </Badge>
          </div>
        </header>

        <div className="space-y-6">
          {/* Server Component Example */}
          <Card>
            <CardHeader>
              <CardTitle>Server Component (await)</CardTitle>
              <CardDescription>
                Dans les Server Components, on utilise <code>await</code> directement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg space-y-2">
                <Badge>ID: {serverUser.id}</Badge>
                <h3 className="font-semibold">{serverUser.name}</h3>
                <p className="text-sm text-muted-foreground">{serverUser.email}</p>
              </div>
              <pre className="mt-4 text-xs bg-muted p-3 rounded-lg overflow-x-auto">
{`// Server Component
async function ServerComponent() {
  const user = await fetchUser() // ✅ await direct
  return <div>{user.name}</div>
}`}
              </pre>
            </CardContent>
          </Card>

          {/* Client Component Examples */}
          <PromiseUnwrapDemo />
          <ContextReadDemo />

          {/* Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Comparaison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-2">Server Component</h3>
                  <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
{`async function Component() {
  const data = await fetch()
  return <div>{data}</div>
}`}
                  </pre>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Client Component</h3>
                  <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
{`"use client"
function Component({ promise }) {
  const data = use(promise)
  return <div>{data}</div>
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

