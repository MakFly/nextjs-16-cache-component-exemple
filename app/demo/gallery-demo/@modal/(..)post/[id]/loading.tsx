import { Modal } from "@/components/modal"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function PostModalLoading() {
  return (
    <Modal>
      <div className="max-w-2xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <Skeleton className="h-5 w-16 rounded-full mb-2" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32 mt-1" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>

        {/* Content Skeleton */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-2/3 mt-2" />
          </CardContent>
        </Card>

        {/* Comments Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-20 mt-1" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-4 w-full ml-8" />
                  <Skeleton className="h-4 w-2/3 ml-8 mt-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Modal>
  )
}
