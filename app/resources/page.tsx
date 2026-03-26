import { Suspense } from "react"
import { getResources, getRecentResources } from "@/actions/resource/get-resources"
import { getCategories } from "@/actions/category/get-categories"
import { getResourcesCount } from "@/actions/resource/get-resources-count"
import ResourcesClient from "@/app/resources/client-page"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Перелік ресурсів",
  description: "Повний перелік онлайн-ресурсів Черкаської громади: електронні послуги, портали, довідники та інструменти для вирішення побутових питань.",
  openGraph: {
    title: "Перелік ресурсів | СітіЧЕ",
    description: "Повний перелік онлайн-ресурсів Черкаської громади.",
    url: "/resources",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
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
