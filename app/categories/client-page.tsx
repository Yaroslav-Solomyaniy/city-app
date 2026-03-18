// app/categories/client-page.tsx
"use client"

import Link from "next/link"
import React, { useMemo, useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  AlertCircle,
  Baby,
  Briefcase,
  Building2,
  Bus,
  Calendar,
  BarChart2,
  GraduationCap,
  Heart,
  Hospital,
  School,
  Users,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ViewMode, DEFAULT_VIEW } from "@/constants/view-mode"
import PageLayout from "@/components/page-sidebar/page-layout"
import { CategoryWithCount } from "@/types/action"
import CategoriesGrid from "./_components/categories-grid"
import CategoriesList from "./_components/categories-list"
import CategoriesTable from "./_components/categories-table"
import { plural, wordForm } from "@/lib/plural"

const ICON_MAP: Record<string, React.ElementType> = {
  Heart,
  GraduationCap,
  Building2,
  Users,
  Zap,
  Briefcase,
  Bus,
  AlertCircle,
  Calendar,
  School,
  Baby,
  Hospital,
}

export default function CategoriesClient({ categories }: { categories: CategoryWithCount[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchParamsRef = useRef(searchParams)
  useEffect(() => {
    searchParamsRef.current = searchParams
  }, [searchParams])

  const [search, setSearch] = useState(searchParams.get("q") ?? "")
  const [view, setView] = useState<ViewMode>((searchParams.get("view") as ViewMode) ?? DEFAULT_VIEW)
  const [topOpen, setTopOpen] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)

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
    if (view !== DEFAULT_VIEW) params.set("view", view)
    else params.delete("view")
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [view, router])

  const totalResources = categories.reduce((s, c) => s + c._count.resources, 0)

  const filtered = useMemo(
    () =>
      categories.filter(
        (c) =>
          !search ||
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.titleEn.toLowerCase().includes(search.toLowerCase()) ||
          c.services.some((s) => s.toLowerCase().includes(search.toLowerCase()))
      ),
    [search, categories]
  )

  const stats = [
    { value: categories.length, word: "категорія" },
    { value: totalResources, word: "ресурс" },
    { value: filtered.length, label: "у пошуку" },
  ]

  const sidebarBlock = (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="border-b px-5 py-3">
        <p className="text-[12px] font-semibold tracking-widest text-primary uppercase">Статистика</p>
      </div>

      <div className="flex border-b">
        {stats.map((s, i, arr) => (
          <div key={i} className={`flex flex-1 flex-col items-center py-4 ${i < arr.length - 1 ? "border-r" : ""}`}>
            <p className="text-[22px] leading-none font-bold text-foreground">{s.value}</p>
            <p className="mt-1.5 text-[11px] text-muted-foreground">{"label" in s ? s.label : wordForm(s.value, s.word)}</p>
          </div>
        ))}
      </div>

      <div className="border-b px-5 py-2.5">
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">Останні додані</p>
      </div>
      {[...categories]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)
        .map((cat, i, arr) => {
          const Icon = ICON_MAP[cat.iconName] ?? Building2
          return (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className={`flex items-center gap-3 px-5 py-2.5 text-[13px] transition-colors hover:bg-muted/40 ${i < arr.length - 1 ? "border-b" : ""}`}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: cat.bg }}>
                <Icon size={13} color={cat.accent} strokeWidth={1.8} />
              </div>
              <span className="flex-1 truncate font-medium text-foreground">{cat.title}</span>
              <span className="text-[11px] whitespace-nowrap text-muted-foreground">
                {new Date(cat.createdAt).toLocaleDateString("uk-UA", { day: "numeric", month: "short" })}
              </span>
            </Link>
          )
        })}

      <div className="border-t border-b px-5 py-2.5">
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">Топ за ресурсами</p>
      </div>
      {[...categories]
        .sort((a, b) => b._count.resources - a._count.resources)
        .slice(0, 3)
        .map((cat, i, arr) => {
          const Icon = ICON_MAP[cat.iconName] ?? Building2
          return (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className={`flex items-center gap-3 px-5 py-2.5 text-[13px] transition-colors hover:bg-muted/40 ${i < arr.length - 1 ? "border-b" : ""}`}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: cat.bg }}>
                <Icon size={13} color={cat.accent} strokeWidth={1.8} />
              </div>
              <span className="flex-1 truncate font-medium text-foreground">{cat.title}</span>
              <span className="rounded-full px-2 py-0.5 text-[11.5px] font-semibold" style={{ background: cat.bg, color: cat.accent }}>
                {cat._count.resources}
              </span>
            </Link>
          )
        })}
    </div>
  )

  return (
    <>
      <div className="relative min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 pt-10 pb-4 sm:px-6">
          <h1 className="mb-2 text-[clamp(28px,4vw,48px)] leading-tight font-bold text-foreground">Категорії послуг</h1>
          <p className="mb-4 text-[15px] text-muted-foreground">
            Знайдіть потрібні сервіси, організації та корисні посилання для вирішення щоденних питань
          </p>
        </div>

        <PageLayout
          search={search}
          setSearch={setSearch}
          view={view}
          setView={setView}
          searchPlaceholder="Пошук категорії..."
          extraNavItems={[
            {
              key: "stats",
              icon: <BarChart2 size={18} />,
              label: "Статистика",
              active: statsOpen,
              onClick: () => setStatsOpen(true),
            },
            {
              key: "top",
              icon: <BarChart2 size={18} />,
              label: "Топ",
              active: topOpen,
              onClick: () => setTopOpen(true),
            },
          ]}
          sidebarSlot={sidebarBlock}
        >
          <p className="mb-4 text-[13px] text-muted-foreground">
            Знайдено <span className="font-semibold text-foreground">{plural(filtered.length, "категорія")}</span>
          </p>

          {filtered.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <p className="mb-3 text-4xl">🔍</p>
                <p className="mb-1 text-[15px] font-semibold text-foreground">Нічого не знайдено</p>
                <p className="mb-4 text-[13px] text-muted-foreground">Спробуйте змінити запит</p>
                <Button variant="ghost" size="sm" onClick={() => setSearch("")}>
                  Скинути пошук
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {view === "grid" && <CategoriesGrid categories={filtered} />}
              {view === "list" && <CategoriesList categories={filtered} />}
              {view === "table" && <CategoriesTable categories={filtered} total={categories.length} />}
            </>
          )}
        </PageLayout>
      </div>

      {/* Модалка статистики — мобільний */}
      <Dialog open={statsOpen} onOpenChange={setStatsOpen}>
        <DialogContent className="max-w-sm overflow-hidden p-0">
          <DialogHeader className="border-b px-5 py-4">
            <DialogTitle className="text-[15px]">Статистика та топ</DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto">{sidebarBlock}</div>
        </DialogContent>
      </Dialog>

    </>
  )
}
