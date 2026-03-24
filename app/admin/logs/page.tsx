import { Suspense } from "react"
import { getLogs, getLogUsers } from "@/actions/logs/get-logs"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { ROUTES } from "@/constants/routes"
import LogsClient from "@/app/admin/logs/logs-client"

interface Props {
  searchParams: Promise<{ action?: string; user?: string }>
}

export default async function LogsPage({ searchParams }: Props) {
  const { action, user } = await searchParams

  // Серверна фільтрація тільки по action і user (enum поля в БД)
  // Пошук по тексту — клієнтський, бо текст речень генерується на льоту
  const [logs, users] = await Promise.all([getLogs({ action, user }), getLogUsers()])

  return (
    <div className="mx-auto max-w-225 space-y-6">
      <div>
        <Breadcrumb items={[ROUTES.ADMIN.ROOT, ROUTES.ADMIN.LOGS]} />
        <h1 className="text-[32px] font-bold tracking-tight text-foreground">Логи дій</h1>
        <p className="mt-1 text-sm text-muted-foreground">{logs.length} записів · останні 500</p>
      </div>

      <Suspense><LogsClient logs={logs} users={users} activeAction={action} activeUser={user} /></Suspense>
    </div>
  )
}
