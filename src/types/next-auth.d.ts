/**
 * NextAuth type extensions for custom session and JWT fields.
 *
 * This module augments the default NextAuth types to include
 * additional properties required by the application's
 * multi-tenant and RBAC authorization system.
 *
 * The Session interface is extended to expose custom user data
 * to the client, including:
 * - id: unique identifier of the authenticated user
 * - tenantId: active tenant (workspace/company) identifier
 * - tenantName: name of the active tenant
 * - permissions: list of permissions granted to the user
 * - roles: list of roles assigned to the user
 * - needsTenantSelection: indicates whether the user must choose
 *   a tenant before accessing the application
 *
 * The JWT interface is also extended to store these values inside
 * the authentication token, allowing them to be propagated from
 * the authentication layer to the client session.
 *
 * This ensures full type safety across the application when
 * accessing authentication, authorization, and tenant context data.
 */

import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      tenantId?: string | null
      tenantName?: string | null
      permissions?: string[]
      roles?: string[]
      needsTenantSelection?: boolean
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string
    tenantId?: string | null
    tenantName?: string | null
    permissions?: string[]
    roles?: string[]
    needsTenantSelection?: boolean
  }
}