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