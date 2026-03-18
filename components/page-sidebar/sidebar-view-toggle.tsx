// components/page-sidebar/sidebar-view-toggle.tsx
import React from "react"
import { VIEW_OPTIONS } from "@/constants/view-mode"
import type { ViewMode } from "@/constants/view-mode"
import { cn } from "@/lib/utils"

interface Props {
  view: ViewMode
  setView: (v: ViewMode) => void
  /** compact=true — тільки іконки, без тексту. Для мобільного рядка поруч з пошуком */
  compact?: boolean
}

const SidebarViewToggle = ({ view, setView, compact = false }: Props) => {
  return (
    <div className={cn("flex gap-1 rounded-xl border bg-muted/40 p-1", compact && "w-auto shrink-0")}>
      {VIEW_OPTIONS.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => setView(mode)}
          title={label}
          className={cn(
            "flex items-center justify-center rounded-lg transition-all duration-150",
            compact ? "h-8 w-8" : "flex-1 gap-1.5 px-3 py-2 text-[13px] font-semibold",
            view === mode ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Icon size={compact ? 15 : 14} />
          {!compact && label}
        </button>
      ))}
    </div>
  )
}

export default SidebarViewToggle
