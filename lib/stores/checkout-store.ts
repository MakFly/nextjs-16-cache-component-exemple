import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { CheckoutFormData } from "@/lib/schemas/checkout"

interface CheckoutState {
  step: "shipping" | "review" | "success"
  loading: boolean
  formData: CheckoutFormData | null
  setStep: (step: "shipping" | "review" | "success") => void
  setFormData: (data: CheckoutFormData) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

export const useCheckoutStore = create<CheckoutState>()(
  devtools(
    (set) => ({
      step: "shipping",
      loading: false,
      formData: null,
      setStep: (step) => set({ step }, false, "setStep"),
      setFormData: (data) => set({ formData: data }, false, "setFormData"),
      setLoading: (loading) => set({ loading }, false, "setLoading"),
      reset: () =>
        set(
          {
            step: "shipping",
            loading: false,
            formData: null,
          },
          false,
          "reset"
        ),
    }),
    { name: "CheckoutStore" }
  )
)

