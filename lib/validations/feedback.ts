import { z } from "zod"

const baseFields = z.object({
  author: z.string().min(1, "Ім'я обов'язкове").max(100),
  email: z.string().email("Некоректний email"),
})

export const FeedbackSchema = baseFields.extend({
  type: z.literal("feedback"),
  subject: z.string().min(1, "Тема обов'язкова").max(200),
  message: z.string().min(1, "Повідомлення обов'язкове").max(2000),
})

export const AddResourceSchema = baseFields.extend({
  type: z.literal("add-resource"),
  name: z.string().min(1, "Назва ресурсу обов'язкова").max(200),
  url: z.string().url("Введіть коректне посилання"),
  category: z.string().min(1, "Категорія обов'язкова"),
  description: z.string().max(500).optional(),
})

export const RemoveResourceSchema = baseFields.extend({
  type: z.literal("remove-resource"),
  resource: z.string().min(1, "Ресурс обов'язковий"),
  reason: z.string().min(1, "Причина обов'язкова"),
  comment: z.string().max(500).optional(),
})

export const AddCategorySchema = baseFields.extend({
  type: z.literal("add-category"),
  name: z.string().min(1, "Назва обов'язкова").max(200),
  description: z.string().min(1, "Опис обов'язковий").max(500),
  examples: z.string().max(500).optional(),
})

export const FeedbackInputSchema = z.discriminatedUnion("type", [
  FeedbackSchema,
  AddResourceSchema,
  RemoveResourceSchema,
  AddCategorySchema,
])

export type FeedbackInput = z.infer<typeof FeedbackInputSchema>
