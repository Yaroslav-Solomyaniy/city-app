import { requireAuth } from "@/lib/require-auth"
import { getAdministrators } from "@/actions/administrators/get-administators"
import AdministratorsClientPage from "@/app/admin/administrators/client-page"

export default async function AdministratorsPage() {
  const { admins, invites } = await getAdministrators()
  const user = await requireAuth()
  return <AdministratorsClientPage currentUserId={user.id} admins={admins} invites={invites} />
}
