/**
 * Secure reset password token generation and validation.
 *
 * This module implements a custom password reset token mechanism
 * using HMAC signatures to ensure integrity and prevent tampering.
 *
 * The token contains a payload with:
 * - userId
 * - email
 * - expiration timestamp (exp)
 *
 * The payload is Base64URL encoded and signed using an HMAC SHA-256
 * signature derived from:
 *   RESET_PASSWORD_SECRET + user's password hash.
 *
 * This design provides additional security because:
 * - the token automatically becomes invalid if the user's password changes
 * - the payload cannot be modified without breaking the signature
 * - expiration is enforced during verification
 *
 * Main functions:
 *
 * - createResetPasswordToken:
 *   Generates a signed token containing the user identifier,
 *   email, and expiration timestamp.
 *
 * - verifyResetPasswordToken:
 *   Validates the token by checking:
 *   • token format
 *   • signature integrity (using timing-safe comparison)
 *   • payload structure
 *   • expiration time
 *
 * If valid, the decoded payload is returned. Otherwise, a specific
 * failure reason is provided (invalid format, signature, payload, or expiration).
 */

import crypto from "crypto"

type ResetPasswordPayload = {
  userId: string
  email: string
  exp: number
}

const RESET_PASSWORD_SECRET = process.env.RESET_PASSWORD_SECRET || process.env.NEXTAUTH_SECRET

if (!RESET_PASSWORD_SECRET) {
  throw new Error("RESET_PASSWORD_SECRET or NEXTAUTH_SECRET must be defined")
}

function base64urlEncode(value: string) {
  return Buffer.from(value).toString("base64url")
}

function base64urlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf-8")
}

function sign(value: string, passwordHash: string) {
  return crypto
    .createHmac("sha256", `${RESET_PASSWORD_SECRET}:${passwordHash}`)
    .update(value)
    .digest("base64url")
}

export function createResetPasswordToken(params: {
  userId: bigint | string
  email: string
  passwordHash: string
  expiresInMinutes?: number
}) {
  const exp =
    Math.floor(Date.now() / 1000) + 60 * (params.expiresInMinutes ?? 30)

  const payload: ResetPasswordPayload = {
    userId: params.userId.toString(),
    email: params.email,
    exp,
  }

  const payloadEncoded = base64urlEncode(JSON.stringify(payload))
  const signature = sign(payloadEncoded, params.passwordHash)

  return `${payloadEncoded}.${signature}`
}

export function verifyResetPasswordToken(params: {
  token: string
  passwordHash: string
}) {
  const [payloadEncoded, receivedSignature] = params.token.split(".")

  if (!payloadEncoded || !receivedSignature) {
    return { valid: false as const, reason: "invalid-format" }
  }

  const expectedSignature = sign(payloadEncoded, params.passwordHash)

  const receivedBuffer = Buffer.from(receivedSignature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
  ) {
    return { valid: false as const, reason: "invalid-signature" }
  }

  try {
    const payload = JSON.parse(
      base64urlDecode(payloadEncoded)
    ) as ResetPasswordPayload

    if (!payload?.userId || !payload?.email || !payload?.exp) {
      return { valid: false as const, reason: "invalid-payload" }
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false as const, reason: "expired" }
    }

    return {
      valid: true as const,
      payload,
    }
  } catch {
    return { valid: false as const, reason: "invalid-payload" }
  }
}