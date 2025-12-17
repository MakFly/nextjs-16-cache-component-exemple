import { cacheLife, cacheTag } from "next/cache"

// Utility to add artificial delay for demonstrating streaming
export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Types
export type Post = {
  id: number
  title: string
  body: string
  userId: number
}

export type Comment = {
  id: number
  postId: number
  name: string
  email: string
  body: string
}

export type User = {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
  }
  address: {
    city: string
    street: string
  }
}

export type Todo = {
  id: number
  userId: number
  title: string
  completed: boolean
}

export type Album = {
  id: number
  userId: number
  title: string
}

// Cached API functions using "use cache"

export async function getPosts(delayMs = 0): Promise<Post[]> {
  "use cache"
  cacheLife("minutes")
  cacheTag("posts")

  await delay(delayMs)
  const res = await fetch("https://jsonplaceholder.typicode.com/posts")
  return res.json()
}

export async function getComments(delayMs = 0): Promise<Comment[]> {
  "use cache"
  cacheLife("minutes")
  cacheTag("comments")

  await delay(delayMs)
  const res = await fetch("https://jsonplaceholder.typicode.com/comments")
  return res.json()
}

export async function getUsers(delayMs = 0): Promise<User[]> {
  "use cache"
  cacheLife("minutes")
  cacheTag("users")

  await delay(delayMs)
  const res = await fetch("https://jsonplaceholder.typicode.com/users")
  return res.json()
}

export async function getTodos(delayMs = 0): Promise<Todo[]> {
  "use cache"
  cacheLife("minutes")
  cacheTag("todos")

  await delay(delayMs)
  const res = await fetch("https://jsonplaceholder.typicode.com/todos")
  return res.json()
}

export async function getAlbums(delayMs = 0): Promise<Album[]> {
  "use cache"
  cacheLife("minutes")
  cacheTag("albums")

  await delay(delayMs)
  const res = await fetch("https://jsonplaceholder.typicode.com/albums")
  return res.json()
}
