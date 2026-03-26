import React from "react"
import { SearchX, Inbox, X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  variant: "empty" | "search"
  query?: string
  hasFilter?: boolean
  onResetSearch?: () => void
  onResetFilter?: () => void
}

export default function EmptyState({ variant, query, hasFilter = false, onResetSearch, onResetFilter }: EmptyStateProps) {
  const hasSearch = !!query
  const isActive = hasSearch || hasFilter
  const bothActive = hasSearch && hasFilter

  const handleResetAll = () => {
    onResetSearch?.()
    onResetFilter?.()
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border bg-card px-6 py-16 text-center">
      {/* Icon */}
      <div
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          background: hasSearch ? "rgba(14,165,233,0.08)" : hasFilter ? "rgba(99,102,241,0.08)" : "rgba(148,163,184,0.10)",
        }}
      >
        {hasSearch ? (
          <SearchX size={30} strokeWidth={1.5} className="text-sky-400" />
        ) : hasFilter ? (
          <Filter size={30} strokeWidth={1.5} className="text-indigo-400" />
        ) : (
          <Inbox size={30} strokeWidth={1.5} className="text-slate-400" />
        )}
      </div>

      {/* Title */}
      <p className="mb-1.5 text-[16px] font-semibold text-foreground">
        {isActive ? "Нічого не знайдено" : "Список порожній"}
      </p>

      {/* Subtitle */}
      <p className="mb-5 max-w-65 text-[13px] leading-relaxed text-muted-foreground">
        {hasSearch ? (
          <>За запитом {<span className="font-medium text-foreground">«{query}»</span>} нічого не знайдено. Спробуйте інші слова.</>
        ) : hasFilter ? (
          "Немає результатів за обраним фільтром. Спробуйте інший."
        ) : (
          "Тут ще немає жодного елементу."
        )}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {bothActive ? (
          <Button variant="outline" size="sm" className="gap-1.5 rounded-full" onClick={handleResetAll}>
            <X size={13} />
            Скинути все
          </Button>
        ) : hasSearch ? (
          <Button variant="outline" size="sm" className="gap-1.5 rounded-full" onClick={onResetSearch}>
            <X size={13} />
            Скинути пошук
          </Button>
        ) : hasFilter ? (
          <Button variant="outline" size="sm" className="gap-1.5 rounded-full" onClick={onResetFilter}>
            <X size={13} />
            Скинути фільтр
          </Button>
        ) : null}
      </div>
    </div>
  )
}
