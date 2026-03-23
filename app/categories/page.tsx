import { getCategories } from "@/actions/category/get-categories"
import CategoriesClient from "@/app/categories/client-page"
import { getResourcesCount } from "@/actions/resource/get-resources-count"

export default async function CategoriesPage() {
  const categories = await getCategories()
  const resourcesCount = await getResourcesCount()
  return <CategoriesClient categories={categories} resourcesCount={resourcesCount} />
}
