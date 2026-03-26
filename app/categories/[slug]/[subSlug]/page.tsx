import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getCategoryBySlug, getCategoryBySlugFull } from "@/actions/category/get-category-by-slug"
import SubCategoryPageClient from "./client-page"
import { ogImageUrl } from "@/lib/site"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; subSlug: string }>
}): Promise<Metadata> {
  const { slug, subSlug } = await params
  const category = await getCategoryBySlugFull(slug)
  if (!category) return {}

  const sub = category.subcategories.find((s) => s.slug === subSlug)
  if (!sub) return {}

  const title = sub.titleEn ? `${sub.title} — ${sub.titleEn}` : sub.title
  const description = `Онлайн-ресурси підкатегорії «${sub.title}» категорії «${category.title}» Черкаської громади.`

  const ogImage = category.photo
    ? { url: category.photo, width: 1200, height: 630, alt: category.title }
    : { url: ogImageUrl, width: 1200, height: 630 }

  return {
    title,
    description,
    openGraph: {
      title: `${title} | СітіЧЕ`,
      description,
      url: `/categories/${slug}/${subSlug}`,
      images: [ogImage],
    },
  }
}

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
