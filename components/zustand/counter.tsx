"use client"

import { useCounterStore } from "@/lib/stores/counter-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, RotateCcw } from "lucide-react"

export function CounterDemo() {
  // Utilisation directe du store (re-render sur chaque changement)
  const count = useCounterStore((state) => state.count)
  const increment = useCounterStore((state) => state.increment)
  const decrement = useCounterStore((state) => state.decrement)
  const reset = useCounterStore((state) => state.reset)
  const incrementBy = useCounterStore((state) => state.incrementBy)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Counter Store</CardTitle>
        <CardDescription>Store Zustand simple avec devtools</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" size="icon" onClick={decrement}>
            <Minus className="h-4 w-4" />
          </Button>
          <Badge variant="outline" className="text-2xl px-6 py-2 min-w-[80px] justify-center">
            {count}
          </Badge>
          <Button variant="outline" size="icon" onClick={increment}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2 justify-center">
          <Button variant="secondary" onClick={() => incrementBy(5)}>
            +5
          </Button>
          <Button variant="secondary" onClick={() => incrementBy(-5)}>
            -5
          </Button>
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Ouvrez les DevTools Redux pour voir les actions dispatchées
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

