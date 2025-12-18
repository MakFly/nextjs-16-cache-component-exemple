"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { queryKeys, fetchUser, fetchTodosByUser, type User } from "@/lib/queries"
import type { Todo } from "@/lib/api"

export function DependentQueryExample() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  // First query: Get user details
  const {
    data: user,
    isLoading: isLoadingUser,
  } = useQuery({
    queryKey: queryKeys.users.detail(selectedUserId!),
    queryFn: () => fetchUser(selectedUserId!),
    enabled: selectedUserId !== null, // Only run when user is selected
  })

  // Second query: Get user's todos (depends on first query)
  const {
    data: todos,
    isLoading: isLoadingTodos,
  } = useQuery({
    queryKey: queryKeys.todos.byUser(selectedUserId!),
    queryFn: () => fetchTodosByUser(selectedUserId!),
    enabled: selectedUserId !== null && !!user, // Only run when user is loaded
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Dependent Queries</CardTitle>
            <CardDescription>
              Query that depends on another query's result
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Client-side
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* User selection */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((id) => (
            <Button
              key={id}
              variant={selectedUserId === id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedUserId(id)}
            >
              User {id}
            </Button>
          ))}
          {selectedUserId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedUserId(null)}
            >
              Clear
            </Button>
          )}
        </div>

        {!selectedUserId ? (
          <p className="text-center py-8 text-muted-foreground">
            Select a user to load their data
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {/* User Card */}
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                User Details
                <Badge variant="secondary" className="text-xs">Query 1</Badge>
              </h4>
              {isLoadingUser ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              ) : user ? (
                <div className="text-sm">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-muted-foreground">{user.email}</p>
                  <p className="text-muted-foreground">{user.company.name}</p>
                </div>
              ) : null}
            </div>

            {/* Todos Card */}
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                Todos
                <Badge variant="secondary" className="text-xs">Query 2 (depends)</Badge>
              </h4>
              {isLoadingTodos || isLoadingUser ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              ) : todos ? (
                <div className="space-y-1 text-sm">
                  {todos.slice(0, 4).map((todo: Todo) => (
                    <div key={todo.id} className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${todo.completed ? "bg-green-500" : "bg-orange-400"}`} />
                      <span className={todo.completed ? "line-through text-muted-foreground" : ""}>
                        {todo.title.slice(0, 40)}...
                      </span>
                    </div>
                  ))}
                  {todos.length > 4 && (
                    <p className="text-muted-foreground text-xs">+{todos.length - 4} more</p>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Code example */}
        <div className="mt-4 pt-4 border-t">
          <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
{`// Query 1: User details
const { data: user } = useQuery({
  queryKey: ['users', 'detail', userId],
  queryFn: () => fetchUser(userId),
  enabled: userId !== null,
})

// Query 2: Depends on Query 1
const { data: todos } = useQuery({
  queryKey: ['todos', 'user', userId],
  queryFn: () => fetchTodosByUser(userId),
  enabled: userId !== null && !!user, // Wait for user
})`}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}
