import { z } from "zod"

export const SignInSchema = z.object({
  email: z
    .string({ error: "Email обов'язковий" })
    .min(1, { message: "Email не може бути порожнім" })
    .email({ message: "Некоректний формат email" }),

  password: z
    .string({ error: "Пароль обов'язковий" })
    .min(1, { message: "Пароль не може бути порожнім" })
    .min(8, { message: "Пароль має бути не менше 8 символів" })
    .max(32, { message: "Пароль має бути не більше 32 символів" }),
})

export type SignInFormData = z.infer<typeof SignInSchema>

export const SignUpSchema = z
  .object({
    name: z
      .string({ error: "Ім'я обов'язкове" })
      .min(2, { message: "Ім'я має бути не менше 2 символів" })
      .max(64, { message: "Ім'я занадто довге" }),

    password: z
      .string({ error: "Пароль обов'язковий" })
      .min(8, { message: "Пароль має бути не менше 8 символів" })
      .max(32, { message: "Пароль має бути не більше 32 символів" }),

    confirm: z.string({ error: "Підтвердження обов'язкове" }),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Паролі не співпадають",
    path: ["confirm"],
  })

export type SignUpFormData = z.infer<typeof SignUpSchema>
