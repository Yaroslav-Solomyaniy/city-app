import { Skeleton } from "@/components/ui/skeleton"

export default function AdminFeedbackLoading() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div className="space-y-1">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-36" />
      </div>
      <Skeleton className="h-[480px] rounded-2xl" />
    </div>
  )
}
