"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ExternalLink, FolderOpen, Layers, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"

import { globalSearch, SearchResultItem } from "@/actions/search/global-search"
import { ICON_MAP } from "@/constants/icon-map"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface Props {
  open: boolean
  onClose: () => void
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  category: FolderOpen,
  subcategory: Layers,
}

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
    const FallbackIcon = TYPE_ICONS[item.type] ?? Search
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <FallbackIcon size={14} className="text-muted-foreground" />
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

export default function GlobalSearch({ open, onClose }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<{ items: SearchResultItem[]; total: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (open) {
      setQuery("")
      setResults(null)
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const handleChange = useCallback((value: string) => {
    setQuery(value)
    setActiveIndex(0)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!value.trim()) {
      setResults(null)
      setLoading(false)
      return
    }

    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await globalSearch(value)
        setResults(res)
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [])

  const handleSelect = useCallback(
    (item: SearchResultItem) => {
      if (item.external) {
        window.open(item.href, "_blank", "noopener,noreferrer")
      } else {
        onClose()
        router.push(item.href)
      }
    },
    [onClose, router]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = results?.items ?? []
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, items.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      const target = items[activeIndex] ?? items[0]
      if (target) handleSelect(target)
    } else if (e.key === "Escape") {
      onClose()
    }
  }

  const items = results?.items ?? []

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
        showCloseButton={false}
        onKeyDown={handleKeyDown}
      >
        <DialogTitle className="sr-only">Пошук</DialogTitle>
        {/* Input */}
        <div className="flex shrink-0 items-center gap-2 border-b px-4 py-3">
          <Search size={16} className="shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Пошук сервісів та категорій..."
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
        </div>

        {/* Results */}
        <div className="h-[260px] overflow-y-auto px-2 py-2">
          {loading && (
            <div className="flex flex-col gap-1 py-1">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                  <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-muted" />
                  <div className="flex flex-1 flex-col gap-1.5">
                    <div className="h-3 w-2/5 animate-pulse rounded-md bg-muted" style={{ animationDelay: `${n * 60}ms` }} />
                    <div className="h-2.5 w-3/5 animate-pulse rounded-md bg-muted/70" style={{ animationDelay: `${n * 60 + 30}ms` }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && results && results.total === 0 && (
            <div className="py-10 text-center">
              <p className="text-[13px] text-muted-foreground">Нічого не знайдено за запитом «{query}»</p>
            </div>
          )}

          {!loading && items.map((item, i) => (
            <ResultItem
              key={item.id}
              item={item}
              isActive={activeIndex === i}
              onSelect={handleSelect}
            />
          ))}

          {!loading && !results && (
            <div className="py-10 text-center">
              <p className="text-[13px] text-muted-foreground">Почніть вводити запит...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t px-4 py-2.5">
          <p className="text-[11px] text-muted-foreground">
            {results && results.total > 0 ? `Знайдено ${results.total} результатів` : "Введіть запит для пошуку"}
          </p>
          <Button variant="ghost" size="sm" onClick={onClose} className="gap-1.5 text-[11px]">
            <X size={11} />
            Закрити
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
