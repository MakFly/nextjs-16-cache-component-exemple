import { z } from "zod"

export const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  zipCode: z
    .string()
    .min(3, "Zip code must be at least 3 characters")
    .regex(/^[A-Z0-9\s-]+$/i, "Invalid zip code format"),
  country: z.string().min(2, "Country must be at least 2 characters"),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>

