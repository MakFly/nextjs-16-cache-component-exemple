import { connection } from "next/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { delay } from "@/lib/api"

// DYNAMIC COMPONENT - Streams at request time
export async function UserTodos() {
  await connection() // Defer to request time

  // Simulate API delay (2500ms)
  await delay(2500)

  const res = await fetch("https://jsonplaceholder.typicode.com/todos")
  const todos = await res.json()

  const completed = todos.filter((t: { completed: boolean }) => t.completed).length
  const pending = todos.filter((t: { completed: boolean }) => !t.completed).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Todo Summary</CardTitle>
            <CardDescription>
              {completed} completed / {pending} pending
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            dynamic
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {todos.slice(0, 6).map((todo: { id: number; title: string; completed: boolean }) => (
            <div key={todo.id} className="flex items-center gap-3">
              <div
                className={`h-4 w-4 rounded-full shrink-0 ${
                  todo.completed ? "bg-green-500" : "bg-orange-400"
                }`}
              />
              <p className={`text-sm truncate ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                {todo.title}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function UserTodosSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-4 w-36 mt-1" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded-full shrink-0" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
