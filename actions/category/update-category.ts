"use server"
import { requireAuth } from "@/lib/require-auth"
import prisma from "@/lib/prisma"
import { revalidatePath, revalidateTag } from "next/cache"
import { CategorySchema } from "@/lib/validations/category"

export async function updateCategory(id: string, data: unknown) {
  const parsed = CategorySchema.safeParse(data)
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Невірні дані")
  }

  const user = await requireAuth()

  const category = await prisma.category.update({
    where: { id },
    data: parsed.data,
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

  revalidateTag("categories", {})
  revalidatePath("/admin/categories")
  return category
}
