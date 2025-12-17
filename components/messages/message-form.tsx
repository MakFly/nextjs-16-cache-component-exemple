"use client"

import { useRef, useOptimistic, useTransition, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Send, Loader2, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react"
import { useToast } from "@/components/toast"
import { addMessage, deleteMessage, type Message, type ActionResult } from "@/lib/actions"

interface MessageFormProps {
  initialMessages: Message[]
}

// Extended message for optimistic UI
type OptimisticMessage = Message & { failed?: boolean }

type OptimisticAction =
  | { type: "add"; message: OptimisticMessage }
  | { type: "delete"; id: string }
  | { type: "sync"; messages: Message[] }
  | { type: "fail"; id: string }
  | { type: "retry"; id: string }
  | { type: "remove"; id: string }

export function MessageForm({ initialMessages }: MessageFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const { addToast } = useToast()
  const [isPending, startTransition] = useTransition()

  // Track previous initialMessages to detect server updates
  const prevInitialMessagesRef = useRef<string>("")

  const [optimisticMessages, addOptimisticMessage] = useOptimistic<OptimisticMessage[], OptimisticAction>(
    initialMessages,
    (state, action) => {
      switch (action.type) {
        case "add":
          return [action.message, ...state]
        case "delete":
          return state.filter((m) => m.id !== action.id)
        case "sync":
          // Merge server data with pending/failed optimistic messages
          const pendingMessages = state.filter((m) => m.pending || m.failed)
          const serverIds = new Set(action.messages.map((m) => m.id))
          // Keep pending/failed messages that aren't yet on the server
          const newPending = pendingMessages.filter((m) => !serverIds.has(m.id) && m.id.startsWith("temp-"))
          return [...newPending, ...action.messages]
        case "fail":
          // Mark a message as failed
          return state.map((m) =>
            m.id === action.id ? { ...m, pending: false, failed: true } : m
          )
        case "retry":
          // Mark a failed message as pending again
          return state.map((m) =>
            m.id === action.id ? { ...m, pending: true, failed: false } : m
          )
        case "remove":
          // Remove a failed message
          return state.filter((m) => m.id !== action.id)
        default:
          return state
      }
    }
  )

  // Sync when initialMessages change (e.g., after revalidation with Activity)
  useEffect(() => {
    const currentKey = JSON.stringify(initialMessages.map((m) => m.id))
    if (prevInitialMessagesRef.current && prevInitialMessagesRef.current !== currentKey) {
      // Server data changed, sync it
      startTransition(() => {
        addOptimisticMessage({ type: "sync", messages: initialMessages })
      })
    }
    prevInitialMessagesRef.current = currentKey
  }, [initialMessages, addOptimisticMessage])

  // Store pending message text for retry
  const pendingTextsRef = useRef<Map<string, string>>(new Map())

  async function handleSubmit(formData: FormData) {
    const text = formData.get("text") as string
    if (!text?.trim()) return

    // Create optimistic message
    const tempId = `temp-${Date.now()}`
    const optimisticMessage: OptimisticMessage = {
      id: tempId,
      text: text.trim(),
      author: "You",
      createdAt: new Date().toISOString(),
      pending: true,
    }

    // Store text for potential retry
    pendingTextsRef.current.set(tempId, text.trim())

    startTransition(async () => {
      // Add optimistic message immediately
      addOptimisticMessage({ type: "add", message: optimisticMessage })
      formRef.current?.reset()

      // Call server action
      const result: ActionResult = await addMessage(formData)

      if (result.success) {
        addToast({ type: "success", title: result.message })
        pendingTextsRef.current.delete(tempId)
      } else {
        // Mark as failed instead of removing
        addOptimisticMessage({ type: "fail", id: tempId })
        addToast({ type: "error", title: "Failed to send", description: result.message })
      }
    })
  }

  async function handleRetry(id: string) {
    const text = pendingTextsRef.current.get(id)
    if (!text) return

    startTransition(async () => {
      addOptimisticMessage({ type: "retry", id })

      const formData = new FormData()
      formData.set("text", text)
      formData.set("author", "You")

      const result = await addMessage(formData)

      if (result.success) {
        addToast({ type: "success", title: "Message sent!" })
        pendingTextsRef.current.delete(id)
        // Remove the temp message (server will send the real one via revalidation)
        addOptimisticMessage({ type: "remove", id })
      } else {
        addOptimisticMessage({ type: "fail", id })
        addToast({ type: "error", title: "Still failing", description: result.message })
      }
    })
  }

  function handleDismiss(id: string) {
    pendingTextsRef.current.delete(id)
    startTransition(() => {
      addOptimisticMessage({ type: "remove", id })
    })
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      addOptimisticMessage({ type: "delete", id })

      const result = await deleteMessage(id)

      if (result.success) {
        addToast({ type: "success", title: result.message })
      } else {
        addToast({ type: "error", title: "Error", description: result.message })
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>New Message</CardTitle>
              <CardDescription>
                Uses useOptimistic for instant feedback
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              useOptimistic
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={handleSubmit} className="flex gap-2">
            <input type="hidden" name="author" value="You" />
            <Input
              name="text"
              placeholder="Type a message..."
              maxLength={280}
              required
              disabled={isPending}
              className="flex-1"
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="ml-2 hidden sm:inline">Send</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Messages List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Messages ({optimisticMessages.length})</CardTitle>
              <CardDescription className="font-mono">
                {new Date().toLocaleTimeString()}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Server Actions
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {optimisticMessages.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No messages yet. Send one above!
            </p>
          ) : (
            <div className="space-y-3">
              {optimisticMessages.map((message) => {
                const isFailed = (message as OptimisticMessage).failed
                const isPendingMsg = message.pending

                return (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-300 ${
                      isFailed
                        ? "bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-800"
                        : isPendingMsg
                        ? "bg-purple-50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800 border-dashed animate-pulse"
                        : "bg-background border-border"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium shrink-0 ${
                        isFailed
                          ? "bg-red-500 text-white"
                          : isPendingMsg
                          ? "bg-purple-500 text-white"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {isFailed ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : isPendingMsg ? (
                        <Sparkles className="h-4 w-4" />
                      ) : (
                        message.author.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{message.author}</span>
                        {isPendingMsg && !isFailed && (
                          <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            Sending...
                          </Badge>
                        )}
                        {isFailed && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Failed
                          </Badge>
                        )}
                        {!isPendingMsg && !isFailed && message.id.startsWith("temp-") === false && (
                          <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Sent
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className={`text-sm mt-1 ${isFailed ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}>
                        {message.text}
                      </p>
                      {/* Retry/Dismiss buttons for failed messages */}
                      {isFailed && (
                        <div className="flex gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRetry(message.id)}
                            disabled={isPending}
                            className="text-xs h-7"
                          >
                            <Loader2 className={`h-3 w-3 mr-1 ${isPending ? "animate-spin" : "hidden"}`} />
                            Retry
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDismiss(message.id)}
                            disabled={isPending}
                            className="text-xs h-7 text-muted-foreground"
                          >
                            Dismiss
                          </Button>
                        </div>
                      )}
                    </div>
                    {!isPendingMsg && !isFailed && message.id !== "1" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(message.id)}
                        disabled={isPending}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
