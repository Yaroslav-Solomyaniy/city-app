"use server"

import { Action } from "@/types/action"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/require-auth"

export async function deleteAdmin(adminId: string): Promise<Action> {
  const user = await requireAuth()

  if (adminId === user.id) {
    return { ok: false, error: "Не можна видалити власний акаунт" }
  }

  const target = await prisma.user.findUnique({ where: { id: adminId } })
  if (!target) return { ok: false, error: "Адміністратора не знайдено" }

  // Видаляємо все пов'язане перед видаленням юзера
  await prisma.$transaction([
    // Від'єднуємо логи (SetNull через схему, але на випадок якщо є прямий зв'язок)
    prisma.inviteToken.deleteMany({ where: { createdBy: adminId } }),
    prisma.session.deleteMany({ where: { userId: adminId } }),
    prisma.account.deleteMany({ where: { userId: adminId } }),
    prisma.user.delete({ where: { id: adminId } }),
  ])

  await prisma.activityLog.create({
    data: {
      action: "DELETE",
      entity: "ADMIN",
      entityName: target.name ?? target.email,
      details: `Адміністратор видалений`,
      userId: user.id,
      userName: user.name ?? user.email ?? "Невідомий",
    },
  })

  revalidatePath("/admin/administrators")
  return { ok: true }
}
