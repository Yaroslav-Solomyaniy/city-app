import { Suspense } from "react"

export const dynamic = "force-dynamic"
import { notFound } from "next/navigation"
import { getCategoryBySlug, getCategoryBySlugFull } from "@/actions/category/get-category-by-slug"
import CategoryPageClient from "@/app/categories/[slug]/client-page"

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ q?: string; view?: string }>
}) {
  const { slug } = await params
  const { q } = await searchParams

  const [category, allCategory] = await Promise.all([getCategoryBySlug(slug, q), getCategoryBySlugFull(slug)])

  if (!category || !allCategory) notFound()

  return <Suspense><CategoryPageClient category={category} allCategory={allCategory} /></Suspense>
}
