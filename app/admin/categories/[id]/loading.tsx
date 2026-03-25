import { Skeleton } from "@/components/ui/skeleton"

export default function AdminCategoryDetailLoading() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div className="space-y-1">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-8 w-80" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
