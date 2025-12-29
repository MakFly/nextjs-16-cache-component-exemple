"use server"

import { revalidateTag } from "next/cache"

// Action result type for toast notifications
export type ActionResult = {
  success: boolean
  message: string
  data?: unknown
}

export async function revalidatePosts() {
  revalidateTag("posts", "default")
  revalidateTag("post-list", "default")
}

export async function revalidateUsers() {
  revalidateTag("users", "default")
  revalidateTag("user-list", "default")
}

export async function revalidateAll() {
  revalidateTag("posts", "default")
  revalidateTag("post-list", "default")
  revalidateTag("comments", "default")
  revalidateTag("users", "default")
  revalidateTag("user-list", "default")
  revalidateTag("todos", "default")
  revalidateTag("albums", "default")
}

// Simulated message type
export type Message = {
  id: string
  text: string
  author: string
  createdAt: string
  pending?: boolean
}

// In-memory store for demo (would be a database in real app)
let messages: Message[] = [
  { id: "1", text: "Welcome to the demo!", author: "System", createdAt: new Date().toISOString() },
]

export async function getMessages(): Promise<Message[]> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 500))
  return [...messages]
}

export async function addMessage(formData: FormData): Promise<ActionResult> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 1000))

  const text = formData.get("text") as string
  const author = formData.get("author") as string || "Anonymous"

  if (!text || text.trim().length === 0) {
    return { success: false, message: "Message cannot be empty" }
  }

  if (text.length > 280) {
    return { success: false, message: "Message too long (max 280 chars)" }
  }

  // Simulate random failure (10% chance)
  if (Math.random() < 0.1) {
    return { success: false, message: "Server error - please try again" }
  }

  const newMessage: Message = {
    id: Math.random().toString(36).slice(2),
    text: text.trim(),
    author,
    createdAt: new Date().toISOString(),
  }

  messages = [newMessage, ...messages]
  revalidateTag("messages", "default")

  return { success: true, message: "Message sent!", data: newMessage }
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  await new Promise((r) => setTimeout(r, 500))

  const index = messages.findIndex((m) => m.id === id)
  if (index === -1) {
    return { success: false, message: "Message not found" }
  }

  messages = messages.filter((m) => m.id !== id)
  revalidateTag("messages", "default")

  return { success: true, message: "Message deleted" }
}

export async function likePost(postId: number): Promise<ActionResult> {
  await new Promise((r) => setTimeout(r, 800))

  // Simulate random failure
  if (Math.random() < 0.15) {
    return { success: false, message: "Failed to like post" }
  }

  return { success: true, message: `Liked post #${postId}` }
}

export async function revalidateTagAction(tag: string, profile: "default" | "max" = "default") {
  revalidateTag(tag, profile)
}
