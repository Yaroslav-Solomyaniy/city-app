"use server"
import { requireAuth } from "@/lib/require-auth"
import { SubcategoryFormData } from "@/types/action"
import prisma from "@/lib/prisma"
import { toSlug } from "@/lib/slug"
import { revalidatePath } from "next/cache"

export async function createSubcategory(categoryId: string, data: SubcategoryFormData) {
  const user = await requireAuth()

  const maxOrder = await prisma.subcategory.aggregate({
    where: { categoryId },
    _max: { order: true },
  })
  const order = (maxOrder._max.order ?? 0) + 1
  const slug = toSlug(data.titleEn || data.title)

  const sub = await prisma.subcategory.create({
    data: {
      title: data.title.trim(),
      titleEn: data.titleEn.trim() || data.title.trim(),
      description: data.description?.trim() ?? "",
      slug,
      order,
      categoryId,
    },
  })

  await prisma.activityLog.create({
    data: {
      action: "CREATE",
      entity: "SUBCATEGORY",
      entityName: sub.title,
      details: `Створено підкатегорію «${sub.title}»`,
      userId: user.id,
      userName: user.name ?? user.email ?? "Невідомий",
      categoryId,
      subcategoryId: sub.id,
    },
  })

  revalidatePath(`/admin/categories/${categoryId}`)
  return sub
}
