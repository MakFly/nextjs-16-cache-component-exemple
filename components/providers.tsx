"use client"

import { type ReactNode } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { ToastProvider } from "@/components/toast"
import { getQueryClient } from "@/lib/query-client"

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <ToastProvider>
          {children}
        </ToastProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  )
}
