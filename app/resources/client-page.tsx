"use client"

import Link from "next/link"
import React, { useState, useMemo, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Clock, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DEFAULT_VIEW, ViewMode } from "@/constants/view-mode"
import PageLayout from "@/components/page-sidebar/page-layout"
import SidebarStats from "@/components/page-sidebar-stats"
import { ICON_MAP } from "@/constants/icon-map"
import { formatDate } from "@/lib/format-date"
import { CategoryWithCount, ResourceWithCategory } from "@/types/action"

interface Props {
  resources: ResourceWithCategory[]
  categories: CategoryWithCount[]
}

export default function ResourcesClient({ resources, categories }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchParamsRef = useRef(searchParams)
  useEffect(() => {
    searchParamsRef.current = searchParams
  }, [searchParams])

  const urlSearch = searchParams.get("q") ?? ""
  const urlCategory = searchParams.get("cat") ?? "all"
  const urlView = (searchParams.get("view") as ViewMode) ?? DEFAULT_VIEW

  const [search, setSearch] = useState(urlSearch)
  const [activeCategory, setActiveCategory] = useState(urlCategory)
  const [view, setView] = useState<ViewMode>(urlView)
  const [recentOpen, setRecentOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParamsRef.current.toString())
      if (search) params.set("q", search)
      else params.delete("q")
      router.replace(`?${params.toString()}`, { scroll: false })
    }, 300)
    return () => clearTimeout(timer)
  }, [search, router])

  useEffect(() => {
    const params = new URLSearchParams(searchParamsRef.current.toString())
    if (activeCategory !== "all") params.set("cat", activeCategory)
    else params.delete("cat")
    if (view !== DEFAULT_VIEW) params.set("view", view)
    else params.delete("view")
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [activeCategory, view, router])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return resources.filter((r) => {
      const matchCat = activeCategory === "all" || r.category.id === activeCategory
      const matchSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q) ||
        r.category.title.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      return matchCat && matchSearch
    })
  }, [resources, activeCategory, search])

  const recentlyAdded = useMemo(() => [...resources].slice(0, 8), [resources])

  const sidebarSlot = (
    <>
      <Card className="gap-0 p-0">
        <CardContent className="p-5">
          <p className="mb-4 text-xs font-semibold tracking-widest text-primary uppercase">Категорії</p>
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => setActiveCategory("all")}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-medium transition-colors ${activeCategory === "all" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"}`}
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
              Всі категорії
              <span className="ml-auto text-[11px] font-semibold opacity-60">{resources.length}</span>
            </button>
            {categories.map((cat) => {
              const count = resources.filter((r) => r.category.id === cat.id).length
              if (!count) return null
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-medium transition-colors ${activeCategory === cat.id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"}`}
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                  {cat.title}
                  <span className="ml-auto text-[11px] font-semibold opacity-60">{count}</span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="gap-0 p-0">
        <CardContent className="p-5">
          <p className="mb-4 text-xs font-semibold tracking-widest text-primary uppercase">Нещодавно додано</p>
          <div className="flex flex-col divide-y">
            {recentlyAdded.slice(0, 5).map((r) => {
              const Icon = ICON_MAP[r.icon] ?? ICON_MAP.Building2
              return (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-2.5 py-3 no-underline first:pt-0 last:pb-0"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: r.category.bg }}>
                    <Icon size={12} color={r.category.accent} strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-[12.5px] leading-snug font-medium text-foreground transition-colors group-hover:text-primary">
                      {r.title}
                    </p>
                    <span className="text-[11px] text-muted-foreground">{formatDate(r.createdAt)}</span>
                  </div>
                </a>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <SidebarStats
        items={[
          { label: "Всього ресурсів", value: resources.length },
          { label: "Знайдено", value: filtered.length },
          { label: "Категорій", value: categories.length },
        ]}
      />
    </>
  )

  return (
    <>
      <div className="relative min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6">
          <div className="mb-4 flex items-center gap-2 text-[13px] text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Головна
            </Link>
            <span className="text-[10px]">›</span>
            <span className="text-foreground">Ресурси</span>
          </div>
          <Badge variant="secondary" className="mb-4">
            Корисні посилання
          </Badge>
          <h1 className="mb-2 text-[clamp(28px,4vw,48px)] leading-tight font-bold text-foreground">Корисні ресурси</h1>
          <p className="text-[15px] text-muted-foreground">{resources.length} ресурсів · зовнішні сайти та сервіси для мешканців Черкас</p>

          <div className="mt-4 flex flex-wrap gap-2 lg:hidden">
            <button
              onClick={() => setActiveCategory("all")}
              className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-all duration-150 ${activeCategory === "all" ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"}`}
            >
              Всі
            </button>
            {categories.map((cat) => {
              const count = resources.filter((r) => r.category.id === cat.id).length
              if (!count) return null
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-all duration-150 ${activeCategory === cat.id ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"}`}
                >
                  {cat.title}
                </button>
              )
            })}
          </div>
        </div>

        <PageLayout
          search={search}
          setSearch={setSearch}
          view={view}
          setView={setView}
          searchPlaceholder="Пошук ресурсів..."
          extraNavItems={[
            { key: "recent", icon: <Clock size={18} />, label: "Нещодавні", active: recentOpen, onClick: () => setRecentOpen(true) },
          ]}
          sidebarSlot={sidebarSlot}
        >
          <p className="mb-4 text-[13px] text-muted-foreground">
            Знайдено <span className="font-semibold text-foreground">{filtered.length}</span> ресурсів
          </p>

          {filtered.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <p className="mb-3 text-4xl">🔍</p>
                <p className="mb-1 text-[15px] font-semibold text-foreground">Нічого не знайдено</p>
                <p className="mb-4 text-[13px] text-muted-foreground">Спробуйте змінити запит або категорію</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch("")
                    setActiveCategory("all")
                  }}
                >
                  Скинути фільтри
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {view === "grid" && <ResourcesGrid resources={filtered} />}
              {view === "list" && <ResourcesList resources={filtered} />}
              {view === "table" && <ResourcesTable resources={filtered} total={resources.length} />}
            </>
          )}
        </PageLayout>
      </div>

      <Dialog open={recentOpen} onOpenChange={setRecentOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Нещодавно додано</DialogTitle>
          </DialogHeader>
          <ul className="max-h-[60vh] divide-y overflow-y-auto">
            {recentlyAdded.map((r) => {
              const Icon = ICON_MAP[r.icon] ?? ICON_MAP.Building2
              return (
                <li key={r.id}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setRecentOpen(false)}
                    className="group flex items-start gap-3 px-1 py-3.5 no-underline"
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: r.category.bg }}>
                      <Icon size={16} color={r.category.accent} strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] leading-snug font-medium text-foreground transition-colors group-hover:text-primary">
                        {r.title}
                      </p>
                      {r.description && <p className="mt-0.5 truncate text-[12px] text-muted-foreground">{r.description}</p>}
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[11px] text-muted-foreground">{formatDate(r.createdAt)}</span>
                        <span className="text-[11px] text-border">·</span>
                        <span className="text-[11px] font-medium" style={{ color: r.category.accent }}>
                          {r.category.title}
                        </span>
                      </div>
                    </div>
                  </a>
                </li>
              )
            })}
          </ul>
          <div className="border-t pt-3">
            <p className="text-[12px] text-muted-foreground">
              Знайшли неактуальне посилання?{" "}
              <a href="mailto:info@portal.cherkasy.ua" className="text-primary hover:underline">
                Напишіть нам
              </a>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ResourcesGrid({ resources }: { resources: ResourceWithCategory[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {resources.map((res) => {
        const Icon = ICON_MAP[res.icon] ?? ICON_MAP.Building2
        return (
          <a
            key={res.id}
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col overflow-hidden rounded-2xl border bg-card no-underline shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="h-1 opacity-80" style={{ background: res.category.accent }} />
            <div className="flex flex-1 flex-col p-4">
              <div className="mb-2.5 flex items-center justify-between gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: res.category.bg }}>
                  <Icon size={17} color={res.category.accent} strokeWidth={1.8} />
                </div>
                <ExternalLink size={13} className="text-muted-foreground opacity-50 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="mb-0.5 text-[13.5px] leading-snug font-semibold text-foreground">{res.title}</p>
              {res.description && (
                <p className="mb-3 line-clamp-3 flex-1 text-[12px] leading-relaxed text-muted-foreground">{res.description}</p>
              )}
              <div className="mt-auto flex items-center justify-between border-t pt-3">
                <span
                  className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                  style={{ background: res.category.bg, color: res.category.accent }}
                >
                  {res.category.title}
                </span>
                <span className="text-[11px] text-muted-foreground">{formatDate(res.createdAt)}</span>
              </div>
            </div>
          </a>
        )
      })}
    </div>
  )
}

function ResourcesList({ resources }: { resources: ResourceWithCategory[] }) {
  return (
    <div className="flex flex-col gap-2">
      {resources.map((res) => {
        const Icon = ICON_MAP[res.icon] ?? ICON_MAP.Building2
        return (
          <a
            key={res.id}
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl border bg-card px-5 py-4 no-underline shadow-sm transition-all duration-200 hover:translate-x-1 hover:shadow-md"
          >
            <div className="w-1 shrink-0 self-stretch rounded-full" style={{ background: res.category.accent }} />
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: res.category.bg }}>
              <Icon size={18} color={res.category.accent} strokeWidth={1.8} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] leading-tight font-semibold text-foreground">{res.title}</p>
              {res.description && <p className="mt-0.5 truncate text-[13px] text-muted-foreground">{res.description}</p>}
            </div>
            <span
              className="hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold sm:inline-flex"
              style={{ background: res.category.bg, color: res.category.accent }}
            >
              {res.category.title}
            </span>
            <ExternalLink size={15} className="shrink-0 text-muted-foreground" />
          </a>
        )
      })}
    </div>
  )
}

function ResourcesTable({ resources, total }: { resources: ResourceWithCategory[]; total: number }) {
  return (
    <Card className="overflow-hidden rounded-2xl border p-0 shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="pl-5 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Ресурс</TableHead>
              <TableHead className="hidden text-[11px] font-bold tracking-wider text-muted-foreground uppercase sm:table-cell">
                Категорія
              </TableHead>
              <TableHead className="hidden w-32 text-[11px] font-bold tracking-wider text-muted-foreground uppercase md:table-cell">
                Додано
              </TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((res) => {
              const Icon = ICON_MAP[res.icon] ?? ICON_MAP.Building2
              return (
                <TableRow
                  key={res.id}
                  className="group cursor-pointer border-b transition-colors last:border-0 hover:bg-muted/30"
                  onClick={() => window.open(res.url, "_blank")}
                >
                  <TableCell className="w-full max-w-0 py-3.5 pl-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: res.category.bg }}>
                        <Icon size={14} color={res.category.accent} strokeWidth={1.8} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-foreground">{res.title}</p>
                        {res.description && <p className="truncate text-[11px] text-muted-foreground">{res.description}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden py-3.5 sm:table-cell">
                    <span
                      className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold"
                      style={{ background: res.category.bg, color: res.category.accent }}
                    >
                      {res.category.title}
                    </span>
                  </TableCell>
                  <TableCell className="hidden w-32 py-3.5 md:table-cell">
                    <span className="text-[12px] whitespace-nowrap text-muted-foreground">{formatDate(res.createdAt)}</span>
                  </TableCell>
                  <TableCell className="py-3.5 pr-4 text-right">
                    <ExternalLink size={14} className="ml-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <Separator />
        <div className="px-5 py-3">
          <p className="text-[12px] text-muted-foreground">
            Показано <span className="font-semibold text-foreground">{resources.length}</span> з{" "}
            <span className="font-semibold text-foreground">{total}</span> ресурсів
          </p>
        </div>
      </CardContent>
    </Card>
  )
}