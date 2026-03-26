"use client"

import Link from "next/link"
import Image from "next/image"
import { FolderTree, Globe, Users, MessageSquare, ScrollText, ExternalLink } from "lucide-react"
import { ROUTES } from "@/constants/routes"
import type { CategoryWithCount, ResourceWithRelations } from "@/types/action"
import type { FeedbackEntry } from "@/actions/feedback/feedback"

interface Props {
  categories: CategoryWithCount[]
  resources: ResourceWithRelations[]
  admins: { id: string; name: string | null; email: string }[]
  logs: unknown[]
  feedback: FeedbackEntry[]
}

const LINKS = [
  {
    label: "Категорії",
    description: "Управління категоріями послуг",
    href: ROUTES.ADMIN.CATEGORIES.href,
    icon: FolderTree,
    accent: "#6366f1",
    tag: "01",
  },
  {
    label: "Ресурси",
    description: "Всі ресурси та посилання",
    href: ROUTES.ADMIN.RESOURCES.href,
    icon: Globe,
    accent: "#10b981",
    tag: "02",
  },
  {
    label: "Адміністратори",
    description: "Керування доступом",
    href: ROUTES.ADMIN.ADMINISTRATORS.href,
    icon: Users,
    accent: "#8b5cf6",
    tag: "03",
  },
  {
    label: "Зворотній зв'язок",
    description: "Звернення від користувачів",
    href: ROUTES.ADMIN.FEEDBACK.href,
    icon: MessageSquare,
    accent: "#f59e0b",
    tag: "04",
  },
  {
    label: "Логи дій",
    description: "Історія змін на порталі",
    href: ROUTES.ADMIN.LOGS.href,
    icon: ScrollText,
    accent: "#64748b",
    tag: "05",
  },
  {
    label: "Переглянути сайт",
    description: "Відкрити публічну частину",
    href: "/",
    icon: ExternalLink,
    accent: "#f43f5e",
    tag: "06",
  },
]

export default function AdminDashboardClient({ categories, resources, admins, feedback }: Props) {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6">

      {/* Header */}
      <div className="flex flex-col items-start gap-5 rounded-2xl border bg-card px-7 py-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">Адмін-панель</p>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">СітіЧЕ</h1>
        </div>
        <Image src="/1.png" width={200} height={64} alt="Черкаси" priority className="opacity-90" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border bg-border shadow-sm sm:grid-cols-2 lg:grid-cols-3">
        {LINKS.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              href={item.href}
              className="group relative flex flex-col gap-6 bg-card px-6 py-6 transition-colors duration-150 hover:bg-muted/40"
            >
              <div
                className="pointer-events-none absolute top-0 right-0 h-20 w-20 rounded-bl-[4rem] rounded-tr-2xl opacity-[0.07]"
                style={{ background: item.accent }}
              />
              <span className="text-[10px] font-bold tracking-widest text-muted-foreground/40">{item.tag}</span>
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-110"
                style={{ background: `${item.accent}18` }}
              >
                <Icon size={22} strokeWidth={1.6} style={{ color: item.accent }} />
              </div>
              <div>
                <p className="text-base font-bold text-foreground sm:text-[17px]">{item.label}</p>
                <p className="mt-0.5 text-[12.5px] text-muted-foreground">{item.description}</p>
              </div>
              <div
                className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"
                style={{ background: item.accent }}
              />
            </Link>
          )
        })}
      </div>

      <p className="text-center text-[11px] text-muted-foreground/40">
        © {new Date().getFullYear()} КП «Інститут розвитку міста та цифрової трансформації» · СітіЧЕ
      </p>
    </div>
  )
}
