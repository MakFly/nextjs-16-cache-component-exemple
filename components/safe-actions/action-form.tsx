"use client"

import { useState } from "react"
import { useAction } from "next-safe-action/hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  createPostAction,
  updatePasswordAction,
  getStatsAction,
} from "@/lib/safe-actions/actions"
import { CheckCircle2, Loader2, AlertCircle, Database } from "lucide-react"

export function SafeActionForm() {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")

  // useAction hook avec optimistic UI
  const { execute: createPost, result, status, reset } = useAction(createPostAction, {
    onSuccess: ({ data }) => {
      console.log("Post créé:", data)
      setTitle("")
      setBody("")
    },
    onError: ({ error }) => {
      console.error("Erreur:", error)
    },
  })

  const {
    execute: updatePassword,
    result: passwordResult,
    status: passwordStatus,
  } = useAction(updatePasswordAction)

  const {
    execute: getStats,
    result: statsResult,
    status: statsStatus,
  } = useAction(getStatsAction)

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <Card>
        <CardHeader>
          <CardTitle>Créer un Post</CardTitle>
          <CardDescription>Action type-safe avec validation Zod</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Titre
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre du post..."
              disabled={status === "executing"}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="body" className="text-sm font-medium">
              Contenu
            </label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Contenu du post..."
              rows={4}
              disabled={status === "executing"}
            />
          </div>

          {result?.serverError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{result.serverError}</AlertDescription>
            </Alert>
          )}

          {result?.validationErrors && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {Object.entries(result.validationErrors).map(([field, errors]) => (
                    <li key={field}>
                      {field}: {errors?.[0]}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {result?.data && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Post créé avec succès ! ID: {result.data.id}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() =>
                createPost({
                  title,
                  body,
                  userId: 1,
                })
              }
              disabled={status === "executing"}
            >
              {status === "executing" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer"
              )}
            </Button>
            {result && (
              <Button variant="outline" onClick={reset}>
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Update Password */}
      <Card>
        <CardHeader>
          <CardTitle>Mettre à jour le mot de passe</CardTitle>
          <CardDescription>Validation avec refine (confirm password)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PasswordForm
            execute={updatePassword}
            result={passwordResult}
            status={passwordStatus}
          />
        </CardContent>
      </Card>

      {/* Get Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Statistiques
          </CardTitle>
          <CardDescription>Action sans input</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => getStats()}
            disabled={statsStatus === "executing"}
            variant="outline"
          >
            {statsStatus === "executing" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Chargement...
              </>
            ) : (
              "Récupérer les stats"
            )}
          </Button>

          {statsResult?.data && (
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <p className="text-2xl font-bold">{statsResult.data.totalPosts}</p>
                <p className="text-sm text-muted-foreground">Posts</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-2xl font-bold">{statsResult.data.totalUsers}</p>
                <p className="text-sm text-muted-foreground">Users</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-2xl font-bold">{statsResult.data.totalComments}</p>
                <p className="text-sm text-muted-foreground">Comments</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Code Example */}
      <Card>
        <CardHeader>
          <CardTitle>Comment ça marche</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
{`// 1. Créer le client avec middleware
const actionClient = createSafeActionClient({
  middleware: [loggerMiddleware, authMiddleware],
})

// 2. Définir l'action avec schemas Zod
export const createPostAction = actionClient
  .schema(createPostSchema)
  .action(async ({ parsedInput }) => {
    // parsedInput est type-safe !
    return { id: 1, ...parsedInput }
  })

// 3. Utiliser dans un composant
const { execute, result, status } = useAction(createPostAction)
execute({ title: "Hello", body: "World" })

// result contient: data, serverError, validationErrors`}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}

function PasswordForm({ execute, result, status }: any) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  return (
    <>
      <div className="space-y-2">
        <label htmlFor="current" className="text-sm font-medium">
          Mot de passe actuel
        </label>
        <Input
          id="current"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="password123"
          disabled={status === "executing"}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="new" className="text-sm font-medium">
          Nouveau mot de passe
        </label>
        <Input
          id="new"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={status === "executing"}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirm" className="text-sm font-medium">
          Confirmer
        </label>
        <Input
          id="confirm"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={status === "executing"}
        />
      </div>

      {result?.validationErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {Object.entries(result.validationErrors).map(([field, errors]) => (
              <div key={field}>
                {field}: {errors?.[0]}
              </div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {result?.serverError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{result.serverError}</AlertDescription>
        </Alert>
      )}

      {result?.data && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            {result.data.message}
          </AlertDescription>
        </Alert>
      )}

      <Button
        onClick={() =>
          execute({
            currentPassword,
            newPassword,
            confirmPassword,
          })
        }
        disabled={status === "executing"}
      >
        {status === "executing" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Mise à jour...
          </>
        ) : (
          "Mettre à jour"
        )}
      </Button>
    </>
  )
}

