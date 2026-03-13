/**
 * Prisma Client initialization with a SQL Server adapter.
 *
 * This module configures and exports a single PrismaClient instance
 * used throughout the application to interact with the database.
 *
 * Key responsibilities:
 * - Loads environment variables using dotenv.
 * - Creates a PrismaMssql adapter configured for SQL Server.
 * - Configures connection details such as host, port, database,
 *   credentials, encryption, and connection pooling.
 *
 * The adapter is used instead of the default Prisma engine to allow
 * Prisma to connect to Microsoft SQL Server through the MSSQL driver.
 *
 * To prevent multiple database connections during development,
 * the PrismaClient instance is stored in the global scope and reused
 * across hot reloads.
 *
 * This pattern avoids exhausting the database connection pool when
 * using development servers with automatic reload (e.g., Next.js).
 */

import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaMssql } from "@prisma/adapter-mssql"

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function makeAdapter() {
  return new PrismaMssql({
    server: process.env.HOST!, // obrigatório
    port: Number(process.env.DB_PORT ?? 1433),
    database: process.env.DB_NAME!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    options: {
      encrypt: true,
      trustServerCertificate: true, // local/self-signed
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  })
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: makeAdapter(),
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma