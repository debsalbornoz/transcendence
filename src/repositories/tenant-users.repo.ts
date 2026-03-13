/**
 * Tenant-user relationship data access helpers.
 *
 * This module contains database operations related to the relationship
 * between users and tenants (companies/workspaces) in a multi-tenant system.
 * It uses Prisma to query and manage records in the tenantUsers table.
 *
 * The functions include:
 *
 * - findTenantLinksByUserId:
 *   Retrieves all active tenant associations for a given user,
 *   including tenant information. Results are ordered by tenant_user_id.
 *
 * - findActiveTenantUser:
 *   Finds a specific active relationship between a user and a tenant.
 *   Useful for validating whether a user belongs to a given tenant.
 *
 * - createTenantUser:
 *   Creates a new association between a user and a tenant with an
 *   active status.
 *
 * - deleteTenantUser:
 *   Removes the relationship between a user and a tenant by deleting
 *   the corresponding records.
 *
 * These helpers centralize tenant membership logic and support
 * multi-tenant authorization and workspace management.
 */

import { prisma } from "@/lib/prisma"

export async function findTenantLinksByUserId(userId: bigint) {
  return prisma.tenantUsers.findMany({
    where: {
      user_id: userId,
      status: "active",
    },
    include: {
      Tenants: true,
    },
    orderBy: {
      tenant_user_id: "asc",
    },
  })
}

export async function findActiveTenantUser(params: {
  userId: bigint
  tenantId: bigint
}) {
  return prisma.tenantUsers.findFirst({
    where: {
      user_id: params.userId,
      tenant_id: params.tenantId,
      status: "active",
    },
  })
}

export async function createTenantUser(params: {
  userId: bigint
  tenantId: bigint
}) {
  return prisma.tenantUsers.create({
    data: {
      user_id: params.userId,
      tenant_id: params.tenantId,
      status: "active",
    },
  })
}

export async function deleteTenantUser(params: {
  userId: bigint
  tenantId: bigint
}) {
  return prisma.tenantUsers.deleteMany({
    where: {
      user_id: params.userId,
      tenant_id: params.tenantId,
    },
  })
}