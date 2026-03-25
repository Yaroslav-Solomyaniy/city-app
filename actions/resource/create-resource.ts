"use server"
import { revalidatePath, revalidateTag } from "next/cache"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/require-auth"
import { ResourceSchema } from "@/lib/validations/resource"
import type { ResourceFormData } from "@/types/action"

export async function createResource(categoryId: string, data: ResourceFormData) {
  const parsed = ResourceSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Невірні дані")
  }

  const user = await requireAuth()

  const maxOrder = await prisma.resource.aggregate({
    where: { categoryId },
    _max: { order: true },
  })
  const order = (maxOrder._max.order ?? 0) + 1

  const resource = await prisma.resource.create({
    data: {
      title: parsed.data.title.trim(),
      description: parsed.data.description.trim() || null,
      url: parsed.data.url.trim(),
      icon: parsed.data.icon,
      tags: parsed.data.tags,
      subcategoryId: parsed.data.subcategoryId || null,
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

  revalidateTag("resources", {})
  revalidateTag("categories", {})
  revalidatePath(`/admin/categories/${categoryId}`)
  return resource
}
