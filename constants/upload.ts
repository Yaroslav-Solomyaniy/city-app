import path from "path"

export const PUBLIC_DIR = path.join(process.cwd(), "public")

export const UPLOAD_MAX_SIZE = 2 * 1024 * 1024 // 2MB

export const UPLOAD_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const

export const UPLOAD_ALLOWED_FOLDERS = ["categories", "resources"] as const

export type UploadFolder = (typeof UPLOAD_ALLOWED_FOLDERS)[number]
