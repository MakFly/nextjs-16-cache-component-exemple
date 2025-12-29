"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CounterDemo } from "@/components/zustand/counter"
import { CartDemo } from "@/components/zustand/cart"
import { Code, Zap } from "lucide-react"

export default function ZustandDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <header className="mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">← Retour</Link>
          </Button>
          <h1 className="text-3xl font-bold mt-4 mb-2">Zustand State Management</h1>
          <p className="text-muted-foreground">
            State management léger avec middleware (persist, devtools) et selectors
          </p>
          <div className="flex gap-2 mt-3">
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              Zustand
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Persist
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              DevTools
            </Badge>
          </div>
        </header>

        <div className="space-y-8">
          {/* Counter Demo */}
          <CounterDemo />

          {/* Cart Demo */}
          <CartDemo />

          {/* Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Avantages vs Context API
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    Zustand
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Pas de Provider nécessaire</li>
                    <li>• Selectors pour éviter re-renders</li>
                    <li>• Middleware intégré (persist, devtools)</li>
                    <li>• Bundle size ~1KB</li>
                    <li>• TypeScript natif</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Context API</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Provider requis</li>
                    <li>• Re-render tous les consumers</li>
                    <li>• Pas de persist/devtools intégrés</li>
                    <li>• Plus verbeux</li>
                    <li>• Peut causer des problèmes de performance</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <p className="text-sm font-medium mb-2">Exemple de code :</p>
                <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
{`// Store simple
const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))

// Avec middleware
const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => ({
        items: [...state.items, item]
      })),
    }),
    { name: 'cart-storage' }
  )
)

// Utilisation avec selector
const count = useCounterStore((state) => state.count)
const increment = useCounterStore((state) => state.increment)`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

