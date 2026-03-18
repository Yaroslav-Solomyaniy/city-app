import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import prisma from "@/lib/prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  session: {
    expiresIn: 60 * 60 * 24, // 1 день
    updateAge: 60 * 60 * 4, // оновлюємо сесію кожні 4 години
  },

  trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",") : ["http://localhost:3000"],
})

export type Session = typeof auth.$Infer.Session
