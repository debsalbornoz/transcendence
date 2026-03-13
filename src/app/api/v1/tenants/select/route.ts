/**
 * Selects a tenant and retrieves the authenticated user's access context.
 *
 * This POST route allows an authenticated user to select a tenant they
 * belong to and retrieves the authorization data associated with that tenant.
 *
 * The route:
 * - verifies that the request is authenticated using requireAuth
 * - reads the tenantId from the request body
 * - validates the tenantId format
 * - checks whether the user has access to the requested tenant
 * - retrieves the user's permissions within the tenant
 * - retrieves the user's roles within the tenant
 * - fetches the tenant's name
 *
 * The response includes:
 * - tenantId
 * - tenantName
 * - the list of permissions granted to the user
 * - the list of roles assigned to the user in that tenant
 *
 * Proper HTTP responses are returned for authentication failures,
 * invalid input, forbidden tenant access, successful tenant selection,
 * and unexpected server errors.
 */

import { NextResponse } from "next/server"

import { requireAuth } from "@/lib/authz"
import {
  getPermissionsForUser,
  getRolesForUserInTenant,
  getTenantNameById,
  userHasAccessToTenant,
} from "@/services/auth/rbac"

export async function POST(req: Request) {
  const auth = await requireAuth(req)

  if (!auth.ok) {
    return auth.response
  }

  try {
    const body = await req.json()
    const tenantId = body?.tenantId

    if (!tenantId || typeof tenantId !== "string") {
      return NextResponse.json(
        { error: "tenantId is required" },
        { status: 400 }
      )
    }

    const userIdBigInt = BigInt(auth.token.userId)
    const tenantIdBigInt = BigInt(tenantId)

    const hasAccess = await userHasAccessToTenant({
      userId: userIdBigInt,
      tenantId: tenantIdBigInt,
    })

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const permissions = await getPermissionsForUser({
      userId: userIdBigInt,
      tenantId: tenantIdBigInt,
    })

    const roles = await getRolesForUserInTenant({
      userId: userIdBigInt,
      tenantId: tenantIdBigInt,
    })

    const tenantName = await getTenantNameById(tenantIdBigInt)

    return NextResponse.json(
      {
        tenantId,
        tenantName,
        permissions,
        roles: roles.map((role) => role.name),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error selecting tenant:", error)

    return NextResponse.json(
      { error: "Failed to select tenant" },
      { status: 500 }
    )
  }
}