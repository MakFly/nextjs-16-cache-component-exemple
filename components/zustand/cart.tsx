"use client"

import { useCartStore, type CartItem } from "@/lib/stores/cart-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input"

const mockProducts: Omit<CartItem, "quantity">[] = [
  { id: 1, name: "Laptop", price: 999 },
  { id: 2, name: "Mouse", price: 29 },
  { id: 3, name: "Keyboard", price: 79 },
  { id: 4, name: "Monitor", price: 299 },
]

export function CartDemo() {
  // Utilisation de selectors pour éviter les re-renders inutiles
  const items = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const clearCart = useCartStore((state) => state.clearCart)
  const total = useCartStore((state) => state.getTotal())
  const itemCount = useCartStore((state) => state.getItemCount())

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Products */}
      <Card>
        <CardHeader>
          <CardTitle>Produits</CardTitle>
          <CardDescription>Ajoutez des produits au panier</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {mockProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">${product.price}</p>
              </div>
              <Button size="sm" onClick={() => addItem(product)}>
                Ajouter
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Cart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Panier</CardTitle>
              <CardDescription>
                {itemCount} {itemCount === 1 ? "article" : "articles"}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg">
              ${total.toFixed(2)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Le panier est vide</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.price} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value) || 1)
                        }
                        className="w-16 h-8 text-center"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold">${total.toFixed(2)}</span>
                </div>
                <Button variant="outline" onClick={clearCart} className="w-full">
                  Vider le panier
                </Button>
              </div>
            </>
          )}

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Le panier est persisté dans localStorage (rechargez la page pour vérifier)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

