"use client"

import React, { useState, useMemo, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  MessageSquare,
  Search,
  X,
  Check,
  Clock,
  Eye,
  Trash2,
  MoreHorizontal,
  AlertCircle,
  PlusCircle,
  MinusCircle,
  ArrowUpDown,
  Calendar,
  Tag,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { deleteFeedback, FeedbackEntry, setFeedbackStatus } from "@/actions/feedback/feedback"
import EmptyState from "@/components/empty-state"

type FeedbackType = "feedback" | "add-resource" | "remove-resource" | "add-category"
type FeedbackStatus = "new" | "reviewed" | "resolved"

const TYPE_META: Record<FeedbackType, { label: string; icon: React.ElementType; cls: string; iconColor: string; iconBg: string }> = {
  feedback: {
    label: "Відгук",
    icon: MessageSquare,
    cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    iconColor: "#3b82f6",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
  },
  "add-resource": {
    label: "Додати ресурс",
    icon: PlusCircle,
    cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    iconColor: "#10b981",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  "remove-resource": {
    label: "Видалити ресурс",
    icon: MinusCircle,
    cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    iconColor: "#ef4444",
    iconBg: "bg-red-100 dark:bg-red-900/30",
  },
  "add-category": {
    label: "Нова категорія",
    icon: Tag,
    cls: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    iconColor: "#8b5cf6",
    iconBg: "bg-violet-100 dark:bg-violet-900/30",
  },
}

const STATUS_META: Record<FeedbackStatus, { label: string; cls: string; dot: string }> = {
  new: { label: "Нове", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", dot: "bg-amber-500" },
  reviewed: { label: "Переглянуто", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", dot: "bg-blue-500" },
  resolved: { label: "Вирішено", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", dot: "bg-emerald-500" },
}

const STATUS_PRISMA: Record<FeedbackStatus, "NEW" | "REVIEWED" | "RESOLVED"> = {
  new: "NEW",
  reviewed: "REVIEWED",
  resolved: "RESOLVED",
}

const VALID_TYPES: FeedbackType[] = ["feedback", "add-resource", "remove-resource", "add-category"]
const VALID_STATUSES: FeedbackStatus[] = ["new", "reviewed", "resolved"]

export default function FeedbackClient({ initialItems }: { initialItems: FeedbackEntry[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const urlSearch = searchParams.get("q") ?? ""
  const filterType = VALID_TYPES.includes(searchParams.get("type") as FeedbackType) ? (searchParams.get("type") as FeedbackType) : null
  const filterStatus = VALID_STATUSES.includes(searchParams.get("status") as FeedbackStatus)
    ? (searchParams.get("status") as FeedbackStatus)
    : null
  const sortDir = searchParams.get("sort") === "asc" ? "asc" : "desc"

  const [items, setItems] = useState<FeedbackEntry[]>(initialItems)
  const [viewItem, setViewItem] = useState<FeedbackEntry | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState(urlSearch)

  const searchParamsRef = useRef(searchParams)
  useEffect(() => {
    searchParamsRef.current = searchParams
  }, [searchParams])

  // Debounce search → URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParamsRef.current.toString())
      if (searchInput) params.set("q", searchInput)
      else params.delete("q")
      router.replace(`?${params.toString()}`, { scroll: false })
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput, router])

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  function resetFilters() {
    setSearchInput("")
    router.replace("?", { scroll: false })
  }

  const filtered = useMemo(() => {
    const q = urlSearch.toLowerCase()
    return items
      .filter(
        (i) =>
          (!q || i.subject.toLowerCase().includes(q) || i.author.toLowerCase().includes(q) || i.message.toLowerCase().includes(q)) &&
          (!filterType || i.type === filterType) &&
          (!filterStatus || i.status === filterStatus)
      )
      .sort((a, b) => {
        const cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        return sortDir === "asc" ? cmp : -cmp
      })
  }, [items, urlSearch, filterType, filterStatus, sortDir])

  const newCount = items.filter((i) => i.status === "new").length

  async function handleSetStatus(id: string, status: FeedbackStatus) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
    setViewItem((v) => (v?.id === id ? { ...v, status } : v))
    try {
      await setFeedbackStatus(id, STATUS_PRISMA[status])
    } catch {
      toast.error("Не вдалося оновити статус")
    }
  }

  async function handleDelete(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
    setDeleteId(null)
    setViewItem((v) => (v?.id === id ? null : v))
    try {
      await deleteFeedback(id)
      toast.success("Звернення видалено")
    } catch {
      toast.error("Не вдалося видалити звернення")
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(Object.entries(TYPE_META) as [FeedbackType, (typeof TYPE_META)[FeedbackType]][]).map(([type, meta]) => {
          const Icon = meta.icon
          const count = items.filter((i) => i.type === type).length
          const active = filterType === type
          return (
            <button
              key={type}
              onClick={() => setParam("type", active ? null : type)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200",
                active ? cn(meta.cls, "border-current/20 shadow-md") : "border-border bg-card hover:shadow-md"
              )}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: `radial-gradient(ellipse at bottom right, ${meta.iconColor}18, transparent 70%)` }}
              />
              {active && (
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: `radial-gradient(ellipse at bottom right, ${meta.iconColor}25, transparent 65%)` }}
                />
              )}
              <div
                className="absolute bottom-0 left-0 h-0.5 w-full transition-all duration-300"
                style={{ background: active ? meta.iconColor : "transparent" }}
              />
              <div className="relative flex items-start justify-between gap-2">
                <div className="flex flex-col gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl transition-all"
                    style={{ background: active ? `${meta.iconColor}20` : "var(--muted)" }}
                  >
                    <Icon size={15} color={active ? meta.iconColor : "#94a3b8"} />
                  </div>
                  <p className="text-[11.5px] font-medium text-muted-foreground">{meta.label}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p
                    className="text-[32px] leading-none font-bold tracking-tight"
                    style={{ color: active ? meta.iconColor : "var(--foreground)" }}
                  >
                    {count}
                  </p>
                  {active && <X size={12} className="opacity-50" />}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Alert */}
      {newCount > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800/40 dark:bg-amber-950/30">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40">
            <AlertCircle size={14} className="text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-[13px] font-semibold text-amber-700 dark:text-amber-400">
            {newCount} {newCount === 1 ? "нове звернення потребує" : "нових звернень потребують"} уваги
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={14} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Пошук за темою, автором, текстом..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-9 rounded-xl pr-9 pl-9 text-[13px]"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput("")
                setParam("q", null)
              }}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={13} />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(STATUS_META) as [FeedbackStatus, (typeof STATUS_META)[FeedbackStatus]][]).map(([st, meta]) => (
            <Button
              key={st}
              size="sm"
              variant="outline"
              className={cn("h-9 gap-1.5 rounded-xl text-[12px] transition-all", filterStatus === st ? cn(meta.cls, "border-current/20") : "")}
              onClick={() => setParam("status", filterStatus === st ? null : st)}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
              {meta.label}
            </Button>
          ))}
          <Button
            size="sm"
            variant="outline"
            className="h-9 gap-1.5 rounded-xl text-[12px]"
            onClick={() => setParam("sort", sortDir === "asc" ? null : "asc")}
          >
            <ArrowUpDown size={11} />
            {sortDir === "desc" ? "Нові спочатку" : "Старі спочатку"}
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden rounded-2xl border p-0 shadow-sm">
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="pl-5 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Тема</TableHead>
                <TableHead className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Тип</TableHead>
                <TableHead className="hidden text-[11px] font-bold tracking-wider text-muted-foreground uppercase sm:table-cell">
                  Автор
                </TableHead>
                <TableHead className="hidden text-[11px] font-bold tracking-wider text-muted-foreground uppercase md:table-cell">
                  Дата
                </TableHead>
                <TableHead className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Статус</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="px-5 py-5">
                    <EmptyState
                      variant={urlSearch || filterType || filterStatus ? "search" : "empty"}
                      query={urlSearch || undefined}
                      hasFilter={!!(filterType || filterStatus)}
                      onResetSearch={resetFilters}
                      onResetFilter={resetFilters}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => {
                  const tm = TYPE_META[item.type as FeedbackType] ?? TYPE_META.feedback
                  const sm = STATUS_META[item.status as FeedbackStatus] ?? STATUS_META.new
                  const TIcon = tm.icon
                  return (
                    <TableRow
                      key={item.id}
                      className="group cursor-pointer border-b transition-colors last:border-0 hover:bg-muted/30"
                      onClick={() => setViewItem(item)}
                    >
                      <TableCell className="py-3.5 pl-5">
                        <div className="flex items-center gap-3">
                          {item.status === "new" && <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-amber-500" />}
                          <div className="min-w-0">
                            <p className="max-w-64 truncate text-[13px] font-semibold text-foreground">{item.subject}</p>
                            <p className="max-w-64 truncate text-[11.5px] text-muted-foreground">{item.message}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap",
                            tm.cls
                          )}
                        >
                          <TIcon size={10} /> {tm.label}
                        </span>
                      </TableCell>

                      <TableCell className="hidden py-3.5 sm:table-cell">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                            {item.author[0]}
                          </div>
                          <div>
                            <p className="text-[12.5px] font-medium text-foreground">{item.author}</p>
                            <p className="text-[11px] text-muted-foreground">{item.email}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="hidden py-3.5 md:table-cell">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar size={11} />
                          <span className="text-[12px]">
                            {new Date(item.createdAt).toLocaleDateString("uk-UA", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap",
                            sm.cls
                          )}
                        >
                          <span className={cn("h-1.5 w-1.5 rounded-full", sm.dot)} />
                          {sm.label}
                        </span>
                      </TableCell>

                      <TableCell className="py-3.5 pr-3" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal size={15} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => setViewItem(item)}>
                              <Eye size={13} /> Переглянути
                            </DropdownMenuItem>
                            {item.status !== "reviewed" && (
                              <DropdownMenuItem onClick={() => handleSetStatus(item.id, "reviewed")}>
                                <Clock size={13} /> Позначити як переглянуте
                              </DropdownMenuItem>
                            )}
                            {item.status !== "resolved" && (
                              <DropdownMenuItem className="text-emerald-600" onClick={() => handleSetStatus(item.id, "resolved")}>
                                <Check size={13} /> Позначити як вирішене
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(item.id)}>
                              <Trash2 size={13} /> Видалити
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
          {filtered.length > 0 && (
            <>
              <Separator />
              <div className="px-5 py-3">
                <p className="text-[12px] text-muted-foreground">
                  Показано <span className="font-semibold text-foreground">{filtered.length}</span> з{" "}
                  <span className="font-semibold text-foreground">{items.length}</span> звернень
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* View dialog */}
      {viewItem && (
        <ViewDialog
          item={viewItem}
          onClose={() => setViewItem(null)}
          onSetStatus={handleSetStatus}
          onDelete={(id) => {
            setDeleteId(id)
            setViewItem(null)
          }}
        />
      )}

      {/* Delete confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
              <Trash2 size={22} className="text-destructive" />
            </div>
            <DialogTitle className="text-center">Видалити звернення?</DialogTitle>
          </DialogHeader>
          <p className="text-center text-sm text-muted-foreground">Цю дію неможливо скасувати.</p>
          <DialogFooter className="mt-4 flex gap-3 sm:flex-row">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setDeleteId(null)}>
              Скасувати
            </Button>
            <Button variant="destructive" className="flex-1 rounded-xl" onClick={() => deleteId && handleDelete(deleteId)}>
              Видалити
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── View Dialog ──────────────────────────────────────────────

function ViewDialog({
  item,
  onClose,
  onSetStatus,
  onDelete,
}: {
  item: FeedbackEntry
  onClose: () => void
  onSetStatus: (id: string, s: FeedbackStatus) => void
  onDelete: (id: string) => void
}) {
  const tm = TYPE_META[item.type as FeedbackType] ?? TYPE_META.feedback
  const sm = STATUS_META[item.status as FeedbackStatus] ?? STATUS_META.new
  const TIcon = tm.icon

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] max-w-lg flex-col gap-0 overflow-hidden rounded-2xl p-0">
        <DialogTitle className="sr-only">{item.subject}</DialogTitle>

        <div className="h-1 shrink-0 rounded-t-2xl" style={{ background: tm.iconColor }} />

        <div className="flex shrink-0 items-center gap-3 border-b px-6 py-4">
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", tm.iconBg)}>
            <TIcon size={17} color={tm.iconColor} />
          </div>
          <div>
            <p className="text-[15px] font-bold text-foreground">{tm.label}</p>
            <span className={cn("inline-flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-[11px] font-semibold", sm.cls)}>
              <span className={cn("h-1.5 w-1.5 rounded-full", sm.dot)} />
              {sm.label}
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          <div className="rounded-xl border bg-muted/20 p-4">
            <p className="mb-1 text-[10.5px] font-bold tracking-widest text-muted-foreground uppercase">Тема</p>
            <p className="text-[13.5px] font-semibold text-foreground">{item.subject}</p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[13px] font-bold text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
              {item.author[0]}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-foreground">{item.author}</p>
              <p className="text-[11.5px] text-muted-foreground">{item.email}</p>
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-1.5 text-muted-foreground">
              <Calendar size={11} />
              <span className="text-[11.5px]">
                {new Date(item.createdAt).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
          </div>

          <div className="rounded-xl border bg-muted/20 p-4">
            <p className="mb-2 text-[10.5px] font-bold tracking-widest text-muted-foreground uppercase">Повідомлення</p>
            <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap text-foreground">{item.message}</p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 border-t bg-muted/20 px-6 py-4">
          {item.status !== "reviewed" && (
            <Button variant="outline" size="sm" className="gap-1.5 rounded-xl" onClick={() => onSetStatus(item.id, "reviewed")}>
              <Clock size={13} /> Переглянуто
            </Button>
          )}
          {item.status !== "resolved" && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-xl border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-900/20"
              onClick={() => onSetStatus(item.id, "resolved")}
            >
              <Check size={13} /> Вирішено
            </Button>
          )}
          {item.status !== "new" && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-xl border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-800 dark:hover:bg-amber-900/20"
              onClick={() => onSetStatus(item.id, "new")}
            >
              <AlertCircle size={13} /> Повернути як нове
            </Button>
          )}
          <Button variant="destructive" size="sm" className="ml-auto gap-1.5 rounded-xl" onClick={() => onDelete(item.id)}>
            <Trash2 size={13} /> Видалити
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
