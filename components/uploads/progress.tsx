"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Upload, Loader2 } from "lucide-react"

interface UploadState {
  success?: boolean
  error?: string
  data?: {
    name: string
    size: number
    type: string
    uploadedAt?: string
  }
}

export function ProgressUploadDemo() {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [pending, setPending] = useState(false)
  const [state, setState] = useState<UploadState | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      setProgress(0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setPending(true)
    setProgress(0)
    setState(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      // Simule une progress bar (dans un vrai projet, utiliser XMLHttpRequest ou fetch avec ReadableStream)
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval)
            return 90
          }
          return prev + 10
        })
      }, 150)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      clearInterval(interval)
      setProgress(100)

      if (!response.ok) {
        setState({ success: false, error: result.error || "Erreur lors de l'upload" })
      } else {
        setState(result)
        setFile(null)
      }
    } catch (error) {
      setState({
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
        <CardTitle>Upload avec Progress Bar</CardTitle>
        <CardDescription>Barre de progression pour le téléchargement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            disabled={pending}
          />
          {file && (
            <p className="text-sm text-muted-foreground">
              Sélectionné: {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        {pending && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Upload en cours...</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {!pending && file && (
          <form onSubmit={handleSubmit}>
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
        )}

        {state?.success && (
          <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-500 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              Fichier uploadé avec succès !
            </p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
              {state.data?.name} - {state.data?.type}
            </p>
          </div>
        )}

        {state?.error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-500 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">{state.error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

