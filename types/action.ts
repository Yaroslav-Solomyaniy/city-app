import { getAdministrators } from "@/actions/administrators/get-administrators"
import { getCategories } from "@/actions/category/get-categories"
import { getCategoryById } from "@/actions/category/get-category-by-id"
import { getCategoryBySlug } from "@/actions/category/get-category-by-slug"
import { getResources } from "@/actions/resource/get-resources"
import { getCategoriesWithSubs } from "@/actions/category/get-category-with-subs"

// ─── Generic ──────────────────────────────────────────────────
export type Action<T = undefined> = { ok: true; data?: T } | { ok: false; error: string }
export type TokenStatus = "valid" | "invalid" | "used" | "expired"

// ─── Admin ────────────────────────────────────────────────────
export type InvitePayload = {
  id: string
  email: string
  used: boolean
  expires: string
  createdAt: string
  link: string
}

export type LogEntry = {
  id: string
  action: string
  entity: string
  entityName: string
  userName: string
  userId: string | null
  details: string | null
  createdAt: string
}

// ─── Form data ────────────────────────────────────────────────
export type SubcategoryFormData = {
  title: string
  titleEn: string
  description?: string
}

export type ResourceFormData = {
  title: string
  description: string
  url: string
  icon: string
  tags: string[]
  subcategoryId: string | null
}

// ─── Derived from actions ─────────────────────────────────────
export type Admin = Awaited<ReturnType<typeof getAdministrators>>["admins"][number]
export type CategoryWithCount = Awaited<ReturnType<typeof getCategories>>[number]

export type CategoryDetail = NonNullable<Awaited<ReturnType<typeof getCategoryById>>>
export type SubcategoryItem = CategoryDetail["subcategories"][number]
export type ResourceItem = CategoryDetail["resources"][number]
export type CategoryWithSubs = Awaited<ReturnType<typeof getCategoriesWithSubs>>[number]

export type PublicCategory = NonNullable<Awaited<ReturnType<typeof getCategoryBySlug>>>
export type PublicSubcategory = PublicCategory["subcategories"][number]
export type PublicResource = PublicCategory["resources"][number]

export type ResourceWithCategory = Awaited<ReturnType<typeof getResources>>[number]
/** @deprecated Use ResourceWithCategory */
export type ResourceWithRelations = ResourceWithCategory
