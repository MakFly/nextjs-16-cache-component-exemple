import Link from "next/link"
import { UserStatsSkeleton } from "@/components/users/user-stats"
import { UserListSkeleton } from "@/components/users/user-list"
import { UserTodosSkeleton } from "@/components/users/user-todos"
import { UserAlbumsSkeleton } from "@/components/users/user-albums"
import { Button } from "@/components/ui/button"

export default function UsersLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">Back</Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-1">
            4 components loading independently - watch them stream in!
          </p>
        </header>

        {/* Stats Skeleton */}
        <section className="mb-6">
          <UserStatsSkeleton />
        </section>

        {/* Main Grid Skeletons */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <UserListSkeleton />
          </div>
          <div className="space-y-6">
            <UserTodosSkeleton />
            <UserAlbumsSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}
