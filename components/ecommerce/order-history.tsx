"use client"

import { useCartStore } from "@/lib/stores/cart-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, Calendar } from "lucide-react"

export function OrderHistory() {
  const orders = useCartStore((state) => state.orders)

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Package className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-6">
            Start shopping to see your order history here
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Order #{order.id.split("-")[1]}
                  <Badge
                    variant={
                      order.status === "completed"
                        ? "default"
                        : order.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {order.status}
                  </Badge>
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(order.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Items</h4>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {order.shippingAddress && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Shipping Address</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.email}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

