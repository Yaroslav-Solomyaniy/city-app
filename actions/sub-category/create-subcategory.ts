"use server"
import { requireAuth } from "@/lib/require-auth"
import prisma from "@/lib/prisma"
import { toSlug } from "@/lib/slug"
import { revalidatePath } from "next/cache"
import { SubcategorySchema } from "@/lib/validations/subcategory"

export async function createSubcategory(categoryId: string, data: unknown) {
  const parsed = SubcategorySchema.safeParse(data)
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Невірні дані")
  }

  const user = await requireAuth()

  const maxOrder = await prisma.subcategory.aggregate({
    where: { categoryId },
    _max: { order: true },
  })
  const order = (maxOrder._max.order ?? 0) + 1
  const slug = toSlug(parsed.data.titleEn || parsed.data.title)

  const sub = await prisma.subcategory.create({
    data: {
      title: parsed.data.title.trim(),
      titleEn: parsed.data.titleEn.trim() || parsed.data.title.trim(),
      description: parsed.data.description?.trim() ?? "",
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
