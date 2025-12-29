import { type NextRequest, NextResponse } from "next/server"

export function proxy(request: NextRequest) {
  // Log request for demo purposes
  const url = request.nextUrl.pathname
  const method = request.method

  // Example: Auth guard for protected routes
  if (url.startsWith("/dashboard") || url.startsWith("/account")) {
    const authHeader = request.headers.get("authorization")
    const cookie = request.cookies.get("auth-token")

    if (!authHeader && !cookie) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Example: Add custom headers
  const response = NextResponse.next()
  response.headers.set("x-proxy-processed", "true")
  response.headers.set("x-request-method", method)
  response.headers.set("x-request-path", url)

  return response
}

