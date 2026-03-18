"use server"
import { notFound } from "next/navigation"
import { getCategoryBySlug } from "@/actions/category/get-category-by-slug"
import CategoryPageClient from "@/app/categories/[slug]/client-page"

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sub?: string; q?: string; view?: string }>
}) {
  const { slug } = await params
  const { sub, q, view } = await searchParams

  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  return (
    <CategoryPageClient
      category={category}
      initialSub={sub ?? null}
      initialSearch={q ?? ""}
      initialView={(view as "grid" | "list" | "table") ?? undefined}
    />
  )
}
