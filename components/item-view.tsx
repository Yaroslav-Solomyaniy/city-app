import React from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ViewMode } from "@/constants/view-mode"
import { cn } from "@/lib/utils"
import Image from "next/image"

export interface BaseItem {
  id: string
  title: string
  titleEn?: string
  accent: string
  bg: string
  icon: React.ElementType
  isNew?: boolean
  href?: string // internal link → <Link>
  url?: string // external link → <a target="_blank">
  photo?: string // опційне фото для grid-картки
  iconWithTitle?: boolean // іконка і назва в один рядок (для категорій з фото)
}

interface RenderSlots<T extends BaseItem> {
  gridBody?: (item: T) => React.ReactNode
  gridFooter?: (item: T) => React.ReactNode
  listSub?: (item: T) => React.ReactNode
  listMeta?: (item: T) => React.ReactNode
  // tableColumns — масив { header, cell } замість окремих tableHeaders/tableCells
  // це єдиний спосіб гарантувати що колонок в thead і tbody однакова кількість
  tableColumns?: Array<{
    header: string
    cell: (item: T) => React.ReactNode
    className?: string // додаткові класи на <th> і <td>
  }>
  tableAction?: (item: T) => React.ReactNode
}

interface Props<T extends BaseItem> {
  items: T[]
  view: ViewMode
  slots?: RenderSlots<T>
  onItemClick?: (item: T) => void
}

const NewBadge = () => (
  <Badge
    variant="secondary"
    className="bg-emerald-100 px-2 py-0 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
  >
    Нове
  </Badge>
)

function ItemWrapper<T extends BaseItem>({
  item,
  className,
  children,
  onClick,
}: {
  item: T
  className: string
  children: React.ReactNode
  onClick?: () => void
}) {
  if (item.href)
    return (
      <Link href={item.href} className={className}>
        {children}
      </Link>
    )
  if (item.url)
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className={cn(className, "no-underline")}>
        {children}
      </a>
    )
  return (
    <button onClick={onClick} className={cn(className, "w-full text-left")}>
      {children}
    </button>
  )
}

export default function ItemView<T extends BaseItem>({ items, view, slots = {}, onItemClick }: Props<T>) {
  if (items.length === 0) return null

  /* ── GRID ──────────────────────────────────────────────── */
  if (view === "grid")
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <ItemWrapper
              key={item.id}
              item={item}
              onClick={() => onItemClick?.(item)}
              className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="h-1 opacity-80" style={{ background: item.accent }} />
              {item.photo && (
                <div className="relative h-32 overflow-hidden bg-muted">
                  <Image src={item.photo} width={300} height={250} alt={item.title} priority={true} className={"h-full w-full object-cover"} />
                  {item.isNew && (
                    <div className="absolute top-2 right-2">
                      <NewBadge />
                    </div>
                  )}
                </div>
              )}
              <div className="flex flex-1 flex-col p-4">
                {item.iconWithTitle ? (
                  /* іконка + назва в один рядок (категорії) */
                  <div className="mb-2.5 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: item.bg }}>
                        <Icon size={17} color={item.accent} strokeWidth={1.8} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[13.5px] leading-tight font-semibold text-foreground">{item.title}</p>
                        {item.titleEn && <p className="text-[11px] text-muted-foreground">{item.titleEn}</p>}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {item.isNew && !item.photo && <NewBadge />}
                      {item.url && (
                        <ExternalLink size={13} className="text-muted-foreground opacity-50 transition-opacity group-hover:opacity-100" />
                      )}
                    </div>
                  </div>
                ) : (
                  /* іконка окремо, назва під нею (ресурси) */
                  <>
                    <div className="mb-2.5 flex items-center justify-between gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: item.bg }}>
                        <Icon size={17} color={item.accent} strokeWidth={1.8} />
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        {item.isNew && !item.photo && <NewBadge />}
                        {item.url && (
                          <ExternalLink size={13} className="text-muted-foreground opacity-50 transition-opacity group-hover:opacity-100" />
                        )}
                      </div>
                    </div>
                    <p className="mb-0.5 text-[13.5px] leading-snug font-semibold text-foreground">{item.title}</p>
                    {item.titleEn && <p className="mb-1 text-[11px] text-muted-foreground">{item.titleEn}</p>}
                  </>
                )}
                {slots.gridBody?.(item)}
                {slots.gridFooter && <div className="mt-auto border-t pt-3">{slots.gridFooter(item)}</div>}
              </div>
            </ItemWrapper>
          )
        })}
      </div>
    )

  /* ── LIST ──────────────────────────────────────────────── */
  if (view === "list")
    return (
      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <ItemWrapper
              key={item.id}
              item={item}
              onClick={() => onItemClick?.(item)}
              className="group flex items-center gap-4 rounded-2xl border bg-card px-5 py-4 shadow-sm transition-all duration-200 hover:translate-x-1 hover:shadow-md"
            >
              <div className="w-1 shrink-0 self-stretch rounded-full" style={{ background: item.accent }} />
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: item.bg }}>
                <Icon size={18} color={item.accent} strokeWidth={1.8} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[14px] leading-tight font-semibold text-foreground">{item.title}</p>
                  {item.isNew && <NewBadge />}
                </div>
                {slots.listSub
                  ? slots.listSub(item)
                  : item.titleEn && <p className="mt-0.5 truncate text-[13px] text-muted-foreground">{item.titleEn}</p>}
              </div>
              {slots.listMeta?.(item)}
              {item.url && <ExternalLink size={15} className="shrink-0 text-muted-foreground" />}
              {item.href && (
                <span
                  className="shrink-0 text-[13px] font-medium transition-transform duration-150 group-hover:translate-x-0.5"
                  style={{ color: item.accent }}
                >
                  →
                </span>
              )}
            </ItemWrapper>
          )
        })}
      </div>
    )

  /* ── TABLE ─────────────────────────────────────────────── */
  const cols = slots.tableColumns ?? []
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto rounded-[inherit]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Назва</TableHead>
                {cols.map((col) => (
                  <TableHead key={col.header} className={col.className}>
                    {col.header}
                  </TableHead>
                ))}
                <TableHead className="w-8" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const Icon = item.icon
                return (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer"
                    onClick={() => {
                      if (item.url) window.open(item.url, "_blank")
                      else if (item.href) window.location.href = item.href
                      else onItemClick?.(item)
                    }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3 p-1">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: item.bg }}>
                          <Icon size={14} color={item.accent} strokeWidth={1.8} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[13px] leading-tight font-semibold text-foreground">{item.title}</span>
                            {item.isNew && <NewBadge />}
                          </div>
                          {item.titleEn && <p className="text-[11px] text-muted-foreground">{item.titleEn}</p>}
                        </div>
                      </div>
                    </TableCell>
                    {cols.map((col) => (
                      <TableCell key={col.header} className={col.className}>
                        {col.cell(item)}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      {slots.tableAction ? (
                        slots.tableAction(item)
                      ) : item.url ? (
                        <ExternalLink size={14} className="ml-auto pr-3 text-muted-foreground" />
                      ) : (
                        <span className="pr-3 text-[13px] text-muted-foreground">→</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
