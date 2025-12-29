import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthHeader } from "@/components/auth/auth-header"
import { Code, ShoppingCart, Sparkles, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
          <Link href="/" className="font-semibold text-lg flex items-center gap-2">
            <Code className="h-5 w-5" />
            Next.js 16 Demo
          </Link>
          <AuthHeader />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 max-w-7xl py-20 md:py-32">
        <div className="text-center mb-16">
          <Badge className="mb-6 text-sm px-4 py-1">Next.js 16 Showcase</Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Explore Modern Web Development
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Discover Next.js 16 features and modern state management patterns
          </p>
        </div>

        {/* Main Cards */}
        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {/* E-commerce Demo */}
          <Link href="/ecommerce" className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-primary/50 cursor-pointer">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <ShoppingCart className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                      E-commerce Demo
                    </CardTitle>
                    <Badge variant="secondary" className="mt-2">
                      Zustand
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-base">
                  Full-featured fake e-commerce website with shopping cart, checkout flow, and order history.
                  Demonstrates client-side state management with Zustand.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="text-xs">
                    Shopping Cart
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Checkout Flow
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Order History
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Persistent State
                  </Badge>
                </div>
                <Button className="w-full group-hover:bg-primary/90" size="lg">
                  Explore E-commerce
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Feature Demos */}
          <Link href="/demo" className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-primary/50 cursor-pointer">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                      Next.js 16 Features
                    </CardTitle>
                    <Badge variant="secondary" className="mt-2">
                      Server Components
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-base">
                  Comprehensive collection of Next.js 16 demos including Cache Components, Server Actions,
                  parallel routes, streaming, and more advanced patterns.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="text-xs">
                    Cache Components
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Server Actions
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Parallel Routes
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Streaming
                  </Badge>
                </div>
                <Button variant="outline" className="w-full group-hover:bg-muted" size="lg">
                  Explore Features
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  )
}
