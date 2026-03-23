import React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export interface FilterItem {
  key: string
  label: string
  onRemove: () => void
}

interface Props {
  filters: FilterItem[]
  onResetAll?: () => void
}

export default function ActiveFilters({ filters, onResetAll }: Props) {
  if (filters.length === 0) return null

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span className="text-[12px] text-muted-foreground">Активні фільтри:</span>

      {filters.map((filter) => (
        <Badge
          key={filter.key}
          variant="outline"
          className="gap-1.5 rounded-full border-primary/25 bg-primary/8 px-3 py-1 text-[12px] font-medium text-primary"
        >
          {filter.label}
          <Button
            variant="ghost"
            size="icon"
            onClick={filter.onRemove}
            className="ml-0.5 h-4 w-4 rounded-full p-0 hover:bg-primary/15 hover:text-primary"
            aria-label={`Видалити фільтр ${filter.label}`}
          >
            <X size={11} strokeWidth={2.5} />
          </Button>
        </Badge>
      ))}

      {filters.length > 1 && onResetAll && (
        <Button
          variant="link"
          size="sm"
          onClick={onResetAll}
          className="h-auto p-0 text-[12px] text-muted-foreground underline-offset-2 hover:text-foreground"
        >
          Скинути всі
        </Button>
      )}
    </div>
  )
}
