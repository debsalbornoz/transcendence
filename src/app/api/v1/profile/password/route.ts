/**
 * Updates the authenticated user's password.
 *
 * This PATCH route allows a logged-in user to change their own password.
 * The request must be authenticated, and the user must provide their
 * current password along with the new password and confirmation.
 *
 * The route:
 * - verifies that the request is authenticated using requireAuth
 * - reads the current password, new password, and confirmation from the request body
 * - validates that all required fields are valid strings
 * - extracts the authenticated user's ID from the token
 * - calls the profile service responsible for validating the current password
 *   and updating the user's password
 * - returns an error if the update operation fails
 * - returns a success message if the password is updated successfully
 *
 * Proper HTTP responses are returned for authentication failures,
 * validation errors, incorrect passwords, successful updates,
 * and unexpected server errors.
 */

import { NextResponse } from "next/server"

import { requireAuth } from "@/lib/authz"
import { updateMyPassword } from "@/services/user-profile"

export async function PATCH(req: Request) {
  const auth = await requireAuth(req)

  if (!auth.ok) {
    return auth.response
  }

  try {
    const body = await req.json()

    const currentPassword = body?.currentPassword
    const newPassword = body?.newPassword
    const confirmPassword = body?.confirmPassword

    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      return NextResponse.json(
        { error: "Dados inválidos." },
        { status: 400 }
      )
    }

    const userId = BigInt(auth.token.userId)

    const result = await updateMyPassword({
      userId,
      currentPassword,
      newPassword,
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
    console.error("Error updating password:", error)

    return NextResponse.json(
      { error: "Erro ao atualizar senha." },
      { status: 500 }
    )
  }
}