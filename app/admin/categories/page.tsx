import { getCategories } from "@/actions/category/get-categories"
import AdminCategoriesClient from "@/app/admin/categories/client-page"

export default async function AdminCategoriesPage() {
  const categories = await getCategories()
  return <AdminCategoriesClient categories={categories} />
}
