import { getCategories } from "@/actions/category/get-categories"
import CategoriesClient from "@/app/categories/client-page"


export default async function CategoriesPage() {
  const categories = await getCategories()
  return <CategoriesClient categories={categories} />
}
