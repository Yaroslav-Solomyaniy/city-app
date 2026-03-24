"use client"

import React, { useState, useMemo, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  X,
  Plus,
  Pencil,
  Trash2,
  ArrowUpDown,
  MoreHorizontal,
  Palette,
  Type,
  ChevronDown,
  Check,
  ChevronRight,
  Globe,
  GripVertical,
  ArrowDownUp,
} from "lucide-react"
import { toast } from "sonner"
import { DragDropProvider } from "@dnd-kit/react"
import { useSortable } from "@dnd-kit/react/sortable"
import { isSortableOperation } from "@dnd-kit/dom/sortable"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ICON_MAP } from "@/constants/icon-map"
import { cn } from "@/lib/utils"
import { toSlug } from "@/lib/slug"
import { CategoryWithCount } from "@/types/action"
import ImageUpload from "@/components/image-upload"
import { CategoryFormData, createCategory } from "@/actions/category/create-category"
import { updateCategory } from "@/actions/category/update-category"
import { deleteCategory } from "@/actions/category/delete-category"
import { reorderCategories } from "@/actions/category/reorder-categories"
import EmptyState from "@/components/empty-state"

type SortCol = "title" | "res" | "createdAt"


function arrayMove<T>(arr: T[], from: number, to: number): T[] {
  const result = [...arr]
  const [moved] = result.splice(from, 1)
  result.splice(to, 0, moved)
  return result
}

// ═══════════════════════════════════════════════════════════════
// SORTABLE ROW
// ═══════════════════════════════════════════════════════════════

function SortableCategoryRow({
  cat,
  index,
  reorderMode,
  onNavigate,
  onEdit,
  onDelete,
}: {
  cat: CategoryWithCount
  index: number
  reorderMode: boolean
  onNavigate: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const { ref, handleRef, isDragging } = useSortable({ id: cat.id, index, disabled: !reorderMode })
  const Icon = ICON_MAP[cat.iconName] ?? ICON_MAP.Building2

  return (
    <TableRow
      ref={ref}
      className={cn(
        "group border-b transition-colors last:border-0",
        reorderMode ? "hover:bg-muted/30" : "cursor-pointer hover:bg-muted/30",
        isDragging && "opacity-40"
      )}
      onClick={reorderMode ? undefined : onNavigate}
    >
      {/* Drag handle (reorder mode only) */}
      {reorderMode && (
        <TableCell className="w-8 py-3.5 pl-3 pr-0" onClick={(e) => e.stopPropagation()}>
          <span
            ref={handleRef}
            className="flex cursor-grab items-center justify-center text-muted-foreground active:cursor-grabbing"
          >
            <GripVertical size={16} />
          </span>
        </TableCell>
      )}

      <TableCell className="py-3.5 pl-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: cat.bg }}>
            <Icon size={16} color={cat.accent} strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <p className="text-[13.5px] leading-tight font-semibold text-foreground">{cat.title}</p>
            <p className="text-[11px] text-muted-foreground">{cat.titleEn}</p>
          </div>
        </div>
      </TableCell>

      <TableCell className="hidden py-3.5 md:table-cell">
        <div className="flex flex-wrap gap-1">
          {cat.services.slice(0, 2).map((s) => (
            <Badge key={s} variant="secondary" className="text-[11px]">
              {s}
            </Badge>
          ))}
          {cat.services.length > 2 && <span className="text-[11px] text-muted-foreground">+{cat.services.length - 2}</span>}
        </div>
      </TableCell>

      <TableCell className="py-3.5">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold"
          style={{ background: cat.bg, color: cat.accent }}
        >
          <Globe size={10} />
          {cat._count.resources}
        </span>
      </TableCell>

      <TableCell className="hidden py-3.5 sm:table-cell">
        <span className="text-[12px] text-muted-foreground">
          {new Date(cat.createdAt).toLocaleDateString("uk-UA", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </TableCell>

      <TableCell className="py-3.5 pr-3" onClick={(e) => e.stopPropagation()}>
        {reorderMode ? null : (
          <div className="flex items-center gap-1">
            <ChevronRight size={14} className="text-muted-foreground/40" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil size={14} /> Редагувати
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                  <Trash2 size={14} /> Видалити
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </TableCell>
    </TableRow>
  )
}

// ═══════════════════════════════════════════════════════════════
// CLIENT PAGE
// ═══════════════════════════════════════════════════════════════

export default function AdminCategoriesClient({ categories: initial }: { categories: CategoryWithCount[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [categories, setCategories] = useState(initial)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<SortCol>("title")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<CategoryWithCount | null>(null)
  const [deleteItem, setDeleteItem] = useState<CategoryWithCount | null>(null)
  const [reorderMode, setReorderMode] = useState(false)
  const [orderSnapshot, setOrderSnapshot] = useState<CategoryWithCount[]>([])

  const filtered = useMemo(() => {
    if (reorderMode) return categories
    const q = search.toLowerCase()
    const list = categories.filter(
      (c) =>
        !q || c.title.toLowerCase().includes(q) || c.titleEn.toLowerCase().includes(q) || c.services.some((s) => s.toLowerCase().includes(q))
    )
    list.sort((a, b) => {
      let cmp = 0
      if (sortBy === "title") cmp = a.title.localeCompare(b.title, "uk")
      if (sortBy === "res") cmp = a._count.resources - b._count.resources
      if (sortBy === "createdAt") cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return sortDir === "asc" ? cmp : -cmp
    })
    return list
  }, [categories, search, sortBy, sortDir, reorderMode])

  const toggleSort = (col: SortCol) => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else {
      setSortBy(col)
      setSortDir("asc")
    }
  }

  const totalRes = categories.reduce((s, c) => s + c._count.resources, 0)

  // ── Reorder ────────────────────────────────────────────────

  function startReorder() {
    setOrderSnapshot(categories)
    setReorderMode(true)
  }

  function cancelReorder() {
    setCategories(orderSnapshot)
    setReorderMode(false)
  }

  async function saveReorder() {
    startTransition(async () => {
      try {
        await reorderCategories(categories.map((c, i) => ({ id: c.id, order: i })))
        setReorderMode(false)
        toast.success("Порядок збережено")
        router.refresh()
      } catch {
        toast.error("Не вдалося зберегти порядок")
      }
    })
  }

  // ── CRUD Handlers ─────────────────────────────────────────

  async function handleAdd(data: CategoryFormData) {
    let created
    try {
      created = await createCategory(data)
    } catch {
      if (data.photo) {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: data.photo }),
        })
      }
      toast.error("Не вдалося створити категорію")
      return
    }

    startTransition(() => {
      setCategories((prev) => [...prev, { ...created, _count: { resources: 0 } }])
      setShowAdd(false)
    })
    toast.success(`Категорію «${created.title}» створено`)
    router.refresh()
  }

  async function handleEdit(data: CategoryFormData & { originalPhoto?: string }) {
    if (!editItem) return
    const { originalPhoto, ...formData } = data
    startTransition(async () => {
      try {
        const updated = await updateCategory(editItem.id, formData)
        setCategories((prev) => prev.map((c) => (c.id === editItem.id ? { ...updated, _count: c._count } : c)))
        setEditItem(null)
        toast.success("Зміни збережено")

        if (originalPhoto && originalPhoto !== updated.photo) {
          await fetch("/api/upload", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: originalPhoto }),
          })
        }

        router.refresh()
      } catch {
        if (formData.photo && formData.photo !== editItem.photo) {
          await fetch("/api/upload", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: formData.photo }),
          })
        }
        toast.error("Не вдалося зберегти зміни")
      }
    })
  }

  async function handleDelete() {
    if (!deleteItem) return
    startTransition(async () => {
      try {
        await deleteCategory(deleteItem.id)
        setCategories((prev) => prev.filter((c) => c.id !== deleteItem.id))
        setDeleteItem(null)
        toast.success(`Категорію «${deleteItem.title}» видалено`)
        router.refresh()
      } catch {
        toast.error("Не вдалося видалити категорію")
      }
    })
  }

  // ── Render ─────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-[13px] text-muted-foreground">
            Адмін-панель › <span className="text-foreground">Категорії</span>
          </p>
          <h1 className="text-3xl font-bold text-foreground">Управління категоріями</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {categories.length} категорій · {totalRes} ресурсів
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          {reorderMode ? (
            <>
              <Button variant="outline" onClick={cancelReorder} disabled={isPending}>
                Скасувати
              </Button>
              <Button onClick={saveReorder} disabled={isPending} className="gap-2">
                <Check size={16} />
                {isPending ? "Збереження..." : "Зберегти порядок"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={startReorder} className="gap-2">
                <ArrowDownUp size={16} />
                Впорядкувати
              </Button>
              <Button onClick={() => setShowAdd(true)} className="gap-2">
                <Plus size={16} /> Додати категорію
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Search + sort (hidden in reorder mode) */}
      {!reorderMode && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={15} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Пошук категорій..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9 pl-9" />
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
            {(
              [
                { col: "title" as const, label: "Назва" },
                { col: "res" as const, label: "Ресурси" },
                { col: "createdAt" as const, label: "Дата" },
              ] as const
            ).map((s) => (
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
      )}

      {reorderMode && (
        <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-[13px] text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
          <GripVertical size={14} />
          Перетягніть рядки щоб змінити порядок відображення категорій
        </div>
      )}

      {/* Table */}
      <Card className="overflow-hidden rounded-2xl border p-0 shadow-sm">
        <CardContent className="p-0">
          <DragDropProvider
            onDragEnd={(event) => {
              if (event.canceled || !isSortableOperation(event.operation)) return
              const { source } = event.operation
              if (!source) return
              const from = source.initialIndex
              const to = source.index
              if (from === to) return
              setCategories((prev) => arrayMove(prev, from, to))
            }}
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  {reorderMode && <TableHead className="w-8 pl-3" />}
                  <TableHead className="pl-5 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Категорія</TableHead>
                  <TableHead className="hidden text-[11px] font-bold tracking-wider text-muted-foreground uppercase md:table-cell">
                    Послуги
                  </TableHead>
                  <TableHead className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Ресурси</TableHead>
                  <TableHead className="hidden text-[11px] font-bold tracking-wider text-muted-foreground uppercase sm:table-cell">
                    Створено
                  </TableHead>
                  <TableHead className="w-[80px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={reorderMode ? 6 : 5} className="py-5 px-5">
                      <EmptyState variant={search ? "search" : "empty"} query={search} onResetSearch={() => setSearch("")} />
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((cat, index) => (
                    <SortableCategoryRow
                      key={cat.id}
                      cat={cat}
                      index={index}
                      reorderMode={reorderMode}
                      onNavigate={() => router.push(`/admin/categories/${cat.id}`)}
                      onEdit={() => setEditItem(cat)}
                      onDelete={() => setDeleteItem(cat)}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </DragDropProvider>
          <Separator />
          <div className="px-5 py-3">
            <p className="text-[12px] text-muted-foreground">
              Показано <span className="font-semibold text-foreground">{filtered.length}</span> з{" "}
              <span className="font-semibold text-foreground">{categories.length}</span>
              {!reorderMode && " · Клікніть на рядок щоб керувати вмістом"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Form dialog */}
      {(showAdd || editItem) && (
        <CategoryFormDialog
          category={editItem ?? undefined}
          isPending={isPending}
          onSave={editItem ? handleEdit : handleAdd}
          onClose={() => {
            setShowAdd(false)
            setEditItem(null)
          }}
        />
      )}

      {/* Delete dialog */}
      <Dialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
              <Trash2 size={24} className="text-destructive" />
            </div>
            <DialogTitle>Видалити категорію?</DialogTitle>
          </DialogHeader>
          {deleteItem && (
            <div className="flex items-center justify-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: deleteItem.bg }}>
                {(() => {
                  const I = ICON_MAP[deleteItem.iconName] ?? ICON_MAP.Building2
                  return <I size={13} color={deleteItem.accent} />
                })()}
              </div>
              <span className="font-semibold text-foreground">{deleteItem.title}</span>
            </div>
          )}
          <p className="text-[13px] text-muted-foreground">Всі ресурси буде видалено. Дію неможливо скасувати.</p>
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

// ═══════════════════════════════════════════════════════════════
// CATEGORY FORM DIALOG
// ═══════════════════════════════════════════════════════════════

function CategoryFormDialog({
  category,
  isPending,
  onSave,
  onClose,
}: {
  category?: CategoryWithCount
  isPending: boolean
  onSave: (data: CategoryFormData & { originalPhoto?: string }) => void
  onClose: () => void
}) {
  const isEdit = !!category
  const originalPhoto = category?.photo ?? ""
  const [title, setTitle] = useState(category?.title ?? "")
  const [titleEn, setTitleEn] = useState(category?.titleEn ?? "")
  const [description, setDescription] = useState(category?.description ?? "")
  const [iconName, setIconName] = useState(category?.iconName ?? "Building2")
  const [photo, setPhoto] = useState(category?.photo ?? "")
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)
  const [accent, setAccent] = useState(category?.accent ?? "#3b82f6")
  const [bg, setBg] = useState(category?.bg ?? "#eff6ff")
  const [services, setServices] = useState(category?.services.join(", ") ?? "")
  const [iconOpen, setIconOpen] = useState(false)

  const SelectedIcon = ICON_MAP[iconName] ?? ICON_MAP.Building2

  async function handleClose() {
    if (pendingUrl && pendingUrl !== originalPhoto) {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: pendingUrl }),
      })
    }
    onClose()
  }

  const submit = () => {
    if (!title.trim()) return
    onSave({
      title: title.trim(),
      titleEn: titleEn.trim(),
      description: description.trim(),
      iconName,
      photo: photo.trim(),
      accent,
      bg,
      services: services
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      originalPhoto,
    })
    setPendingUrl(null)
  }

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[90vh] max-w-xl flex-col gap-0 overflow-hidden p-0">
        {/* Accent bar */}
        <div className="h-1 shrink-0 rounded-t-[inherit]" style={{ background: accent }} />

        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b px-6 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all" style={{ background: accent + "20" }}>
            <SelectedIcon size={17} color={accent} />
          </div>
          <div>
            <DialogTitle className="text-[15px]">{isEdit ? "Редагувати категорію" : "Нова категорія"}</DialogTitle>
            <p className="text-[11px] text-muted-foreground">{isEdit ? `ID: ${category?.id}` : "Заповніть поля та збережіть"}</p>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {/* Title UA / EN */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="flex items-center gap-1 text-xs tracking-wider uppercase">
                <Type size={10} /> Назва (UA) *
              </Label>
              <Input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Здоров'я" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="flex items-center gap-1 text-xs tracking-wider uppercase">
                <Globe size={10} /> Назва (EN)
              </Label>
              <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="Health" />
              {titleEn && (
                <p className="text-[11px] text-muted-foreground">
                  URL: <span className="font-mono text-foreground">/categories/{toSlug(titleEn)}</span>
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs tracking-wider uppercase">Опис</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Коротко про категорію" />
          </div>

          {/* Icon picker */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs tracking-wider uppercase">Іконка</Label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIconOpen((o) => !o)}
                className="flex w-full items-center gap-2.5 rounded-md border bg-background px-3 py-2.5 text-sm transition-colors hover:bg-muted"
              >
                <SelectedIcon size={16} color={accent} />
                <span>{iconName}</span>
                <ChevronDown size={14} className="ml-auto text-muted-foreground" />
              </button>
              {iconOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIconOpen(false)} />
                  <div className="absolute top-full right-0 left-0 z-20 mt-1 grid max-h-44 grid-cols-4 gap-1 overflow-y-auto rounded-xl border bg-card p-2 shadow-xl">
                    {Object.entries(ICON_MAP).map(([name, Ico]) => {
                      const sel = name === iconName
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => {
                            setIconName(name)
                            setIconOpen(false)
                          }}
                          className={cn(
                            "flex flex-col items-center gap-1 rounded-lg p-2.5 text-[9px] font-medium transition-all hover:bg-muted",
                            sel && "bg-primary/10 text-primary"
                          )}
                        >
                          <Ico size={18} color={sel ? accent : undefined} />
                          {name}
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Photo upload */}
          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center gap-1 text-xs tracking-wider uppercase">Фото категорії</Label>
            <ImageUpload value={photo} onChange={setPhoto} onPendingChange={setPendingUrl} />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="flex items-center gap-1 text-xs tracking-wider uppercase">
                <Palette size={10} /> Акцент
              </Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  className="h-10 w-9 cursor-pointer rounded-md border bg-transparent"
                />
                <Input value={accent} onChange={(e) => setAccent(e.target.value)} className="flex-1 font-mono text-xs" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="flex items-center gap-1 text-xs tracking-wider uppercase">
                <Palette size={10} /> Фон іконки
              </Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className="h-10 w-9 cursor-pointer rounded-md border bg-transparent"
                />
                <Input value={bg} onChange={(e) => setBg(e.target.value)} className="flex-1 font-mono text-xs" />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs tracking-wider uppercase">Послуги (через кому)</Label>
            <Input value={services} onChange={(e) => setServices(e.target.value)} placeholder="Лікарні, Поліклініки, Аптеки" />
            <p className="text-[11px] text-muted-foreground">Підкатегорії та ресурси — на сторінці категорії</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end gap-3 border-t px-6 py-4">
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Скасувати
          </Button>
          <Button onClick={submit} disabled={!title.trim() || isPending}>
            <Check size={14} />
            {isPending ? "Збереження..." : isEdit ? "Зберегти" : "Створити"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
