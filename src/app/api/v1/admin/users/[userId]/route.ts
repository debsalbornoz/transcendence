/**
 * Removes a user from the current tenant.
 *
 * This DELETE route allows administrators with the "users.manage" permission
 * to remove a user from the active tenant.
 *
 * The route performs several validations before executing the operation:
 * - Verifies that the requester has the required permission.
 * - Extracts and validates the target userId from the route parameters.
 * - Prevents users from removing themselves from the active tenant.
 * - Ensures the target user is currently linked to the tenant.
 *
 * If the validations pass, the route:
 * - Deletes all role assignments for the user within the tenant.
 * - Removes the user's association with the tenant.
 *
 * Proper HTTP responses are returned for validation errors,
 * permission failures, missing tenant relationships,
 * successful removal, and unexpected server errors.
 */

import { NextResponse } from "next/server"

import { requirePermission } from "@/lib/authz"
import {
  deleteTenantUser,
  findActiveTenantUser,
} from "@/repositories/tenant-users.repo"
import { deleteUserRolesInTenant } from "@/repositories/user-roles.repo"

type Params = {
  params: Promise<{
    userId: string
  }>
}

export async function DELETE(req: Request, { params }: Params) {
  const auth = await requirePermission(req, "users.manage")

  if (!auth.ok) {
    return auth.response
  }

  try {
    const { userId } = await params

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      )
    }

    if (auth.token.userId === userId) {
      return NextResponse.json(
        { error: "You cannot remove yourself from the active tenant" },
        { status: 400 }
      )
    }

    const tenantId = BigInt(auth.token.tenantId)
    const targetUserId = BigInt(userId)

    const tenantUser = await findActiveTenantUser({
      userId: targetUserId,
      tenantId,
    })

    if (!tenantUser) {
      return NextResponse.json(
        { error: "User is not linked to this tenant" },
        { status: 404 }
      )
    }

    await deleteUserRolesInTenant({
      tenantId,
      userId: targetUserId,
    })

    await deleteTenantUser({
      tenantId,
      userId: targetUserId,
    })

    return NextResponse.json(
      {
        message: "User removed from tenant successfully",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error removing user from tenant:", error)

    return NextResponse.json(
      { error: "Failed to remove user from tenant" },
      { status: 500 }
    )
  }
}