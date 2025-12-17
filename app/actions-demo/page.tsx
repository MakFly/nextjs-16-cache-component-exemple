import { Suspense } from "react"
import Link from "next/link"
import { cacheLife, cacheTag } from "next/cache"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageForm } from "@/components/messages/message-form"
import { getMessages } from "@/lib/actions"

async function MessagesLoader() {
  "use cache"
  cacheLife("seconds")
  cacheTag("messages")

  const messages = await getMessages()
  return <MessageForm initialMessages={messages} />
}

function MessagesSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-1" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-20" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ActionsDemo() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">Back</Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Server Actions Demo</h1>
          <p className="text-muted-foreground mt-1">
            useOptimistic + Server Actions + Toast notifications
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              useOptimistic = Instant UI
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Server Actions = Data mutations
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              Toast = Feedback
            </Badge>
          </div>
        </header>

        {/* Info Card */}
        <Card className="mb-6 border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">How it works</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>1. Optimistic Update:</strong> Message appears instantly in UI (pending state)
            </p>
            <p>
              <strong>2. Server Action:</strong> Runs in background, validates & persists
            </p>
            <p>
              <strong>3. Toast Notification:</strong> Shows success/error feedback
            </p>
            <p>
              <strong>4. Revalidation:</strong> Cache is invalidated, fresh data loads
            </p>
            <p className="text-orange-600 dark:text-orange-400 mt-3">
              Note: 10% random failure rate to demo error handling
            </p>
          </CardContent>
        </Card>

        {/* Messages Section */}
        <Suspense fallback={<MessagesSkeleton />}>
          <MessagesLoader />
        </Suspense>
      </div>
    </div>
  )
}
