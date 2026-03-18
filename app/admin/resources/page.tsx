// app/(pages)/auth/resources/page.tsx
"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
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
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ICON_MAP } from "@/constants/icon-map"
import type { Prisma } from "@/prisma/src/generated/prisma"
import {
  MOCK_CATEGORIES,
  MOCK_SUBCATEGORIES,
  MOCK_RESOURCES,
} from "@/constants/mock-data"

// ─── Types ────────────────────────────────────────────────────

// Базовий тип категорії без _count — він потрібен тільки для списку категорій
type CategoryBase = Prisma.CategoryGetPayload<Record<string, never>>
type SubcategoryBase = Prisma.SubcategoryGetPayload<Record<string, never>>

interface FlatResource {
  id: string
  title: string
  description: string | null
  url: string | null
  tags: string[]
  createdAt: Date
  categoryId: string
  subcategoryId: string | null
  category: CategoryBase
  subcategory: SubcategoryBase | null
}

// ─── Seed flat resources from mock ────────────────────────────

const seedResources = (): FlatResource[] =>
  MOCK_RESOURCES.map((r) => {
    return {
      id: r.id,
      title: r.title,
      description: r.description,
      url: r.url,
      tags: r.tags,
      createdAt: r.createdAt,
      categoryId: r.categoryId,
      subcategoryId: r.subcategoryId,
      category: r.category as CategoryBase,
      subcategory: r.subcategory,
    }
  })

const formatDate = (d: Date) =>
  d
    .toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .replace(" р.", "")

// ═══════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════

export default function AdminResourcesPage() {
  const router = useRouter()
  const [resources, setResources] = useState<FlatResource[]>(seedResources)

  const [search, setSearch] = useState("")
  const [filterCatId, setFilterCatId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"title" | "category" | "createdAt">(
    "createdAt"
  )
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  const [showAddForm, setShowAddForm] = useState(false)
  const [editRes, setEditRes] = useState<FlatResource | null>(null)
  const [moveRes, setMoveRes] = useState<FlatResource | null>(null)
  const [deleteRes, setDeleteRes] = useState<FlatResource | null>(null)

  // ── filtered + sorted ──
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const list = resources.filter((r) => {
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
      if (sortBy === "category")
        cmp = a.category.title.localeCompare(b.category.title, "uk")
      if (sortBy === "createdAt")
        cmp = a.createdAt.getTime() - b.createdAt.getTime()
      return sortDir === "asc" ? cmp : -cmp
    })
    return list
  }, [resources, search, filterCatId, sortBy, sortDir])

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else {
      setSortBy(col)
      setSortDir("asc")
    }
  }

  // ── category that have at least one resource ──
  const activeCats = useMemo(
    () =>
      MOCK_CATEGORIES.filter((c) =>
        resources.some((r) => r.categoryId === c.id)
      ),
    [resources]
  )

  // ── mutators ──
  const addResource = (r: Omit<FlatResource, "id" | "createdAt">) => {
    setResources((prev) => [
      ...prev,
      { ...r, id: "r-" + Date.now(), createdAt: new Date() },
    ])
    setShowAddForm(false)
  }

  const saveEdit = (updated: FlatResource) => {
    setResources((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
    setEditRes(null)
  }

  const moveResource = (
    res: FlatResource,
    newCatId: string,
    newSubId: string | null
  ) => {
    const cat = MOCK_CATEGORIES.find((c) => c.id === newCatId)!
    const sub = MOCK_SUBCATEGORIES.find((s) => s.id === newSubId) ?? null
    setResources((prev) =>
      prev.map((r) =>
        r.id !== res.id
          ? r
          : {
              ...r,
              categoryId: newCatId,
              subcategoryId: newSubId,
              category: cat as CategoryBase,
              subcategory: sub,
            }
      )
    )
    setMoveRes(null)
  }

  const deleteResource = (res: FlatResource) => {
    setResources((prev) => prev.filter((r) => r.id !== res.id))
    setDeleteRes(null)
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-[13px] text-muted-foreground">
            Адмін-панель › <span className="text-foreground">Ресурси</span>
          </p>
          <h1 className="text-3xl font-bold text-foreground">Всі ресурси</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {resources.length} ресурсів у {activeCats.length} категоріях
          </p>
        </div>
        <Button
          onClick={() => {
            setShowAddForm(true)
            setEditRes(null)
          }}
        >
          <Plus size={16} /> Додати ресурс
        </Button>
      </div>

      {/* ── Category filter chips ── */}
      <div className="flex flex-wrap gap-2">
        {activeCats.map((cat) => {
          const Icon = ICON_MAP[cat.iconName] ?? ICON_MAP.Building2
          const active = filterCatId === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setFilterCatId(active ? null : cat.id)}
              className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors hover:bg-muted"
              style={
                active
                  ? {
                      background: cat.bg,
                      borderColor: cat.accent + "88",
                      color: cat.accent,
                    }
                  : {}
              }
            >
              <Icon size={12} style={{ color: cat.accent }} />
              {cat.title}
              <span className="ml-0.5 opacity-60">
                {resources.filter((r) => r.categoryId === cat.id).length}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Search + sort ── */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground"
          />
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
        <div className="flex gap-2">
          {(
            [
              { col: "createdAt" as const, label: "Дата" },
              { col: "title" as const, label: "Назва" },
              { col: "category" as const, label: "Категорія" },
            ] as const
          ).map((s) => (
            <Button
              key={s.col}
              variant={sortBy === s.col ? "secondary" : "outline"}
              size="sm"
              onClick={() => toggleSort(s.col)}
              className="gap-1.5"
            >
              <ArrowUpDown size={12} />
              {s.label}
              {sortBy === s.col && (
                <span className="text-[10px]">
                  {sortDir === "asc" ? "↑" : "↓"}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* ── Inline add/edit form ── */}
      {(showAddForm || editRes) && (
        <Card className="border-primary/30">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold text-foreground">
                {editRes ? `Редагувати: ${editRes.title}` : "Новий ресурс"}
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowAddForm(false)
                  setEditRes(null)
                }}
              >
                <X size={16} />
              </Button>
            </div>
            <Separator className="mb-5" />
            <ResourceForm
              resource={editRes ?? undefined}
              onSave={(r) =>
                editRes ? saveEdit({ ...editRes, ...r }) : addResource(r)
              }
              onCancel={() => {
                setShowAddForm(false)
                setEditRes(null)
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* ── Table ── */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ресурс</TableHead>
                  <TableHead>Категорія</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Підкатегорія
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Теги</TableHead>
                  <TableHead className="hidden sm:table-cell">Додано</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-16 text-center">
                      <p className="mb-2 text-3xl">🔍</p>
                      <p className="mb-1 font-semibold text-foreground">
                        Нічого не знайдено
                      </p>
                      <Button
                        variant="link"
                        onClick={() => {
                          setSearch("")
                          setFilterCatId(null)
                        }}
                      >
                        Скинути фільтри
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((res) => {
                    const CatIcon =
                      ICON_MAP[res.category.iconName] ?? ICON_MAP.Building2
                    return (
                      <TableRow key={res.id}>
                        {/* Resource */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                              style={{ background: res.category.bg }}
                            >
                              <LinkIcon size={13} color={res.category.accent} />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="truncate text-[13px] font-semibold text-foreground">
                                  {res.title}
                                </span>
                                {res.url && (
                                  <a
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="shrink-0 text-muted-foreground hover:text-foreground"
                                  >
                                    <ExternalLink size={11} />
                                  </a>
                                )}
                              </div>
                              {res.description && (
                                <p className="max-w-[240px] truncate text-[11.5px] text-muted-foreground">
                                  {res.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* Category */}
                        <TableCell>
                          <button
                            onClick={() =>
                              router.push(`/admin/categories/${res.categoryId}`)
                            }
                            className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
                          >
                            <div
                              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
                              style={{ background: res.category.bg }}
                            >
                              <CatIcon size={10} color={res.category.accent} />
                            </div>
                            <span className="text-[12px] font-medium text-muted-foreground">
                              {res.category.title}
                            </span>
                          </button>
                        </TableCell>

                        {/* Subcategory */}
                        <TableCell className="hidden md:table-cell">
                          {res.subcategory ? (
                            <Badge
                              variant="secondary"
                              className="gap-1"
                              style={{
                                background: res.category.bg,
                                color: res.category.accent,
                              }}
                            >
                              <Layers size={9} />
                              {res.subcategory.title}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>

                        {/* Tags */}
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {res.tags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-[10.5px]"
                                style={{
                                  color: res.category.accent,
                                  borderColor: res.category.accent + "44",
                                }}
                              >
                                #{tag}
                              </Badge>
                            ))}
                            {res.tags.length > 2 && (
                              <span className="text-[10.5px] text-muted-foreground">
                                +{res.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Date */}
                        <TableCell className="hidden sm:table-cell">
                          <span className="text-[12px] text-muted-foreground">
                            {formatDate(res.createdAt)}
                          </span>
                        </TableCell>

                        {/* Actions */}
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              title="Редагувати"
                              onClick={() => {
                                setEditRes(res)
                                setShowAddForm(false)
                              }}
                            >
                              <Pencil size={13} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              title="Перемістити"
                              onClick={() => setMoveRes(res)}
                            >
                              <FolderOpen size={13} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              title="Видалити"
                              onClick={() => setDeleteRes(res)}
                            >
                              <Trash2 size={13} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
          <Separator />
          <div className="flex items-center justify-between px-5 py-3">
            <p className="text-[12px] text-muted-foreground">
              Показано {filtered.length} з {resources.length} ресурсів
              {filterCatId && (
                <Button
                  variant="link"
                  className="ml-1 h-auto p-0 text-[12px]"
                  onClick={() => setFilterCatId(null)}
                >
                  · зняти фільтр
                </Button>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Move dialog ── */}
      {moveRes && (
        <MoveDialog
          resource={moveRes}
          onMove={moveResource}
          onClose={() => setMoveRes(null)}
        />
      )}

      {/* ── Delete dialog ── */}
      <Dialog open={!!deleteRes} onOpenChange={() => setDeleteRes(null)}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
              <Trash2 size={24} className="text-destructive" />
            </div>
            <DialogTitle>Видалити ресурс?</DialogTitle>
          </DialogHeader>
          <p className="font-semibold text-foreground">{deleteRes?.title}</p>
          <p className="text-sm text-muted-foreground">
            Цю дію неможливо скасувати.
          </p>
          <DialogFooter className="mt-2 flex gap-3 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setDeleteRes(null)}
            >
              Скасувати
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => deleteRes && deleteResource(deleteRes)}
            >
              Видалити
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// RESOURCE FORM
// ═══════════════════════════════════════════════════════════════

function ResourceForm({
  resource,
  onSave,
  onCancel,
}: {
  resource?: FlatResource
  onSave: (r: Omit<FlatResource, "id" | "createdAt">) => void
  onCancel: () => void
}) {
  const [catId, setCatId] = useState(
    resource?.categoryId ?? MOCK_CATEGORIES[0]?.id ?? ""
  )
  const [title, setTitle] = useState(resource?.title ?? "")
  const [description, setDescription] = useState(resource?.description ?? "")
  const [url, setUrl] = useState(resource?.url ?? "")
  const [subId, setSubId] = useState<string | null>(
    resource?.subcategoryId ?? null
  )
  const [tags, setTags] = useState(resource?.tags.join(", ") ?? "")

  const cat = MOCK_CATEGORIES.find((c) => c.id === catId)!
  const subs = MOCK_SUBCATEGORIES.filter((s) => s.categoryId === catId)

  const handleCatChange = (id: string) => {
    setCatId(id)
    setSubId(null)
  }

  const save = () => {
    if (!title.trim() || !catId) return
    const sub = MOCK_SUBCATEGORIES.find((s) => s.id === subId) ?? null
    onSave({
      title: title.trim(),
      description: description.trim() || null,
      url: url.trim() || null,
      subcategoryId: subId,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      categoryId: catId,
      category: cat as CategoryBase,
      subcategory: sub,
    })
  }

  return (
    <div className="space-y-4">
      {/* Category selector */}
      <div>
        <Label className="mb-2 flex items-center gap-1.5 text-xs tracking-wider uppercase">
          <FolderOpen size={11} /> Категорія *
        </Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {MOCK_CATEGORIES.map((c) => {
            const Icon = ICON_MAP[c.iconName] ?? ICON_MAP.Building2
            const active = catId === c.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleCatChange(c.id)}
                className="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-[12px] font-medium transition-all hover:bg-muted"
                style={
                  active
                    ? {
                        background: c.bg,
                        borderColor: c.accent + "66",
                        color: c.accent,
                      }
                    : {}
                }
              >
                <div
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
                  style={{ background: c.bg }}
                >
                  <Icon size={11} color={c.accent} />
                </div>
                <span className="truncate">{c.title}</span>
                {active && (
                  <Check
                    size={11}
                    className="ml-auto shrink-0"
                    style={{ color: c.accent }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-1.5 text-xs tracking-wider uppercase">
            <Type size={10} /> Назва *
          </Label>
          <Input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Назва ресурсу"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-1.5 text-xs tracking-wider uppercase">
            <LinkIcon size={10} /> URL
          </Label>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="flex items-center gap-1.5 text-xs tracking-wider uppercase">
          <AlignLeft size={10} /> Опис
        </Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Короткий опис"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-1.5 text-xs tracking-wider uppercase">
            <Layers size={10} /> Підкатегорія
          </Label>
          <Select
            value={subId ?? ""}
            onValueChange={(v) => setSubId(v || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="— Напряму в категорії —" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">— Напряму в категорії —</SelectItem>
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
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="лікарня, стаціонар"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-1">
        <Button variant="outline" onClick={onCancel}>
          Скасувати
        </Button>
        <Button onClick={save} disabled={!title.trim() || !catId}>
          <Check size={13} />
          {resource ? "Зберегти зміни" : "Додати ресурс"}
        </Button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// MOVE DIALOG
// ═══════════════════════════════════════════════════════════════

function MoveDialog({
  resource,
  onMove,
  onClose,
}: {
  resource: FlatResource
  onMove: (res: FlatResource, newCatId: string, newSubId: string | null) => void
  onClose: () => void
}) {
  const [newCatId, setNewCatId] = useState(resource.categoryId)
  const [newSubId, setNewSubId] = useState<string | null>(
    resource.subcategoryId
  )

  const selectedCat = MOCK_CATEGORIES.find((c) => c.id === newCatId)!
  const subs = MOCK_SUBCATEGORIES.filter((s) => s.categoryId === newCatId)
  const changed =
    newCatId !== resource.categoryId || newSubId !== resource.subcategoryId

  const handleCatChange = (id: string) => {
    setNewCatId(id)
    setNewSubId(null)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Перемістити ресурс</DialogTitle>
          <p className="truncate text-sm text-muted-foreground">
            {resource.title}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Category grid */}
          <div>
            <Label className="mb-2 block text-xs tracking-wider text-muted-foreground uppercase">
              Оберіть категорію
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {MOCK_CATEGORIES.map((cat) => {
                const Icon = ICON_MAP[cat.iconName] ?? ICON_MAP.Building2
                const active = newCatId === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCatChange(cat.id)}
                    className="flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left text-[12.5px] font-semibold transition-all hover:bg-muted"
                    style={
                      active
                        ? {
                            background: cat.bg,
                            borderColor: cat.accent + "66",
                            color: cat.accent,
                          }
                        : {}
                    }
                  >
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: cat.bg }}
                    >
                      <Icon size={13} color={cat.accent} />
                    </div>
                    <span className="min-w-0 truncate">{cat.title}</span>
                    {active && (
                      <Check
                        size={13}
                        className="ml-auto shrink-0"
                        style={{ color: cat.accent }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Subcategory */}
          {subs.length > 0 && (
            <div>
              <Label className="mb-2 block text-xs tracking-wider text-muted-foreground uppercase">
                Підкатегорія
              </Label>
              <div className="space-y-1.5">
                {[{ id: "", title: "Напряму в категорії" }, ...subs].map(
                  (s) => {
                    const active =
                      s.id === "" ? newSubId === null : newSubId === s.id
                    return (
                      <button
                        key={s.id}
                        onClick={() => setNewSubId(s.id || null)}
                        className="flex w-full items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-[12.5px] font-medium transition-all hover:bg-muted"
                        style={
                          active
                            ? {
                                background: selectedCat.bg,
                                borderColor: selectedCat.accent + "55",
                                color: selectedCat.accent,
                              }
                            : {}
                        }
                      >
                        {s.id === "" ? (
                          <Globe size={13} />
                        ) : (
                          <Layers size={13} />
                        )}
                        {s.title}
                        {active && (
                          <Check
                            size={12}
                            className="ml-auto"
                            style={{ color: selectedCat.accent }}
                          />
                        )}
                      </button>
                    )
                  }
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-3 sm:flex-row">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Скасувати
          </Button>
          <Button
            className="flex-1"
            disabled={!changed}
            onClick={() => onMove(resource, newCatId, newSubId)}
          >
            <Check size={13} /> Перемістити
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
