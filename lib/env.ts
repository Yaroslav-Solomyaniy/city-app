/**
 * Typed, validated environment variables.
 * Import this file only from server components, server actions, or API routes.
 * All values are validated at startup — missing required vars throw immediately.
 */
import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  BETTER_AUTH_URL: z.string().url().optional(),
  BETTER_AUTH_TRUSTED_ORIGINS: z.string().optional(),

  EMAIL_SERVER_HOST: z.string().min(1, "EMAIL_SERVER_HOST is required"),
  EMAIL_SERVER_PORT: z.coerce.number().default(465),
  EMAIL_SERVER_USER: z.string().min(1, "EMAIL_SERVER_USER is required"),
  EMAIL_SERVER_PASSWORD: z.string().min(1, "EMAIL_SERVER_PASSWORD is required"),
  EMAIL_FROM: z.string().min(1, "EMAIL_FROM is required"),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n")
  throw new Error(`\n[env] Invalid environment variables:\n${issues}\n`)
}

export const env = parsed.data
