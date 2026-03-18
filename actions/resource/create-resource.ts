"use server"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { ResourceFormData } from "@/types/action"
import { requireAuth } from "@/lib/require-auth"

export async function createResource(categoryId: string, data: ResourceFormData) {
  const user = await requireAuth()

  const maxOrder = await prisma.resource.aggregate({
    where: { categoryId },
    _max: { order: true },
  })
  const order = (maxOrder._max.order ?? 0) + 1

  const resource = await prisma.resource.create({
    data: {
      title: data.title.trim(),
      description: data.description.trim() || null,
      url: data.url.trim(),
      icon: data.icon,
      tags: data.tags,
      subcategoryId: data.subcategoryId || null,
      categoryId,
      order,
    },
    include: { subcategory: true },
  })

  await prisma.activityLog.create({
    data: {
      action: "CREATE",
      entity: "RESOURCE",
      entityName: resource.title,
      details: `Створено ресурс «${resource.title}»`,
      userId: user.id,
      userName: user.name ?? user.email ?? "Невідомий",
      categoryId,
      resourceId: resource.id,
    },
  })

  revalidatePath(`/admin/categories/${categoryId}`)
  revalidatePath(`/categories/${categoryId}`)
  return resource
}
