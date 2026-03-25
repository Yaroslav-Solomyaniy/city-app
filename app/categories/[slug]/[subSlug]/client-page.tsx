"use client"

import Link from "next/link"
import Image from "next/image"
import React from "react"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ViewMode, DEFAULT_VIEW } from "@/constants/view-mode"
import { useSearchView } from "@/hooks/use-search-view"
import PageLayout, { SidebarSlotItem } from "@/components/page-sidebar/page-layout"
import { ICON_MAP } from "@/constants/icon-map"
import { PublicCategory, PublicSubcategory } from "@/types/action"
import ResourcesGrid from "@/app/categories/[slug]/_components/resources-grid"
import ResourcesList from "@/app/categories/[slug]/_components/resources-list"
import ResourcesTable from "@/app/categories/[slug]/_components/resources-table"
import EmptyState from "@/components/empty-state"
import ActiveFilters from "@/components/active-filters"
import ResultsCount from "@/components/result-counts"

interface Props {
  category: PublicCategory
  allCategory: PublicCategory
  subcategory: PublicSubcategory
}

export default function SubCategoryPageClient({ category, allCategory, subcategory }: Props) {
  const router = useRouter()

  const { search, setSearch, view, setView } = useSearchView()

  const CatIcon = ICON_MAP[category.iconName] ?? ICON_MAP.Building2

  // Ресурси цієї підкатегорії — вже відфільтровані сервером
  const resources = category.resources.filter((r) => r.subcategory?.slug === subcategory.slug)
  const allSubcategory = allCategory.subcategories.find((s) => s.slug === subcategory.slug)
  const totalResources = allSubcategory?._count.resources ?? 0

  function goBack() {
    const params = new URLSearchParams()
    if (view !== DEFAULT_VIEW) params.set("view", view)
    const qs = params.toString()
    router.push(`/categories/${category.slug}${qs ? `?${qs}` : ""}`)
  }

  function goToSub(slug: string) {
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
            <p className="text-[11px] text-muted-foreground">{allCategory.titleEn}</p>
          </div>
        </div>
        {allCategory.description && <p className="text-[13px] leading-relaxed text-muted-foreground">{allCategory.description}</p>}
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 gap-1.5 px-0 text-[12.5px] font-semibold hover:bg-transparent"
          style={{ color: allCategory.accent }}
          onClick={goBack}
        >
          <ArrowLeft size={13} /> До категорії
        </Button>
      </CardContent>
    </Card>
  )

  const subcategoriesContent = (
    <div className="flex flex-col gap-0.5">
      {allCategory.subcategories.map((sub) => {
        const isActive = sub.slug === subcategory.slug
        return (
          <Button
            key={sub.id}
            variant="ghost"
            onClick={() => goToSub(sub.slug)}
            className="h-auto w-full justify-start gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-medium"
            style={isActive ? { background: allCategory.accent + "12", color: allCategory.accent } : undefined}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: isActive ? allCategory.accent : allCategory.accent + "60" }}
            />
            <span className={isActive ? "font-semibold" : "text-muted-foreground"}>{sub.title}</span>
            <span className="ml-auto text-[11px] font-semibold opacity-60">{sub._count.resources}</span>
            <ChevronRight size={12} className="text-muted-foreground" />
          </Button>
        )
      })}
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
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/20" />

          <div className="relative">
            <div className="mb-4">
              <Link
                href={`/categories/${category.slug}`}
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/15 px-3 py-1.5 text-sm font-medium text-white/80 transition-colors hover:border-white/60 hover:text-white"
              >
                <ArrowLeft size={14} /> Повернутись до категорії: {category.title}
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
                <h1 className="text-2xl leading-tight font-bold text-white sm:text-3xl">{subcategory.title}</h1>
                <p className="text-[13px] text-white/70">{subcategory.titleEn}</p>
              </div>
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
        {/*<Button variant="ghost" size="sm" className="mb-4 gap-1.5 px-0 text-[13px] font-semibold hover:bg-transparent" onClick={goBack}>*/}
        {/*  <ArrowLeft size={14} /> Назад до «{category.title}»*/}
        {/*</Button>*/}

        <ActiveFilters filters={[...(search ? [{ key: "q", label: `🔍 «${search}»`, onRemove: () => setSearch("") }] : [])]} />

        <ResultsCount count={resources.length} total={totalResources} word="ресурс" />

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
