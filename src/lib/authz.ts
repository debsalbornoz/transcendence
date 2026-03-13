/**
 * Authorization helpers for protecting API routes.
 *
 * This module provides utility functions to validate authentication,
 * tenant context, roles, and permissions based on the JWT token
 * issued by NextAuth.
 *
 * The functions extract the token from the request and enforce
 * different authorization levels:
 *
 * - requireAuth:
 *   Ensures the request is authenticated by validating the JWT token
 *   and confirming the presence of a userId.
 *
 * - requireTenant:
 *   Ensures the authenticated user has an active tenant selected.
 *   Used for multi-tenant routes that require tenant context.
 *
 * - requirePermission:
 *   Ensures the authenticated user has a specific permission within
 *   the active tenant.
 *
 * - requireAnyPermission:
 *   Ensures the user has at least one permission from a list of allowed
 *   permissions.
 *
 * - requireRole:
 *   Ensures the user has a specific role within the active tenant.
 *
 * Each function returns either:
 * - a successful authorization result containing the token data
 * - a standardized HTTP response (401 or 403) when authorization fails
 *
 * These helpers centralize access control logic and are designed to be
 * reused across API route handlers.
 */

import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

type AuthzResult =
  | {
      ok: true
      token: {
        userId: string
        tenantId: string
        permissions: string[]
        roles: string[]
      }
    }
  | {
      ok: false
      response: NextResponse
    }

export async function requireAuth(req: Request): Promise<AuthzResult> {
  const token = await getToken({
    req: req as any,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token?.userId || typeof token.userId !== "string") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }

  return {
    ok: true,
    token: {
      userId: token.userId,
      tenantId:
        typeof token.tenantId === "string" ? token.tenantId : "",
      permissions: Array.isArray(token.permissions) ? token.permissions : [],
      roles: Array.isArray(token.roles) ? token.roles : [],
    },
  }
}

export async function requireTenant(req: Request): Promise<AuthzResult> {
  const auth = await requireAuth(req)

  if (!auth.ok) return auth

  if (!auth.token.tenantId) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "No active tenant" },
        { status: 403 }
      ),
    }
  }

  return auth
}

export async function requirePermission(
  req: Request,
  permission: string
): Promise<AuthzResult> {
  const auth = await requireTenant(req)

  if (!auth.ok) return auth

  if (!auth.token.permissions.includes(permission)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    }
  }

  return auth
}

export async function requireAnyPermission(
  req: Request,
  permissions: string[]
): Promise<AuthzResult> {
  const auth = await requireTenant(req)

  if (!auth.ok) return auth

  const allowed = permissions.some((permission) =>
    auth.token.permissions.includes(permission)
  )

  if (!allowed) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    }
  }

  return auth
}

export async function requireRole(
  req: Request,
  role: string
): Promise<AuthzResult> {
  const auth = await requireTenant(req)

  if (!auth.ok) return auth

  if (!auth.token.roles.includes(role)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    }
  }

  return auth
}