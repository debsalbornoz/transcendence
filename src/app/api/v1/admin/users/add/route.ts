/**
 * Adds an existing user to the current tenant and assigns a role.
 *
 * This POST route requires the "users.manage" permission and is responsible
 * for linking an already existing active user to the authenticated tenant.
 *
 * The route:
 * - reads the user's email and desired role from the request body
 * - validates the required input fields
 * - ensures the role name is either "Admin" or "User"
 * - finds the user by email
 * - checks whether the user exists and is active
 * - finds the requested role inside the current tenant
 * - creates the tenant-user link if it does not already exist
 * - checks whether the user already has a role in the tenant
 * - creates the role assignment if none exists
 * - returns an unchanged response if the same role is already assigned
 * - replaces the existing role if a different one is currently assigned
 *
 * Proper HTTP responses are returned for permission errors, invalid input,
 * missing users, inactive users, missing roles, successful assignments,
 * unchanged states, and unexpected server failures.
 */

import { NextResponse } from "next/server"

import { requirePermission } from "@/lib/authz"
import { findUserByEmail } from "@/repositories/users.repo"
import {
  createTenantUser,
  findActiveTenantUser,
} from "@/repositories/tenant-users.repo"
import {
  createUserRole,
  findRoleByNameInTenant,
  findUserRoleInTenant,
  replaceUserRoleInTenant,
} from "@/repositories/user-roles.repo"

type RoleName = "Admin" | "User"

export async function POST(req: Request) {
  const auth = await requirePermission(req, "users.manage")

  if (!auth.ok) {
    return auth.response
  }

  try {
    const body = await req.json()
    const email = body?.email
    const roleName = body?.roleName as RoleName

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
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

    const user = await findUserByEmail(email)

    if (!user) {
      return NextResponse.json(
        { error: "User not found. This feature only adds existing users." },
        { status: 404 }
      )
    }

    if (user.status !== "active") {
      return NextResponse.json(
        { error: "User is not active" },
        { status: 400 }
      )
    }

    const role = await findRoleByNameInTenant({
      tenantId,
      roleName,
    })

    if (!role) {
      return NextResponse.json(
        { error: "Role not found in current tenant" },
        { status: 404 }
      )
    }

    const existingTenantUser = await findActiveTenantUser({
      userId: user.user_id,
      tenantId,
    })

    if (!existingTenantUser) {
      await createTenantUser({
        userId: user.user_id,
        tenantId,
      })
    }

    const existingUserRole = await findUserRoleInTenant({
      tenantId,
      userId: user.user_id,
    })

    if (!existingUserRole) {
      await createUserRole({
        tenantId,
        userId: user.user_id,
        roleId: role.role_id,
      })

      return NextResponse.json(
        {
          message: "User added to tenant successfully",
          action: "created-role",
        },
        { status: 200 }
      )
    }

    if (existingUserRole.role_id === role.role_id) {
      return NextResponse.json(
        {
          message: "User already belongs to this tenant with the selected role",
          action: "unchanged",
        },
        { status: 200 }
      )
    }

    await replaceUserRoleInTenant({
      tenantId,
      userId: user.user_id,
      oldRoleId: existingUserRole.role_id,
      newRoleId: role.role_id,
    })

    return NextResponse.json(
      {
        message: "User role updated successfully",
        action: "replaced-role",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error adding user to tenant:", error)

    return NextResponse.json(
      { error: "Failed to add user to tenant" },
      { status: 500 }
    )
  }
}