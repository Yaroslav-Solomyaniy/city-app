import { Skeleton } from "@/components/ui/skeleton"

export default function AdminAdministratorsLoading() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>
      <Skeleton className="h-[380px] rounded-2xl" />
      <Skeleton className="h-[280px] rounded-2xl" />
    </div>
  )
}
