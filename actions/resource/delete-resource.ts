"use server"

import { requireAuth } from "@/lib/require-auth"
import prisma from "@/lib/prisma"
import { revalidatePath, revalidateTag } from "next/cache"

export async function deleteResource(id: string) {
  const user = await requireAuth()

  const resource = await prisma.resource.findUniqueOrThrow({ where: { id } })

  await prisma.resource.delete({ where: { id } })

  await prisma.activityLog.create({
    data: {
      action: "DELETE",
      entity: "RESOURCE",
      entityName: resource.title,
      details: `Видалено ресурс «${resource.title}»`,
      userId: user.id,
      userName: user.name ?? user.email ?? "Невідомий",
      categoryId: resource.categoryId,
    },
  })

  revalidateTag("resources", {})
  revalidateTag("categories", {})
  revalidatePath(`/admin/categories/${resource.categoryId}`)
}
