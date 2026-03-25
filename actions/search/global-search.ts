"use server"

import prisma from "@/lib/prisma"

export type SearchResultItem = {
  id: string
  type: "category" | "subcategory" | "resource"
  title: string
  description?: string
  href: string
  external?: boolean
  accent?: string
  bg?: string
  iconName?: string
}

export type GlobalSearchResults = {
  items: SearchResultItem[]
  total: number
}

export async function globalSearch(query: string): Promise<GlobalSearchResults> {
  const q = query.trim()

  if (!q) {
    return { items: [], total: 0 }
  }

  const mode = "insensitive" as const

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

  const items = [...mappedCategories, ...mappedSubcategories, ...mappedResources]

  return { items, total: items.length }
}
