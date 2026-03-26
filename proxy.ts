import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

function isProtected(pathname: string) {
  return pathname.startsWith("/admin")
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Всі не-адмінські роути — публічні
  if (!isProtected(pathname)) return NextResponse.next()

  const session = await auth.api.getSession({ headers: request.headers })

  // Не авторизований → на логінку
  if (!session?.user?.id) {
    const signIn = new URL("/auth/sign-in", request.url)
    signIn.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signIn)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf)$).*)"],
}
