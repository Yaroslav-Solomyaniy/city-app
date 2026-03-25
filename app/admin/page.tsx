import { getCategories } from "@/actions/category/get-categories"
import { getResources } from "@/actions/resource/get-resources"
import { getLogs } from "@/actions/logs/get-logs"
import { getFeedback } from "@/actions/feedback/feedback"
import { getAdministrators } from "@/actions/administrators/get-administrators"
import AdminDashboardClient from "@/app/admin/client-page"

export default async function AdminDashboardPage() {
  const [categories, resources, { admins }, logs, feedback] = await Promise.all([
    getCategories(),
    getResources(),
    getAdministrators(),
    getLogs(),
    getFeedback(),
  ])

  return (
    <div className="min-h-screen overflow-auto bg-background">
      <AdminDashboardClient
        categories={categories}
        resources={resources}
        admins={admins}
        logs={logs.slice(0, 8)}
        feedback={feedback.slice(0, 5)}
      />
    </div>
  )
}
