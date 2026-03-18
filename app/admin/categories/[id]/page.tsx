import { notFound } from "next/navigation"
import { getCategoryById } from "@/actions/category/get-category-by-id"
import CategoryDetailClient from "@/app/admin/categories/[id]/client-page"

export default async function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await getCategoryById(id)
  if (!category) notFound()
  return <CategoryDetailClient category={category} />
}
