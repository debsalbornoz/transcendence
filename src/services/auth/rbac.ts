/**
 * RBAC and tenant access service.
 *
 * This module provides higher-level business logic for user identity,
 * tenant membership, roles, and permissions in the multi-tenant system.
 * It acts as a service layer between the API/authentication logic
 * and the repository layer.
 *
 * The functions include:
 *
 * - getUserByEmail:
 *   Retrieves a user from the database by email.
 *
 * - ensureUserForOAuth:
 *   Ensures that a user authenticated via OAuth (Google/GitHub)
 *   exists in the database. If the user already exists, their name
 *   may be updated. Otherwise, a new OAuth user record is created.
 *
 * - getTenantsForUser:
 *   Retrieves all tenants (workspaces/companies) associated with
 *   a user and returns a simplified tenant structure.
 *
 * - userHasAccessToTenant:
 *   Verifies whether a user has an active association with a
 *   specific tenant.
 *
 * - getRolesForUserInTenant:
 *   Retrieves all roles assigned to a user within a tenant.
 *
 * - getPermissionsForUser:
 *   Aggregates all permissions granted to a user through their
 *   assigned roles within a tenant.
 *
 * - getTenantNameById:
 *   Retrieves the tenant name using the tenant identifier.
 *
 * This service is responsible for orchestrating tenant access
 * control and RBAC logic used by authentication, session
 * initialization, and authorization checks across the application.
 */

import {
  createOAuthUser,
  findUserByEmail,
  updateUserName,
} from "@/repositories/users.repo"
import {
  findActiveTenantUser,
  findTenantLinksByUserId,
} from "@/repositories/tenant-users.repo"
import { findRolesForUserInTenant } from "@/repositories/user-roles.repo"
import { findTenantById } from "@/repositories/tenants.repo"

export async function getUserByEmail(email: string) {
  return findUserByEmail(email)
}

export async function ensureUserForOAuth(params: {
  email: string
  name?: string | null
}) {
  const existing = await findUserByEmail(params.email)

  if (existing) {
    if (params.name && params.name !== existing.name) {
      await updateUserName({
        userId: existing.user_id,
        name: params.name,
      })
    }

    return existing
  }

  return createOAuthUser({
    email: params.email,
    name: params.name,
  })
}

export async function getTenantsForUser(userId: bigint) {
  const tenantLinks = await findTenantLinksByUserId(userId)

  return tenantLinks.map((item) => ({
    tenant_id: item.Tenants.tenant_id.toString(),
    nome: item.Tenants.nome,
    slug: item.Tenants.slug,
    status: item.Tenants.status,
  }))
}

export async function userHasAccessToTenant(params: {
  userId: bigint
  tenantId: bigint
}) {
  const tenantUser = await findActiveTenantUser({
    userId: params.userId,
    tenantId: params.tenantId,
  })

  return Boolean(tenantUser)
}

export async function getRolesForUserInTenant(params: {
  userId: bigint
  tenantId: bigint
}) {
  const roles = await findRolesForUserInTenant({
    userId: params.userId,
    tenantId: params.tenantId,
  })

  return roles.map((role) => ({
    role_id: role.role_id.toString(),
    name: role.Roles.name,
    description: role.Roles.description,
  }))
}

export async function getPermissionsForUser(params: {
  userId: bigint
  tenantId: bigint
}) {
  const roles = await findRolesForUserInTenant({
    userId: params.userId,
    tenantId: params.tenantId,
  })

  const permissions = new Set<string>()

  for (const role of roles) {
    for (const rolePermission of role.Roles.RolePermissions) {
      permissions.add(rolePermission.Permissions.code)
    }
  }

  return Array.from(permissions)
}

export async function getTenantNameById(tenantId: bigint) {
  const tenant = await findTenantById(tenantId)
  return tenant?.nome ?? null
}