"use server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/require-auth"
import { revalidatePath, revalidateTag } from "next/cache"
import { toSlug } from "@/lib/slug"
import { CategorySchema } from "@/lib/validations/category"

export type { CategoryFormData } from "@/lib/validations/category"

export async function createCategory(data: unknown) {
  const parsed = CategorySchema.safeParse(data)
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Невірні дані")
  }

  const user = await requireAuth()

  const maxOrder = await prisma.category.aggregate({ _max: { order: true } })
  const order = (maxOrder._max.order ?? 0) + 1

  const slug = toSlug(parsed.data.title)

  const category = await prisma.category.create({
    data: { ...parsed.data, slug, order },
  })

  await prisma.activityLog.create({
    data: {
      action: "CREATE",
      entity: "CATEGORY",
      entityName: category.title,
      details: `Створено категорію «${category.title}»`,
      userId: user.id,
      userName: user.name ?? user.email ?? "Невідомий",
      categoryId: category.id,
    },
  })

  revalidateTag("categories", {})
  revalidatePath("/admin/categories")
  return category
}
