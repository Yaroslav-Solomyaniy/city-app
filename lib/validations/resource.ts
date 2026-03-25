import { z } from "zod"

export const ResourceSchema = z.object({
  title: z.string().min(1, "Назва обов'язкова").max(200),
  description: z.string().max(500).default(""),
  url: z.string().url("Введіть коректне посилання"),
  icon: z.string().min(1, "Іконка обов'язкова"),
  tags: z.array(z.string()),
  subcategoryId: z.string().nullable(),
})

export type ResourceFormData = z.infer<typeof ResourceSchema>
