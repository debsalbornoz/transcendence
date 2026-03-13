/**
 * Credentials authentication service.
 *
 * This module implements the authentication logic for users who log in
 * using email and password (Credentials provider).
 *
 * The function:
 *
 * - authorizeWithCredentials:
 *   Validates user credentials by:
 *   1. Retrieving the user from the database using the email address.
 *   2. Ensuring the account exists and is active.
 *   3. Verifying that a password hash is stored (credentials-based user).
 *   4. Comparing the provided password with the stored hash using bcrypt.
 *
 * If the authentication succeeds, a minimal user object is returned
 * containing the user id, email, and name. Otherwise, the function
 * returns null to indicate failed authentication.
 *
 * This function is used by the NextAuth Credentials provider to
 * authenticate users during the login process.
 */

import bcrypt from "bcryptjs"

import { findCredentialsUserByEmail } from "@/repositories/users.repo"

export async function authorizeWithCredentials(
  email: string,
  password: string
) {
  const user = await findCredentialsUserByEmail(email)

  if (!user) return null
  if (user.status !== "active") return null
  if (!user.password_hash) return null

  const isValidPassword = await bcrypt.compare(password, user.password_hash)

  if (!isValidPassword) return null

  return {
    id: user.user_id.toString(),
    email: user.email,
    name: user.name ?? undefined,
  }
}