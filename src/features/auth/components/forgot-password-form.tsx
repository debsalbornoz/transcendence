"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthInput } from "@/components/ui/auth-input"
import { useState } from "react"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Se um usuário com ${email} existir, você receberá um link de recuperação.`)
  }

  return (
    <Card padding="lg" className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-white">Recuperar senha</h1>
        <p className="text-sm text-gray-400">
          Insira seu e-mail e enviaremos um link para redefinir sua senha.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <AuthInput label="E-mail" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
        <Button type="submit" className="w-full">Enviar link de recuperação</Button>
      </form>

      <div className="text-center text-sm text-gray-400">
        Lembrou a senha? <a href="/login" className="text-purple-400 hover:text-purple-300 transition">Voltar ao login</a>
      </div>
    </Card>
  )
}