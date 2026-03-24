"use client"

import React, { useTransition, useState, useMemo } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Search, X, Plus, Pencil, Trash2, LogIn, LogOut, Filter, Clock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { formatDateLabel, groupByDate } from "@/lib/format-date"
import { LogEntry } from "@/types/action"
import EmptyState from "@/components/empty-state"

// ─── Meta ─────────────────────────────────────────────────────

const ACTION_META: Record<string, { label: string; icon: React.ElementType; iconColor: string; bgColor: string; variant: string }> = {
  create: {
    label: "Створення",
    icon: Plus,
    iconColor: "#10b981",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    variant: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  edit: {
    label: "Редагування",
    icon: Pencil,
    iconColor: "#3b82f6",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    variant: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  delete: {
    label: "Видалення",
    icon: Trash2,
    iconColor: "#ef4444",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    variant: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  login: {
    label: "Вхід",
    icon: LogIn,
    iconColor: "#8b5cf6",
    bgColor: "bg-violet-100 dark:bg-violet-900/30",
    variant: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  },
  logout: {
    label: "Вихід",
    icon: LogOut,
    iconColor: "#f59e0b",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    variant: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  invite: {
    label: "Запрошення",
    icon: Mail,
    iconColor: "#06b6d4",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    variant: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  },
}

const FALLBACK_META = { label: "Дія", icon: Clock, iconColor: "#94a3b8", bgColor: "bg-muted", variant: "bg-muted text-muted-foreground" }

const ENTITY_ACCUSATIVE: Record<string, string> = {
  category: "категорію",
  subcategory: "підкатегорію",
  resource: "ресурс",
  admin: "адміна",
  settings: "налаштування",
}

function Accent({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-primary">{children}</span>
}
function Bold({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-foreground">{children}</span>
}

function buildSentence(log: LogEntry): React.ReactNode {
  const name = <Bold>{log.userName}</Bold>
  const obj = <Accent>{log.entityName}</Accent>
  const ent = ENTITY_ACCUSATIVE[log.entity] ?? log.entity

  switch (log.action) {
    case "create":
      if (log.entity === "admin") {
        return (
          <>
            {name} зареєструвався в системі
            {log.details ? (
              <>
                {" "}
                за запрошенням від <Accent>{log.details}</Accent>
              </>
            ) : (
              " за запрошенням"
            )}
          </>
        )
      }
      return (
        <>
          {name} створив {ent} {obj}
        </>
      )
    case "edit":
      return (
        <>
          {name} відредагував {ent} {obj}
        </>
      )
    case "delete":
      return (
        <>
          {name} видалив {ent} {obj}
        </>
      )
    case "invite":
      return (
        <>
          {name} надіслав запрошення на <Accent>{log.entityName}</Accent>
        </>
      )
    case "login":
      return <>{name} увійшов до адмін-панелі</>
    case "logout":
      return <>{name} вийшов з адмін-панелі</>
    default:
      return (
        <>
          {name} виконав дію над {obj}
        </>
      )
  }
}

function shouldShowDetails(log: LogEntry): boolean {
  if (log.action === "invite") return false
  if (log.action === "create" && log.entity === "admin") return false
  if (log.action === "login" || log.action === "logout") return false
  return !!log.details
}

// ─── Component ────────────────────────────────────────────────

interface Props {
  logs: LogEntry[]
  users: string[]
  activeAction?: string
  activeUser?: string
}

export default function LogsClient({ logs, users, activeAction, activeUser }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const [showFilters, setShowFilters] = useState(false)

  // Пошук — клієнтський, бо шукаємо по згенерованому тексту речень
  // (entityName, userName, details, назва дії, назва сутності)
  // Серверний пошук тут не має сенсу — текст "відредагував ресурс" не зберігається в БД
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return logs
    return logs.filter(
      (l) =>
        l.entityName.toLowerCase().includes(q) ||
        l.userName.toLowerCase().includes(q) ||
        (l.details ?? "").toLowerCase().includes(q) ||
        (ENTITY_ACCUSATIVE[l.entity] ?? "").includes(q) ||
        (ACTION_META[l.action]?.label.toLowerCase() ?? "").includes(q)
    )
  }, [logs, search])

  const groups = groupByDate(filtered)
  const activeFilters = [activeAction, activeUser].filter(Boolean).length
  const hasAnyFilter = activeFilters > 0 || search !== ""

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  function resetFilters() {
    setSearch("")
    const params = new URLSearchParams(searchParams.toString())
    params.delete("action")
    params.delete("user")
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="space-y-6">
      {/* Summary badges — завжди від повного logs */}
      <div className="flex flex-wrap items-center gap-2">
        {(["create", "edit", "delete"] as const).map((a) => {
          const m = ACTION_META[a]
          const Icon = m.icon
          const count = logs.filter((l) => l.action === a).length
          return (
            <span key={a} className={cn("flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[12px] font-semibold", m.variant)}>
              <Icon size={12} /> {count}
            </span>
          )
        })}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Пошук по об'єкту, користувачу, деталях..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 pl-9"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <Button
            variant={showFilters || activeFilters > 0 ? "secondary" : "outline"}
            onClick={() => setShowFilters((f) => !f)}
            className="gap-2"
          >
            <Filter size={14} />
            Фільтри
            {activeFilters > 0 && <Badge className="h-5 w-5 rounded-full p-0 text-[10px]">{activeFilters}</Badge>}
          </Button>
        </div>

        {showFilters && (
          <Card>
            <CardContent className="space-y-4 p-4">
              <div>
                <p className="mb-2 text-[10.5px] font-bold tracking-widest text-muted-foreground uppercase">Тип дії</p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant={!activeAction ? "secondary" : "outline"} onClick={() => setParam("action", null)}>
                    Всі
                  </Button>
                  {Object.entries(ACTION_META).map(([action, meta]) => {
                    const Icon = meta.icon
                    const active = activeAction === action
                    return (
                      <button
                        key={action}
                        onClick={() => setParam("action", active ? null : action)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition-all",
                          active ? meta.variant + " border-current/30" : "border-border text-muted-foreground hover:bg-muted"
                        )}
                      >
                        <Icon size={12} /> {meta.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <Separator />

              <div>
                <p className="mb-2 text-[10.5px] font-bold tracking-widest text-muted-foreground uppercase">Адміністратор</p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant={!activeUser ? "secondary" : "outline"} onClick={() => setParam("user", null)}>
                    Всі
                  </Button>
                  {users.map((u) => (
                    <Button
                      key={u}
                      size="sm"
                      variant={activeUser === u ? "secondary" : "outline"}
                      onClick={() => setParam("user", activeUser === u ? null : u)}
                    >
                      {u}
                    </Button>
                  ))}
                </div>
              </div>

              {hasAnyFilter && (
                <Button variant="link" className="h-auto p-0 text-destructive" onClick={resetFilters}>
                  Скинути фільтри
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Empty state */}
      {groups.length === 0 && (
        <EmptyState
          variant={hasAnyFilter ? "search" : "empty"}
          query={search || undefined}
          hasFilter={activeFilters > 0}
          onResetSearch={hasAnyFilter ? resetFilters : undefined}
          onResetFilter={activeFilters > 0 ? resetFilters : undefined}
        />
      )}

      {/* Log groups */}
      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.date}>
            <div className="mb-3 flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="rounded-full border bg-muted px-3 py-1 text-[11.5px] font-bold tracking-widest text-muted-foreground uppercase">
                {formatDateLabel(group.date)}
              </span>
              <Separator className="flex-1" />
            </div>
            <Card className="p-0">
              <CardContent className="p-0">
                {group.items.map((log, idx) => {
                  const am = ACTION_META[log.action] ?? FALLBACK_META
                  const AIcon = am.icon
                  const isLast = idx === group.items.length - 1
                  return (
                    <div key={log.id}>
                      <div className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-muted/40">
                        <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", am.bgColor)}>
                          <AIcon size={14} color={am.iconColor} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13.5px] leading-snug text-muted-foreground">{buildSentence(log)}</p>
                          {shouldShowDetails(log) && <p className="mt-1 text-[12px] text-muted-foreground/60">{log.details}</p>}
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5 text-muted-foreground">
                          <Clock size={11} />
                          <span className="text-[12px] whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                      {!isLast && <Separator />}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {filtered.length > 0 && (
        <p className="text-center text-[12px] text-muted-foreground">
          Показано {filtered.length} з {logs.length} записів
        </p>
      )}
    </div>
  )
}
