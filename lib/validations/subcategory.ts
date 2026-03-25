import { z } from "zod"

export const SubcategorySchema = z.object({
  title: z.string().min(1, "Назва обов'язкова").max(100),
  titleEn: z.string().min(1, "Назва англійською обов'язкова").max(100),
  description: z.string().optional(),
})

export type SubcategoryFormData = z.infer<typeof SubcategorySchema>
