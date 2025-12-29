import { Suspense } from "react"
import Link from "next/link"
import { UserStats, UserStatsSkeleton } from "@/components/users/user-stats"
import { UserList, UserListSkeleton } from "@/components/users/user-list"
import { UserTodos, UserTodosSkeleton } from "@/components/users/user-todos"
import { UserAlbums, UserAlbumsSkeleton } from "@/components/users/user-albums"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RevalidateButton } from "@/components/revalidate-button"
import { revalidateUsers } from "@/lib/actions"

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">Back</Link>
            </Button>
            <RevalidateButton action={revalidateUsers} label="Invalidate Cache" />
          </div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-1">
            Cache Components demo - Mix of cached and dynamic content
          </p>
          <div className="flex gap-2 mt-3">
            <Badge variant="outline" className="text-green-600 border-green-600">
              use cache = Static Shell
            </Badge>
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              dynamic = Streams at request
            </Badge>
          </div>
        </header>

        {/* Stats - CACHED (500ms) - Part of static shell */}
        <section className="mb-6">
          <Suspense fallback={<UserStatsSkeleton />}>
            <UserStats />
          </Suspense>
        </section>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - User List CACHED (1500ms) */}
          <div className="lg:col-span-2">
            <Suspense fallback={<UserListSkeleton />}>
              <UserList />
            </Suspense>
          </div>

          {/* Right Column - DYNAMIC components */}
          <div className="space-y-6">
            {/* Todos - DYNAMIC (2500ms) - Streams at request time */}
            <Suspense fallback={<UserTodosSkeleton />}>
              <UserTodos />
            </Suspense>

            {/* Albums - DYNAMIC (3500ms) - Streams at request time */}
            <Suspense fallback={<UserAlbumsSkeleton />}>
              <UserAlbums />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
