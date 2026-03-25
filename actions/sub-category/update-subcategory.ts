"use server"
import { requireAuth } from "@/lib/require-auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { SubcategorySchema } from "@/lib/validations/subcategory"

export async function updateSubcategory(id: string, data: unknown) {
  const parsed = SubcategorySchema.safeParse(data)
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Невірні дані")
  }

  const user = await requireAuth()

  const sub = await prisma.subcategory.update({
    where: { id },
    data: {
      title: parsed.data.title.trim(),
      titleEn: parsed.data.titleEn.trim() || parsed.data.title.trim(),
      description: parsed.data.description?.trim() ?? "",
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
