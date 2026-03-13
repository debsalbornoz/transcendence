/**
 * Retrieves the list of tenants associated with the authenticated user.
 *
 * This GET route requires authentication and returns all tenants that
 * the current user belongs to.
 *
 * The route:
 * - verifies that the request is authenticated using requireAuth
 * - extracts the user ID from the authentication token
 * - retrieves all tenants linked to that user through the RBAC service
 * - returns the tenant list in the response
 *
 * Proper HTTP responses are returned for authentication failures,
 * successful retrieval of tenants, and unexpected server errors.
 */

import { NextResponse } from "next/server"

import { requireAuth } from "@/lib/authz"
import { getTenantsForUser } from "@/services/auth/rbac"

export async function GET(req: Request) {
  const auth = await requireAuth(req)

  if (!auth.ok) {
    return auth.response
  }

  try {
    const tenants = await getTenantsForUser(BigInt(auth.token.userId))

    return NextResponse.json({ tenants }, { status: 200 })
  } catch (error) {
    console.error("Error fetching user tenants:", error)

    return NextResponse.json(
      { error: "Failed to fetch tenants" },
      { status: 500 }
    )
  }
}