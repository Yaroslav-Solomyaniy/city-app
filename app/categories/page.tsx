import { Suspense } from "react"
import { Metadata } from "next"
import { getCategories } from "@/actions/category/get-categories"
import CategoriesClient from "@/app/categories/client-page"
import { getResourcesCount } from "@/actions/resource/get-resources-count"
import { ogImageUrl } from "@/lib/site"

export const metadata: Metadata = {
  title: "Категорії послуг",
  description: "Усі категорії міських послуг Черкас: комунальні служби, медицина, освіта, транспорт, соціальний захист та інші онлайн-ресурси громади.",
  openGraph: {
    title: "Категорії послуг | СітіЧЕ",
    description: "Усі категорії міських послуг Черкас в одному місці.",
    url: "/categories",
    images: [{ url: ogImageUrl, width: 1200, height: 630 }],
  },
}

export default async function CategoriesPage() {
  const categories = await getCategories()
  const resourcesCount = await getResourcesCount()
  return (
    <Suspense>
      <CategoriesClient categories={categories} resourcesCount={resourcesCount} />
    </Suspense>
  )
}
