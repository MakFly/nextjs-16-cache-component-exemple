"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

export function SimpleUploadDemo() {
  const [file, setFile] = useState<File | null>(null)
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; error?: string; data?: any } | null>(
    null
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      setResult(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setPending(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setResult({ success: false, error: data.error || "Erreur lors de l'upload" })
      } else {
        setResult({ success: true, data: data.data })
        setFile(null)
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Une erreur est survenue",
      })
    } finally {
      setPending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Simple</CardTitle>
        <CardDescription>Upload basique avec input file</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            disabled={pending}
          />

          {file && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB - {file.type}
              </p>
            </div>
          )}

          {result?.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{result.error}</AlertDescription>
            </Alert>
          )}

          {result?.success && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Fichier uploadé avec succès !
                {result.data?.url && (
                  <a
                    href={result.data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 underline"
                  >
                    Voir
                  </a>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={!file || pending} className="w-full">
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Upload...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Uploader
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

