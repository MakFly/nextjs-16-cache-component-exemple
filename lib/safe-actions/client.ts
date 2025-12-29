import { createSafeActionClient } from "next-safe-action"
import { z } from "zod"

// Middleware pour logger les actions
const loggerMiddleware = async (data: { actionName: string; input: unknown }) => {
  console.log(`[Action] ${data.actionName}`, data.input)
}

// Middleware pour vérifier l'authentification (exemple)
const authMiddleware = async () => {
  // Dans un vrai projet, vérifier les cookies/session ici
  // const session = await getSession()
  // if (!session) throw new Error("Unauthorized")
  return {}
}

// Création du client avec middleware
export const actionClient = createSafeActionClient({
  // Middleware exécuté avant chaque action
  middleware: [loggerMiddleware, authMiddleware],
  // Schema par défaut pour les erreurs
  handleServerError(e) {
    console.error("Server error:", e)
    return {
      serverError: e instanceof Error ? e.message : "Une erreur est survenue",
    }
  },
})

