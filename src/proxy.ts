/**
 * Route access control middleware for authentication and tenant context.
 *
 * This middleware intercepts requests to protected application routes
 * and redirects users based on their authentication state and tenant context.
 *
 * The logic handles four main scenarios:
 *
 * - Unauthenticated users:
 *   Users who are not logged in are redirected to the login page
 *   when trying to access protected routes such as the home page,
 *   dashboard, tenant selection, or no-tenant page.
 *
 * - Authenticated users without any tenant:
 *   Users who are logged in but do not belong to any tenant are
 *   redirected to the "/no-tenant" page.
 *
 * - Authenticated users who must choose a tenant:
 *   Users who belong to multiple tenants and still need to select
 *   an active tenant are redirected to the "/select-tenant" page.
 *
 * - Authenticated users with an active tenant:
 *   Users who already have a valid tenant context are redirected
 *   away from public auth pages (such as login and register)
 *   to the dashboard.
 *
 * Additional behavior:
 * - The home route ("/") redirects authenticated users with an
 *   active tenant directly to the dashboard.
 * - The "/select-tenant" route remains accessible even when a user
 *   already has an active tenant, allowing workspace switching.
 *
 * The matcher configuration ensures that this middleware only runs
 * on relevant authentication, dashboard, and tenant-related routes.
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password")

  const isDashboardRoute = pathname.startsWith("/dashboard")
  const isSelectTenantRoute = pathname.startsWith("/select-tenant")
  const isNoTenantRoute = pathname.startsWith("/no-tenant")
  const isHomeRoute = pathname === "/"

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isAuthenticated = Boolean(token?.userId)
  const needsTenantSelection = Boolean(token?.needsTenantSelection)
  const hasTenant = Boolean(token?.tenantId)
  const hasNoTenant = isAuthenticated && !needsTenantSelection && !hasTenant

  if (!isAuthenticated) {
    if (
      isDashboardRoute ||
      isSelectTenantRoute ||
      isNoTenantRoute ||
      isHomeRoute
    ) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = "/login"
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }

  if (hasNoTenant) {
    if (!isNoTenantRoute) {
      const noTenantUrl = request.nextUrl.clone()
      noTenantUrl.pathname = "/no-tenant"
      return NextResponse.redirect(noTenantUrl)
    }

    return NextResponse.next()
  }

  if (needsTenantSelection) {
    if (!isSelectTenantRoute) {
      const tenantUrl = request.nextUrl.clone()
      tenantUrl.pathname = "/select-tenant"
      return NextResponse.redirect(tenantUrl)
    }

    return NextResponse.next()
  }

  // autenticada com tenant ativo
  if (isHomeRoute) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = "/dashboard"
    return NextResponse.redirect(dashboardUrl)
  }

  if (isAuthRoute) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = "/dashboard"
    return NextResponse.redirect(dashboardUrl)
  }

  // IMPORTANTE:
  // agora /select-tenant continua acessível mesmo já tendo tenant ativo,
  // para permitir trocar de empresa
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/dashboard/:path*",
    "/select-tenant",
    "/no-tenant",
  ],
}