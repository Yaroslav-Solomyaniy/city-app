import { z } from "zod"

export const CategorySchema = z.object({
  title: z.string().min(1, "Назва обов'язкова").max(100),
  titleEn: z.string().min(1, "Назва англійською обов'язкова").max(100),
  description: z.string().min(1, "Опис обов'язковий"),
  iconName: z.string().min(1, "Іконка обов'язкова"),
  photo: z.string().min(1, "Фото обов'язкове"),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Невірний формат кольору акценту"),
  bg: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Невірний формат фонового кольору"),
  services: z.array(z.string()),
  order: z.number().optional(),
})

export type CategoryFormData = z.infer<typeof CategorySchema>
