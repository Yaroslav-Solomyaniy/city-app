// app/categories/client-page.tsx
"use client"

import Link from "next/link"
import React, { useMemo, useState } from "react"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ViewMode, DEFAULT_VIEW } from "@/constants/view-mode"
import PageLayout from "@/components/page-sidebar/page-layout"
import { CategoryWithCount } from "@/types/action"
import CategoriesGrid from "./_components/categories-grid"
import CategoriesList from "./_components/categories-list"
import CategoriesTable from "./_components/categories-table"
import { plural, wordForm } from "@/lib/plural"
import EmptyState from "@/components/empty-state"
import { parseAsString, useQueryState } from "nuqs"

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
  const [search, setSearch] = useQueryState("q", parseAsString.withDefault("").withOptions({ throttleMs: 300, shallow: true }))
  const [view, setView] = useQueryState("view", parseAsString.withDefault(DEFAULT_VIEW).withOptions({ shallow: true }))
  const [statsOpen, setStatsOpen] = useState(false)

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

  const totalResources = categories.reduce((s, c) => s + c._count.resources, 0)

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
        <p className="tracking-widests text-[11px] font-semibold text-muted-foreground uppercase">Останні додані</p>
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
          view={view as ViewMode}
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
          ]}
          sidebarSlot={sidebarBlock}
        >
          <p className="mb-4 text-[13px] text-muted-foreground">
            Знайдено <span className="font-semibold text-foreground">{plural(filtered.length, "категорія")}</span>
          </p>

          {filtered.length === 0 ? (
            <EmptyState variant="search" query={search} onResetSearch={() => setSearch("")} />
          ) : (
            <>
              {view === "grid" && <CategoriesGrid categories={filtered} />}
              {view === "list" && <CategoriesList categories={filtered} />}
              {view === "table" && <CategoriesTable categories={filtered} total={categories.length} />}
            </>
          )}
        </PageLayout>
      </div>

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
