import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function proxy(request: NextRequest) {
  const isAdmin = request.nextUrl.pathname.startsWith("/admin")
  const isSignIn = request.nextUrl.pathname.startsWith("/auth/sign-in")

  if (!isAdmin && !isSignIn) return NextResponse.next()

  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session?.user && isAdmin) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url))
  }

  if (session?.user && isSignIn) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/auth/sign-in"],
}
