import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getCategoryBySlug, getCategoryBySlugFull } from "@/actions/category/get-category-by-slug"
import CategoryPageClient from "@/app/categories/[slug]/client-page"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlugFull(slug)
  if (!category) return {}

  const title = category.titleEn ? `${category.title} — ${category.titleEn}` : category.title
  const description = category.description
    ?? `Онлайн-ресурси та послуги категорії «${category.title}» Черкаської громади.`

  return {
    title,
    description,
    openGraph: {
      title: `${title} | СітіЧЕ`,
      description,
      url: `/categories/${slug}`,
    },
  }
}

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
