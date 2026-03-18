"use server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/require-auth"
import { revalidatePath } from "next/cache"
import { toSlug } from "@/lib/slug"

export type CategoryFormData = {
  title: string
  titleEn: string
  description: string
  iconName: string
  photo: string
  accent: string
  bg: string
  services: string[]
  order?: number
}

export async function createCategory(data: CategoryFormData) {
  const user = await requireAuth()

  const maxOrder = await prisma.category.aggregate({ _max: { order: true } })
  const order = (maxOrder._max.order ?? 0) + 1

  const slug = toSlug(data.title)

  const { originalPhoto, ...rest } = data as CategoryFormData & { originalPhoto?: string }

  const category = await prisma.category.create({
    data: { ...rest, slug, order },
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

  revalidatePath("/admin/category")
  revalidatePath("/category")
  return category
}
