// components/page-sidebar/sidebar-view-toggle.tsx
import React from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { VIEW_OPTIONS } from "@/constants/view-mode"
import type { ViewMode } from "@/constants/view-mode"
import { cn } from "@/lib/utils"

interface Props {
  view: ViewMode
  setView: (v: ViewMode) => void
}

const SidebarViewToggle = ({ view, setView }: Props) => {
  return (
    <ToggleGroup
      type="single"
      value={view}
      onValueChange={(v) => v && setView(v as ViewMode)}
      className="w-full gap-1 rounded-xl border bg-muted/15 p-1"
    >
      {VIEW_OPTIONS.map(({ mode, icon: Icon, label }) => {
        const isActive = view === mode
        return (
          <ToggleGroupItem
            key={mode}
            value={mode}
            title={label}
            className={cn(
              "h-8 flex-1 rounded-lg text-[13px] font-medium transition-all duration-150",
              "text-muted-foreground hover:text-foreground",
              "data-[state=on]:bg-primary/15 data-[state=on]:text-primary data-[state=on]:shadow-sm",
              "gap-1.5 px-3"
            )}
          >
            <Icon size={14} />
            <span>{label}</span>
          </ToggleGroupItem>
        )
      })}
    </ToggleGroup>
  )
}

export default SidebarViewToggle
