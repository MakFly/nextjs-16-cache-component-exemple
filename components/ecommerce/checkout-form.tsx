"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useCartStore } from "@/lib/stores/cart-store"
import { useCheckoutStore } from "@/lib/stores/checkout-store"
import { checkoutSchema, type CheckoutFormData } from "@/lib/schemas/checkout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Loader2, Sparkles } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function CheckoutForm() {
  const items = useCartStore((state) => state.items)
  const getTotal = useCartStore((state) => state.getTotal())
  const checkout = useCartStore((state) => state.checkout)

  const step = useCheckoutStore((state) => state.step)
  const loading = useCheckoutStore((state) => state.loading)
  const formData = useCheckoutStore((state) => state.formData)
  const setStep = useCheckoutStore((state) => state.setStep)
  const setFormData = useCheckoutStore((state) => state.setFormData)
  const setLoading = useCheckoutStore((state) => state.setLoading)

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: formData || {
      name: "",
      email: "",
      address: "",
      city: "",
      zipCode: "",
      country: "",
    },
  })

  const mockProfiles: Record<string, CheckoutFormData> = {
    usa: {
      name: "John Doe",
      email: "john.doe@example.com",
      address: "123 Main Street",
      city: "New York",
      zipCode: "10001",
      country: "USA",
    },
    france: {
      name: "Marie Dupont",
      email: "marie.dupont@example.com",
      address: "45 Rue de la République",
      city: "Paris",
      zipCode: "75001",
      country: "France",
    },
    uk: {
      name: "James Smith",
      email: "james.smith@example.com",
      address: "10 Downing Street",
      city: "London",
      zipCode: "SW1A 2AA",
      country: "United Kingdom",
    },
    canada: {
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      address: "789 Maple Avenue",
      city: "Toronto",
      zipCode: "M5H 2N2",
      country: "Canada",
    },
  }

  const fillMockData = (profile: CheckoutFormData) => {
    form.reset(profile)
    toast.info("Form filled with test data", {
      description: "You can now submit or edit the information",
    })
  }

  const onSubmit = (data: CheckoutFormData) => {
    setFormData(data)
    setStep("review")
    toast.success("Shipping information saved", {
      description: "Please review your order details",
    })
  }

  const handleCheckout = async () => {
    if (!formData) {
      toast.error("Missing shipping information", {
        description: "Please fill in all required fields",
      })
      return
    }

    setLoading(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const order = checkout(formData)
    if (order) {
      toast.success("Order placed successfully!", {
        description: `Order #${order.id.split("-")[1]} has been confirmed`,
        duration: 5000,
      })
      setStep("success")
    } else {
      toast.error("Failed to place order", {
        description: "Your cart is empty or an error occurred",
      })
    }
    setLoading(false)
  }

  if (items.length === 0 && step !== "success") {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Button asChild className="cursor-pointer">
            <a href="/ecommerce">Continue Shopping</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (step === "success") {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild className="cursor-pointer">
              <a href="/ecommerce">Continue Shopping</a>
            </Button>
            <Button asChild className="cursor-pointer">
              <a href="/ecommerce/orders">View Orders</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Form */}
      <div className="lg:col-span-2">
        {step === "shipping" && (
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>Enter your delivery details</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Auto-fill Test Buttons */}
                  <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-dashed">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Test Auto-fill
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fillMockData(mockProfiles.usa)}
                        className="cursor-pointer text-xs"
                      >
                        🇺🇸 USA
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fillMockData(mockProfiles.france)}
                        className="cursor-pointer text-xs"
                      >
                        🇫🇷 France
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fillMockData(mockProfiles.uk)}
                        className="cursor-pointer text-xs"
                      >
                        🇬🇧 UK
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fillMockData(mockProfiles.canada)}
                        className="cursor-pointer text-xs"
                      >
                        🇨🇦 Canada
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main Street" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input placeholder="10001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="USA" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full cursor-pointer">
                    Continue to Review
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {step === "review" && formData && (
          <Card>
            <CardHeader>
              <CardTitle>Review Your Order</CardTitle>
              <CardDescription>Please review your shipping information and items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{formData.name}</p>
                  <p>{formData.email}</p>
                  <p>{formData.address}</p>
                  <p>
                    {formData.city}, {formData.zipCode}
                  </p>
                  <p>{formData.country}</p>
                </div>
                <Button
                  variant="link"
                  onClick={() => setStep("shipping")}
                  className="mt-2 cursor-pointer"
                >
                  Edit
                </Button>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4">Order Items</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep("shipping")}
                  className="flex-1 cursor-pointer"
                >
                  Back
                </Button>
                <Button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="flex-1 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.name} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${getTotal.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
