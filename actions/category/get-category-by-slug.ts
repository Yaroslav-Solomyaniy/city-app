"use server"

import prisma from "@/lib/prisma"

export async function getCategoryBySlug(slug: string) {
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
