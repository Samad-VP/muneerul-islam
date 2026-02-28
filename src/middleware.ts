import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // If user is logged in
    if (token) {
      // 1. Family Head Routing Logic
      if (token.role === "family_head") {
        // Prevent Family Heads from accessing Admin Dashboard
        if (path.startsWith("/dashboard")) {
          return NextResponse.redirect(new URL("/portal", req.url))
        }
      } else {
        // Prevent Non-Family Heads (Admins) from accessing Family Head Portal
        if (path.startsWith("/portal")) {
          return NextResponse.redirect(new URL("/dashboard", req.url))
        }
      }

      // 2. Strict Finance Roles (Only let Admin, President, Treasurer handle certain routes)
      const isFinanceAdminRoute = path.startsWith("/dashboard/finance") || path.startsWith("/api/finance")
      const financeAdminRoles = ["admin", "super_admin", "president", "treasurer", "secretary", "data_entry"]
      
      if (isFinanceAdminRoute && !financeAdminRoles.includes(token.role as string)) {
        return NextResponse.redirect(new URL("/dashboard", req.url)) // Or a 403 page
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*", "/portal/:path*", "/api/finance/:path*", "/api/portal/:path*"],
}
