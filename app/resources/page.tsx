import { getResources } from "@/actions/resource/get-resources"
import { getCategories } from "@/actions/category/get-categories"
import ResourcesClient from "@/app/resources/client-page"


export default async function ResourcesPage() {
  const [resources, categories] = await Promise.all([getResources(), getCategories()])
  return <ResourcesClient resources={resources} categories={categories} />
}
