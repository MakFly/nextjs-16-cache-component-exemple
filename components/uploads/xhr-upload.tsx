"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

export function XHRUploadDemo() {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      setProgress(0)
      setResult(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setPending(true)
    setProgress(0)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      // Utilise XMLHttpRequest pour avoir un vrai progress
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100
          setProgress(percentComplete)
        }
      })

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText)
          setResult({ success: true })
          setFile(null)
          setProgress(0)
        } else {
          const data = JSON.parse(xhr.responseText)
          setResult({ success: false, error: data.error || "Erreur lors de l'upload" })
        }
        setPending(false)
      })

      xhr.addEventListener("error", () => {
        setResult({ success: false, error: "Erreur réseau" })
        setPending(false)
      })

      xhr.open("POST", "/api/upload")
      xhr.send(formData)
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Une erreur est survenue",
      })
      setPending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload avec XHR Progress</CardTitle>
        <CardDescription>Progress réel avec XMLHttpRequest</CardDescription>
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
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          )}

          {pending && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Upload en cours...</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
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
                Upload réussi !
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={!file || pending} className="w-full">
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Upload... {Math.round(progress)}%
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

