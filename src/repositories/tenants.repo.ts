/**
 * Tenant data access helper.
 *
 * This module provides a function to retrieve tenant (workspace/company)
 * information from the database using Prisma.
 *
 * - findTenantById:
 *   Fetches a tenant by its unique identifier (tenant_id) and returns
 *   a limited set of fields including:
 *   • tenant_id
 *   • nome
 *   • slug
 *   • status
 *
 * The use of `select` ensures that only the required fields are returned,
 * improving performance and avoiding unnecessary data exposure.
 *
 * This helper is typically used in authentication, tenant selection,
 * and workspace context resolution within the multi-tenant system.
 */

import { prisma } from "@/lib/prisma"

export async function findTenantById(tenantId: bigint) {
  return prisma.tenants.findUnique({
    where: {
      tenant_id: tenantId,
    },
    select: {
      tenant_id: true,
      nome: true,
      slug: true,
      status: true,
    },
  })
}