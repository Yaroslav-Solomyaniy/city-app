import { Suspense } from "react"

export const dynamic = "force-dynamic"
import { notFound } from "next/navigation"
import { getCategoryBySlug, getCategoryBySlugFull } from "@/actions/category/get-category-by-slug"
import SubCategoryPageClient from "./client-page"

export default async function SubCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; subSlug: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { slug, subSlug } = await params
  const { q } = await searchParams

  const [category, allCategory] = await Promise.all([getCategoryBySlug(slug, q), getCategoryBySlugFull(slug)])

  if (!category || !allCategory) notFound()

  const subcategory = category.subcategories.find((s) => s.slug === subSlug)
  const allSubcategory = allCategory.subcategories.find((s) => s.slug === subSlug)

  if (!subcategory || !allSubcategory) notFound()

  return <Suspense><SubCategoryPageClient category={category} allCategory={allCategory} subcategory={subcategory} /></Suspense>
}
