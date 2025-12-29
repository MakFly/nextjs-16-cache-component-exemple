"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, BookOpen } from "lucide-react"

interface CodeExplanationProps {
  code: string
  explanation: string
  language?: string
}

export function CodeExplanation({ code, explanation, language = "typescript" }: CodeExplanationProps) {
  return (
    <Tabs defaultValue="code" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="code" className="flex items-center gap-2">
          <Code className="h-4 w-4" />
          Code
        </TabsTrigger>
        <TabsTrigger value="explanation" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Explanation
        </TabsTrigger>
      </TabsList>
      <TabsContent value="code" className="mt-4">
        <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
          {code}
        </pre>
      </TabsContent>
      <TabsContent value="explanation" className="mt-4">
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm whitespace-pre-line">{explanation}</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}

