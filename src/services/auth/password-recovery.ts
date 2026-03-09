import bcrypt from "bcryptjs"

import {
  findCredentialsUserByEmail,
  findUserById,
  updateUserPasswordHash,
} from "@/repositories/users.repo"
import {
  createResetPasswordToken,
  verifyResetPasswordToken,
} from "@/lib/reset-password-token"

export async function requestPasswordReset(email: string) {
  const normalizedEmail = email.trim().toLowerCase()

  if (!normalizedEmail) {
    return {
      ok: false as const,
      error: "E-mail é obrigatório.",
    }
  }

  const user = await findCredentialsUserByEmail(normalizedEmail)

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

  if (!user || !user.password_hash || user.status !== "active") {
    return {
      ok: true as const,
      message:
        "Se existir uma conta com esse e-mail, você receberá instruções para redefinir a senha.",
      resetUrl: null,
    }
  }

  const token = createResetPasswordToken({
    userId: user.user_id,
    email: user.email,
    passwordHash: user.password_hash,
    expiresInMinutes: 30,
  })

  const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`

  return {
    ok: true as const,
    message:
      "Se existir uma conta com esse e-mail, você receberá instruções para redefinir a senha.",
    resetUrl,
  }
}

export async function resetPassword(params: {
  token: string
  password: string
  confirmPassword: string
}) {
  const token = params.token?.trim()
  const password = params.password
  const confirmPassword = params.confirmPassword

  if (!token) {
    return { ok: false as const, error: "Token inválido." }
  }

  if (!password || password.length < 6) {
    return {
      ok: false as const,
      error: "A senha deve ter pelo menos 6 caracteres.",
    }
  }

  if (password !== confirmPassword) {
    return {
      ok: false as const,
      error: "A confirmação de senha não confere.",
    }
  }

  const payloadPart = token.split(".")[0]

  if (!payloadPart) {
    return {
      ok: false as const,
      error: "Token inválido.",
    }
  }

  let userIdFromToken: string | null = null

  try {
    const decoded = JSON.parse(
      Buffer.from(payloadPart, "base64url").toString("utf-8")
    ) as { userId?: string }

    userIdFromToken = decoded?.userId ?? null
  } catch {
    return {
      ok: false as const,
      error: "Token inválido.",
    }
  }

  if (!userIdFromToken) {
    return {
      ok: false as const,
      error: "Token inválido.",
    }
  }

  const user = await findUserById(BigInt(userIdFromToken))

  if (!user || !user.password_hash || user.status !== "active") {
    return {
      ok: false as const,
      error: "Token inválido ou usuário não encontrado.",
    }
  }

  const verification = verifyResetPasswordToken({
    token,
    passwordHash: user.password_hash,
  })

  if (!verification.valid) {
    if (verification.reason === "expired") {
      return {
        ok: false as const,
        error: "O link de redefinição expirou.",
      }
    }

    return {
      ok: false as const,
      error: "Token inválido.",
    }
  }

  if (verification.payload.email.toLowerCase() !== user.email.toLowerCase()) {
    return {
      ok: false as const,
      error: "Token inválido.",
    }
  }

  const newPasswordHash = await bcrypt.hash(password, 10)

  await updateUserPasswordHash({
    userId: user.user_id,
    passwordHash: newPasswordHash,
  })

  return {
    ok: true as const,
    message: "Senha redefinida com sucesso.",
  }
}