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