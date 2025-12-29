"use client"

import { useState, useEffect, useTransition, startTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Zap, Activity } from "lucide-react"
import Link from "next/link"

// useEffectEvent example
function useCounter() {
  const [count, setCount] = useState(0)
  const [isPending, startTransition] = useTransition()

  // In React 19.2, useEffectEvent extracts non-reactive logic
  // For now, we'll show the pattern conceptually
  useEffect(() => {
    console.log("Count changed:", count)
  }, [count])

  return {
    count,
    increment: () => {
      startTransition(() => {
        setCount((c) => c + 1)
      })
    },
    isPending,
  }
}

export default function React19FeaturesPage() {
  const { count, increment, isPending } = useCounter()
  const [showActivity, setShowActivity] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">Back</Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold mb-2">React 19.2 Features</h1>
          <p className="text-muted-foreground">
            New React features available in Next.js 16
          </p>
          <div className="flex gap-2 mt-3">
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              useEffectEvent
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Activity
            </Badge>
          </div>
        </header>

        {/* useEffectEvent Demo */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              useEffectEvent (Conceptual)
            </CardTitle>
            <CardDescription>
              Extract non-reactive logic from Effects into reusable Effect Event functions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-4">
                useEffectEvent allows you to extract non-reactive logic from Effects.
                This prevents unnecessary re-runs when dependencies change.
              </p>
              <div className="flex items-center gap-4">
                <Button onClick={increment} disabled={isPending}>
                  Count: {count}
                </Button>
                {isPending && <span className="text-sm text-muted-foreground">Updating...</span>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Demo */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Activity Component
            </CardTitle>
            <CardDescription>
              Render "background activity" by hiding UI with display: none while maintaining state
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-4">
                Activity component maintains component state and effects while hiding the UI.
                Useful for prefetching pages or maintaining state during transitions.
              </p>
              <Button onClick={() => setShowActivity(!showActivity)}>
                {showActivity ? "Hide" : "Show"} Activity
              </Button>
              {showActivity && (
                <div className="mt-4 p-4 bg-background border rounded-lg">
                  <p className="text-sm">Activity content (state preserved)</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Code Examples */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Code Examples
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">useEffectEvent</h3>
              <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg text-xs overflow-x-auto">
{`import { useEffectEvent } from 'react'

function useCounter() {
  const [count, setCount] = useState(0)
  
  const onCountChange = useEffectEvent((newCount) => {
    // Non-reactive logic - doesn't re-run when deps change
    console.log('Count:', newCount)
  })
  
  useEffect(() => {
    onCountChange(count)
  }, [count])
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Activity</h3>
              <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg text-xs overflow-x-auto">
{`import { Activity } from 'react'

function PrefetchPage() {
  return (
    <Activity>
      <ExpensiveComponent />
    </Activity>
  )
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

