import React from "react"
import { ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ICON_MAP } from "@/constants/icon-map"
import { PublicCategory, PublicResource } from "@/types/action"
import { formatDate } from "@/lib/format-date"

interface Props {
  resources: PublicResource[]
  category: PublicCategory
}

export default function ResourcesTable({ resources, category }: Props) {
  return (
    <Card className="overflow-hidden rounded-2xl border p-0 shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="pl-5 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Ресурс</TableHead>
              <TableHead className="hidden text-[11px] font-bold tracking-wider text-muted-foreground uppercase md:table-cell">Опис</TableHead>
              <TableHead className="hidden w-32 text-[11px] font-bold tracking-wider text-muted-foreground uppercase sm:table-cell">
                Додано
              </TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((res) => {
              const Icon = ICON_MAP[res.icon] ?? ICON_MAP.Building2
              return (
                <TableRow
                  key={res.id}
                  className="group cursor-pointer border-b transition-colors last:border-0 hover:bg-muted/30"
                  onClick={() => window.open(res.url, "_blank")}
                >
                  <TableCell className="py-3.5 pl-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: category.bg }}>
                        <Icon size={14} color={category.accent} strokeWidth={1.8} />
                      </div>
                      <p className="text-[13px] font-semibold text-foreground">{res.title}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden py-3.5 md:table-cell">
                    <span className="line-clamp-1 text-[12.5px] text-muted-foreground">{res.description}</span>
                  </TableCell>
                  <TableCell className="hidden w-32 py-3.5 sm:table-cell">
                    <span className="text-[12px] whitespace-nowrap text-muted-foreground">{formatDate(res.createdAt)}</span>
                  </TableCell>
                  <TableCell className="py-3.5 pr-4 text-right">
                    <ExternalLink size={14} className="ml-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <Separator />
        <div className="px-5 py-3">
          <p className="text-[12px] text-muted-foreground">
            Показано <span className="font-semibold text-foreground">{resources.length}</span> ресурсів
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
