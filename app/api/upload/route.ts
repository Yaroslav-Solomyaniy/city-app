import { NextRequest, NextResponse } from "next/server"
import { writeFile, unlink } from "fs/promises"
import { existsSync, mkdirSync } from "fs"
import path from "path"
import { auth } from "@/lib/auth"
import { UPLOAD_ALLOWED_FOLDERS, UPLOAD_ALLOWED_TYPES, UPLOAD_MAX_SIZE, UploadFolder } from "@/constants/upload"
import { requireAuth } from "@/lib/require-auth"

const PUBLIC_DIR = path.join(process.cwd(), "public")

function ensureDir(folder: UploadFolder) {
  const dir = path.join(PUBLIC_DIR, folder)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  return dir
}

// POST /api/upload?folder=category
export async function POST(req: NextRequest) {
  await requireAuth();

  const folder = req.nextUrl.searchParams.get("folder") as UploadFolder | null
  if (!folder || !UPLOAD_ALLOWED_FOLDERS.includes(folder)) {
    return NextResponse.json({ error: "Invalid folder" }, { status: 400 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }
  if (!UPLOAD_ALLOWED_TYPES.includes(file.type as never)) {
    return NextResponse.json({ error: "Дозволено лише jpg, png, webp" }, { status: 400 })
  }
  if (file.size > UPLOAD_MAX_SIZE) {
    return NextResponse.json({ error: "Файл перевищує 2MB" }, { status: 400 })
  }

  const ext = file.type === "image/webp" ? "webp" : file.type === "image/png" ? "png" : "jpg"
  const filename = `upload_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`

  const dir = ensureDir(folder)
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(dir, filename), buffer)

  return NextResponse.json({ url: `/${folder}/${filename}` })
}

// DELETE /api/upload
// body: { url: "/category/upload_..." } або { url: "/resources/upload_..." }
export async function DELETE(req: NextRequest) {
  await requireAuth()

  const { url } = (await req.json()) as { url?: string }

  if (!url) {
    return NextResponse.json({ error: "No url provided" }, { status: 400 })
  }

  const parts = url.split("/").filter(Boolean) // ["category", "upload_123.jpg"]
  if (parts.length !== 2 || !UPLOAD_ALLOWED_FOLDERS.includes(parts[0] as UploadFolder) || !parts[1].startsWith("upload_")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 })
  }

  const filepath = path.join(PUBLIC_DIR, parts[0], parts[1])
  if (existsSync(filepath)) await unlink(filepath)

  return NextResponse.json({ ok: true })
}
