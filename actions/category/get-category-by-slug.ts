"use server"

import prisma from "@/lib/prisma"

export async function getCategoryBySlug(slug: string, q?: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      subcategories: {
        orderBy: { order: "asc" },
        include: {
          _count: { select: { resources: true } },
        },
      },
      resources: {
        where: q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
                { tags: { hasSome: [q] } },
              ],
            }
          : undefined,
        orderBy: { order: "asc" },
        include: {
          subcategory: {
            select: { id: true, slug: true },
          },
        },
      },
      _count: { select: { resources: true } },
    },
  })
}

// Без фільтрів — для стабільного сайдбару
export async function getCategoryBySlugFull(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      subcategories: {
        orderBy: { order: "asc" },
        include: {
          _count: { select: { resources: true } },
        },
      },
      resources: {
        orderBy: { order: "asc" },
        include: {
          subcategory: {
            select: { id: true, slug: true },
          },
        },
      },
      _count: { select: { resources: true } },
    },
  })
}
