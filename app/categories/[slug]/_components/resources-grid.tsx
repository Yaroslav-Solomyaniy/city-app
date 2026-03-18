import React from "react"
import { ExternalLink } from "lucide-react"
import { ICON_MAP } from "@/constants/icon-map"
import { PublicCategory, PublicResource } from "@/types/action"
import { formatDate } from "@/lib/format-date"

interface Props {
  resources: PublicResource[]
  category: PublicCategory
}

export default function ResourcesGrid({ resources, category }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {resources.map((res) => {
        const Icon = ICON_MAP[res.icon] ?? ICON_MAP.Building2
        return (
          <a
            key={res.id}
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="h-1 opacity-80" style={{ background: category.accent }} />
            <div className="flex flex-1 flex-col p-4">
              <div className="mb-2.5 flex items-center justify-between gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: category.bg }}>
                  <Icon size={17} color={category.accent} strokeWidth={1.8} />
                </div>
                <ExternalLink size={13} className="text-muted-foreground opacity-50 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="mb-0.5 text-[13.5px] leading-snug font-semibold text-foreground">{res.title}</p>
              {res.description && (
                <p className="mb-3 line-clamp-3 flex-1 text-[12px] leading-relaxed text-muted-foreground">{res.description}</p>
              )}
              <div className="mt-auto flex items-center justify-between border-t pt-3">
                <span className="text-[11px] text-muted-foreground">{formatDate(res.createdAt)}</span>
                <span className="flex items-center gap-1 text-[11.5px] font-semibold" style={{ color: category.accent }}>
                  Перейти <ExternalLink size={11} />
                </span>
              </div>
            </div>
          </a>
        )
      })}
    </div>
  )
}
