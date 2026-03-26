"use client"

import Link from "next/link"
import Image from "next/image"
import React from "react"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { DEFAULT_VIEW, ViewMode } from "@/constants/view-mode"
import { useSearchView } from "@/hooks/use-search-view"
import PageLayout, { SidebarSlotItem } from "@/components/page-sidebar/page-layout"
import { ICON_MAP } from "@/constants/icon-map"
import { PublicCategory } from "@/types/action"
import ResourcesGrid from "@/app/categories/[slug]/_components/resources-grid"
import ResourcesList from "@/app/categories/[slug]/_components/resources-list"
import ResourcesTable from "@/app/categories/[slug]/_components/resources-table"
import { plural } from "@/lib/plural"
import EmptyState from "@/components/empty-state"
import ActiveFilters from "@/components/active-filters"
import ResultsCount from "@/components/result-counts"
import { Card, CardContent } from "@/components/ui/card"

interface Props {
  category: PublicCategory
  allCategory: PublicCategory
}

export default function CategoryPageClient({ category, allCategory }: Props) {
  const router = useRouter()

  const { search, setSearch, view, setView } = useSearchView()

  const CatIcon = ICON_MAP[category.iconName] ?? ICON_MAP.Building2

  // Ресурси без підкатегорії — вже відфільтровані сервером
  const resources = category.resources.filter((r) => !r.subcategoryId)
  const totalDirectResources = allCategory.resources.filter((r) => !r.subcategoryId).length

  function openSubcategory(slug: string) {
    const params = new URLSearchParams()
    if (view !== DEFAULT_VIEW) params.set("view", view)
    const qs = params.toString()
    router.push(`/categories/${category.slug}/${slug}${qs ? `?${qs}` : ""}`)
  }

  // ── Контент сайдбару ────────────────────────────────────────

  const categoryInfoContent = (
    <Card className="gap-0 overflow-hidden p-0">
      {allCategory.photo && (
        <div className="relative h-32 w-full overflow-hidden">
          <Image
            src={allCategory.photo}
            alt={allCategory.title}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
        </div>
      )}
      <div className="h-1 shrink-0 opacity-80" style={{ background: allCategory.accent }} />
      <CardContent className="p-5">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: allCategory.bg }}>
            <CatIcon size={17} color={allCategory.accent} strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-foreground">{allCategory.title}</p>
          </div>
        </div>
        {allCategory.description && <p className="text-[13px] leading-relaxed text-muted-foreground">{allCategory.description}</p>}
        {allCategory.services.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {allCategory.services.map((s) => (
              <span
                key={s}
                className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
                style={{ borderColor: allCategory.accent + "30", color: allCategory.accent, background: allCategory.accent + "08" }}
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  const subcategoriesContent = (
    <div className="flex flex-col gap-0.5">
      {allCategory.subcategories.map((sub) => (
        <Button
          key={sub.id}
          variant="ghost"
          onClick={() => openSubcategory(sub.slug)}
          className="h-auto w-full justify-start gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-medium text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: allCategory.accent }} />
          {sub.title}
          <span className="ml-auto text-[11px] font-semibold opacity-60">{sub._count.resources}</span>
          <ChevronRight size={12} className="text-muted-foreground" />
        </Button>
      ))}
    </div>
  )

  const sidebarSlot: SidebarSlotItem[] = [
    {
      title: allCategory.title,
      raw: true,
      content: categoryInfoContent,
    },
    ...(allCategory.subcategories.length > 0 ? [{ title: "Підкатегорії", content: subcategoriesContent }] : []),
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative my-4 overflow-hidden rounded-2xl px-6 py-8 sm:px-8 sm:py-10" style={{ background: category.bg }}>
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${category.accent}cc 0%, ${category.accent}44 50%, transparent 95%)` }}
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${category.accent}dd 0%, ${category.accent}18 48%, ${category.accent}aa 100%)` }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/20" />

          <div className="relative">
            <div className="mb-4">
              <Link href="/categories" className="bg-white/15  inline-flex items-center gap-2 rounded-lg border border-white/30 px-3 py-1.5 text-sm font-medium text-white/80 transition-colors hover:border-white/60 hover:text-white">
                <ArrowLeft size={14} /> Повернутись до списку категорій
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-lg"
                style={{ background: "rgba(255,255,255,0.92)" }}
              >
                <CatIcon size={19} color={category.accent} strokeWidth={1.8} />
              </div>
              <div>
                <h1 className="text-2xl leading-tight font-bold text-white sm:text-3xl">{category.title}</h1>
                {category.titleEn && <p className="text-[13px] text-white/70">{category.titleEn}</p>}
              </div>
            </div>

            <div className="mt-4 lg:hidden">
              {category.description && <p className="mb-3 text-[13px] leading-relaxed text-white/80">{category.description}</p>}
              {category.services.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {category.services.map((s) => (
                    <span
                      key={s}
                      className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                      style={{
                        background: "rgba(255,255,255,0.18)",
                        color: "rgba(255,255,255,0.92)",
                        border: "1px solid rgba(255,255,255,0.25)",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <PageLayout
        search={search}
        setSearch={setSearch}
        view={view as ViewMode}
        setView={setView}
        searchPlaceholder="Пошук ресурсів..."
        sidebarSlot={sidebarSlot}
        stickyTop={80}
        showMoreButton={false}
      >
        {/* Підкатегорії */}
        {allCategory.subcategories.length > 0 && (
          <div className="mb-6">
            <p className="mb-3 text-[12.5px] font-semibold tracking-wide text-muted-foreground uppercase">Підкатегорії</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {allCategory.subcategories.map((sub) => (
                <Button
                  key={sub.id}
                  variant="outline"
                  onClick={() => openSubcategory(sub.slug)}
                  className="h-auto w-full justify-start gap-4 rounded-2xl px-5 py-4 shadow-sm transition-all hover:translate-x-0.5 hover:shadow-md hover:cursor-pointer"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: category.bg }}>
                    <CatIcon size={18} color={category.accent} strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-[14px] leading-tight font-semibold text-foreground">{sub.title}</p>
                    <p className="mt-0.5 text-[12px] text-muted-foreground">{plural(sub._count.resources, "ресурс")}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </Button>
              ))}
            </div>
          </div>
        )}

        {totalDirectResources > 0 && <p className="mb-3 text-[12.5px] font-semibold tracking-wide text-muted-foreground uppercase">Ресурси</p>}

        <ActiveFilters filters={[...(search ? [{ key: "q", label: `🔍 «${search}»`, onRemove: () => setSearch("") }] : [])]} />

        <ResultsCount count={resources.length} total={totalDirectResources} word="ресурс" />

        {resources.length === 0 ? (
          <EmptyState variant={search ? "search" : "empty"} query={search} onResetSearch={() => setSearch("")} />
        ) : (
          <>
            {view === "grid" && <ResourcesGrid resources={resources} category={category} />}
            {view === "list" && <ResourcesList resources={resources} category={category} />}
            {view === "table" && <ResourcesTable resources={resources} category={category} />}
          </>
        )}
      </PageLayout>
    </div>
  )
}
