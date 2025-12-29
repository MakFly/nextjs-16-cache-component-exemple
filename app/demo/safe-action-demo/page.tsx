import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SafeActionForm } from "@/components/safe-actions/action-form"
import { Shield, Zap } from "lucide-react"

export default function SafeActionDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <header className="mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">← Retour</Link>
          </Button>
          <h1 className="text-3xl font-bold mt-4 mb-2">next-safe-action</h1>
          <p className="text-muted-foreground">
            Server Actions type-safe avec validation Zod et middleware
          </p>
          <div className="flex gap-2 mt-3">
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              Type-safe
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Zod
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              Middleware
            </Badge>
          </div>
        </header>

        <SafeActionForm />

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Avantages</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Type-safety end-to-end (client → server)</li>
                <li>• Validation automatique avec Zod</li>
                <li>• Middleware pour auth, logging, etc.</li>
                <li>• Gestion d'erreurs centralisée</li>
                <li>• Optimistic UI support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

