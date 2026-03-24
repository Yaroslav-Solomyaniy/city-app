"use client"

import Link from "next/link"
import Image from "next/image"
import React from "react"
import { FolderTree, Globe, Users, MessageSquare, ScrollText, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
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
    iconColor: "#3b82f6",
    iconBg: "bg-blue-50 dark:bg-blue-900/30",
    accentBg: "bg-blue-400",
  },
  {
    label: "Ресурси",
    description: "Всі ресурси та посилання",
    href: ROUTES.ADMIN.RESOURCES.href,
    icon: Globe,
    iconColor: "#10b981",
    iconBg: "bg-emerald-50 dark:bg-emerald-900/30",
    accentBg: "bg-emerald-400",
  },
  {
    label: "Адміністратори",
    description: "Керування доступом",
    href: ROUTES.ADMIN.ADMINISTRATORS.href,
    icon: Users,
    iconColor: "#8b5cf6",
    iconBg: "bg-violet-50 dark:bg-violet-900/30",
    accentBg: "bg-violet-400",
  },
  {
    label: "Зворотній зв'язок",
    description: "Звернення від користувачів",
    href: ROUTES.ADMIN.FEEDBACK.href,
    icon: MessageSquare,
    iconColor: "#f59e0b",
    iconBg: "bg-amber-50 dark:bg-amber-900/30",
    accentBg: "bg-amber-400",
  },
  {
    label: "Логи дій",
    description: "Історія змін на порталі",
    href: ROUTES.ADMIN.LOGS.href,
    icon: ScrollText,
    iconColor: "#64748b",
    iconBg: "bg-slate-100 dark:bg-slate-900/30",
    accentBg: "bg-slate-400",
  },
  {
    label: "Переглянути сайт",
    description: "Відкрити публічну частину",
    href: "/",
    icon: ExternalLink,
    iconColor: "#f43f5e",
    iconBg: "bg-rose-50 dark:bg-rose-900/30",
    accentBg: "bg-rose-400",
  },
]

export default function AdminDashboardClient({ categories, resources, admins, feedback }: Props) {
  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden">
      {/* Background — розтягуємо за межі паддінгу main через від'ємні марджини */}
      <div className="pointer-events-none absolute -inset-x-4 -inset-y-4 sm:-inset-x-6 sm:-inset-y-6 lg:-inset-x-8 lg:-inset-y-8 bg-slate-100">
        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(100,116,139,0.18) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Color blobs */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 55% at 10% 50%, rgba(59,130,246,0.10) 0%, transparent 100%),
              radial-gradient(ellipse 55% 50% at 88% 15%, rgba(16,185,129,0.09) 0%, transparent 100%),
              radial-gradient(ellipse 50% 55% at 65% 90%, rgba(139,92,246,0.07) 0%, transparent 100%)
            `,
          }}
        />
      </div>

      <div className="mx-auto w-7xl space-y-8 px-4">
        <div className="flex items-end justify-center gap-2">
          <Image
            src="/kozak.png"
            alt=""
            width={90}
            height={180}
            className="-scale-x-100 self-end object-contain object-bottom drop-shadow-sm"
            aria-hidden
          />

          <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-10 py-6 text-center shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/80">
            <Image src="/Cherkasy_Color_Mini.png" width={200} height={64} alt="Черкаси" priority />
            <div>
              <h1
                className="text-[1.85rem] leading-tight font-extrabold tracking-tight"
                style={{
                  background: "linear-gradient(135deg, #1e40af 0%, #0ea5e9 60%, #10b981 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                СітіЧЕ
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">Адмін-панель сервісів громади</p>
            </div>
          </div>
          <Image src="/kozak.png" alt="" width={90} height={180} className="self-end object-contain object-bottom drop-shadow-sm" aria-hidden />
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700" />
          <span className="text-[10px] font-medium tracking-widest text-slate-400 uppercase">Швидкий доступ</span>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700" />
        </div>

        {/* ── Navigation grid ── */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {LINKS.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.label} href={item.href} className="group block">
                <div className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md dark:border-slate-700/60 dark:bg-slate-900">
                  {/* Accent stripe top */}
                  <div className={cn("absolute inset-x-[20%] top-0 h-[2px] rounded-b opacity-50", item.accentBg)} />

                  <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", item.iconBg)}>
                    <Icon size={20} color={item.iconColor} strokeWidth={1.7} />
                  </div>

                  <div>
                    <p className="text-[14px] font-semibold text-foreground">{item.label}</p>
                    <p className="mt-0.5 text-[11.5px] text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* ── Footer ── */}
        <p className="pb-2 text-center text-[11px] text-slate-400">
          © {new Date().getFullYear()} КП «Інститут розвитку міста та цифрової трансформації» · СітіЧЕ
        </p>
      </div>
    </div>
  )
}
