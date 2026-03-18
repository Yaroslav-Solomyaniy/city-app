// app/admin/feedback/page.tsx
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { ROUTES } from "@/constants/routes"
import { getFeedback } from "@/actions/feedback/feedback"
import FeedbackClient from "@/app/admin/feedback/page-client"
import { Suspense } from "react"

export default async function FeedbackPage() {
  const items = await getFeedback()

  return (
    <div className="mx-auto max-w-300 space-y-6">
      <div>
        <Breadcrumb items={[ROUTES.ADMIN.ROOT, ROUTES.ADMIN.FEEDBACK]} />
        <h1 className="text-[32px] font-bold tracking-tight text-foreground">Зворотній зв'язок</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {items.length} звернень · {items.filter((i) => i.status === "new").length} нових
        </p>
      </div>
      <Suspense>
        <FeedbackClient initialItems={items} />
      </Suspense>
    </div>
  )
}
