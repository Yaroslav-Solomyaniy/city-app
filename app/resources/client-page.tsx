"use client"

import Link from "next/link"
import React, { useMemo } from "react"
import { ExternalLink, X } from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"

import { DEFAULT_VIEW, ViewMode } from "@/constants/view-mode"
import PageLayout, { SidebarSlotItem } from "@/components/page-sidebar/page-layout"
import SidebarStats from "@/components/page-sidebar-stats"
import { ICON_MAP } from "@/constants/icon-map"
import { formatDate } from "@/lib/format-date"
import { CategoryWithCount, ResourceWithCategory } from "@/types/action"
import EmptyState from "@/components/empty-state"
import { RecentResourcesList } from "@/app/resources/_components/recent-resources-list"
import CategoriesCountList from "@/components/categories-count-list"
import ActiveFilters from "@/components/active-filters"
import ResultsCount from "@/components/result-counts"

interface Props {
  resources: ResourceWithCategory[]
  allResources: ResourceWithCategory[]
  categories: CategoryWithCount[]
}

export default function ResourcesClient({ resources, allResources, categories }: Props) {
  const [search, setSearch] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({
      limitUrlUpdates: { method: "debounce", timeMs: 400 },
      shallow: false,
    })
  )
  const [activeCategory, setActiveCategory] = useQueryState("cat", parseAsString.withDefault("all").withOptions({ shallow: false }))
  const [view, setView] = useQueryState("view", parseAsString.withDefault(DEFAULT_VIEW).withOptions({ shallow: false }))

  const activeCategoryLabel = useMemo(() => categories.find((c) => c.slug === activeCategory)?.title ?? null, [categories, activeCategory])

  const sidebarSlot: SidebarSlotItem[] = [
    {
      title: "Категорії",
      content: (
        <CategoriesCountList
          categories={categories.map((cat) => ({
            id: cat.id,
            slug: cat.slug,
            title: cat.title,
            count: cat._count.resources,
          }))}
          activeSlug={activeCategory}
          totalCount={allResources.length}
          onSelect={setActiveCategory}
        />
      ),
    },
    {
      title: "Нещодавно додані",
      content: <RecentResourcesList resources={allResources} />,
    },
    {
      title: "Статистика",
      content: (
        <SidebarStats
          items={[
            { label: "Всього ресурсів", value: allResources.length },
            { label: "Всього категорій", value: categories.length },
          ]}
        />
      ),
    },
  ]

  return (
    <div className="relative min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6">
<h1 className="mb-2 text-[clamp(28px,4vw,48px)] leading-tight font-bold text-foreground">Перелік ресурсів</h1>
        <p className="text-[15px] text-muted-foreground">
          Це підбірка ресурсів, що допомагають швидше вирішувати побутові питання, залишатися в курсі подій у місті та користуватися
          онлайн-можливостями Черкас без поділу на категорії
        </p>
      </div>

      <PageLayout
        search={search}
        setSearch={setSearch}
        view={view as ViewMode}
        setView={setView}
        searchPlaceholder="Пошук ресурсів..."
        sidebarSlot={sidebarSlot}
      >
        <ActiveFilters
          filters={[
            ...(search ? [{ key: "q", label: `🔍 «${search}»`, onRemove: () => setSearch("") }] : []),
            ...(activeCategoryLabel ? [{ key: "cat", label: `📂 ${activeCategoryLabel}`, onRemove: () => setActiveCategory("all") }] : []),
          ]}
          onResetAll={() => {
            setSearch("")
            setActiveCategory("all")
          }}
        />

        <ResultsCount count={resources.length} total={allResources.length} word="ресурсів" />

        {resources.length === 0 ? (
          <EmptyState
            variant={search ? "search" : "empty"}
            query={search}
            hasFilter={activeCategory !== "all"}
            onResetSearch={() => setSearch("")}
            onResetFilter={() => setActiveCategory("all")}
          />
        ) : (
          <>
            {view === "grid" && <ResourcesGrid resources={resources} />}
            {view === "list" && <ResourcesList resources={resources} />}
            {view === "table" && <ResourcesTable resources={resources} />}
          </>
        )}
      </PageLayout>
    </div>
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
              {res.description && <p className="mb-3 flex-1 text-[12px] leading-relaxed text-muted-foreground">{res.description}</p>}
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
            className="group flex items-start gap-4 rounded-2xl border bg-card px-5 py-4 no-underline shadow-sm transition-all duration-200 hover:translate-x-1 hover:shadow-md"
          >
            <div className="mt-0.5 w-1 shrink-0 self-stretch rounded-full" style={{ background: res.category.accent }} />
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: res.category.bg }}>
              <Icon size={18} color={res.category.accent} strokeWidth={1.8} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] leading-tight font-semibold text-foreground">{res.title}</p>
              {res.description && <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{res.description}</p>}
            </div>
            <div className="ml-auto flex shrink-0 flex-col items-end gap-2 pt-0.5">
              <span
                className="hidden rounded-full px-2.5 py-1 text-[11px] font-semibold sm:inline-flex"
                style={{ background: res.category.bg, color: res.category.accent }}
              >
                {res.category.title}
              </span>
              <ExternalLink size={15} className="text-muted-foreground" />
            </div>
          </a>
        )
      })}
    </div>
  )
}

function ResourcesTable({ resources }: { resources: ResourceWithCategory[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-muted/40">
            <th
              className="py-3 pr-4 pl-5 text-left text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
              style={{ width: "50%" }}
            >
              Ресурс
            </th>
            <th
              className="hidden px-4 py-3 text-left text-[11px] font-bold tracking-wider text-muted-foreground uppercase sm:table-cell"
              style={{ width: "30%" }}
            >
              Категорія
            </th>
            <th
              className="hidden px-4 py-3 text-left text-[11px] font-bold tracking-wider text-muted-foreground uppercase md:table-cell"
              style={{ width: "120px" }}
            >
              Додано
            </th>
            <th style={{ width: "40px" }} />
          </tr>
        </thead>
        <tbody>
          {resources.map((res) => {
            const Icon = ICON_MAP[res.icon] ?? ICON_MAP.Building2
            return (
              <tr
                key={res.id}
                className="group cursor-pointer border-b transition-colors last:border-0 hover:bg-muted/30"
                onClick={() => window.open(res.url, "_blank")}
              >
                <td className="py-3.5 pr-4 pl-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: res.category.bg }}>
                      <Icon size={14} color={res.category.accent} strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-foreground">{res.title}</p>
                      {res.description && <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{res.description}</p>}
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3.5 align-top sm:table-cell">
                  <span
                    className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ background: res.category.bg, color: res.category.accent }}
                  >
                    {res.category.title}
                  </span>
                </td>
                <td className="hidden px-4 py-3.5 align-top md:table-cell">
                  <span className="text-[12px] whitespace-nowrap text-muted-foreground">{formatDate(res.createdAt)}</span>
                </td>
                <td className="py-3.5 pr-4 text-right align-top">
                  <ExternalLink size={14} className="ml-auto text-muted-foreground" />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="border-t px-5 py-3">
        <p className="text-[12px] text-muted-foreground">
          Показано <span className="font-semibold text-foreground">{resources.length}</span> ресурсів
        </p>
      </div>
    </div>
  )
}
