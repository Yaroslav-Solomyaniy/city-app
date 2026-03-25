// app/categories/client-page.tsx
"use client"

import Link from "next/link"
import React, { useMemo } from "react"
import { AlertCircle, Baby, Briefcase, Building2, Bus, Calendar, GraduationCap, Heart, Hospital, School, Users, Zap, X } from "lucide-react"
import { ViewMode, DEFAULT_VIEW } from "@/constants/view-mode"
import PageLayout, { SidebarSlotItem } from "@/components/page-sidebar/page-layout"
import { CategoryWithCount } from "@/types/action"
import CategoriesGrid from "./_components/categories-grid"
import CategoriesList from "./_components/categories-list"
import CategoriesTable from "./_components/categories-table"
import { plural, wordForm } from "@/lib/plural"
import EmptyState from "@/components/empty-state"
import { parseAsString, useQueryState } from "nuqs"
import { RecentResourcesList } from "@/app/resources/_components/recent-resources-list"
import TopCategoriesByResources from "@/components/top-categories-by-resources"
import LastAddedCategories from "@/components/last-added-categories"
import ActiveFilters from "@/components/active-filters"
import ResultsCount from "@/components/result-counts"

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

interface Props {
  categories: CategoryWithCount[]
  resourcesCount: number
}

export default function CategoriesClient({ categories, resourcesCount }: Props) {
  const [search, setSearch] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({
      limitUrlUpdates: { method: "throttle", timeMs: 300 },
      shallow: true,
    })
  )
  const [view, setView] = useQueryState("view", parseAsString.withDefault(DEFAULT_VIEW).withOptions({ shallow: true }))

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

  const hasFilters = search !== ""

  const sidebarSlot: SidebarSlotItem[] = [
    {
      title: "Останні додані",
      content: <LastAddedCategories categories={categories} />,
    },
    {
      title: "Топ за ресурсами",
      content: <TopCategoriesByResources categories={categories} />,
    },
  ]

  return (
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
        sidebarSlot={sidebarSlot}
      >
        <ActiveFilters filters={[...(search ? [{ key: "q", label: `🔍 «${search}»`, onRemove: () => setSearch("") }] : [])]} />

        <ResultsCount count={filtered.length} total={categories.length} word="категорій" />

        {filtered.length === 0 ? (
          <EmptyState variant={search ? "search" : "empty"} query={search} onResetSearch={() => setSearch("")} />
        ) : (
          <>
            {view === "grid" && <CategoriesGrid categories={filtered} />}
            {view === "list" && <CategoriesList categories={filtered} />}
            {view === "table" && <CategoriesTable categories={filtered} total={categories.length} />}
          </>
        )}
      </PageLayout>
    </div>
  )
}
