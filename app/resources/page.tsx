import { Suspense } from "react"
import { getResources, getRecentResources } from "@/actions/resource/get-resources"
import { getCategories } from "@/actions/category/get-categories"
import { getResourcesCount } from "@/actions/resource/get-resources-count"
import ResourcesClient from "@/app/resources/client-page"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "СітіЧЕ — список доступних ресурсів",
  description: "Офіційний довідник ресурсів Черкаської громади",
}

interface Props {
  searchParams: Promise<{ q?: string; cat?: string; view?: string }>
}

export default async function ResourcesPage({ searchParams }: Props) {
  const { q, cat } = await searchParams

  const [resources, recentResources, totalCount, categories] = await Promise.all([
    getResources({ q, categorySlug: cat }),
    getRecentResources(8),
    getResourcesCount(),
    getCategories(),
  ])

  return <Suspense><ResourcesClient resources={resources} recentResources={recentResources} totalCount={totalCount} categories={categories} /></Suspense>
}
