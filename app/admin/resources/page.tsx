import { Suspense } from "react"
import { getResources } from "@/actions/resource/get-resources"
import { getCategoriesWithSubs } from "@/actions/category/get-category-with-subs"
import AdminResourcesClient from "@/app/admin/resources/client-page"

export default async function AdminResourcesPage() {
  const [resources, categories] = await Promise.all([getResources(), getCategoriesWithSubs()])

  return (
    <Suspense>
      <AdminResourcesClient resources={resources} categories={categories} />
    </Suspense>
  )
}
