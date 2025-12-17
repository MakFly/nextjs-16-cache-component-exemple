"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, RotateCcw } from "lucide-react"

export function DevRefreshButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleRefresh() {
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={isPending}
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isPending ? "animate-spin" : ""}`} />
      {isPending ? "Refreshing..." : "Refresh RSC"}
    </Button>
  )
}

export function HardReloadButton() {
  function handleReload() {
    window.location.reload()
  }

  return (
    <Button variant="outline" size="sm" onClick={handleReload}>
      <RotateCcw className="h-4 w-4 mr-2" />
      Hard Reload
    </Button>
  )
}
