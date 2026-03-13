/**
 * User registration service.
 *
 * This module implements the registration logic for users who create
 * an account using email and password (credentials-based authentication).
 *
 * The registerUser function performs the following steps:
 *
 * - Validates input data:
 *   • ensures the name is provided
 *   • normalizes and validates the email format
 *   • ensures the password meets the minimum length requirement
 *
 * - Checks if a user with the same email already exists in the database.
 *
 * - Hashes the password using bcrypt to securely store it.
 *
 * - Creates a new user record with the hashed password and active status.
 *
 * The function returns a standardized result object indicating whether
 * the registration succeeded or failed, along with an error message
 * or the created user.
 *
 * This service is used by the registration API endpoint to create
 * new accounts in the system.
 */

import bcrypt from "bcryptjs"

import {
  createCredentialsUser,
  findUserByEmail,
} from "@/repositories/users.repo"

type RegisterInput = {
  name: string
  email: string
  password: string
}

export async function registerUser(input: RegisterInput) {
  const name = input.name.trim()
  const email = input.email.trim().toLowerCase()
  const password = input.password

  if (!name) {
    return { ok: false as const, error: "Nome é obrigatório." }
  }

  if (!email) {
    return { ok: false as const, error: "E-mail é obrigatório." }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { ok: false as const, error: "E-mail inválido." }
  }

  if (!password || password.length < 6) {
    return {
      ok: false as const,
      error: "A senha deve ter pelo menos 6 caracteres.",
    }
  }

  const existingUser = await findUserByEmail(email)

  if (existingUser) {
    return {
      ok: false as const,
      error: "Já existe uma conta com este e-mail.",
    }
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await createCredentialsUser({
    name,
    email,
    passwordHash,
  })

  return {
    ok: true as const,
    user,
  }
}