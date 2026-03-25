"use client"

import React, { useState, useMemo, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Plus,
  Check,
  X,
  ExternalLink,
  Layers,
  Hash,
  AlignLeft,
  Link as LinkIcon,
  Type,
  Search,
  Globe,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ICON_MAP } from "@/constants/icon-map"
import { CategoryDetail, ResourceFormData, ResourceItem, SubcategoryFormData, SubcategoryItem } from "@/types/action"
import { updateSubcategory } from "@/actions/sub-category/update-subcategory"
import { createSubcategory } from "@/actions/sub-category/create-subcategory"
import { deleteSubcategory } from "@/actions/sub-category/delete-subcategory"
import { createResource } from "@/actions/resource/create-resource"
import { updateResource } from "@/actions/resource/update-resource"
import { deleteResource } from "@/actions/resource/delete-resource"
import { updateCategory } from "@/actions/category/update-category"
import { CategoryFormDialog } from "@/app/admin/categories/client-page"

// ═══════════════════════════════════════════════════════════════
// CLIENT PAGE
// ═══════════════════════════════════════════════════════════════

export default function CategoryDetailClient({ category: initial }: { category: CategoryDetail }) {
  const router = useRouter()
  const [category, setCategory] = useState(initial)
  const [resSearch, setResSearch] = useState("")
  const [showEdit, setShowEdit] = useState(false)
  const [isPending, startTransition] = useTransition()

  const subs = category.subcategories
  const resources = category.resources

  const filteredRes = useMemo(() => {
    const q = resSearch.toLowerCase()
    if (!q) return resources
    return resources.filter(
      (r) =>
        r.title.toLowerCase().includes(q) || (r.description ?? "").toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q))
    )
  }, [resources, resSearch])

  const resGroups = useMemo(() => {
    const groups: { sub: SubcategoryItem | null; items: ResourceItem[] }[] = []
    const direct = filteredRes.filter((r) => r.subcategoryId === null)
    if (direct.length) groups.push({ sub: null, items: direct })
    subs.forEach((sub) => {
      const items = filteredRes.filter((r) => r.subcategoryId === sub.id)
      if (items.length) groups.push({ sub, items })
    })
    return groups
  }, [filteredRes, subs])

  const Icon = ICON_MAP[category.iconName] ?? ICON_MAP.Building2

  // ── Sub handlers ──────────────────────────────────────────

  async function handleAddSub(data: SubcategoryFormData) {
    try {
      const created = await createSubcategory(category.id, data)
      setCategory((prev) => ({
        ...prev,
        subcategories: [...prev.subcategories, created],
      }))
      toast.success(`Підкатегорію «${created.title}» створено`)
    } catch {
      toast.error("Не вдалося створити підкатегорію")
      throw new Error()
    }
  }

  async function handleEditSub(id: string, data: SubcategoryFormData) {
    try {
      const updated = await updateSubcategory(id, data)
      setCategory((prev) => ({
        ...prev,
        subcategories: prev.subcategories.map((s) => (s.id === id ? updated : s)),
      }))
      toast.success("Збережено")
    } catch {
      toast.error("Не вдалося зберегти")
      throw new Error()
    }
  }

  async function handleDeleteSub(id: string) {
    try {
      await deleteSubcategory(id)
      setCategory((prev) => ({
        ...prev,
        subcategories: prev.subcategories.filter((s) => s.id !== id),
        resources: prev.resources.map((r) => (r.subcategoryId === id ? { ...r, subcategoryId: null, subcategory: null } : r)),
      }))
      toast.success("Підкатегорію видалено")
    } catch {
      toast.error("Не вдалося видалити підкатегорію")
      throw new Error()
    }
  }

  // ── Resource handlers ─────────────────────────────────────

  async function handleAddRes(data: ResourceFormData) {
    try {
      const created = await createResource(category.id, data)
      setCategory((prev) => ({
        ...prev,
        resources: [...prev.resources, created],
        _count: { resources: prev._count.resources + 1 },
      }))
      toast.success(`Ресурс «${created.title}» додано`)
    } catch {
      toast.error("Не вдалося додати ресурс")
      throw new Error()
    }
  }

  async function handleEditRes(id: string, data: ResourceFormData) {
    try {
      const updated = await updateResource(id, data)
      setCategory((prev) => ({
        ...prev,
        resources: prev.resources.map((r) => (r.id === id ? updated : r)),
      }))
      toast.success("Збережено")
    } catch {
      toast.error("Не вдалося зберегти")
      throw new Error()
    }
  }

  async function handleDeleteRes(id: string) {
    try {
      await deleteResource(id)
      setCategory((prev) => ({
        ...prev,
        resources: prev.resources.filter((r) => r.id !== id),
        _count: { resources: prev._count.resources - 1 },
      }))
      toast.success("Ресурс видалено")
    } catch {
      toast.error("Не вдалося видалити ресурс")
      throw new Error()
    }
  }

  // ── Edit category handler ─────────────────────────────────

  async function handleEditCategory(data: import("@/actions/category/create-category").CategoryFormData & { originalPhoto?: string }) {
    const { originalPhoto, ...formData } = data
    startTransition(async () => {
      try {
        const updated = await updateCategory(category.id, formData)
        setCategory((prev) => ({ ...prev, ...updated }))
        setShowEdit(false)
        toast.success("Категорію оновлено")
        if (originalPhoto && originalPhoto !== updated.photo) {
          await fetch("/api/upload", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: originalPhoto }),
          })
        }
      } catch {
        toast.error("Не вдалося зберегти зміни")
      }
    })
  }

  // ── Render ─────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
        <button onClick={() => router.push("/admin/categories")} className="flex items-center gap-1.5 hover:text-foreground hover:underline">
          <ArrowLeft size={13} /> Категорії
        </button>
        <span className="text-[10px]">›</span>
        <span className="text-foreground">{category.title}</span>
      </div>

      {/* Hero card */}
      <Card className="overflow-hidden">
        {category.photo && (
          <div className="relative h-36">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={category.photo} alt={category.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,.7))" }} />
          </div>
        )}
        <CardContent className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
              style={{ background: category.bg, boxShadow: `0 0 0 4px ${category.accent}22` }}
            >
              <Icon size={26} color={category.accent} strokeWidth={1.7} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{category.title}</h1>
              <p className="mt-0.5 text-[13px] text-muted-foreground">
                {category.titleEn} · slug: {category.slug}
              </p>
              {category.description && (
                <p className="mt-1 text-[13px] text-muted-foreground">{category.description}</p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <div className="rounded-xl px-4 py-2 text-center" style={{ background: category.bg }}>
              <p className="text-[18px] font-bold" style={{ color: category.accent }}>
                {subs.length}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold tracking-wide uppercase" style={{ color: category.accent + "cc" }}>
                підкатег.
              </p>
            </div>
            <div className="rounded-xl bg-muted px-4 py-2 text-center">
              <p className="text-[18px] font-bold text-foreground">{resources.length}</p>
              <p className="mt-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">ресурсів</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowEdit(true)}>
              <Pencil size={14} /> Редагувати
            </Button>
          </div>
        </CardContent>
        <Separator />
        <div className="flex flex-wrap items-center gap-1.5 px-6 py-3">
          <span className="mr-2 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">Послуги:</span>
          {category.services.map((s) => (
            <Badge key={s} variant="secondary" className="text-[12px]">
              {s}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <SubcategoriesPanel
          cat={category}
          subs={subs}
          resources={resources}
          onAdd={handleAddSub}
          onEdit={handleEditSub}
          onDelete={handleDeleteSub}
        />
        <ResourcesPanel
          cat={category}
          subs={subs}
          resources={resources}
          resSearch={resSearch}
          setResSearch={setResSearch}
          resGroups={resGroups}
          onAdd={handleAddRes}
          onEdit={handleEditRes}
          onDelete={handleDeleteRes}
        />
      </div>

      {showEdit && (
        <CategoryFormDialog
          category={category}
          isPending={isPending}
          onSave={handleEditCategory}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SUBCATEGORIES PANEL
// ═══════════════════════════════════════════════════════════════

function SubcategoriesPanel({
  cat,
  subs,
  resources,
  onAdd,
  onEdit,
  onDelete,
}: {
  cat: CategoryDetail
  subs: SubcategoryItem[]
  resources: ResourceItem[]
  onAdd: (data: SubcategoryFormData) => Promise<void>
  onEdit: (id: string, data: SubcategoryFormData) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [isPending, startTransition] = useTransition()
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState("")
  const [newTitleEn, setNewTitleEn] = useState("")
  const [editTitle, setEditTitle] = useState("")
  const [editTitleEn, setEditTitleEn] = useState("")

  const startEdit = (sub: SubcategoryItem) => {
    setEditId(sub.id)
    setEditTitle(sub.title)
    setEditTitleEn(sub.titleEn)
  }

  function handleAdd() {
    if (!newTitle.trim()) return
    startTransition(async () => {
      try {
        await onAdd({ title: newTitle.trim(), titleEn: newTitleEn.trim() })
        setNewTitle("")
        setNewTitleEn("")
        setAdding(false)
      } catch {
        /* handled in parent */
      }
    })
  }

  function handleEdit() {
    if (!editTitle.trim() || !editId) return
    startTransition(async () => {
      try {
        await onEdit(editId, { title: editTitle.trim(), titleEn: editTitleEn.trim() })
        setEditId(null)
      } catch {
        /* handled in parent */
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await onDelete(id)
        setDeleteId(null)
      } catch {
        /* handled in parent */
      }
    })
  }

  const resCountFor = (subId: string) => resources.filter((r) => r.subcategoryId === subId).length

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: cat.accent + "18" }}>
            <Layers size={14} color={cat.accent} />
          </div>
          <div>
            <p className="text-[13.5px] font-semibold text-foreground">Підкатегорії</p>
            <p className="text-[11px] text-muted-foreground">{subs.length} шт.</p>
          </div>
        </div>
        {!adding && (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-[12px]"
            style={{ color: cat.accent, borderColor: cat.accent + "44" }}
            onClick={() => setAdding(true)}
          >
            <Plus size={13} /> Додати
          </Button>
        )}
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        {adding && (
          <>
            <div className="space-y-2.5 px-5 py-4" style={{ background: cat.accent + "06" }}>
              <p className="text-[10.5px] font-bold tracking-widest text-muted-foreground uppercase">Нова підкатегорія</p>
              <Input
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="Назва (UA)"
              />
              <Input
                value={newTitleEn}
                onChange={(e) => setNewTitleEn(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="Назва (EN)"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setAdding(false)
                    setNewTitle("")
                    setNewTitleEn("")
                  }}
                >
                  Скасувати
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  disabled={!newTitle.trim() || isPending}
                  onClick={handleAdd}
                  style={{ background: cat.accent }}
                >
                  <Check size={12} /> {isPending ? "..." : "Додати"}
                </Button>
              </div>
            </div>
            <Separator />
          </>
        )}

        {subs.length === 0 && !adding && (
          <div className="px-5 py-10 text-center">
            <Layers size={28} className="mx-auto mb-2 text-muted-foreground/20" />
            <p className="text-[13px] text-muted-foreground">Підкатегорій ще немає</p>
          </div>
        )}

        {subs.map((sub, idx) => (
          <div key={sub.id}>
            {deleteId === sub.id ? (
              <div className="flex items-center justify-between gap-3 bg-destructive/10 px-5 py-3.5">
                <p className="truncate text-[12.5px] font-medium text-destructive">Видалити «{sub.title}»?</p>
                <div className="flex shrink-0 gap-2">
                  <Button size="sm" variant="outline" onClick={() => setDeleteId(null)}>
                    Ні
                  </Button>
                  <Button size="sm" variant="destructive" disabled={isPending} onClick={() => handleDelete(sub.id)}>
                    {isPending ? "..." : "Так"}
                  </Button>
                </div>
              </div>
            ) : editId === sub.id ? (
              <div className="space-y-2.5 px-5 py-3.5" style={{ background: cat.accent + "06" }}>
                <Input
                  autoFocus
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEdit()}
                />
                <Input
                  value={editTitleEn}
                  onChange={(e) => setEditTitleEn(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEdit()}
                  placeholder="Назва (EN)"
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditId(null)}>
                    Скасувати
                  </Button>
                  <Button size="sm" className="flex-1" disabled={isPending} onClick={handleEdit} style={{ background: cat.accent }}>
                    <Check size={12} /> {isPending ? "..." : "Зберегти"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/40">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl" style={{ background: cat.accent + "15" }}>
                  <Layers size={13} color={cat.accent} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-foreground">{sub.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {sub.titleEn} · {resCountFor(sub.id)} ресурсів
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => startEdit(sub)}>
                    <Pencil size={12} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteId(sub.id)}
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
            )}
            {idx < subs.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════
// RESOURCES PANEL
// ═══════════════════════════════════════════════════════════════

function ResourcesPanel({
  cat,
  subs,
  resources,
  resSearch,
  setResSearch,
  resGroups,
  onAdd,
  onEdit,
  onDelete,
}: {
  cat: CategoryDetail
  subs: SubcategoryItem[]
  resources: ResourceItem[]
  resSearch: string
  setResSearch: (v: string) => void
  resGroups: { sub: SubcategoryItem | null; items: ResourceItem[] }[]
  onAdd: (data: ResourceFormData) => Promise<void>
  onEdit: (id: string, data: ResourceFormData) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [isPending, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(false)
  const [editRes, setEditRes] = useState<ResourceItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  function handleSave(data: ResourceFormData) {
    startTransition(async () => {
      try {
        if (editRes) {
          await onEdit(editRes.id, data)
          setEditRes(null)
        } else {
          await onAdd(data)
          setShowForm(false)
        }
      } catch {
        /* handled in parent */
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await onDelete(id)
        setDeleteId(null)
      } catch {
        /* handled in parent */
      }
    })
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted">
            <Globe size={14} className="text-muted-foreground" />
          </div>
          <div>
            <p className="text-[13.5px] font-semibold text-foreground">Ресурси</p>
            <p className="text-[11px] text-muted-foreground">{resources.length} шт.</p>
          </div>
        </div>
        {!showForm && !editRes && (
          <Button size="sm" className="gap-1.5" onClick={() => setShowForm(true)}>
            <Plus size={13} /> Додати ресурс
          </Button>
        )}
      </CardHeader>
      <Separator />

      {(showForm || editRes) && (
        <>
          <div className="bg-muted/30 px-5 py-4">
            <ResourceForm
              resource={editRes ?? undefined}
              subcategories={subs}
              accent={cat.accent}
              isPending={isPending}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false)
                setEditRes(null)
              }}
            />
          </div>
          <Separator />
        </>
      )}

      {resources.length > 3 && (
        <>
          <div className="px-5 py-3">
            <div className="relative">
              <Search size={13} className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Пошук ресурсів..."
                value={resSearch}
                onChange={(e) => setResSearch(e.target.value)}
                className="pr-8 pl-8 text-[13px]"
              />
              {resSearch && (
                <button
                  onClick={() => setResSearch("")}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
          <Separator />
        </>
      )}

      {resources.length === 0 && !showForm && (
        <div className="px-5 py-14 text-center">
          <Globe size={32} className="mx-auto mb-3 text-muted-foreground/20" />
          <p className="mb-1 font-semibold text-foreground">Ресурсів ще немає</p>
          <p className="text-[12.5px] text-muted-foreground">Натисніть «Додати ресурс» щоб створити перший</p>
        </div>
      )}
      {resources.length > 0 && resGroups.length === 0 && (
        <div className="px-5 py-10 text-center">
          <p className="text-[13px] text-muted-foreground">Нічого не знайдено</p>
        </div>
      )}

      <CardContent className="p-0">
        {resGroups.map((group) => (
          <div key={group.sub?.id ?? "__direct__"}>
            <div className="flex items-center gap-2 border-t border-b border-border bg-muted/30 px-5 py-2.5">
              <div
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
                style={{ background: group.sub ? cat.accent + "18" : undefined }}
              >
                {group.sub ? <Layers size={10} color={cat.accent} /> : <Globe size={10} className="text-muted-foreground" />}
              </div>
              <p className="text-[11.5px] font-bold" style={{ color: group.sub ? cat.accent : undefined }}>
                {group.sub ? group.sub.title : "Напряму в категорії"}
              </p>
              <span
                className="ml-auto rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold"
                style={{ background: group.sub ? cat.accent + "15" : undefined, color: group.sub ? cat.accent : undefined }}
              >
                {group.items.length}
              </span>
            </div>

            {group.items.map((res, idx) => (
              <div key={res.id}>
                {deleteId === res.id ? (
                  <div className="flex items-center justify-between gap-3 bg-destructive/10 px-5 py-3.5">
                    <p className="truncate text-[12.5px] font-medium text-destructive">Видалити «{res.title}»?</p>
                    <div className="flex shrink-0 gap-2">
                      <Button size="sm" variant="outline" onClick={() => setDeleteId(null)}>
                        Ні
                      </Button>
                      <Button size="sm" variant="destructive" disabled={isPending} onClick={() => handleDelete(res.id)}>
                        {isPending ? "..." : "Так"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="group flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-muted/40">
                    <div
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: cat.accent + "12" }}
                    >
                      <LinkIcon size={13} color={cat.accent} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="text-[13.5px] font-semibold text-foreground">{res.title}</p>
                        {res.url && (
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-50"
                            style={{ color: cat.accent }}
                          >
                            <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                      {res.description && <p className="mt-0.5 line-clamp-1 text-[12px] text-muted-foreground">{res.description}</p>}
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(res.createdAt).toLocaleDateString("uk-UA", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        {res.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md px-1.5 py-0.5 text-[10.5px] font-medium"
                            style={{ background: cat.accent + "12", color: cat.accent }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground"
                        onClick={() => {
                          setEditRes({ ...res })
                          setShowForm(false)
                        }}
                      >
                        <Pencil size={13} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteId(res.id)}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                )}
                {idx < group.items.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════
// RESOURCE FORM
// ═══════════════════════════════════════════════════════════════

function ResourceForm({
  resource,
  subcategories,
  accent,
  isPending,
  onSave,
  onCancel,
}: {
  resource?: ResourceItem
  subcategories: SubcategoryItem[]
  accent: string
  isPending: boolean
  onSave: (data: ResourceFormData) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(resource?.title ?? "")
  const [description, setDescription] = useState(resource?.description ?? "")
  const [url, setUrl] = useState(resource?.url ?? "")
  const [icon, setIcon] = useState(resource?.icon ?? "Globe")
  const [subcategoryId, setSubcategoryId] = useState<string | null>(resource?.subcategoryId ?? null)
  const [tags, setTags] = useState(resource?.tags.join(", ") ?? "")

  const save = () => {
    if (!title.trim()) return
    onSave({
      title: title.trim(),
      description: description.trim(),
      url: url.trim(),
      icon,
      subcategoryId,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    })
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">{resource ? "Редагувати ресурс" : "Новий ресурс"}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-1 text-[10px] tracking-wider uppercase">
            <Type size={9} /> Назва *
          </Label>
          <Input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Назва ресурсу" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-1 text-[10px] tracking-wider uppercase">
            <LinkIcon size={9} /> URL
          </Label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="flex items-center justify-between text-[10px] tracking-wider uppercase">
          <span className="flex items-center gap-1"><AlignLeft size={9} /> Опис</span>
          <span className="font-normal normal-case text-muted-foreground">{description.length}/300</span>
        </Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 300))}
          placeholder="Короткий опис ресурсу"
          className="min-h-[80px] resize-none"
        />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-1 text-[10px] tracking-wider uppercase">
            <Layers size={9} /> Підкатегорія
          </Label>
          <Select value={subcategoryId ?? "__none__"} onValueChange={(v) => setSubcategoryId(v === "__none__" ? null : v)}>
            <SelectTrigger className="text-[13px]">
              <SelectValue placeholder="— Напряму в категорії —" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">— Напряму в категорії —</SelectItem>
              {subcategories.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-1 text-[10px] tracking-wider uppercase">
            <Hash size={9} /> Теги (через кому)
          </Label>
          <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="лікарня, стаціонар" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="outline" size="sm" onClick={onCancel} disabled={isPending}>
          Скасувати
        </Button>
        <Button size="sm" disabled={!title.trim() || isPending} onClick={save} style={{ background: accent }}>
          <Check size={12} /> {isPending ? "Збереження..." : resource ? "Зберегти" : "Додати"}
        </Button>
      </div>
    </div>
  )
}
