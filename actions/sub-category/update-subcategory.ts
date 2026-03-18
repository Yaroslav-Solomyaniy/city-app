"use server"
import { SubcategoryFormData } from "@/types/action"
import { requireAuth } from "@/lib/require-auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateSubcategory(id: string, data: SubcategoryFormData) {
  const user = await requireAuth()

  const sub = await prisma.subcategory.update({
    where: { id },
    data: {
      title: data.title.trim(),
      titleEn: data.titleEn.trim() || data.title.trim(),
      description: data.description?.trim() ?? "",
    },
  })

  await prisma.activityLog.create({
    data: {
      action: "EDIT",
      entity: "SUBCATEGORY",
      entityName: sub.title,
      details: `Відредаговано підкатегорію «${sub.title}»`,
      userId: user.id,
      userName: user.name ?? user.email ?? "Невідомий",
      categoryId: sub.categoryId,
      subcategoryId: sub.id,
    },
  })

  revalidatePath(`/admin/categories/${sub.categoryId}`)
  return sub
}
