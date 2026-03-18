"use server"

import { requireAuth } from "@/lib/require-auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { ActionResult } from "next/dist/shared/lib/app-router-types"

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

function buildMessage(data: Record<string, string>): string {
  const who = `${data.author} (${data.email})`

  switch (data.type) {
    case "feedback":
      return data.message ?? "—"

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

    default:
      return "—"
  }
}

export async function createFeedback(data: Record<string, string>): Promise<ActionResult> {
  try {
    await prisma.feedback.create({
      data: {
        type: TYPE_MAP[data.type as keyof typeof TYPE_MAP],
        author: data.author,
        email: data.email,
        subject: data.subject ?? data.name ?? data.resource ?? "—",
        message: buildMessage(data),
      },
    })
    return { ok: true }
  } catch (e) {
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

  revalidatePath("/admin/feedback")
}

export async function deleteFeedback(id: string) {
  await requireAuth()

  await prisma.feedback.delete({ where: { id } })

  revalidatePath("/admin/feedback")
}
