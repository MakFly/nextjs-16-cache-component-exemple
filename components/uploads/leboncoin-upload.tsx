"use client"

import { useState, useRef, DragEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, X, Loader2, AlertCircle, GripVertical } from "lucide-react"
import Image from "next/image"

interface UploadedPhoto {
  id: string
  file: File
  preview: string
  url?: string
  uploading?: boolean
  error?: string
}

export function LeboncoinUploadDemo() {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [isDragging, setIsDragging] = useState(false)
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
    const droppedFiles = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    )
    handleFiles(droppedFiles)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter((f) => f.type.startsWith("image/"))
      handleFiles(selectedFiles)
    }
  }

  const handleFiles = async (newFiles: File[]) => {
    const newPhotos: UploadedPhoto[] = newFiles.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      uploading: true,
    }))

    setPhotos((prev) => [...prev, ...newPhotos])

    // Upload automatique de chaque fichier
    newPhotos.forEach(async (photo) => {
      try {
        const formData = new FormData()
        formData.append("file", photo.file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        const result = await response.json()

        if (!response.ok) {
          setPhotos((prev) =>
            prev.map((p) =>
              p.id === photo.id
                ? { ...p, uploading: false, error: result.error || "Erreur lors de l'upload" }
                : p
            )
          )
        } else {
          setPhotos((prev) =>
            prev.map((p) =>
              p.id === photo.id
                ? { ...p, uploading: false, url: result.data?.url }
                : p
            )
          )
        }
      } catch (error) {
        setPhotos((prev) =>
          prev.map((p) =>
            p.id === photo.id
              ? { ...p, uploading: false, error: "Erreur réseau" }
              : p
          )
        )
      }
    })
  }

  const removePhoto = (id: string) => {
    const photo = photos.find((p) => p.id === id)
    if (photo?.preview) {
      URL.revokeObjectURL(photo.preview)
    }
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-2xl">Ajoutez des photos</CardTitle>
        <CardDescription className="text-base">
          Faites glisser vos photos pour changer leur ordre.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold mb-4">Vos photos *</h3>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {/* Bouton Ajouter */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                shrink-0 w-40 h-40 border border-foreground rounded flex flex-col items-center justify-center cursor-pointer transition-colors
                ${
                  isDragging
                    ? "border-foreground bg-muted"
                    : "border-foreground bg-background hover:bg-muted/20"
                }
              `}
            >
              <Camera className="h-9 w-9 text-foreground/60 mb-1.5" />
              <span className="text-[10px] text-center text-foreground font-medium px-2 leading-tight">
                Ajouter des photos
              </span>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Photos uploadées */}
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="shrink-0 relative group cursor-grab active:cursor-grabbing"
              >
                <div className="w-40 h-40 border border-foreground rounded overflow-hidden bg-background relative">
                  {/* Photo de couverture badge */}
                  {index === 0 && (
                    <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
                      <div className="bg-foreground text-background text-[10px] font-medium px-2 py-0.5 text-center">
                        Photo de couverture
                      </div>
                    </div>
                  )}

                  {/* Image */}
                  {photo.preview && (
                    <div className="w-full h-full relative pointer-events-none">
                      <Image
                        src={photo.url || photo.preview}
                        alt={`Photo ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      {photo.uploading && (
                        <div className="absolute inset-0 bg-background/90 flex items-center justify-center">
                          <Loader2 className="h-7 w-7 animate-spin text-foreground" />
                        </div>
                      )}
                      {photo.error && (
                        <div className="absolute inset-0 bg-destructive/90 flex items-center justify-center">
                          <AlertCircle className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Numéro de photo - en bas */}
                  <div className="absolute bottom-0 left-0 z-10 pointer-events-none">
                    <div className="bg-foreground text-background text-[10px] font-medium px-2 py-0.5">
                      Photo n° {index + 1}
                    </div>
                  </div>

                  {/* Bouton supprimer */}
                  <button
                    type="button"
                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-600 text-white flex items-center justify-center z-30 pointer-events-auto hover:bg-red-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      removePhoto(photo.id)
                    }}
                    aria-label="Supprimer la photo"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}

            {/* Placeholders pour photos vides - cliquables */}
            {photos.length < 3 &&
              Array.from({ length: 3 - photos.length }).map((_, i) => (
                <div
                  key={`placeholder-${i}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    shrink-0 w-40 h-40 border border-dashed rounded flex flex-col items-center justify-center cursor-pointer transition-colors
                    ${
                      isDragging
                        ? "border-foreground/50 bg-muted/30"
                        : "border-foreground/20 bg-muted/10 hover:bg-muted/20 hover:border-foreground/30"
                    }
                  `}
                >
                  <Camera className="h-8 w-8 text-muted-foreground/50 mb-1.5" />
                  <span className="text-[10px] text-muted-foreground font-medium">
                    Photo n° {photos.length + i + 1}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Messages d'erreur globaux */}
        {photos.some((p) => p.error) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Certaines photos n'ont pas pu être uploadées. Vérifiez les erreurs ci-dessus.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

