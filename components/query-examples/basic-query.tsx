"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertCircle } from "lucide-react"
import { queryKeys, fetchUsers } from "@/lib/queries"
import type { User } from "@/lib/api"

export function BasicQueryExample() {
  const {
    data: users,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: fetchUsers,
    staleTime: 30 * 1000, // 30 seconds
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Basic Query
              {isFetching && !isLoading && (
                <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </CardTitle>
            <CardDescription>
              useQuery with staleTime, refetch, loading states
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Client-side
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
            Refetch
          </Button>
          {dataUpdatedAt && (
            <span className="text-xs text-muted-foreground font-mono">
              Updated: {new Date(dataUpdatedAt).toLocaleTimeString()}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48 mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error.message}</span>
          </div>
        ) : (
          <div className="space-y-3">
            {users?.slice(0, 5).map((user: User) => (
              <div key={user.id} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                  {user.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Code example */}
        <div className="mt-4 pt-4 border-t">
          <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
{`const { data, isLoading, refetch } = useQuery({
  queryKey: ['users', 'list'],
  queryFn: fetchUsers,
  staleTime: 30 * 1000,
})`}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}
