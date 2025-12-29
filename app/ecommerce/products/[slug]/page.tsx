"use client"

import { useMemo, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useCartStore } from "@/lib/stores/cart-store"
import { mockProducts } from "@/lib/stores/product-store"
import { getProductBySlug, getProductSlug } from "@/lib/utils/product"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, ArrowLeft, Check, Package, Truck, Shield } from "lucide-react"
import { toast } from "sonner"

export default function ProductPage() {
  const params = useParams()
  const slug = params?.slug as string

  const product = useMemo(() => {
    if (!slug) return undefined
    return getProductBySlug(slug, mockProducts)
  }, [slug])

  const addItem = useCartStore((state) => state.addItem)
  const relatedProducts = useMemo(() => {
    if (!product) return []
    return mockProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4)
  }, [product])

  const handleAddToCart = () => {
    if (!product) return
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
    })
    toast.success("Added to cart", {
      description: `${product.name} has been added to your cart`,
      id: `add-to-cart-${product.id}`, // Prevent duplicate toasts
    })
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 max-w-7xl py-16">
          <Card>
            <CardContent className="p-12 text-center">
              <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The product you're looking for doesn't exist.
              </p>
              <Button asChild className="cursor-pointer">
                <Link href="/ecommerce">Back to Shop</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

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
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-12">
                <span className="text-9xl">{product.image}</span>
              </div>
            </Card>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="aspect-square bg-muted/50 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                  <span className="text-2xl">{product.image}</span>
                </Card>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                {product.inStock ? (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                    <Check className="mr-1 h-3 w-3" />
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-red-500/10 text-red-600">
                    Out of Stock
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-primary mb-6">${product.price.toFixed(2)}</p>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <Separator />

            {/* Features */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Fast Delivery</p>
                  <p className="text-xs text-muted-foreground">2-3 business days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Warranty</p>
                  <p className="text-xs text-muted-foreground">1 year included</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Add to Cart */}
            <div className="space-y-4">
              <Button
                className="w-full cursor-pointer"
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              {!product.inStock && (
                <p className="text-sm text-muted-foreground text-center">
                  This product is currently out of stock
                </p>
              )}
            </div>

            <Separator />

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SKU</span>
                  <span className="font-medium">#{product.id.toString().padStart(4, "0")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Availability</span>
                  <span className="font-medium">
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/ecommerce/products/${getProductSlug(relatedProduct)}`}
                  className="group"
                >
                  <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="text-6xl mb-4 text-center">{relatedProduct.image}</div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {relatedProduct.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {relatedProduct.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">${relatedProduct.price.toFixed(2)}</span>
                        {relatedProduct.inStock ? (
                          <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                            In Stock
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-red-500/10 text-red-600">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

