"use client"

import { useRouter } from "next/navigation"
import { useEffect, useCallback, type ReactNode } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Modal({ children }: { children: ReactNode }) {
  const router = useRouter()

  const onDismiss = useCallback(() => {
    router.back()
  }, [router])

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss()
    },
    [onDismiss]
  )

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown)
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [onKeyDown])

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in-0"
        onClick={onDismiss}
      />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-[10%] lg:inset-[15%] z-50">
        <div className="relative h-full bg-background border border-border rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in-0 duration-200">
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-10"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
            <span className="ml-2">Close</span>
          </Button>

          {/* Content */}
          <div className="h-full overflow-auto p-6 pt-14">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
