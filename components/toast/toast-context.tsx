"use client"

import { toast } from "sonner"

export type ToastType = "success" | "error" | "info" | "warning"

interface ToastOptions {
  type: ToastType
  title: string
  description?: string
}

/**
 * Hook to show toast notifications using Sonner
 * Maintains same API as the previous custom implementation
 */
export function useToast() {
  const addToast = ({ type, title, description }: ToastOptions) => {
    const options = {
      description,
    }

    switch (type) {
      case "success":
        toast.success(title, options)
        break
      case "error":
        toast.error(title, options)
        break
      case "warning":
        toast.warning(title, options)
        break
      case "info":
      default:
        toast.info(title, options)
        break
    }
  }

  return { addToast, toast }
}
