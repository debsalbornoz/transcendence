/**
 * Shared RBAC and tenant data types.
 *
 * This module defines TypeScript types used to represent simplified
 * tenant and role structures across the application.
 *
 * - TenantSummary:
 *   Represents a lightweight view of a tenant (workspace/company)
 *   including its identifier, name, slug, and status. It is typically
 *   used when listing tenants available to a user.
 *
 * - RoleSummary:
 *   Represents a simplified role structure containing the role
 *   identifier, role name, and optional description. It is used
 *   when returning role information from RBAC services or APIs.
 *
 * These types help ensure consistent data structures between
 * services, APIs, and frontend components.
 */
export type TenantSummary = {
    tenant_id: string
    nome: string
    slug: string
    status: string
  }
  
  export type RoleSummary = {
    role_id: string
    name: string
    description: string | null
  }