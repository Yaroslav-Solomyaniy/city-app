"use server"

import prisma from "@/lib/prisma"

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: {
      subcategories: { orderBy: { order: "asc" } },
      resources: {
        orderBy: { order: "asc" },
        include: { subcategory: true },
      },
      _count: { select: { resources: true } },
    },
  })
}


