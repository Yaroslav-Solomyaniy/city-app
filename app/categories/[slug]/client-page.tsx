"use client"

import Link from "next/link"
import Image from "next/image"
import React, { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronRight } from "lucide-react"

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
  initialSearch: string
  initialView?: ViewMode
}

export default function CategoryPageClient({ category, initialSearch, initialView }: Props) {
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

  // Тільки ресурси без підкатегорії (вони на окремому роуті)
  const filtered = useMemo(() => {
    const source = category.resources.filter((r) => !r.subcategoryId)
    if (!search) return source
    const q = search.toLowerCase()
    return source.filter((r) => r.title.toLowerCase().includes(q) || (r.description ?? "").toLowerCase().includes(q))
  }, [category.resources, search])

  function openSubcategory(sub: PublicSubcategory) {
    const params = new URLSearchParams()
    if (view !== DEFAULT_VIEW) params.set("view", view)
    const qs = params.toString()
    router.push(`/categories/${category.slug}/${sub.slug}${qs ? `?${qs}` : ""}`)
  }

  const sidebarSlot = (
    <>
      <Card className="gap-0 overflow-hidden p-0">
        {category.photo && (
          <div className="relative h-32 w-full overflow-hidden">
            <Image src={category.photo} alt={category.title} fill className="object-cover" unoptimized={category.photo.includes("/upload_")} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
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
          {category.services.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {category.services.map((s) => (
                <span
                  key={s}
                  className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
                  style={{ borderColor: category.accent + "30", color: category.accent, background: category.accent + "08" }}
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {category.subcategories.length > 0 && (
        <Card className="gap-0 p-0">
          <CardContent className="p-5">
            <p className="mb-3 text-[13.5px] font-semibold text-foreground">Підкатегорії</p>
            <div className="flex flex-col gap-0.5">
              {category.subcategories.map((sub) => (
                <Button
                  key={sub.id}
                  variant="ghost"
                  onClick={() => openSubcategory(sub)}
                  className="h-auto w-full justify-start gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-medium text-muted-foreground"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: category.accent }} />
                  {sub.title}
                  <span className="ml-auto text-[11px] font-semibold opacity-60">{sub._count.resources}</span>
                  <ChevronRight size={12} className="text-muted-foreground" />
                </Button>
              ))}
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
              <span className="text-white">{category.title}</span>
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
                <h1 className="text-2xl leading-tight font-bold text-white sm:text-3xl">{category.title}</h1>
                <p className="text-[13px] text-white/70">{category.titleEn}</p>
              </div>
            </div>

            {/* Мобільний: опис + теги */}
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
        view={view}
        setView={setView}
        searchPlaceholder="Пошук ресурсів..."
        sidebarSlot={sidebarSlot}
        stickyTop={80}
      >
        {/* Підкатегорії */}
        {category.subcategories.length > 0 && (
          <div className="mb-6">
            <p className="mb-3 text-[12.5px] font-semibold tracking-wide text-muted-foreground uppercase">Підкатегорії</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {category.subcategories.map((sub) => (
                <Button
                  key={sub.id}
                  variant="outline"
                  onClick={() => openSubcategory(sub)}
                  className="h-auto w-full justify-start gap-4 rounded-2xl px-5 py-4 shadow-sm transition-all hover:translate-x-0.5 hover:shadow-md"
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

        {/* Ресурси напряму в категорії (без підкатегорії) */}
        {category.resources.filter((r) => !r.subcategoryId).length > 0 && (
          <p className="mb-3 text-[12.5px] font-semibold tracking-wide text-muted-foreground uppercase">Ресурси</p>
        )}

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
