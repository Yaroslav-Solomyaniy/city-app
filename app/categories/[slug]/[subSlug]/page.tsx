"use server"

import { notFound } from "next/navigation"
import { getCategoryBySlug } from "@/actions/category/get-category-by-slug"
import SubCategoryPageClient from "./client-page"

export default async function SubCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; subSlug: string }>
  searchParams: Promise<{ q?: string; view?: string }>
}) {
  const { slug, subSlug } = await params
  const { q, view } = await searchParams

  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const subcategory = category.subcategories.find((s) => s.slug === subSlug)
  if (!subcategory) notFound()

  return (
    <SubCategoryPageClient
      category={category}
      subcategory={subcategory}
      initialSearch={q ?? ""}
      initialView={(view as "grid" | "list" | "table") ?? undefined}
    />
  )
}
