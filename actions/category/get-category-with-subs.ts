"use server"
import prisma from "@/lib/prisma"

export async function getCategoriesWithSubs() {
  return prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      subcategories: { orderBy: { order: "asc" } },
    },
  })
}

