import { NextResponse } from "next/server"

import { requestPasswordReset } from "@/services/auth/password-recovery"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = body?.email

    if (typeof email !== "string") {
      return NextResponse.json(
        { error: "E-mail inválido." },
        { status: 400 }
      )
    }

    const result = await requestPasswordReset(email)

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        message: result.message,
        resetUrl: process.env.NODE_ENV !== "production" ? result.resetUrl : null,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error requesting password reset:", error)

    return NextResponse.json(
      { error: "Erro ao solicitar redefinição de senha." },
      { status: 500 }
    )
  }
}