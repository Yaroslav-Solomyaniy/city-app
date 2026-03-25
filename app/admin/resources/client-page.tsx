"use client"

import React, { useMemo, useState, useTransition, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Search,
  X,
  Plus,
  Pencil,
  Trash2,
  Check,
  ExternalLink,
  Layers,
  Hash,
  AlignLeft,
  Link as LinkIcon,
  Type,
  ArrowUpDown,
  FolderOpen,
  Globe,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ICON_MAP } from "@/constants/icon-map"

import { createResource } from "@/actions/resource/create-resource"
import { updateResource } from "@/actions/resource/update-resource"
import { deleteResource } from "@/actions/resource/delete-resource"
import { moveResource } from "@/actions/resource/move-resource"
import { CategoryWithSubs, ResourceWithRelations } from "@/types/action"
import EmptyState from "@/components/empty-state"

interface Props {
  resources: ResourceWithRelations[]
  categories: CategoryWithSubs[]
}

type SortCol = "title" | "category" | "createdAt"

const formatDate = (d: Date | string) =>
  new Date(d).toLocaleDateString("uk-UA", { day: "numeric", month: "short", year: "numeric" }).replace(" р.", "")

export default function AdminResourcesClient({ resources: initial, categories }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchParamsRef = useRef(searchParams)
  useEffect(() => {
    searchParamsRef.current = searchParams
  }, [searchParams])
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get("q") ?? "")
  const [filterCatId, setFilterCatId] = useState<string | null>(searchParams.get("cat") ?? null)
  const [sortBy, setSortBy] = useState<SortCol>((searchParams.get("sort") as SortCol) ?? "createdAt")
  const [sortDir, setSortDir] = useState<"asc" | "desc">((searchParams.get("dir") as "asc" | "desc") ?? "desc")

  // Debounce search → URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParamsRef.current.toString())
      if (search) params.set("q", search)
      else params.delete("q")
      router.replace(`?${params.toString()}`, { scroll: false })
    }, 300)
    return () => clearTimeout(timer)
  }, [search, router])

  // filterCatId, sortBy, sortDir → URL
  useEffect(() => {
    const params = new URLSearchParams(searchParamsRef.current.toString())
    if (filterCatId) params.set("cat", filterCatId)
    else params.delete("cat")
    if (sortBy !== "createdAt") params.set("sort", sortBy)
    else params.delete("sort")
    if (sortDir !== "desc") params.set("dir", sortDir)
    else params.delete("dir")
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [filterCatId, sortBy, sortDir, router])

  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<ResourceWithRelations | null>(null)
  const [moveItem, setMoveItem] = useState<ResourceWithRelations | null>(null)
  const [deleteItem, setDeleteItem] = useState<ResourceWithRelations | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const list = initial.filter((r) => {
      const matchSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q) ||
        r.category.title.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      const matchCat = !filterCatId || r.categoryId === filterCatId
      return matchSearch && matchCat
    })
    list.sort((a, b) => {
      let cmp = 0
      if (sortBy === "title") cmp = a.title.localeCompare(b.title, "uk")
      if (sortBy === "category") cmp = a.category.title.localeCompare(b.category.title, "uk")
      if (sortBy === "createdAt") cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return sortDir === "asc" ? cmp : -cmp
    })
    return list
  }, [initial, search, filterCatId, sortBy, sortDir])

  const toggleSort = (col: SortCol) => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else {
      setSortBy(col)
      setSortDir("asc")
    }
  }

  const activeCats = useMemo(() => categories.filter((c) => initial.some((r) => r.categoryId === c.id)), [initial, categories])

  const totalRes = initial.length

  // ── Handlers ──

  async function handleAdd(data: FormPayload) {
    startTransition(async () => {
      try {
        await createResource(data.categoryId, {
          title: data.title,
          description: data.description,
          url: data.url,
          icon: "Globe",
          tags: data.tags,
          subcategoryId: data.subcategoryId,
        })
        setShowAdd(false)
        toast.success(`Ресурс «${data.title}» створено`)
        router.refresh()
      } catch {
        toast.error("Не вдалося створити ресурс")
      }
    })
  }

  async function handleEdit(data: FormPayload) {
    if (!editItem) return
    startTransition(async () => {
      try {
        await updateResource(editItem.id, {
          title: data.title,
          description: data.description,
          url: data.url,
          icon: editItem.icon,
          tags: data.tags,
          subcategoryId: data.subcategoryId,
        })
        setEditItem(null)
        toast.success("Зміни збережено")
        router.refresh()
      } catch {
        toast.error("Не вдалося зберегти зміни")
      }
    })
  }

  async function handleMove(res: ResourceWithRelations, newCatId: string, newSubId: string | null) {
    startTransition(async () => {
      try {
        await moveResource(res.id, newCatId, newSubId)
        setMoveItem(null)
        toast.success("Ресурс переміщено")
        router.refresh()
      } catch {
        toast.error("Не вдалося перемістити ресурс")
      }
    })
  }

  async function handleDelete() {
    if (!deleteItem) return
    startTransition(async () => {
      try {
        await deleteResource(deleteItem.id)
        setDeleteItem(null)
        toast.success(`Ресурс «${deleteItem.title}» видалено`)
        router.refresh()
      } catch {
        toast.error("Не вдалося видалити ресурс")
      }
    })
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-[13px] text-muted-foreground">
            Адмін-панель › <span className="text-foreground">Ресурси</span>
          </p>
          <h1 className="text-3xl font-bold text-foreground">Управління ресурсами</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalRes} ресурсів у {activeCats.length} категоріях
          </p>
        </div>
        <Button
          onClick={() => {
            setShowAdd(true)
            setEditItem(null)
          }}
          className="shrink-0 gap-2"
          disabled={isPending}
        >
          <Plus size={16} /> Додати ресурс
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Ресурсів", value: initial.length },
          { label: "Категорій", value: activeCats.length },
          { label: "Знайдено", value: filtered.length },
          { label: "З URL", value: initial.filter((r) => r.url).length },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="px-4 py-3">
              <p className="text-[20px] font-bold text-foreground">{s.value}</p>
              <p className="mt-0.5 text-[11.5px] text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2">
        {activeCats.map((cat) => {
          const Icon = ICON_MAP[cat.iconName] ?? ICON_MAP.Building2
          const active = filterCatId === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setFilterCatId(active ? null : cat.id)}
              className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors hover:bg-muted"
              style={active ? { background: cat.bg, borderColor: cat.accent + "88", color: cat.accent } : {}}
            >
              <Icon size={12} style={{ color: cat.accent }} />
              {cat.title}
              <span className="ml-0.5 opacity-60">{initial.filter((r) => r.categoryId === cat.id).length}</span>
            </button>
          )
        })}
      </div>

      {/* Search + sort */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={15} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Пошук по назві, опису, тегам, категорії..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9 pl-9"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { col: "title" as const, label: "Назва" },
            { col: "category" as const, label: "Категорія" },
            { col: "createdAt" as const, label: "Дата" },
          ].map((s) => (
            <Button
              key={s.col}
              size="sm"
              variant={sortBy === s.col ? "secondary" : "outline"}
              className="gap-1.5"
              onClick={() => toggleSort(s.col)}
            >
              <ArrowUpDown size={12} />
              {s.label}
              {sortBy === s.col && <span className="text-[10px]">{sortDir === "asc" ? "↑" : "↓"}</span>}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden rounded-2xl border p-0 shadow-sm">
        <CardContent className="p-0">
          {/* Mobile list */}
          <div className="md:hidden">
            {filtered.length === 0 ? (
              <div className="px-5 py-5">
                <EmptyState variant={search ? "search" : "empty"} query={search} onResetSearch={() => setSearch("")} />
              </div>
            ) : (
              filtered.map((res) => {
                const CatIcon = ICON_MAP[res.category.iconName] ?? ICON_MAP.Building2
                return (
                  <div key={res.id} className="flex items-center gap-3 border-b px-4 py-3 last:border-0" onClick={() => { setEditItem(res); setShowAdd(false) }}>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: res.category.bg }}>
                      <LinkIcon size={14} color={res.category.accent} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-foreground">{res.title}</p>
                      <p className="text-[11px] text-muted-foreground" style={{ color: res.category.accent }}>{res.category.title}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => { setEditItem(res); setShowAdd(false) }}>
                          <Pencil size={14} /> Редагувати
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setMoveItem(res)}>
                          <FolderOpen size={14} /> Перемістити
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteItem(res)}>
                          <Trash2 size={14} /> Видалити
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              })
            )}
          </div>

          {/* Desktop table */}
          <table className="hidden w-full border-collapse md:table">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="py-3 pl-5 text-left text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Ресурс</th>
                <th className="hidden w-[140px] py-3 px-4 text-left text-[11px] font-bold tracking-wider text-muted-foreground uppercase md:table-cell">Категорія</th>
                <th className="hidden w-[160px] py-3 px-4 text-left text-[11px] font-bold tracking-wider text-muted-foreground uppercase lg:table-cell">Підкатегорія</th>
                <th className="hidden w-[180px] py-3 px-4 text-left text-[11px] font-bold tracking-wider text-muted-foreground uppercase lg:table-cell">Теги</th>
                <th className="hidden w-[110px] py-3 px-4 text-left text-[11px] font-bold tracking-wider text-muted-foreground uppercase md:table-cell">Створено</th>
                <th className="w-[56px]" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-5">
                    <EmptyState variant={search ? "search" : "empty"} query={search} onResetSearch={() => setSearch("")} />
                  </td>
                </tr>
              ) : (
                filtered.map((res) => {
                  const CatIcon = ICON_MAP[res.category.iconName] ?? ICON_MAP.Building2
                  return (
                    <tr
                      key={res.id}
                      className="group cursor-pointer border-b transition-colors last:border-0 hover:bg-muted/30"
                      onClick={() => { setEditItem(res); setShowAdd(false) }}
                    >
                      {/* Ресурс */}
                      <td className="max-w-0 overflow-hidden py-3.5 pl-5">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: res.category.bg }}>
                            <LinkIcon size={14} color={res.category.accent} />
                          </div>
                          <div className="min-w-0 overflow-hidden">
                            <div className="flex min-w-0 items-center gap-1.5">
                              <span className="truncate text-[13.5px] leading-tight font-semibold text-foreground">{res.title}</span>
                              {res.url && (
                                <a href={res.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="shrink-0 text-muted-foreground hover:text-foreground">
                                  <ExternalLink size={11} />
                                </a>
                              )}
                            </div>
                            {res.description && <p className="truncate text-[11px] text-muted-foreground">{res.description}</p>}
                          </div>
                        </div>
                      </td>

                      {/* Категорія */}
                      <td className="hidden py-3.5 px-4 md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md" style={{ background: res.category.bg }}>
                            <CatIcon size={10} color={res.category.accent} />
                          </div>
                          <span className="text-[12px] font-medium text-muted-foreground">{res.category.title}</span>
                        </div>
                      </td>

                      {/* Підкатегорія */}
                      <td className="hidden py-3.5 px-4 lg:table-cell">
                        {res.subcategory ? (
                          <Badge variant="secondary" className="gap-1" style={{ background: res.category.bg, color: res.category.accent }}>
                            <Layers size={9} /> {res.subcategory.title}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>

                      {/* Теги */}
                      <td className="hidden py-3.5 px-4 lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {res.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-[10.5px]" style={{ color: res.category.accent, borderColor: res.category.accent + "44" }}>
                              #{tag}
                            </Badge>
                          ))}
                          {res.tags.length > 2 && <span className="text-[10.5px] text-muted-foreground">+{res.tags.length - 2}</span>}
                        </div>
                      </td>

                      {/* Дата */}
                      <td className="hidden py-3.5 px-4 md:table-cell">
                        <span className="text-[12px] text-muted-foreground">{formatDate(res.createdAt)}</span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pr-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <ChevronRight size={14} className="text-muted-foreground/40" />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem onClick={() => { setEditItem(res); setShowAdd(false) }}>
                                <Pencil size={14} /> Редагувати
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setMoveItem(res)}>
                                <FolderOpen size={14} /> Перемістити
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive" onClick={() => setDeleteItem(res)}>
                                <Trash2 size={14} /> Видалити
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
          <Separator />
          <div className="px-5 py-3">
            <p className="text-[12px] text-muted-foreground">
              Показано <span className="font-semibold text-foreground">{filtered.length}</span> з{" "}
              <span className="font-semibold text-foreground">{initial.length}</span> · Клікніть на рядок щоб редагувати
              {filterCatId && (
                <Button variant="link" className="ml-1 h-auto p-0 text-[12px]" onClick={() => setFilterCatId(null)}>
                  · зняти фільтр
                </Button>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit dialog */}
      {(showAdd || editItem) && (
        <ResourceFormDialog
          resource={editItem ?? undefined}
          categories={categories}
          isPending={isPending}
          onSave={editItem ? handleEdit : handleAdd}
          onClose={() => {
            setShowAdd(false)
            setEditItem(null)
          }}
        />
      )}

      {/* Move dialog */}
      {moveItem && (
        <MoveDialog resource={moveItem} categories={categories} isPending={isPending} onMove={handleMove} onClose={() => setMoveItem(null)} />
      )}

      {/* Delete dialog */}
      <Dialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
              <Trash2 size={24} className="text-destructive" />
            </div>
            <DialogTitle>Видалити ресурс?</DialogTitle>
          </DialogHeader>
          {deleteItem && (
            <div className="flex items-center justify-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: deleteItem.category.bg }}>
                <LinkIcon size={12} color={deleteItem.category.accent} />
              </div>
              <span className="font-semibold text-foreground">{deleteItem.title}</span>
            </div>
          )}
          <p className="text-[13px] text-muted-foreground">Цю дію неможливо скасувати.</p>
          <DialogFooter className="mt-2 flex gap-3 sm:flex-row">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteItem(null)}>
              Скасувати
            </Button>
            <Button variant="destructive" className="flex-1" disabled={isPending} onClick={handleDelete}>
              {isPending ? "Видалення..." : "Видалити"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ── Form types ──
interface FormPayload {
  title: string
  description: string
  url: string
  tags: string[]
  categoryId: string
  subcategoryId: string | null
}

// ── Resource Form Dialog ──
function ResourceFormDialog({
  resource,
  categories,
  isPending,
  onSave,
  onClose,
}: {
  resource?: ResourceWithRelations
  categories: CategoryWithSubs[]
  isPending: boolean
  onSave: (p: FormPayload) => void
  onClose: () => void
}) {
  const isEdit = !!resource
  const [catId, setCatId] = useState(resource?.categoryId ?? categories[0]?.id ?? "")
  const [title, setTitle] = useState(resource?.title ?? "")
  const [description, setDescription] = useState(resource?.description ?? "")
  const [url, setUrl] = useState(resource?.url ?? "")
  const [subId, setSubId] = useState<string | null>(resource?.subcategoryId ?? null)
  const [tags, setTags] = useState(resource?.tags.join(", ") ?? "")

  const cat = categories.find((c) => c.id === catId)
  const subs = cat?.subcategories ?? []

  const save = () => {
    if (!title.trim() || !catId) return
    onSave({
      title: title.trim(),
      description: description.trim(),
      url: url.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      categoryId: catId,
      subcategoryId: subId,
    })
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
        {/* Accent bar */}
        {cat && <div className="h-1 shrink-0 rounded-t-[inherit]" style={{ background: cat.accent }} />}

        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b px-6 py-4">
          {cat && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: cat.accent + "20" }}>
              {(() => {
                const I = ICON_MAP[cat.iconName] ?? ICON_MAP.Building2
                return <I size={17} color={cat.accent} />
              })()}
            </div>
          )}
          <div>
            <DialogTitle className="text-[15px]">{isEdit ? "Редагувати ресурс" : "Новий ресурс"}</DialogTitle>
            <p className="text-[11px] text-muted-foreground">{isEdit ? `ID: ${resource?.id}` : "Заповніть поля та збережіть"}</p>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {/* Category selector */}
          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center gap-1.5 text-xs tracking-wider uppercase">
              <FolderOpen size={11} /> Категорія *
            </Label>
            <Select value={catId} onValueChange={(v) => { setCatId(v); setSubId(null) }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Оберіть категорію" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => {
                  const Icon = ICON_MAP[c.iconName] ?? ICON_MAP.Building2
                  return (
                    <SelectItem key={c.id} value={c.id}>
                      <div className="flex items-center gap-2">
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded" style={{ background: c.bg }}>
                          <Icon size={9} color={c.accent} />
                        </div>
                        {c.title}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Title + URL */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label className="flex items-center gap-1.5 text-xs tracking-wider uppercase">
                <Type size={10} /> Назва *
              </Label>
              <Input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Назва ресурсу" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="flex items-center gap-1.5 text-xs tracking-wider uppercase">
                <LinkIcon size={10} /> URL
              </Label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center justify-between gap-1.5 text-xs tracking-wider uppercase">
              <span className="flex items-center gap-1.5"><AlignLeft size={10} /> Опис</span>
              <span className="font-normal normal-case text-muted-foreground">{description.length}/300</span>
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 300))}
              placeholder="Короткий опис ресурсу"
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Subcategory + Tags */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label className="flex items-center gap-1.5 text-xs tracking-wider uppercase">
                <Layers size={10} /> Підкатегорія
              </Label>
              <Select value={subId ?? "__none__"} onValueChange={(v) => setSubId(v === "__none__" ? null : v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="— Напряму в категорії —" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— Напряму в категорії —</SelectItem>
                  {subs.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="flex items-center gap-1.5 text-xs tracking-wider uppercase">
                <Hash size={10} /> Теги (через кому)
              </Label>
              <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="лікарня, стаціонар" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end gap-3 border-t px-6 py-4">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Скасувати
          </Button>
          <Button onClick={save} disabled={!title.trim() || !catId || isPending}>
            <Check size={14} />
            {isPending ? "Збереження..." : isEdit ? "Зберегти" : "Створити"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Move Dialog ──
function MoveDialog({
  resource,
  categories,
  isPending,
  onMove,
  onClose,
}: {
  resource: ResourceWithRelations
  categories: CategoryWithSubs[]
  isPending: boolean
  onMove: (res: ResourceWithRelations, newCatId: string, newSubId: string | null) => void
  onClose: () => void
}) {
  const [newCatId, setNewCatId] = useState(resource.categoryId)
  const [newSubId, setNewSubId] = useState<string | null>(resource.subcategoryId)

  const selectedCat = categories.find((c) => c.id === newCatId)!
  const subs = selectedCat?.subcategories ?? []
  const changed = newCatId !== resource.categoryId || newSubId !== resource.subcategoryId

  const CurIcon = ICON_MAP[resource.category.iconName] ?? ICON_MAP.Building2

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
        {/* Accent bar */}
        <div className="h-1 shrink-0 rounded-t-[inherit]" style={{ background: resource.category.accent }} />

        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b px-5 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: resource.category.bg }}>
            <CurIcon size={17} color={resource.category.accent} />
          </div>
          <div className="min-w-0">
            <DialogTitle className="truncate text-[15px]">{resource.title}</DialogTitle>
            <p className="text-[12px] text-muted-foreground">Перемістити до іншої категорії</p>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="relative flex-1 overflow-y-auto">
          <div className="space-y-4 px-5 py-4">
          <div>
            <Label className="mb-2 block text-xs tracking-wider text-muted-foreground uppercase">Оберіть категорію</Label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => {
                const Icon = ICON_MAP[cat.iconName] ?? ICON_MAP.Building2
                const active = newCatId === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setNewCatId(cat.id)
                      setNewSubId(null)
                    }}
                    className="flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left text-[12.5px] font-semibold transition-all hover:bg-muted"
                    style={active ? { background: cat.bg, borderColor: cat.accent + "66", color: cat.accent } : {}}
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: cat.bg }}>
                      <Icon size={13} color={cat.accent} />
                    </div>
                    <span className="min-w-0 truncate">{cat.title}</span>
                    {active && <Check size={13} className="ml-auto shrink-0" style={{ color: cat.accent }} />}
                  </button>
                )
              })}
            </div>
          </div>

          {subs.length > 0 && (
            <div>
              <Label className="mb-2 block text-xs tracking-wider text-muted-foreground uppercase">Підкатегорія</Label>
              <div className="space-y-1.5">
                {[{ id: "", title: "Напряму в категорії" }, ...subs].map((s) => {
                  const active = s.id === "" ? newSubId === null : newSubId === s.id
                  return (
                    <button
                      key={s.id}
                      onClick={() => setNewSubId(s.id || null)}
                      className="flex w-full items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-[12.5px] font-medium transition-all hover:bg-muted"
                      style={active ? { background: selectedCat.bg, borderColor: selectedCat.accent + "55", color: selectedCat.accent } : {}}
                    >
                      {s.id === "" ? <Globe size={13} /> : <Layers size={13} />}
                      {s.title}
                      {active && <Check size={12} className="ml-auto" style={{ color: selectedCat.accent }} />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
          </div>

          {subs.length > 0 && (
            <div className="sticky bottom-0 px-5 pb-4">
              <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/90 px-3.5 py-2.5 shadow-sm backdrop-blur-sm dark:border-amber-900/50 dark:bg-amber-950/80">
                <AlertCircle size={14} className="shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="text-[12px] text-amber-700 dark:text-amber-400">Після зміни категорії не забудьте обрати підкатегорію</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 gap-3 border-t px-5 py-4">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Скасувати
          </Button>
          <Button className="flex-1" disabled={!changed || isPending} onClick={() => onMove(resource, newCatId, newSubId)}>
            <Check size={13} /> {isPending ? "Переміщення..." : "Перемістити"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
