"use client"

import { useState } from "react"
import Link from "next/link"
import { ProductList } from "@/components/ecommerce/product-list"
import { CartDrawer } from "@/components/ecommerce/cart-drawer"
import { useCartStore } from "@/lib/stores/cart-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package, ArrowLeft, Sparkles } from "lucide-react"
import { mockProducts } from "@/lib/stores/product-store"
import { toast } from "sonner"
import { SonnerDemo } from "@/components/ecommerce/sonner-demo"

export default function EcommercePage() {
  const [cartOpen, setCartOpen] = useState(false)
  const itemCount = useCartStore((state) => state.getItemCount())
  const addItem = useCartStore((state) => state.addItem)
  const clearCart = useCartStore((state) => state.clearCart)

  const fillCartWithMockData = () => {
    clearCart()
    // Add first 3 products in stock
    const productsInStock = mockProducts.filter((p) => p.inStock).slice(0, 3)
    productsInStock.forEach((product) => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
      })
    })
    toast.success("Cart filled with test products", {
      description: `${productsInStock.length} items added to cart`,
      id: "fill-cart", // Prevent duplicate toasts
    })
  }

  const fillCartWithSingleItem = () => {
    clearCart()
    const firstProduct = mockProducts.find((p) => p.inStock)
    if (firstProduct) {
      addItem({
        id: firstProduct.id,
        name: firstProduct.name,
        price: firstProduct.price,
      })
      toast.success("Test product added", {
        description: `${firstProduct.name} added to cart`,
        id: "add-single-item", // Prevent duplicate toasts
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
          <Link href="/" className="font-semibold text-lg flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/ecommerce/orders">
              <Button variant="ghost" size="sm" className="cursor-pointer">
                <Package className="mr-2 h-4 w-4" />
                Orders
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCartOpen(true)}
              className="cursor-pointer relative"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart
              {itemCount > 0 && (
                <Badge
                  variant="default"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 max-w-7xl py-8">
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">E-commerce Demo</h1>
              <p className="text-muted-foreground">
                Browse products, add them to your cart, and complete a checkout flow powered by
                Zustand
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="p-3 bg-muted/50 rounded-lg border border-dashed">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Quick Test</span>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fillCartWithSingleItem}
                    className="cursor-pointer text-xs"
                  >
                    Add 1 Item
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fillCartWithMockData}
                    className="cursor-pointer text-xs"
                  >
                    Fill Cart (3 items)
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sonner Demo */}
        <div className="mb-8">
          <SonnerDemo />
        </div>

        <ProductList />
      </main>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}

