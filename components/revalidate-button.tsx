"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface RevalidateButtonProps {
  action: () => Promise<void>
  label?: string
}

export function RevalidateButton({ action, label = "Refresh Cache" }: RevalidateButtonProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(() => action())}
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isPending ? "animate-spin" : ""}`} />
      {isPending ? "Refreshing..." : label}
    </Button>
  )
}
