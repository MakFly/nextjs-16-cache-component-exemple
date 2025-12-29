"use server"

import { z } from "zod"
import { actionClient } from "./client"
import { revalidateTag } from "next/cache"

// Schema d'input pour créer un post
const createPostSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  body: z.string().min(10, "Le contenu doit contenir au moins 10 caractères"),
  userId: z.number().int().positive(),
})

// Schema d'output
const postOutputSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  userId: z.number(),
  createdAt: z.string(),
})

// Action type-safe avec Zod
export const createPostAction = actionClient
  .schema(createPostSchema)
  .action(async ({ parsedInput: { title, body, userId } }) => {
    // Simule une création de post
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newPost = {
      id: Math.floor(Math.random() * 1000),
      title,
      body,
      userId,
      createdAt: new Date().toISOString(),
    }

    // Revalidation du cache
    revalidateTag("posts", "default")

    return newPost
  })

// Action avec validation de mot de passe
const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mot de passe actuel requis"),
    newPassword: z.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

export const updatePasswordAction = actionClient
  .schema(updatePasswordSchema)
  .action(async ({ parsedInput: { currentPassword, newPassword } }) => {
    // Simule une vérification du mot de passe actuel
    if (currentPassword !== "password123") {
      throw new Error("Mot de passe actuel incorrect")
    }

    // Simule la mise à jour
    await new Promise((resolve) => setTimeout(resolve, 800))

    return {
      success: true,
      message: "Mot de passe mis à jour avec succès",
    }
  })

// Action pour obtenir des données (sans input)
export const getStatsAction = actionClient.action(async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    totalPosts: 42,
    totalUsers: 10,
    totalComments: 156,
  }
})

