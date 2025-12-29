"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react"
import { createPostAction, type CreatePostState } from "@/lib/actions"

// Submit button component - must be separate to use useFormStatus
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="min-w-[100px]">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <Send className="h-4 w-4 mr-2" />
          Submit
        </>
      )}
    </Button>
  )
}

export function React19Form() {
  const [state, formAction, pending] = useActionState<CreatePostState, FormData>(
    createPostAction,
    { success: false, message: "" }
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>React 19 Form (useActionState + useFormStatus)</CardTitle>
            <CardDescription>
              Next.js 16 + React 19 form handling with built-in state management
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              useActionState
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              useFormStatus
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Post Title
            </label>
            <Input
              id="title"
              name="title"
              placeholder="Enter post title..."
              required
              disabled={pending}
              className={state.errors?.title ? "border-red-500" : ""}
            />
            {state.errors?.title && (
              <p className="text-sm text-red-600 dark:text-red-400">{state.errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="body" className="text-sm font-medium">
              Post Body
            </label>
            <textarea
              id="body"
              name="body"
              placeholder="Enter post content..."
              required
              disabled={pending}
              rows={4}
              className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                state.errors?.body ? "border-red-500" : ""
              }`}
            />
            {state.errors?.body && (
              <p className="text-sm text-red-600 dark:text-red-400">{state.errors.body}</p>
            )}
          </div>

          {/* Success/Error Messages */}
          {state.success && state.message && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800 dark:text-green-200">Success</AlertTitle>
              <AlertDescription className="text-green-800 dark:text-green-200">
                {state.message}
              </AlertDescription>
            </Alert>
          )}

          {!state.success && state.message && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button - Separate component for useFormStatus */}
          <SubmitButton />
        </form>

        {/* Code Example */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm font-medium mb-2">How it works:</p>
          <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
{`// 1. useActionState manages form state
const [state, formAction, pending] = useActionState(
  createPostAction,
  { success: false, message: "" }
)

// 2. useFormStatus tracks submission (must be in child component)
function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>Submit</button>
}

// 3. Server Action uses updateTag for immediate cache refresh
export async function createPostAction(prevState, formData) {
  // ... create post
  updateTag('posts') // Immediate refresh
  return { success: true, message: 'Post created!' }
}`}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}

