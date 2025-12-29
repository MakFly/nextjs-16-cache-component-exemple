"use client"

import { useState } from "react"
import Link from "next/link"
import { useCartStore } from "@/lib/stores/cart-store"
import { mockProducts, type Product, categories, type Category } from "@/lib/stores/product-store"
import { getProductSlug } from "@/lib/utils/product"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus } from "lucide-react"
import { toast } from "sonner"

export function ProductList() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All")
  const addItem = useCartStore((state) => state.addItem)

  const filteredProducts =
    selectedCategory === "All"
      ? mockProducts
      : mockProducts.filter((product) => product.category === selectedCategory)

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
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

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="cursor-pointer"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <Link
            key={product.id}
            href={`/ecommerce/products/${getProductSlug(product)}`}
            className="group"
          >
            <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
              <CardHeader className="pb-3">
                <div className="text-6xl mb-4 text-center">{product.image}</div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {product.name}
                </CardTitle>
                <CardDescription className="line-clamp-2">{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                    {product.inStock ? (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                        In Stock
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-red-500/10 text-red-600">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  <Button
                    className="w-full cursor-pointer"
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

