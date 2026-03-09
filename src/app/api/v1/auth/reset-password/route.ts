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