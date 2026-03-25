"use server"
import { requireAuth } from "@/lib/require-auth"
import prisma from "@/lib/prisma"
import { revalidatePath, revalidateTag } from "next/cache"
import { ResourceSchema } from "@/lib/validations/resource"
import type { ResourceFormData } from "@/types/action"

export async function updateResource(id: string, data: ResourceFormData) {
  const parsed = ResourceSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Невірні дані")
  }

  const user = await requireAuth()

  const resource = await prisma.resource.update({
    where: { id },
    data: {
      title: parsed.data.title.trim(),
      description: parsed.data.description.trim() || null,
      url: parsed.data.url.trim(),
      icon: parsed.data.icon,
      tags: parsed.data.tags,
      subcategoryId: parsed.data.subcategoryId || null,
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

  revalidateTag("resources", {})
  revalidateTag("categories", {})
  revalidatePath(`/admin/categories/${resource.categoryId}`)
  return resource
}
