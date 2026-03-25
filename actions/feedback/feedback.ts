"use server"

import { requireAuth } from "@/lib/require-auth"
import prisma from "@/lib/prisma"
import { revalidatePath, revalidateTag } from "next/cache"
import { ActionResult } from "next/dist/shared/lib/app-router-types"
import { FeedbackInputSchema, type FeedbackInput } from "@/lib/validations/feedback"

export type FeedbackEntry = {
  id: string
  type: string
  status: string
  subject: string
  message: string
  author: string
  email: string
  createdAt: string
}

const TYPE_MAP = {
  feedback: "FEEDBACK",
  "add-resource": "ADD_RESOURCE",
  "remove-resource": "REMOVE_RESOURCE",
  "add-category": "ADD_CATEGORY",
} as const

function buildMessage(data: FeedbackInput): string {
  const who = `${data.author} (${data.email})`

  switch (data.type) {
    case "feedback":
      return data.message

    case "add-resource":
      return [
        `Користувач ${who} пропонує додати ресурс "${data.name}" до категорії "${data.category}".`,
        `Посилання: ${data.url}`,
        data.description && `Опис від користувача: ${data.description}`,
      ]
        .filter(Boolean)
        .join("\n")

    case "remove-resource":
      return [
        `Користувач ${who} просить видалити ресурс "${data.resource}".`,
        `Причина: ${data.reason}`,
        data.comment && `Коментар: ${data.comment}`,
      ]
        .filter(Boolean)
        .join("\n")

    case "add-category":
      return [
        `Користувач ${who} пропонує додати нову категорію "${data.name}".`,
        data.description && `Опис: ${data.description}`,
        data.examples && `Приклади ресурсів: ${data.examples}`,
      ]
        .filter(Boolean)
        .join("\n")
  }
}

function buildSubject(data: FeedbackInput): string {
  switch (data.type) {
    case "feedback":
      return data.subject
    case "add-resource":
      return data.name
    case "remove-resource":
      return data.resource
    case "add-category":
      return data.name
  }
}

export async function createFeedback(data: Record<string, string>): Promise<ActionResult> {
  const parsed = FeedbackInputSchema.safeParse(data)
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Невірні дані"
    return { ok: false, error: message }
  }

  try {
    await prisma.feedback.create({
      data: {
        type: TYPE_MAP[parsed.data.type],
        author: parsed.data.author,
        email: parsed.data.email,
        subject: buildSubject(parsed.data),
        message: buildMessage(parsed.data),
      },
    })
    return { ok: true }
  } catch {
    return { ok: false, error: "Не вдалося надіслати звернення" }
  }
}

export async function getFeedback(): Promise<FeedbackEntry[]> {
  await requireAuth()

  const items = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
  })

  return items.map((i) => ({
    id: i.id,
    type: i.type.toLowerCase().replace("_", "-"),
    status: i.status.toLowerCase(),
    subject: i.subject,
    message: i.message,
    author: i.author,
    email: i.email,
    createdAt: i.createdAt.toISOString(),
  }))
}

export async function setFeedbackStatus(id: string, status: "NEW" | "REVIEWED" | "RESOLVED") {
  await requireAuth()

  await prisma.feedback.update({
    where: { id },
    data: { status },
  })

  revalidateTag("feedback", {})
  revalidatePath("/admin/feedback")
}

export async function deleteFeedback(id: string) {
  await requireAuth()

  await prisma.feedback.delete({ where: { id } })

  revalidateTag("feedback", {})
  revalidatePath("/admin/feedback")
}
