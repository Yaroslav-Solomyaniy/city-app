import React from "react"
import { SearchX, Inbox, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  variant: "empty" | "search"
  query?: string
  hasFilter?: boolean
  onResetSearch?: () => void
  onResetFilter?: () => void
}

export default function EmptyState({ variant, query, hasFilter = false, onResetSearch, onResetFilter }: EmptyStateProps) {
  const isSearch = variant === "search"

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border bg-card px-6 py-16 text-center">
      {/* Іконка */}
      <div
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          background: isSearch ? "rgba(14,165,233,0.08)" : "rgba(148,163,184,0.10)",
        }}
      >
        {isSearch ? (
          <SearchX size={30} strokeWidth={1.5} className="text-sky-400" />
        ) : (
          <Inbox size={30} strokeWidth={1.5} className="text-slate-400" />
        )}
      </div>

      {/* Заголовок */}
      <p className="mb-1.5 text-[16px] font-semibold text-foreground">{isSearch ? "Упс, нічого не знайдено" : "Список порожній"}</p>

      {/* Підзаголовок */}
      <p className="mb-5 max-w-65 text-[13px] leading-relaxed text-muted-foreground">
        {isSearch ? (
          <>За запитом {query && <span className="font-medium text-foreground">«{query}»</span>} нічого не знайдено. Спробуйте інші слова.</>
        ) : (
          "Тут ще немає жодного елементу."
        )}
      </p>

      {/* Кнопки дій */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {isSearch && onResetSearch && (
          <Button variant="outline" size="sm" className="gap-1.5 rounded-full" onClick={onResetSearch}>
            <X size={13} />
            Скинути пошук
          </Button>
        )}
        {hasFilter && onResetFilter && (
          <Button variant="ghost" size="sm" className="gap-1.5 rounded-full text-muted-foreground" onClick={onResetFilter}>
            <X size={13} />
            Скинути фільтр
          </Button>
        )}
      </div>
    </div>
  )
}
