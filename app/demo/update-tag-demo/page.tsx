import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Code, Info, RefreshCw, Zap } from "lucide-react"
import { UpdateTagDemo } from "@/components/update-tag-demo/update-tag-demo"
import { RevalidateTagDemo } from "@/components/update-tag-demo/revalidate-tag-demo"

export default function UpdateTagDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">Back</Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold mb-2">updateTag vs revalidateTag</h1>
          <p className="text-muted-foreground">
            Next.js 16 new caching APIs: read-your-writes semantics
          </p>
          <div className="flex gap-2 mt-3">
            <Badge variant="outline" className="text-green-600 border-green-600">
              updateTag
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              revalidateTag
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              refresh
            </Badge>
          </div>
        </header>

        {/* Explanation */}
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Difference between updateTag and revalidateTag</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>
              <strong>revalidateTag:</strong> Marks cache as stale. Users see stale data while fresh data loads in background.
              Best for: Blog posts, product catalogs, documentation.
            </p>
            <p>
              <strong>updateTag:</strong> Expires cache AND immediately refreshes within the same request. User sees their changes instantly.
              Best for: Forms, user settings, interactive features.
            </p>
            <p>
              <strong>refresh:</strong> Refreshes the client router from a Server Action. Useful for updating UI after mutations.
            </p>
          </AlertDescription>
        </Alert>

        {/* Comparison Grid */}
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          {/* revalidateTag Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-blue-600" />
                revalidateTag Demo
              </CardTitle>
              <CardDescription>
                Stale data shown while revalidating
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
                <RevalidateTagDemo />
              </Suspense>
            </CardContent>
          </Card>

          {/* updateTag Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-600" />
                updateTag Demo
              </CardTitle>
              <CardDescription>
                Immediate update, no stale data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
                <UpdateTagDemo />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Code Examples */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Code Examples
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">revalidateTag (Background Revalidation)</h3>
              <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg text-xs overflow-x-auto">
{`"use server"
import { revalidateTag } from 'next/cache'

export async function updateArticle(id: string) {
  await db.articles.update(id, { published: true })
  
  // Mark as stale - users see old data while it revalidates
  revalidateTag(\`article-\${id}\`, 'max')
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">updateTag (Immediate Update)</h3>
              <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg text-xs overflow-x-auto">
{`"use server"
import { updateTag } from 'next/cache'

export async function updateUserProfile(userId: string, profile: Profile) {
  await db.users.update(userId, profile)
  
  // Expire AND refresh immediately - user sees changes right away
  updateTag(\`user-\${userId}\`)
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">refresh (Client Router Refresh)</h3>
              <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg text-xs overflow-x-auto">
{`"use server"
import { refresh } from 'next/cache'

export async function markNotificationAsRead(id: string) {
  await db.notifications.markAsRead(id)
  
  // Refresh client router to update UI
  refresh()
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

