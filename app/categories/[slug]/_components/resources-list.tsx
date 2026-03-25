import React from "react"
import { ExternalLink } from "lucide-react"
import { ICON_MAP } from "@/constants/icon-map"
import { PublicCategory, PublicResource } from "@/types/action"
import { formatDate } from "@/lib/format-date"

interface Props {
  resources: PublicResource[]
  category: PublicCategory
}

export default function ResourcesList({ resources, category }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {resources.map((res) => {
        const Icon = ICON_MAP[res.icon] ?? ICON_MAP.Building2
        return (
          <a
            key={res.id}
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 rounded-2xl border bg-card px-5 py-4 no-underline shadow-sm transition-all duration-200 hover:translate-x-1 hover:shadow-md"
          >
            <div className="mt-0.5 w-1 shrink-0 self-stretch rounded-full" style={{ background: category.accent }} />
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: category.bg }}>
              <Icon size={18} color={category.accent} strokeWidth={1.8} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] leading-tight font-semibold text-foreground">{res.title}</p>
              {res.description && <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{res.description}</p>}
            </div>
            <div className="ml-auto flex shrink-0 flex-col items-end gap-2 pt-0.5">
              <span className="hidden text-[11px] whitespace-nowrap text-muted-foreground sm:block">{formatDate(res.createdAt)}</span>
              <ExternalLink size={15} className="text-muted-foreground" />
            </div>
          </a>
        )
      })}
    </div>
  )
}
