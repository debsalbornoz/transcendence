/**
 * Authenticated user profile service.
 *
 * This module contains the business logic for managing the profile
 * of the currently authenticated user.
 *
 * It supports the following operations:
 *
 * - getMyProfile:
 *   Retrieves the user's profile information and returns a safe
 *   response with user_id, name, email, and status.
 *
 * - updateMyProfile:
 *   Updates the user's display name after validating that the
 *   provided name is not empty.
 *
 * - updateMyEmail:
 *   Updates the user's email address after:
 *   • normalizing the email
 *   • validating the email format
 *   • ensuring the new email is different from the current one
 *   • checking that no other account already uses the same email
 *
 * - updateMyPassword:
 *   Updates the user's password after:
 *   • verifying that the account has a local password hash
 *   • validating the current password
 *   • validating the new password length
 *   • confirming the new password matches the confirmation field
 *   • ensuring the new password is different from the current password
 *   • hashing the new password with bcrypt before saving it
 *
 * - deleteMyProfile:
 *   Permanently deletes the user's account and related records,
 *   including role assignments and tenant links, using a database
 *   transaction to ensure consistency.
 *
 * This service centralizes authenticated profile management and
 * account security operations for the application.
 */

import bcrypt from "bcryptjs"

import {
  findUserByEmail,
  getProfileByUserId,
  updateUserEmail,
  updateUserName,
  updateUserPasswordHash,
} from "@/repositories/users.repo"
import { prisma } from "@/lib/prisma"

export async function getMyProfile(userId: bigint) {
  const user = await getProfileByUserId(userId)

  if (!user) {
    return {
      ok: false as const,
      error: "Usuário não encontrado.",
    }
  }

  return {
    ok: true as const,
    user: {
      user_id: user.user_id.toString(),
      name: user.name,
      email: user.email,
      status: user.status,
    },
  }
}

export async function updateMyProfile(params: {
  userId: bigint
  name: string
}) {
  const name = params.name.trim()

  if (!name) {
    return {
      ok: false as const,
      error: "Nome é obrigatório.",
    }
  }

  const user = await getProfileByUserId(params.userId)

  if (!user) {
    return {
      ok: false as const,
      error: "Usuário não encontrado.",
    }
  }

  await updateUserName({
    userId: params.userId,
    name,
  })

  return {
    ok: true as const,
    message: "Nome atualizado com sucesso.",
  }
}

export async function updateMyEmail(params: {
  userId: bigint
  email: string
}) {
  const email = params.email.trim().toLowerCase()

  if (!email) {
    return {
      ok: false as const,
      error: "E-mail é obrigatório.",
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      ok: false as const,
      error: "E-mail inválido.",
    }
  }

  const user = await getProfileByUserId(params.userId)

  if (!user) {
    return {
      ok: false as const,
      error: "Usuário não encontrado.",
    }
  }

  if (user.email.toLowerCase() === email) {
    return {
      ok: false as const,
      error: "O novo e-mail deve ser diferente do atual.",
    }
  }

  const existingUser = await findUserByEmail(email)

  if (existingUser && existingUser.user_id !== params.userId) {
    return {
      ok: false as const,
      error: "Já existe uma conta com este e-mail.",
    }
  }

  await updateUserEmail({
    userId: params.userId,
    email,
  })

  return {
    ok: true as const,
    message: "E-mail atualizado com sucesso.",
  }
}

export async function updateMyPassword(params: {
  userId: bigint
  currentPassword: string
  newPassword: string
  confirmPassword: string
}) {
  const user = await getProfileByUserId(params.userId)

  if (!user) {
    return {
      ok: false as const,
      error: "Usuário não encontrado.",
    }
  }

  if (!user.password_hash) {
    return {
      ok: false as const,
      error: "Esta conta não possui senha local cadastrada.",
    }
  }

  if (!params.currentPassword) {
    return {
      ok: false as const,
      error: "Informe sua senha atual.",
    }
  }

  if (!params.newPassword || params.newPassword.length < 6) {
    return {
      ok: false as const,
      error: "A nova senha deve ter pelo menos 6 caracteres.",
    }
  }

  if (params.newPassword !== params.confirmPassword) {
    return {
      ok: false as const,
      error: "A confirmação da nova senha não confere.",
    }
  }

  const isValid = await bcrypt.compare(
    params.currentPassword,
    user.password_hash
  )

  if (!isValid) {
    return {
      ok: false as const,
      error: "Senha atual incorreta.",
    }
  }

  const samePassword = await bcrypt.compare(
    params.newPassword,
    user.password_hash
  )

  if (samePassword) {
    return {
      ok: false as const,
      error: "A nova senha deve ser diferente da senha atual.",
    }
  }

  const passwordHash = await bcrypt.hash(params.newPassword, 10)

  await updateUserPasswordHash({
    userId: params.userId,
    passwordHash,
  })

  return {
    ok: true as const,
    message: "Senha atualizada com sucesso.",
  }
}

export async function deleteMyProfile(userId: bigint) {
  const user = await getProfileByUserId(userId)

  if (!user) {
    return {
      ok: false as const,
      error: "Usuário não encontrado.",
    }
  }

  await prisma.$transaction([
    prisma.userRoles.deleteMany({
      where: { user_id: userId },
    }),
    prisma.tenantUsers.deleteMany({
      where: { user_id: userId },
    }),
    prisma.users.delete({
      where: { user_id: userId },
    }),
  ])

  return {
    ok: true as const,
    message: "Conta removida com sucesso.",
  }
}