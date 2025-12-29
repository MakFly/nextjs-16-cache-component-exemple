import { cacheLife, cacheTag } from "next/cache"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { revalidateTagAction } from "@/lib/actions"
import { delay } from "@/lib/api"

async function getStaleData() {
  "use cache"
  cacheLife("hours")
  cacheTag("revalidate-demo")

  await delay(500)
  const timestamp = new Date().toLocaleTimeString()
  return { timestamp, message: "This data is cached" }
}

export async function RevalidateTagDemo() {
  const data = await getStaleData()

  async function handleRevalidate() {
    "use server"
    await revalidateTagAction("revalidate-demo", "default")
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground mb-1">Cached timestamp:</p>
        <p className="text-lg font-mono">{data.timestamp}</p>
        <Badge variant="outline" className="mt-2 text-blue-600 border-blue-600">
          Stale data shown
        </Badge>
      </div>

      <form action={handleRevalidate}>
        <Button type="submit" variant="outline" className="w-full">
          Revalidate Tag (Background)
        </Button>
      </form>

      <p className="text-xs text-muted-foreground">
        Click to mark cache as stale. Refresh page to see new data load in background.
      </p>
    </div>
  )
}

