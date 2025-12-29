"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log critical error to monitoring service
    console.error("Global error (root boundary):", error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <CardTitle className="text-2xl">Critical Error</CardTitle>
              </div>
              <CardDescription>
                A critical error occurred in the root layout. This is caught by the global error boundary.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error.message && (
                <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <p className="text-sm font-mono text-destructive">{error.message}</p>
                  {error.digest && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}

              <Button onClick={reset} variant="default" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try again
              </Button>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}

