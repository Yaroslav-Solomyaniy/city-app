"use server"

import prisma from "@/lib/prisma"

export type SearchResultItem = {
  id: string
  type: "page" | "category" | "subcategory" | "resource"
  title: string
  description?: string
  href: string
  external?: boolean
  accent?: string
  bg?: string
  iconName?: string
}

export type GlobalSearchResults = {
  pages: SearchResultItem[]
  categories: SearchResultItem[]
  subcategories: SearchResultItem[]
  resources: SearchResultItem[]
  total: number
}

const STATIC_PAGES: SearchResultItem[] = [
  { id: "home", type: "page", title: "Головна", description: "Головна сторінка порталу", href: "/" },
  { id: "categories", type: "page", title: "Категорії послуг", description: "Перелік всіх категорій", href: "/categories" },
  { id: "resources", type: "page", title: "Ресурси", description: "Всі доступні ресурси порталу", href: "/resources" },
  { id: "about", type: "page", title: "Про портал", description: "Інформація про СітіЧЕ та зворотний зв'язок", href: "/about" },
]

export async function globalSearch(query: string): Promise<GlobalSearchResults> {
  const q = query.trim()

  if (!q) {
    return { pages: STATIC_PAGES, categories: [], subcategories: [], resources: [], total: STATIC_PAGES.length }
  }

  const mode = "insensitive" as const
  const lower = q.toLowerCase()

  const [categories, subcategories, resources] = await Promise.all([
    prisma.category.findMany({
      where: {
        OR: [
          { title: { contains: q, mode } },
          { titleEn: { contains: q, mode } },
          { description: { contains: q, mode } },
        ],
      },
      take: 5,
      select: { id: true, title: true, description: true, slug: true, accent: true, bg: true, iconName: true },
      orderBy: { order: "asc" },
    }),
    prisma.subcategory.findMany({
      where: {
        OR: [
          { title: { contains: q, mode } },
          { titleEn: { contains: q, mode } },
          { description: { contains: q, mode } },
        ],
      },
      take: 5,
      select: {
        id: true, title: true, description: true, slug: true,
        category: { select: { slug: true, accent: true, bg: true, iconName: true } },
      },
      orderBy: { order: "asc" },
    }),
    prisma.resource.findMany({
      where: {
        OR: [
          { title: { contains: q, mode } },
          { description: { contains: q, mode } },
        ],
      },
      take: 6,
      select: {
        id: true, title: true, description: true, url: true, icon: true,
        category: { select: { accent: true, bg: true } },
        subcategory: { select: { slug: true } },
      },
    }),
  ])

  const pages = STATIC_PAGES.filter(
    (p) =>
      p.title.toLowerCase().includes(lower) ||
      (p.description ?? "").toLowerCase().includes(lower)
  )

  const mappedCategories: SearchResultItem[] = categories.map((c) => ({
    id: c.id,
    type: "category",
    title: c.title,
    description: c.description,
    href: `/categories/${c.slug}`,
    accent: c.accent,
    bg: c.bg,
    iconName: c.iconName,
  }))

  const mappedSubcategories: SearchResultItem[] = subcategories.map((s) => ({
    id: s.id,
    type: "subcategory",
    title: s.title,
    description: s.description ?? undefined,
    href: `/categories/${s.category.slug}/${s.slug}`,
    accent: s.category.accent,
    bg: s.category.bg,
    iconName: s.category.iconName,
  }))

  const mappedResources: SearchResultItem[] = resources.map((r) => ({
    id: r.id,
    type: "resource",
    title: r.title,
    description: r.description ?? undefined,
    href: r.url,
    external: true,
    accent: r.category.accent,
    bg: r.category.bg,
    iconName: r.icon,
  }))

  const total = pages.length + mappedCategories.length + mappedSubcategories.length + mappedResources.length

  return {
    pages,
    categories: mappedCategories,
    subcategories: mappedSubcategories,
    resources: mappedResources,
    total,
  }
}
