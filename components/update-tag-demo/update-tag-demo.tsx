import { cacheLife, cacheTag, updateTag } from "next/cache"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { delay } from "@/lib/api"

async function getData() {
  "use cache"
  cacheLife("hours")
  cacheTag("update-demo")

  await delay(500)
  const timestamp = new Date().toLocaleTimeString()
  return { timestamp, message: "This data is cached" }
}

export async function UpdateTagDemo() {
  const data = await getData()

  async function handleUpdate() {
    "use server"
    // Simulate update
    await delay(100)
    // Immediately expire and refresh cache
    updateTag("update-demo")
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground mb-1">Cached timestamp:</p>
        <p className="text-lg font-mono">{data.timestamp}</p>
        <Badge variant="outline" className="mt-2 text-green-600 border-green-600">
          Immediate update
        </Badge>
      </div>

      <form action={handleUpdate}>
        <Button type="submit" variant="default" className="w-full">
          Update Tag (Immediate)
        </Button>
      </form>

      <p className="text-xs text-muted-foreground">
        Click to immediately refresh cache. You'll see new data right away.
      </p>
    </div>
  )
}

