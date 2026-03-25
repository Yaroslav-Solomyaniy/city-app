import { Skeleton } from "@/components/ui/skeleton"

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-24 grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-14 w-full max-w-xs" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-96 max-w-full" />
          <Skeleton className="h-5 w-80 max-w-full" />
          <Skeleton className="mt-4 h-64 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
