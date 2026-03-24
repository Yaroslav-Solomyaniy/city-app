import { NextRequest, NextResponse } from "next/server"
import { UTApi } from "uploadthing/server"
import { requireAuth } from "@/lib/require-auth"

const utapi = new UTApi()

// DELETE /api/upload
// body: { url: "https://...ufs.sh/f/key" }
export async function DELETE(req: NextRequest) {
  await requireAuth()

  const { url } = (await req.json()) as { url?: string }
  if (!url) return NextResponse.json({ error: "No url provided" }, { status: 400 })

  const key = url.split("/f/")[1]
  if (!key) return NextResponse.json({ error: "Invalid url" }, { status: 400 })

  await utapi.deleteFiles(key)

  return NextResponse.json({ ok: true })
}
