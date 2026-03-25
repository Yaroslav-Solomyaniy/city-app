"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ExternalLink, FileText, FolderOpen, Layers, Search, X } from "lucide-react"

import { globalSearch, SearchResultItem } from "@/actions/search/global-search"
import { ICON_MAP } from "@/constants/icon-map"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// ── Types ─────────────────────────────────────────────────────

interface Props {
  open: boolean
  onClose: () => void
}

// ── Section label map ─────────────────────────────────────────

const SECTION_LABELS: Record<string, string> = {
  pages: "Сторінки",
  categories: "Категорії",
  subcategories: "Підкатегорії",
  resources: "Ресурси",
}

const SECTION_ICONS: Record<string, React.ElementType> = {
  pages: FileText,
  categories: FolderOpen,
  subcategories: Layers,
  resources: ExternalLink,
}

// ── Result item component ─────────────────────────────────────

function ResultItem({
  item,
  isActive,
  onSelect,
}: {
  item: SearchResultItem
  isActive: boolean
  onSelect: (item: SearchResultItem) => void
}) {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isActive) ref.current?.scrollIntoView({ block: "nearest" })
  }, [isActive])

  const iconNode = (() => {
    if (item.type === "page") {
      const PageIcon = SECTION_ICONS.pages
      return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          <PageIcon size={14} className="text-muted-foreground" />
        </div>
      )
    }
    if (item.iconName) {
      const Icon = ICON_MAP[item.iconName] ?? ICON_MAP.Building2
      return (
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ background: item.bg }}
        >
          <Icon size={14} color={item.accent} strokeWidth={1.8} />
        </div>
      )
    }
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Search size={14} className="text-muted-foreground" />
      </div>
    )
  })()

  return (
    <button
      ref={ref}
      onClick={() => onSelect(item)}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
        isActive ? "bg-primary/10 text-primary" : "hover:bg-muted/60"
      }`}
    >
      {iconNode}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold leading-tight text-foreground">{item.title}</p>
        {item.description && (
          <p className="mt-0.5 truncate text-[11.5px] leading-relaxed text-muted-foreground">{item.description}</p>
        )}
      </div>
      {item.external && <ExternalLink size={12} className="shrink-0 text-muted-foreground" />}
    </button>
  )
}

// ── Main component ────────────────────────────────────────────

export default function GlobalSearch({ open, onClose }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<{
    pages: SearchResultItem[]
    categories: SearchResultItem[]
    subcategories: SearchResultItem[]
    resources: SearchResultItem[]
    total: number
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery("")
      setResults(null)
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Debounced search
  const handleChange = useCallback((value: string) => {
    setQuery(value)
    setActiveIndex(0)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await globalSearch(value)
        setResults(res)
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [])

  // Flat list of all results for keyboard navigation
  const allItems: SearchResultItem[] = results
    ? [
        ...results.pages,
        ...results.categories,
        ...results.subcategories,
        ...results.resources,
      ]
    : []

  const handleSelect = useCallback(
    (item: SearchResultItem) => {
      onClose()
      if (item.external) {
        window.open(item.href, "_blank", "noopener,noreferrer")
      } else {
        router.push(item.href)
      }
    },
    [onClose, router]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, allItems.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter" && allItems[activeIndex]) {
      handleSelect(allItems[activeIndex])
    } else if (e.key === "Escape") {
      onClose()
    }
  }

  // Sections to render
  const sections = results
    ? (["pages", "categories", "subcategories", "resources"] as const).filter(
        (key) => results[key].length > 0
      )
    : []

  // Calculate offset per section for keyboard nav index
  const sectionOffsets: Record<string, number> = {}
  if (results) {
    let offset = 0
    for (const key of ["pages", "categories", "subcategories", "resources"] as const) {
      sectionOffsets[key] = offset
      offset += results[key].length
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-h-[80vh] overflow-hidden p-0 sm:max-w-xl"
        onKeyDown={handleKeyDown}
      >
        {/* Input */}
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Search size={16} className="shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Пошук по всьому сайту..."
            className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              onClick={() => handleChange("")}
              className="shrink-0 rounded-md p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
          <kbd className="hidden shrink-0 rounded-md border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:block">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div className="overflow-y-auto px-2 py-2" style={{ maxHeight: "calc(80vh - 56px)" }}>
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}

          {!loading && results && results.total === 0 && (
            <div className="py-10 text-center">
              <p className="text-[13px] text-muted-foreground">Нічого не знайдено за запитом «{query}»</p>
            </div>
          )}

          {!loading &&
            sections.map((key) => {
              const SectionIcon = SECTION_ICONS[key]
              const items = results![key]
              const offset = sectionOffsets[key]
              return (
                <div key={key} className="mb-2">
                  <div className="mb-1 flex items-center gap-1.5 px-3 py-1">
                    <SectionIcon size={11} className="text-muted-foreground" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {SECTION_LABELS[key]}
                    </span>
                  </div>
                  {items.map((item, i) => (
                    <ResultItem
                      key={item.id}
                      item={item}
                      isActive={activeIndex === offset + i}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              )
            })}

          {!loading && !results && (
            <div className="py-10 text-center">
              <p className="text-[13px] text-muted-foreground">Почніть вводити запит...</p>
            </div>
          )}

          {!loading && results && results.total > 0 && (
            <p className="mt-1 px-3 pb-1 text-[11px] text-muted-foreground">
              Знайдено {results.total} результатів
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
