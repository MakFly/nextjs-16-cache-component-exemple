"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { toast } from "sonner"

interface CodeBlockProps {
  code: string
  language?: string
}

export function CodeBlock({ code, language = "typescript" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success("Code copié dans le presse-papiers")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Erreur lors de la copie")
    }
  }

  return (
    <div className="relative group">
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="bg-zinc-950 text-zinc-100 p-6 rounded-xl text-sm font-mono overflow-x-auto border border-zinc-800">
        <pre className="whitespace-pre-wrap">{code}</pre>
      </div>
    </div>
  )
}

