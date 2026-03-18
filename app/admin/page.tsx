// app/(pages)/auth/page.tsx
"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  FolderTree,
  Globe,
  Users,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Eye,
  Clock,
  ArrowRight,
  Plus,
  ExternalLink,
  Activity,
  AlertCircle,
  CheckCircle2,
  XCircle,
  UserPlus,
  FileEdit,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/constants/routes"

// ─── Mock Data ────────────────────────────────────────────────

const STATS = [
  {
    label: "Категорій",
    value: 12,
    change: "+2",
    trend: "up" as const,
    icon: FolderTree,
    iconColor: "#3b82f6",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    label: "Ресурсів",
    value: 48,
    change: "+5",
    trend: "up" as const,
    icon: Globe,
    iconColor: "#10b981",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    label: "Адміністраторів",
    value: 4,
    change: "0",
    trend: "neutral" as const,
    icon: Users,
    iconColor: "#8b5cf6",
    iconBg: "bg-violet-100 dark:bg-violet-900/30",
  },
  {
    label: "Звернень",
    value: 23,
    change: "+8",
    trend: "up" as const,
    icon: MessageSquare,
    iconColor: "#f59e0b",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
  },
]

const RECENT_ACTIVITY = [
  {
    id: 1,
    type: "add" as const,
    entity: "Черкаська обласна лікарня",
    entityType: "ресурс",
    user: "Ярослав С.",
    time: "5 хв тому",
  },
  {
    id: 2,
    type: "edit" as const,
    entity: "Здоров'я",
    entityType: "категорія",
    user: "Катерина Х.",
    time: "23 хв тому",
  },
  {
    id: 3,
    type: "delete" as const,
    entity: "Застаріле посилання #12",
    entityType: "ресурс",
    user: "Дмитро Т.",
    time: "1 год тому",
  },
  {
    id: 4,
    type: "add" as const,
    entity: "Олександр С.",
    entityType: "адмін",
    user: "Ярослав С.",
    time: "2 год тому",
  },
  {
    id: 5,
    type: "edit" as const,
    entity: "Транспорт",
    entityType: "категорія",
    user: "Катерина Х.",
    time: "3 год тому",
  },
  {
    id: 6,
    type: "add" as const,
    entity: "Маршрутки Черкас",
    entityType: "ресурс",
    user: "Дмитро Т.",
    time: "5 год тому",
  },
]

const RECENT_FEEDBACK = [
  {
    id: 1,
    type: "feedback" as const,
    subject: "Не працює посилання на поліклініку",
    author: "Іван П.",
    date: "02.03.2026",
    status: "new" as const,
  },
  {
    id: 2,
    type: "add-resource" as const,
    subject: "Додати Черкаський зоопарк",
    author: "Марія К.",
    date: "01.03.2026",
    status: "new" as const,
  },
  {
    id: 3,
    type: "feedback" as const,
    subject: "Дякую за зручний портал!",
    author: "Олена В.",
    date: "28.02.2026",
    status: "reviewed" as const,
  },
  {
    id: 4,
    type: "remove-resource" as const,
    subject: "Видалити застарілий ресурс",
    author: "Петро Д.",
    date: "27.02.2026",
    status: "resolved" as const,
  },
]

const POPULAR_CATEGORIES = [
  { name: "Здоров'я", views: 1842, accent: "#ef4444" },
  { name: "Освіта", views: 1456, accent: "#3b82f6" },
  { name: "Транспорт", views: 1203, accent: "#f97316" },
  { name: "Міська Рада", views: 987, accent: "#f59e0b" },
  { name: "Комунальні Послуги", views: 845, accent: "#10b981" },
]

const QUICK_ACTIONS = [
  {
    label: "Додати категорію",
    href: "/auth/category",
    icon: FolderTree,
    iconColor: "#3b82f6",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    label: "Додати ресурс",
    href: ROUTES.ADMIN.RESOURCES,
    icon: Globe,
    iconColor: "#10b981",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    label: "Додати адміністратора",
    href: "/auth/administrators",
    icon: UserPlus,
    iconColor: "#8b5cf6",
    iconBg: "bg-violet-100 dark:bg-violet-900/30",
  },
  {
    label: "Переглянути портал",
    href: "/",
    icon: ExternalLink,
    iconColor: "#f59e0b",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
  },
]

const SYSTEM_STATUS = [
  { label: "Портал", status: "ok" as const },
  { label: "База даних", status: "ok" as const },
  { label: "Пошук", status: "warning" as const },
]

// ─── Helpers ──────────────────────────────────────────────────

const activityMeta = (type: "add" | "edit" | "delete") =>
  ({
    add: {
      icon: Plus,
      cls: "bg-emerald-100 dark:bg-emerald-900/30",
      color: "#10b981",
      verb: "додав",
    },
    edit: {
      icon: FileEdit,
      cls: "bg-blue-100 dark:bg-blue-900/30",
      color: "#3b82f6",
      verb: "змінив",
    },
    delete: {
      icon: Trash2,
      cls: "bg-red-100 dark:bg-red-900/30",
      color: "#ef4444",
      verb: "видалив",
    },
  })[type]

const statusBadgeCls = (status: "new" | "reviewed" | "resolved") =>
  ({
    new: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    reviewed:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    resolved:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  })[status]

const statusLabel = (status: "new" | "reviewed" | "resolved") =>
  ({ new: "Нове", reviewed: "Переглянуто", resolved: "Вирішено" })[status]

const feedbackTypeLabel = (type: string) =>
  ({
    feedback: "Відгук",
    "add-resource": "Додати ресурс",
    "remove-resource": "Видалити ресурс",
    "add-category": "Нова категорія",
  })[type] ?? type

// ═══════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════

export default function AdminDashboard() {
  const [period, setPeriod] = useState<"today" | "week" | "month">("week")
  const maxViews = Math.max(...POPULAR_CATEGORIES.map((c) => c.views))

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-[13px] text-muted-foreground">
            Адмін-панель › <span className="text-foreground">Дашборд</span>
          </p>
          <h1 className="text-3xl font-bold text-foreground">Дашборд</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Огляд стану порталу та останніх змін
          </p>
        </div>
        {/* Period switcher */}
        <div className="flex items-center gap-1 rounded-xl border bg-muted/50 p-1">
          {(["today", "week", "month"] as const).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={period === p ? "secondary" : "ghost"}
              className="h-7 text-[12px]"
              onClick={() => setPeriod(p)}
            >
              {p === "today" ? "Сьогодні" : p === "week" ? "Тиждень" : "Місяць"}
            </Button>
          ))}
        </div>
      </div>

      {/* ── Stats cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="mb-3 flex items-start justify-between">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl",
                      stat.iconBg
                    )}
                  >
                    <Icon size={19} color={stat.iconColor} strokeWidth={1.7} />
                  </div>
                  {stat.trend !== "neutral" && (
                    <Badge
                      className={cn(
                        "gap-1",
                        stat.trend === "up"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      )}
                    >
                      {stat.trend === "up" ? (
                        <TrendingUp size={11} />
                      ) : (
                        <TrendingDown size={11} />
                      )}
                      {stat.change}
                    </Badge>
                  )}
                </div>
                <p className="mb-1 text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-[13px] text-muted-foreground">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent Activity */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Activity size={15} color="#3b82f6" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-foreground">
                  Остання активність
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Дії адміністраторів на порталі
                </p>
              </div>
            </div>
            <Button
              variant="link"
              size="sm"
              className="gap-1 text-[12px]"
              asChild
            >
              <Link href="/admin/logs">
                Всі логи <ArrowRight size={13} />
              </Link>
            </Button>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            {RECENT_ACTIVITY.map((item, idx) => {
              const am = activityMeta(item.type)
              const AIcon = am.icon
              return (
                <div key={item.id}>
                  <div className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/40">
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        am.cls
                      )}
                    >
                      <AIcon size={14} color={am.color} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] leading-snug text-foreground">
                        <span className="font-semibold">{item.user}</span>{" "}
                        {am.verb}{" "}
                        <span className="font-medium text-primary">
                          {item.entity}
                        </span>
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {item.entityType}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5 text-muted-foreground">
                      <Clock size={11} />
                      <span className="text-[11px] whitespace-nowrap">
                        {item.time}
                      </span>
                    </div>
                  </div>
                  {idx < RECENT_ACTIVITY.length - 1 && <Separator />}
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Popular category */}
        <Card>
          <CardHeader className="py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
                <Eye size={15} color="#8b5cf6" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-foreground">
                  Популярні категорії
                </p>
                <p className="text-[11px] text-muted-foreground">
                  За кількістю переглядів
                </p>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-3.5 px-5 py-4">
            {POPULAR_CATEGORIES.map((cat, i) => (
              <div key={cat.name}>
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-4 text-center text-[11px] font-bold text-muted-foreground">
                      {i + 1}
                    </span>
                    <span className="text-[13px] font-medium text-foreground">
                      {cat.name}
                    </span>
                  </div>
                  <span
                    className="text-[12px] font-semibold"
                    style={{ color: cat.accent }}
                  >
                    {cat.views.toLocaleString()}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full opacity-80 transition-all duration-500"
                    style={{
                      width: `${(cat.views / maxViews) * 100}%`,
                      background: cat.accent,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Feedback + Quick actions ── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent feedback */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <MessageSquare size={15} color="#f59e0b" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-foreground">
                  Останні звернення
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Зворотній зв'язок від користувачів
                </p>
              </div>
            </div>
            <Button
              variant="link"
              size="sm"
              className="gap-1 text-[12px]"
              asChild
            >
              <Link href="/admin/feedback">
                Всі звернення <ArrowRight size={13} />
              </Link>
            </Button>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Тема</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead className="hidden sm:table-cell">Автор</TableHead>
                  <TableHead className="hidden sm:table-cell">Дата</TableHead>
                  <TableHead>Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RECENT_FEEDBACK.map((fb) => (
                  <TableRow key={fb.id} className="cursor-pointer">
                    <TableCell>
                      <p className="line-clamp-1 text-[13px] font-medium text-foreground">
                        {fb.subject}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[11px]">
                        {feedbackTypeLabel(fb.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-[12.5px] text-muted-foreground">
                        {fb.author}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-[12px] text-muted-foreground">
                        {fb.date}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                          statusBadgeCls(fb.status)
                        )}
                      >
                        {statusLabel(fb.status)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick actions + system status */}
        <Card>
          <CardContent className="p-5">
            <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
              Швидкі дії
            </p>
            <div className="flex flex-col gap-2">
              {QUICK_ACTIONS.map((action) => {
                const AIcon = action.icon
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-3 rounded-xl border px-4 py-3.5 text-foreground transition-all hover:bg-muted/60 hover:shadow-sm"
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                        action.iconBg
                      )}
                    >
                      <AIcon
                        size={17}
                        color={action.iconColor}
                        strokeWidth={1.7}
                      />
                    </div>
                    <span className="text-[13.5px] font-semibold">
                      {action.label}
                    </span>
                    <ArrowRight
                      size={14}
                      className="ml-auto text-muted-foreground"
                    />
                  </Link>
                )
              })}
            </div>

            <Separator className="my-5" />

            <p className="mb-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Стан системи
            </p>
            <div className="flex flex-col gap-2">
              {SYSTEM_STATUS.map((sys) => (
                <div key={sys.label} className="flex items-center gap-2.5">
                  {sys.status === "ok" ? (
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  ) : sys.status === "warning" ? (
                    <AlertCircle size={14} className="text-amber-500" />
                  ) : (
                    <XCircle size={14} className="text-red-500" />
                  )}
                  <span className="text-[12.5px] font-medium text-muted-foreground">
                    {sys.label}
                  </span>
                  <span
                    className={cn(
                      "ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold",
                      sys.status === "ok"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : sys.status === "warning"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}
                  >
                    {sys.status === "ok"
                      ? "Працює"
                      : sys.status === "warning"
                        ? "Увага"
                        : "Помилка"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
