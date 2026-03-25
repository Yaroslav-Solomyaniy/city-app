"use server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/require-auth"

export async function reorderCategories(items: { id: string; order: number }[]) {
  await requireAuth()
  await prisma.$transaction(
    items.map(({ id, order }) =>
      prisma.category.update({ where: { id }, data: { order } })
    )
  )
}
