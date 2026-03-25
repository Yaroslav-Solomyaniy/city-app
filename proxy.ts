import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

const PUBLIC_PATHS = ["/", "/about", "/categories", "/resources"]
const AUTH_PATHS = ["/auth/sign-in", "/auth/register"]

function isPublic(pathname: string) {
  if (PUBLIC_PATHS.includes(pathname)) return true
  if (pathname.startsWith("/api/auth/")) return true
  if (pathname.startsWith("/categories/")) return true
  if (pathname.startsWith("/resources")) return true
  if (AUTH_PATHS.some((p) => pathname.startsWith(p))) return true
  return false
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublic(pathname)) return NextResponse.next()

  const session = await auth.api.getSession({ headers: request.headers })

  // Unauthenticated → sign in
  if (!session?.user?.id) {
    const signIn = new URL("/auth/sign-in", request.url)
    signIn.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signIn)
  }

  // Authenticated user trying to reach sign-in → redirect to admin
  if (pathname.startsWith("/auth/sign-in")) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static  (static files)
     * - _next/image   (image optimisation)
     * - favicon.ico
     * - public folder files (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf)$).*)",
  ],
}
