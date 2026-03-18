"use server"

import { verifyInviteToken } from "@/actions/auth/verify-token"
import { ActionResult } from "next/dist/shared/lib/app-router-types"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { SignUpSchema } from "@/lib/zod"

export async function SignUp(token: string, name: string, password: string): Promise<ActionResult> {
  const parsed = SignUpSchema.safeParse({ name, password, confirm: password })
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Невірні дані"
    return { ok: false, error: message }
  }

  const { status, email } = await verifyInviteToken(token)
  if (status === "invalid") return { ok: false, error: "Недійсне запрошення" }
  if (status === "used") return { ok: false, error: "Це запрошення вже використане" }
  if (status === "expired") return { ok: false, error: "Термін дії запрошення минув" }

  const existing = await prisma.user.findUnique({ where: { email: email! } })
  if (existing) return { ok: false, error: "Адміністратор з таким email вже існує" }

  const result = await auth.api.signUpEmail({
    body: { email: email!, password: parsed.data.password, name: parsed.data.name },
  })

  if (!result?.user) return { ok: false, error: "Не вдалося створити акаунт" }

  await prisma.$transaction([
    prisma.inviteToken.update({
      where: { token },
      data: { used: true },
    }),
    prisma.activityLog.create({
      data: {
        action: "CREATE",
        entity: "ADMIN",
        entityName: parsed.data.name,
        details: email!,
        userId: result.user.id,
        userName: parsed.data.name,
      },
    }),
  ])

  revalidatePath("/admin/administrators")
  return { ok: true }
}
