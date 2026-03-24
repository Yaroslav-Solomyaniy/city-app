"use server"
import { requireAuth } from "@/lib/require-auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { CategoryFormData } from "@/actions/category/create-category"

export async function updateCategory(id: string, data: CategoryFormData) {
  const user = await requireAuth()

  const { originalPhoto, ...rest } = data as CategoryFormData & { originalPhoto?: string }

  const category = await prisma.category.update({
    where: { id },
    data: rest,
  })

  await prisma.activityLog.create({
    data: {
      action: "EDIT",
      entity: "CATEGORY",
      entityName: category.title,
      details: `Відредаговано категорію «${category.title}»`,
      userId: user.id,
      userName: user.name ?? user.email ?? "Невідомий",
      categoryId: category.id,
    },
  })

  revalidatePath("/admin/categories")
  revalidatePath("/categories")
  revalidatePath(`/categories/${category.slug}`)
  return category
}
