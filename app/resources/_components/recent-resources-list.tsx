import { ICON_MAP } from "@/constants/icon-map"
import { formatDate } from "@/lib/format-date"
import { ResourceWithCategory } from "@/types/action"

interface Props {
  resources: ResourceWithCategory[]
}

export function RecentResourcesList({ resources }: Props) {
  return (
    <div className="flex flex-col divide-y">
      {resources.slice(0, 5).map((r) => {
        const Icon = ICON_MAP[r.icon] ?? ICON_MAP.Building2
        return (
          <a
            key={r.id}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-2.5 py-3 no-underline first:pt-0 last:pb-0"
          >
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: r.category.bg }}>
              <Icon size={12} color={r.category.accent} strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <p className="line-clamp-2 text-[12.5px] leading-snug font-medium text-foreground transition-colors group-hover:text-primary">
                {r.title}
              </p>
              <span className="text-[11px] text-muted-foreground">{formatDate(r.createdAt)}</span>
            </div>
          </a>
        )
      })}
    </div>
  )
}
