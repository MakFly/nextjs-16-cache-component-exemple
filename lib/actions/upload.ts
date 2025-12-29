"use server"

import { z } from "zod"
import { revalidateTag } from "next/cache"

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

export async function uploadFileAction(formData: FormData) {
  const file = formData.get("file") as File | null

  if (!file) {
    return {
      success: false,
      error: "Aucun fichier fourni",
    }
  }

  // Validation avec Zod
  const validation = uploadSchema.safeParse({ file })
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.message,
    }
  }

  // Simule un upload (dans un vrai projet, uploader vers S3, Cloudinary, etc.)
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Revalidation du cache
  revalidateTag("uploads", "default")

  return {
    success: true,
    data: {
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    },
  }
}

// Action pour upload multiple
export async function uploadMultipleFilesAction(formData: FormData) {
  const files = formData.getAll("files") as File[]

  if (files.length === 0) {
    return {
      success: false,
      error: "Aucun fichier fourni",
    }
  }

  // Validation de chaque fichier
  const results = await Promise.all(
    files.map(async (file) => {
      const validation = uploadSchema.safeParse({ file })
      if (!validation.success) {
        return {
          success: false,
          error: validation.error.message,
          name: file.name,
        }
      }

      // Simule l'upload
      await new Promise((resolve) => setTimeout(resolve, 500))

      return {
        success: true,
        data: {
          name: file.name,
          size: file.size,
          type: file.type,
        },
      }
    })
  )

  revalidateTag("uploads", "default")

  return {
    success: true,
    results,
  }
}

