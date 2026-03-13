/**
 * NextAuth configuration for authentication and tenant-aware session management.
 *
 * This file defines the authentication providers, session strategy,
 * and authentication callbacks used across the application.
 *
 * The configuration:
 * - enables Google, GitHub, and Credentials authentication providers
 * - authenticates email/password users through a custom credentials service
 * - ensures OAuth users exist in the database before completing sign-in
 * - uses JWT-based sessions to store authentication and tenant context
 *
 * The callbacks handle:
 * - signIn:
 *   Ensures users authenticated through Google or GitHub are created
 *   or synchronized in the database.
 *
 * - jwt:
 *   Enriches the token with application-specific data such as:
 *   • userId
 *   • tenantId
 *   • tenantName
 *   • permissions
 *   • roles
 *   • needsTenantSelection
 *
 *   It also determines whether the user:
 *   - belongs to exactly one tenant and can enter it directly
 *   - belongs to multiple tenants and must choose one
 *   - does not belong to any tenant
 *
 *   In addition, it supports session updates triggered from the client,
 *   allowing tenant context and authorization data to be refreshed.
 *
 * - session:
 *   Maps the custom JWT fields into the session object so they are
 *   available on the client side through NextAuth session hooks.
 *
 * This configuration is responsible for authentication, user provisioning,
 * and tenant-based authorization context throughout the application.
 */
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

import { authorizeWithCredentials } from "@/services/auth/credentials"
import {
  ensureUserForOAuth,
  getPermissionsForUser,
  getRolesForUserInTenant,
  getTenantsForUser,
  getTenantNameById,
} from "@/services/auth/rbac"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email
        const password = credentials?.password

        if (typeof email !== "string" || typeof password !== "string") {
          return null
        }

        return authorizeWithCredentials(email, password)
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        if (!user.email) return false

        await ensureUserForOAuth({
          email: user.email,
          name: user.name,
        })
      }

      return true
    },

    async jwt({ token, user, trigger, session }) {
      if (user?.email) {
        const dbUser = await ensureUserForOAuth({
          email: user.email,
          name: user.name,
        })

        const tenants = await getTenantsForUser(dbUser.user_id)

        token.userId = dbUser.user_id.toString()

        if (tenants.length === 1) {
          const tenantId = tenants[0].tenant_id

          const permissions = await getPermissionsForUser({
            userId: dbUser.user_id,
            tenantId: BigInt(tenantId),
          })

          const roles = await getRolesForUserInTenant({
            userId: dbUser.user_id,
            tenantId: BigInt(tenantId),
          })

          const tenantName = await getTenantNameById(BigInt(tenantId))

          token.tenantId = tenantId
          token.tenantName = tenantName ?? null
          token.permissions = permissions
          token.roles = roles.map((role) => role.name)
          token.needsTenantSelection = false
        } else if (tenants.length > 1) {
          token.tenantId = null
          token.tenantName = null
          token.permissions = []
          token.roles = []
          token.needsTenantSelection = true
        } else {
          token.tenantId = null
          token.tenantName = null
          token.permissions = []
          token.roles = []
          token.needsTenantSelection = false
        }
      }

      if (trigger === "update" && session) {
        if ("tenantId" in session) {
          token.tenantId = session.tenantId ?? null
        }

        if ("tenantName" in session) {
          token.tenantName = session.tenantName ?? null
        }

        if ("permissions" in session) {
          token.permissions = session.permissions ?? []
        }

        if ("roles" in session) {
          token.roles = session.roles ?? []
        }

        token.needsTenantSelection = false
      }

      return token
    },

    async session({ session, token }) {
      session.user = session.user ?? {}

      ;(session.user as any).id = token.userId
      ;(session.user as any).tenantId = token.tenantId ?? null
      ;(session.user as any).tenantName = token.tenantName ?? null
      ;(session.user as any).permissions = token.permissions ?? []
      ;(session.user as any).roles = token.roles ?? []
      ;(session.user as any).needsTenantSelection =
        token.needsTenantSelection ?? false

      return session
    },
  },
}