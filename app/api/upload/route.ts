import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { revalidateTag } from "next/cache"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

// Schema pour valider les fichiers
const uploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Le fichier doit faire moins de 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Seules les images JPEG, PNG et WebP sont autorisées"
    ),
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    const singleFile = formData.get("file") as File | null

    // Gestion d'un seul fichier
    if (singleFile && files.length === 0) {
      const validation = uploadSchema.safeParse({ file: singleFile })
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            error: validation.error.issues[0].message,
          },
          { status: 400 }
        )
      }

      // Sauvegarde le fichier dans public/uploads
      const uploadsDir = join(process.cwd(), "public", "uploads")
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }

      // Génère un nom de fichier unique
      const timestamp = Date.now()
      const sanitizedName = singleFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")
      const filename = `${timestamp}-${sanitizedName}`
      const filepath = join(uploadsDir, filename)

      // Convertit le File en Buffer et sauvegarde
      const bytes = await singleFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filepath, buffer)

      revalidateTag("uploads", "default")

      return NextResponse.json({
        success: true,
        data: {
          name: singleFile.name,
          size: singleFile.size,
          type: singleFile.type,
          uploadedAt: new Date().toISOString(),
          url: `/uploads/${filename}`, // URL publique pour accéder au fichier
        },
      })
    }

    // Gestion de plusieurs fichiers
    if (files.length > 0) {
      const results = await Promise.all(
        files.map(async (file, index) => {
          const validation = uploadSchema.safeParse({ file })
          if (!validation.success) {
            return {
              success: false,
              error: validation.error.issues[0].message,
              name: file.name,
            }
          }

          // Sauvegarde le fichier dans public/uploads
          const uploadsDir = join(process.cwd(), "public", "uploads")
          if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true })
          }

          // Génère un nom de fichier unique
          const timestamp = Date.now()
          const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
          const filename = `${timestamp}-${index}-${sanitizedName}`
          const filepath = join(uploadsDir, filename)

          // Convertit le File en Buffer et sauvegarde
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)
          await writeFile(filepath, buffer)

          return {
            success: true,
            data: {
              name: file.name,
              size: file.size,
              type: file.type,
              url: `/uploads/${filename}`, // URL publique pour accéder au fichier
            },
          }
        })
      )

      revalidateTag("uploads", "default")

      return NextResponse.json({
        success: true,
        results,
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: "Aucun fichier fourni",
      },
      { status: 400 }
    )
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Une erreur est survenue",
      },
      { status: 500 }
    )
  }
}

