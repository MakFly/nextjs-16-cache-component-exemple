"use client"

import { use, useState, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

// Fonction qui retourne une Promise
function fetchUserData(userId: number): Promise<{ id: number; name: string; email: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        name: `User ${userId}`,
        email: `user${userId}@example.com`,
      })
    }, 1500)
  })
}

// Composant qui utilise use() pour unwrap une Promise
function UserProfile({ userPromise }: { userPromise: Promise<{ id: number; name: string; email: string }> }) {
  // use() unwrap la Promise dans un Client Component
  const user = use(userPromise)

  return (
    <div className="p-4 border rounded-lg space-y-2">
      <Badge>ID: {user.id}</Badge>
      <h3 className="font-semibold">{user.name}</h3>
      <p className="text-sm text-muted-foreground">{user.email}</p>
    </div>
  )
}

export function PromiseUnwrapDemo() {
  const [userId, setUserId] = useState(1)
  const [userPromise, setUserPromise] = useState(() => fetchUserData(1))

  const loadUser = (id: number) => {
    setUserId(id)
    setUserPromise(fetchUserData(id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>use(promise) - Promise Unwrapping</CardTitle>
        <CardDescription>
          Unwrap des Promises dans des Client Components avec React 19
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => loadUser(1)} disabled={userId === 1}>
            User 1
          </Button>
          <Button variant="outline" onClick={() => loadUser(2)} disabled={userId === 2}>
            User 2
          </Button>
          <Button variant="outline" onClick={() => loadUser(3)} disabled={userId === 3}>
            User 3
          </Button>
        </div>

        <Suspense
          fallback={
            <div className="p-4 border rounded-lg flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Chargement...</span>
            </div>
          }
        >
          <UserProfile userPromise={userPromise} />
        </Suspense>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            <code>use()</code> permet d'unwrap des Promises dans des Client Components, similaire à{" "}
            <code>await</code> dans les Server Components.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

