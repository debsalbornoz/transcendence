/**
 * Retrieves all active users linked to the current tenant, including their roles.
 *
 * This GET route requires the "users.manage" permission and returns a list of
 * active tenant users for the authenticated tenant.
 *
 * The route:
 * - validates whether the requester has permission to manage users
 * - extracts the current tenant ID from the authentication token
 * - fetches all active tenant-user relationships for that tenant
 * - selects basic user information from the related Users table
 * - retrieves role assignments for those users within the same tenant
 * - builds a role map to match each user with their corresponding role
 * - formats BigInt identifiers as strings before returning the response
 *
 * The response includes, for each tenant user:
 * - tenant user metadata
 * - basic user details
 * - the assigned role, if available
 *
 * Proper HTTP responses are returned for permission failures,
 * successful retrieval, and unexpected server errors.
 */

import { NextResponse } from "next/server"

import { requirePermission } from "@/lib/authz"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const auth = await requirePermission(req, "users.manage")

  if (!auth.ok) {
    return auth.response
  }

  try {
    const tenantId = BigInt(auth.token.tenantId)

    const users = await prisma.tenantUsers.findMany({
      where: {
        tenant_id: tenantId,
        status: "active",
      },
      select: {
        tenant_user_id: true,
        status: true,
        user_id: true,
        Users: {
          select: {
            user_id: true,
            email: true,
            name: true,
            status: true,
          },
        },
      },
      orderBy: {
        tenant_user_id: "asc",
      },
    })

    const userIds = users.map((item) => item.user_id)

    const userRoles = await prisma.userRoles.findMany({
      where: {
        tenant_id: tenantId,
        user_id: {
          in: userIds,
        },
      },
      select: {
        user_id: true,
        Roles: {
          select: {
            role_id: true,
            name: true,
            description: true,
          },
        },
      },
    })

    const roleMap = new Map<string, { role_id: string; name: string; description: string | null }>()

    for (const item of userRoles) {
      roleMap.set(item.user_id.toString(), {
        role_id: item.Roles.role_id.toString(),
        name: item.Roles.name,
        description: item.Roles.description,
      })
    }

    return NextResponse.json(
      {
        users: users.map((item) => ({
          tenant_user_id: item.tenant_user_id.toString(),
          status: item.status,
          user: {
            user_id: item.Users.user_id.toString(),
            email: item.Users.email,
            name: item.Users.name,
            status: item.Users.status,
          },
          role: roleMap.get(item.user_id.toString()) ?? null,
        })),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching tenant users:", error)

    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}