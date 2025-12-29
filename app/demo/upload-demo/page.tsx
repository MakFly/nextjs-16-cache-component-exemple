import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropzoneDemo } from "@/components/uploads/dropzone"
import { ProgressUploadDemo } from "@/components/uploads/progress"
import { SimpleUploadDemo } from "@/components/uploads/simple-upload"
import { PreviewUploadDemo } from "@/components/uploads/preview-upload"
import { XHRUploadDemo } from "@/components/uploads/xhr-upload"
import { LeboncoinUploadDemo } from "@/components/uploads/leboncoin-upload"
import { Upload, Server } from "lucide-react"

export default function UploadDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <header className="mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">← Retour</Link>
          </Button>
          <h1 className="text-3xl font-bold mt-4 mb-2 flex items-center gap-2">
            <Upload className="h-8 w-8 text-blue-600" />
            File Uploads - Différents Systèmes
          </h1>
          <p className="text-muted-foreground">
            Comparaison de différentes méthodes d'upload de fichiers
          </p>
          <div className="flex gap-2 mt-3 flex-wrap">
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              Route Handler
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Drag & Drop
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              Progress
            </Badge>
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              XHR
            </Badge>
            <Badge variant="outline" className="text-cyan-600 border-cyan-600">
              Preview
            </Badge>
          </div>
        </header>

        {/* Leboncoin style upload - prend toute la largeur */}
        <LeboncoinUploadDemo />

        {/* Grid avec tous les autres systèmes d'upload */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8 mt-8">
          <SimpleUploadDemo />
          <PreviewUploadDemo />
          <ProgressUploadDemo />
          <XHRUploadDemo />
          <DropzoneDemo />
        </div>

        {/* Info box */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-start gap-3">
            <Server className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Fonctionnalités</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium mb-2">Systèmes disponibles :</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Leboncoin Style</strong> - Upload auto + réordonner (style Leboncoin)</li>
                    <li>• <strong>Simple Upload</strong> - Input file basique</li>
                    <li>• <strong>Preview Upload</strong> - Preview avant upload</li>
                    <li>• <strong>Progress Upload</strong> - Barre de progression simulée</li>
                    <li>• <strong>XHR Upload</strong> - Progress réel avec XMLHttpRequest</li>
                    <li>• <strong>Drag & Drop</strong> - Upload multiple avec preview</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Caractéristiques :</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Route Handler (pas de limite 1MB)</li>
                    <li>• Sauvegarde dans <code className="bg-background px-1 rounded">public/uploads</code></li>
                    <li>• Validation Zod (type, taille)</li>
                    <li>• Upload multiple supporté</li>
                    <li>• Revalidation du cache</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  <strong>Note:</strong> Pour la production, utilisez un service cloud comme{" "}
                  <code className="bg-background px-1 rounded">Vercel Blob</code>,{" "}
                  <code className="bg-background px-1 rounded">Cloudinary</code> ou{" "}
                  <code className="bg-background px-1 rounded">AWS S3</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

