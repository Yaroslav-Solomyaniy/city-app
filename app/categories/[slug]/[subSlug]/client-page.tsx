"use client"

import Link from "next/link"
import Image from "next/image"
import React, { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ViewMode, DEFAULT_VIEW } from "@/constants/view-mode"
import PageLayout from "@/components/page-sidebar/page-layout"
import { ICON_MAP } from "@/constants/icon-map"
import { PublicCategory, PublicSubcategory } from "@/types/action"
import ResourcesGrid from "@/app/categories/[slug]/_components/resources-grid"
import ResourcesList from "@/app/categories/[slug]/_components/resources-list"
import ResourcesTable from "@/app/categories/[slug]/_components/resources-table"
import { plural } from "@/lib/plural"
import EmptyState from "@/components/empty-state"

interface Props {
  category: PublicCategory
  subcategory: PublicSubcategory
  initialSearch: string
  initialView?: ViewMode
}

export default function SubCategoryPageClient({ category, subcategory, initialSearch, initialView }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(initialSearch)
  const [view, setView] = useState<ViewMode>(initialView ?? DEFAULT_VIEW)

  const CatIcon = ICON_MAP[category.iconName] ?? ICON_MAP.Building2

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (search) params.set("q", search)
    else params.delete("q")
    if (view !== DEFAULT_VIEW) params.set("view", view)
    else params.delete("view")
    const newUrl = `?${params.toString()}`
    const current = `?${searchParams.toString()}`
    if (newUrl !== current) router.replace(newUrl, { scroll: false })
  }, [search, view, router, searchParams])

  const filtered = useMemo(() => {
    const source = category.resources.filter((r) => r.subcategory?.slug === subcategory.slug)
    if (!search) return source
    const q = search.toLowerCase()
    return source.filter((r) => r.title.toLowerCase().includes(q) || (r.description ?? "").toLowerCase().includes(q))
  }, [category.resources, subcategory.slug, search])

  function goBack() {
    const params = new URLSearchParams()
    if (view !== DEFAULT_VIEW) params.set("view", view)
    const qs = params.toString()
    router.push(`/categories/${category.slug}${qs ? `?${qs}` : ""}`)
  }

  function goToSub(sub: PublicSubcategory) {
    const params = new URLSearchParams()
    if (view !== DEFAULT_VIEW) params.set("view", view)
    const qs = params.toString()
    router.push(`/categories/${category.slug}/${sub.slug}${qs ? `?${qs}` : ""}`)
  }

  const sidebarSlot = (
    <>
      {/* Картка категорії */}
      <Card className="gap-0 overflow-hidden p-0">
        {category.photo && (
          <div className="relative h-32 w-full overflow-hidden">
            <Image src={category.photo} alt={category.title} fill className="object-cover" unoptimized={category.photo.includes("/upload_")} />
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/40" />
          </div>
        )}
        <div className="h-1 shrink-0 opacity-80" style={{ background: category.accent }} />
        <CardContent className="p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: category.bg }}>
              <CatIcon size={17} color={category.accent} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-foreground">{category.title}</p>
              <p className="text-[11px] text-muted-foreground">{category.titleEn}</p>
            </div>
          </div>
          {category.description && <p className="text-[13px] leading-relaxed text-muted-foreground">{category.description}</p>}
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 gap-1.5 px-0 text-[12.5px] font-semibold hover:bg-transparent"
            style={{ color: category.accent }}
            onClick={goBack}
          >
            <ArrowLeft size={13} /> До категорії
          </Button>
        </CardContent>
      </Card>

      {/* Список підкатегорій з активною підсвіткою */}
      {category.subcategories.length > 0 && (
        <Card className="gap-0 p-0">
          <CardContent className="p-5">
            <p className="mb-3 text-[13.5px] font-semibold text-foreground">Підкатегорії</p>
            <div className="flex flex-col gap-0.5">
              {category.subcategories.map((sub) => {
                const isActive = sub.slug === subcategory.slug
                return (
                  <Button
                    key={sub.id}
                    variant="ghost"
                    onClick={() => goToSub(sub)}
                    className="h-auto w-full justify-start gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-medium"
                    style={isActive ? { background: category.accent + "12", color: category.accent } : undefined}
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: isActive ? category.accent : category.accent + "60" }}
                    />
                    <span className={isActive ? "font-semibold" : "text-muted-foreground"}>{sub.title}</span>
                    <span className="ml-auto text-[11px] font-semibold opacity-60">{sub._count.resources}</span>
                    <ChevronRight size={12} className="text-muted-foreground" />
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )

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
            {/* Breadcrumb */}
            <div className="mb-3 flex flex-wrap items-center gap-1.5 text-[13px] text-white/70">
              <Link href="/categories" className="transition-colors hover:text-white">
                Категорії
              </Link>
              <span className="text-[10px]">›</span>
              <Link href={`/categories/${category.slug}`} className="transition-colors hover:text-white">
                {category.title}
              </Link>
              <span className="text-[10px]">›</span>
              <span className="text-white">{subcategory.title}</span>
            </div>

            {/* Title */}
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
        view={view}
        setView={setView}
        searchPlaceholder="Пошук ресурсів..."
        sidebarSlot={sidebarSlot}
        stickyTop={80}
      >
        <Button variant="ghost" size="sm" className="mb-4 gap-1.5 px-0 text-[13px] font-semibold hover:bg-transparent" onClick={goBack}>
          <ArrowLeft size={14} /> Назад до «{category.title}»
        </Button>

        <p className="mb-4 text-[13px] text-muted-foreground">
          Знайдено <span className="font-semibold text-foreground">{plural(filtered.length, "ресурс")}</span>
        </p>

        {filtered.length === 0 ? (
          <EmptyState variant={search ? "search" : "empty"} query={search} onResetSearch={() => setSearch("")} />
        ) : (
          <>
            {view === "grid" && <ResourcesGrid resources={filtered} category={category} />}
            {view === "list" && <ResourcesList resources={filtered} category={category} />}
            {view === "table" && <ResourcesTable resources={filtered} category={category} />}
          </>
        )}
      </PageLayout>
    </div>
  )
}
