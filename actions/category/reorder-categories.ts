"use server"
import prisma from "@/lib/prisma"

export async function reorderCategories(items: { id: string; order: number }[]) {
  await prisma.$transaction(
    items.map(({ id, order }) =>
      prisma.category.update({ where: { id }, data: { order } })
    )
  )
}
