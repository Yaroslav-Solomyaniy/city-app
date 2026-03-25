"use server"

import { requireAuth } from "@/lib/require-auth"
import prisma from "@/lib/prisma"
import { revalidatePath, revalidateTag } from "next/cache"

export async function moveResource(id: string, newCategoryId: string, newSubcategoryId: string | null) {
  const user = await requireAuth()

  const old = await prisma.resource.findUniqueOrThrow({ where: { id } })

  const resource = await prisma.resource.update({
    where: { id },
    data: {
      categoryId: newCategoryId,
      subcategoryId: newSubcategoryId,
    },
  })

  await prisma.activityLog.create({
    data: {
      action: "EDIT",
      entity: "RESOURCE",
      entityName: resource.title,
      details: `Переміщено ресурс «${resource.title}»`,
      userId: user.id,
      userName: user.name ?? user.email ?? "Невідомий",
      categoryId: newCategoryId,
      resourceId: resource.id,
    },
  })

  revalidateTag("resources", {})
  revalidateTag("categories", {})
  revalidatePath(`/admin/categories/${old.categoryId}`)
  revalidatePath(`/admin/categories/${newCategoryId}`)
  revalidatePath("/admin/resources")

  return resource
}
