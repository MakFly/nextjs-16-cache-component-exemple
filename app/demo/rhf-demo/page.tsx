import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RhfZodForm } from "@/components/forms/rhf-zod-form"

export default function RhfDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <header className="mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">← Retour</Link>
          </Button>
          <h1 className="text-3xl font-bold mt-4 mb-2">React Hook Form + Zod</h1>
          <p className="text-muted-foreground">
            Validation complète avec schéma Zod partagé entre client et serveur
          </p>
        </header>

        <RhfZodForm />
      </div>
    </div>
  )
}

