import { Skeleton } from "@/components/ui/skeleton"

export default function CategoriesLoading() {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 pt-10 pb-4 sm:px-6">
        <Skeleton className="mb-2 h-12 w-72" />
        <Skeleton className="h-5 w-[480px] max-w-full" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-3 sm:px-6 lg:hidden">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="mt-2 h-9 w-full" />
      </div>

      <div className="mx-auto flex max-w-7xl items-start gap-6 px-4 pb-16 sm:px-6">
        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-2xl" />
            ))}
          </div>
        </div>

        <aside className="hidden w-75 shrink-0 flex-col gap-4 lg:flex xl:w-[320px]">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-44 rounded-xl" />
        </aside>
      </div>
    </div>
  )
}
