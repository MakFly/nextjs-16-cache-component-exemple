"use client"

import { useState, useRef, DragEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, FileImage, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

interface FileWithPreview extends File {
  preview?: string
}

interface UploadState {
  success?: boolean
  error?: string
  results?: Array<{
    success: boolean
    data?: { name: string; size: number; type: string }
    error?: string
    name?: string
  }>
}

export function DropzoneDemo() {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [pending, setPending] = useState(false)
  const [state, setState] = useState<UploadState | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (newFiles: File[]) => {
    const filesWithPreview = newFiles.map((file) => {
      const fileWithPreview = file as FileWithPreview
      if (file.type.startsWith("image/")) {
        fileWithPreview.preview = URL.createObjectURL(file)
      }
      return fileWithPreview
    })
    setFiles((prev) => [...prev, ...filesWithPreview])
  }

  const removeFile = (index: number) => {
    const file = files[index]
    if (file.preview) {
      URL.revokeObjectURL(file.preview)
    }
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) return

    setPending(true)
    setState(null)

    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append("files", file)
      })

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        setState({ success: false, error: result.error || "Erreur lors de l'upload" })
      } else {
        setState(result)
        // Réinitialiser les fichiers après succès
        files.forEach((file) => {
          if (file.preview) {
            URL.revokeObjectURL(file.preview)
          }
        })
        setFiles([])
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
        <CardTitle>Drag & Drop Upload</CardTitle>
        <CardDescription>
          Glissez-déposez des fichiers ou cliquez pour sélectionner
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors
            ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
            hover:border-primary/50 hover:bg-muted/50
          `}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm font-medium mb-1">
            Glissez-déposez des fichiers ici ou cliquez pour sélectionner
          </p>
          <p className="text-xs text-muted-foreground">
            Images JPEG, PNG, WebP (max 5MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Fichiers sélectionnés ({files.length})</h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="relative border rounded-lg p-2 group hover:bg-muted/50 transition-colors"
                >
                  {file.preview ? (
                    <div className="aspect-square relative rounded overflow-hidden mb-2">
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square flex items-center justify-center bg-muted rounded mb-2">
                      <FileImage className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(index)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {state?.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {state?.success && (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              {state.results?.length} fichier(s) uploadé(s) avec succès !
            </AlertDescription>
          </Alert>
        )}

        {/* Submit */}
        <form onSubmit={handleSubmit}>
          <Button type="submit" disabled={files.length === 0 || pending} className="w-full">
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Upload en cours...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Uploader {files.length > 0 && `(${files.length})`}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

