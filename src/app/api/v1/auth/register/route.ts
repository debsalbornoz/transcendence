import { NextResponse } from "next/server"

import { registerUser } from "@/services/auth/register"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const name = body?.name
    const email = body?.email
    const password = body?.password

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { error: "Dados inválidos." },
        { status: 400 }
      )
    }

    const result = await registerUser({
      name,
      email,
      password,
    })

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        message: "Usuário criado com sucesso.",
        user: {
          user_id: result.user.user_id.toString(),
          name: result.user.name,
          email: result.user.email,
          status: result.user.status,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error registering user:", error)

    return NextResponse.json(
      { error: "Erro ao criar usuário." },
      { status: 500 }
    )
  }
}