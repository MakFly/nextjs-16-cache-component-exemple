"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Loader2 } from "lucide-react"

// Schema Zod avec validation complexe
const formSchema = z
  .object({
    email: z.string().email("Email invalide").min(1, "Email requis"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
      .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
    confirmPassword: z.string().min(1, "Confirmation requise"),
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(50),
    bio: z.string().max(500, "La bio ne peut pas dépasser 500 caractères").optional(),
    age: z.coerce
      .number({ invalid_type_error: "L'âge doit être un nombre" })
      .min(18, "Vous devez avoir au moins 18 ans")
      .max(120, "Âge invalide"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

type FormValues = z.infer<typeof formSchema>

export function RhfZodForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      bio: "",
      age: 18,
    },
    mode: "onChange", // Validation en temps réel
  })

  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitSuccess, setSubmitSuccess] = React.useState(false)

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    setSubmitSuccess(false)

    // Simule une requête serveur
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Validation serveur avec le même schema
    const serverValidation = formSchema.safeParse(data)
    if (!serverValidation.success) {
      // Si la validation serveur échoue, on set les erreurs
      serverValidation.error.errors.forEach((error) => {
        const field = error.path[0] as keyof FormValues
        form.setError(field as any, { message: error.message })
      })
      setIsSubmitting(false)
      return
    }

    console.log("Form submitted:", serverValidation.data)
    setSubmitSuccess(true)
    setIsSubmitting(false)
    form.reset()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>React Hook Form + Zod + shadcn</CardTitle>
            <CardDescription>
              Validation complète avec schéma Zod partagé client/serveur
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              RHF
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              Zod
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-600">
              shadcn
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="user@example.com" {...field} />
                  </FormControl>
                  <FormDescription>Votre adresse email</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormDescription>
                    Au moins 8 caractères, majuscule, minuscule, chiffre et caractère spécial
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Jean Dupont" {...field} />
                  </FormControl>
                  <FormDescription>2-50 caractères</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Parlez-nous de vous..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/500 caractères
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Age */}
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Âge</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="18"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : "")}
                    />
                  </FormControl>
                  <FormDescription>Vous devez avoir au moins 18 ans</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Success Message */}
            {submitSuccess && (
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Formulaire soumis avec succès !
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Soumettre"
              )}
            </Button>
          </form>
        </Form>

        {/* Code Example */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm font-medium mb-2">Comment ça marche :</p>
          <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
{`// 1. Schema Zod partagé client/serveur
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/),
  // ...
}).refine((data) => data.password === data.confirmPassword)

// 2. useForm avec zodResolver
const form = useForm({
  resolver: zodResolver(formSchema),
  mode: "onChange" // Validation temps réel
})

// 3. Validation serveur avec le même schema
const result = formSchema.safeParse(data)
if (!result.success) {
  // Set les erreurs sur le form
}`}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}

