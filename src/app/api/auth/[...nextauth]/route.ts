/**
 * NextAuth API route handler.
 *
 * This file initializes NextAuth using the authentication configuration
 * defined in `authOptions`. The handler manages all authentication-related
 * routes such as sign-in, sign-out, session retrieval, and OAuth callbacks.
 *
 * The same handler is exported for both GET and POST HTTP methods to allow
 * NextAuth to process all authentication requests through this endpoint.
 */

import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth-options"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }