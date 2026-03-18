"use server"
import { requireAuth } from "@/lib/require-auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteCategory(id: string) {
  const user = await requireAuth()

  const category = await prisma.category.findUniqueOrThrow({ where: { id } })

  await prisma.category.delete({ where: { id } })

  await prisma.activityLog.create({
    data: {
      action: "DELETE",
      entity: "CATEGORY",
      entityName: category.title,
      details: `Видалено категорію «${category.title}»`,
      userId: user.id,
      userName: user.name ?? user.email ?? "Невідомий",
      // categoryId не передаємо — запис вже видалено, FK = null
    },
  })

  revalidatePath("/admin/category")
  revalidatePath("/category")
}
