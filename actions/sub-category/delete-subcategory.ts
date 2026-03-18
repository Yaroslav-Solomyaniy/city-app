"use server"
import { requireAuth } from "@/lib/require-auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteSubcategory(id: string) {
  const user = await requireAuth()

  const sub = await prisma.subcategory.findUniqueOrThrow({ where: { id } })

  await prisma.subcategory.delete({ where: { id } })

  await prisma.activityLog.create({
    data: {
      action: "DELETE",
      entity: "SUBCATEGORY",
      entityName: sub.title,
      details: `Видалено підкатегорію «${sub.title}»`,
      userId: user.id,
      userName: user.name ?? user.email ?? "Невідомий",
      categoryId: sub.categoryId,
    },
  })

  revalidatePath(`/admin/categories/${sub.categoryId}`)
}
