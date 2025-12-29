"use client"

import { Toaster } from "@/components/ui/sonner"
import { type ReactNode } from "react"

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        expand={true}
        richColors
        closeButton
        toastOptions={{
          duration: 4000,
        }}
      />
    </>
  )
}
