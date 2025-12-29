"use client"

import Link from "next/link"
import { CheckoutForm } from "@/components/ecommerce/checkout-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
          <Link href="/ecommerce">
            <Button variant="ghost" size="sm" className="cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 max-w-7xl py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground">Complete your order</p>
        </div>

        <CheckoutForm />
      </main>
    </div>
  )
}

