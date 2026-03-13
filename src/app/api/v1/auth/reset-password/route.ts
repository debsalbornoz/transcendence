/**
 * Handles password reset confirmation.
 *
 * This POST route finalizes the password reset process using a
 * previously generated recovery token.
 *
 * The route:
 * - reads the reset token, new password, and password confirmation
 *   from the request body
 * - validates that all required fields are valid strings
 * - calls the password recovery service to validate the token
 *   and update the user's password
 * - returns an error if the reset operation fails
 * - returns a success message when the password is updated successfully
 *
 * Proper HTTP responses are returned for validation errors,
 * invalid or expired tokens, service failures, successful resets,
 * and unexpected server errors.
 */

import { NextResponse } from "next/server"

import { resetPassword } from "@/services/auth/password-recovery"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const token = body?.token
    const password = body?.password
    const confirmPassword = body?.confirmPassword

    if (
      typeof token !== "string" ||
      typeof password !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      return NextResponse.json(
        { error: "Dados inválidos." },
        { status: 400 }
      )
    }

    const result = await resetPassword({
      token,
      password,
      confirmPassword,
    })

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: result.message },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error resetting password:", error)

    return NextResponse.json(
      { error: "Erro ao redefinir a senha." },
      { status: 500 }
    )
  }
}