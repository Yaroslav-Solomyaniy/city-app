import React from "react"
import { ExternalLink } from "lucide-react"
import { ICON_MAP } from "@/constants/icon-map"
import { ResourceWithCategory } from "@/types/action"
import { formatDate } from "@/lib/format-date"

interface Props {
  resources: ResourceWithCategory[]
}

export default function ResourcesTable({ resources }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-muted/40">
            <th className="py-3 pr-4 pl-5 text-left text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              Ресурс
            </th>
            <th
              className="hidden px-4 py-3 text-left text-[11px] font-bold tracking-wider text-muted-foreground uppercase sm:table-cell"
              style={{ width: "30%" }}
            >
              Категорія
            </th>
            <th
              className="hidden px-4 py-3 text-left text-[11px] font-bold tracking-wider text-muted-foreground uppercase md:table-cell"
              style={{ width: "120px" }}
            >
              Додано
            </th>
            <th style={{ width: "40px" }} />
          </tr>
        </thead>
        <tbody>
          {resources.map((res) => {
            const Icon = ICON_MAP[res.icon] ?? ICON_MAP.Building2
            return (
              <tr
                key={res.id}
                className="group cursor-pointer border-b transition-colors last:border-0 hover:bg-muted/30"
                onClick={() => window.open(res.url, "_blank")}
              >
                <td className="py-3.5 pr-4 pl-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: res.category.bg }}
                    >
                      <Icon size={14} color={res.category.accent} strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-semibold text-foreground">{res.title}</p>
                      {res.description && (
                        <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">{res.description}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3.5 align-top sm:table-cell">
                  <span
                    className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ background: res.category.bg, color: res.category.accent }}
                  >
                    {res.category.title}
                  </span>
                </td>
                <td className="hidden px-4 py-3.5 align-top md:table-cell">
                  <span className="whitespace-nowrap text-[12px] text-muted-foreground">{formatDate(res.createdAt)}</span>
                </td>
                <td className="py-3.5 pr-4 text-right align-top">
                  <ExternalLink size={14} className="ml-auto text-muted-foreground" />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="border-t px-5 py-3">
        <p className="text-[12px] text-muted-foreground">
          Показано <span className="font-semibold text-foreground">{resources.length}</span> ресурсів
        </p>
      </div>
    </div>
  )
}
