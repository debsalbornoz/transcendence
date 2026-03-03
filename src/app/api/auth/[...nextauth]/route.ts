/**
 * Authentication Configuration (NextAuth)
 *
 * Defines the authentication system for the application using NextAuth.
 *
 * Responsibilities:
 * - Configure OAuth providers (Google, GitHub)
 * - Configure credentials-based authentication
 * - Define JWT-based session strategy
 * - Expose authentication handlers for GET and POST requests
 *   under the /api/auth/* route (App Router)
 *
 * This file acts as the central authentication engine of the application.
 */

import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    // Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // GitHub
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),

    // Credentials (opcional)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.email === "admin@email.com" &&
          credentials?.password === "123456"
        ) {
          return { id: "1", name: "Admin", email: "admin@email.com" }
        }
        return null
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
})

export { handler as GET, handler as POST }