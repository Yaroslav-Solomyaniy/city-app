"use server"
import { ResourceFormData } from "@/types/action"
import { requireAuth } from "@/lib/require-auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateResource(id: string, data: ResourceFormData) {
  const user = await requireAuth()

  const resource = await prisma.resource.update({
    where: { id },
    data: {
      title: data.title.trim(),
      description: data.description.trim() || null,
      url: data.url.trim(),
      icon: data.icon,
      tags: data.tags,
      subcategoryId: data.subcategoryId || null,
    },
    include: { subcategory: true },
  })

  await prisma.activityLog.create({
    data: {
      action: "EDIT",
      entity: "RESOURCE",
      entityName: resource.title,
      details: `Відредаговано ресурс «${resource.title}»`,
      userId: user.id,
      userName: user.name ?? user.email ?? "Невідомий",
      categoryId: resource.categoryId,
      resourceId: resource.id,
    },
  })

  revalidatePath(`/admin/categories/${resource.categoryId}`)
  revalidatePath(`/categories/${resource.categoryId}`)
  return resource
}
