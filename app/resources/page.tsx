import { getResources } from "@/actions/resource/get-resources"
import { getCategories } from "@/actions/category/get-categories"
import ResourcesClient from "@/app/resources/client-page"

interface Props {
  searchParams: Promise<{ q?: string; cat?: string; view?: string }>
}

export default async function ResourcesPage({ searchParams }: Props) {
  const { q, cat } = await searchParams

  const [resources, allResources, categories] = await Promise.all([
    getResources({ q, categorySlug: cat }),
    getResources(),
    getCategories(),
  ])

  return <ResourcesClient resources={resources} allResources={allResources} categories={categories} />
}
