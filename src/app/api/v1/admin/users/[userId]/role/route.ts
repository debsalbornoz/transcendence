import { NextResponse } from "next/server"

import { requirePermission } from "@/lib/authz"
import {
  findRoleByNameInTenant,
  findUserRoleInTenant,
  replaceUserRoleInTenant,
} from "@/repositories/user-roles.repo"
import { findActiveTenantUser } from "@/repositories/tenant-users.repo"

type RoleName = "Admin" | "User"

type Params = {
  params: Promise<{
    userId: string
  }>
}

export async function PATCH(req: Request, { params }: Params) {
  const auth = await requirePermission(req, "users.manage")

  if (!auth.ok) {
    return auth.response
  }

  try {
    const { userId } = await params
    const body = await req.json()
    const roleName = body?.roleName as RoleName

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      )
    }

    if (roleName !== "Admin" && roleName !== "User") {
      return NextResponse.json(
        { error: "roleName must be Admin or User" },
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

    const currentRole = await findUserRoleInTenant({
      tenantId,
      userId: targetUserId,
    })

    if (!currentRole) {
      return NextResponse.json(
        { error: "Current role not found" },
        { status: 404 }
      )
    }

    const newRole = await findRoleByNameInTenant({
      tenantId,
      roleName,
    })

    if (!newRole) {
      return NextResponse.json(
        { error: "Target role not found" },
        { status: 404 }
      )
    }

    if (currentRole.role_id === newRole.role_id) {
      return NextResponse.json(
        {
          message: "User already has this role",
          action: "unchanged",
        },
        { status: 200 }
      )
    }

    await replaceUserRoleInTenant({
      tenantId,
      userId: targetUserId,
      oldRoleId: currentRole.role_id,
      newRoleId: newRole.role_id,
    })

    return NextResponse.json(
      {
        message: "User role updated successfully",
        action: "replaced-role",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating user role:", error)

    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    )
  }
}