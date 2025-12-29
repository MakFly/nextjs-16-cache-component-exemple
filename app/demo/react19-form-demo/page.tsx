import Link from "next/link"
import { Button } from "@/components/ui/button"
import { React19Form } from "@/components/forms/react19-form"

export default function React19FormPage() {
  return (
    <div className="min-h-screen bg-background font-terminal">
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        {/* Header - Terminal Form */}
        <header className="mb-8 terminal-box p-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild className="terminal-button text-xs">
              <Link href="/">[BACK]</Link>
            </Button>
          </div>
          <div className="border-b border-terminal mb-3 pb-2">
            <span className="text-terminal-cyan font-bold">$ ./react19-form.sh</span>
          </div>
          <h1 className="text-3xl font-bold uppercase tracking-widest text-terminal-cyan">REACT 19 FORM</h1>
          <p className="text-muted-foreground mt-1 font-mono text-sm">
            [INFO] useActionState + useFormStatus with updateTag for immediate cache refresh
          </p>
        </header>

        {/* Form Component */}
        <div className="border-b border-terminal pb-1 mb-2">
          <span className="text-terminal-cyan font-mono text-xs">./forms/react19-form.tsx</span>
        </div>
        <React19Form />
      </div>
    </div>
  )
}

