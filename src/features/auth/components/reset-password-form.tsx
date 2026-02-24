"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthInput } from "@/components/ui/auth-input"
import { useState } from "react"

export function ResetPasswordForm() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) return alert("Senhas não coincidem!")
    alert("Senha redefinida com sucesso!")
  }

  return (
    <Card padding="lg" className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-white">Redefinir senha</h1>
        <p className="text-sm text-gray-400">
          Insira sua nova senha.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <AuthInput label="Nova senha" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
        <AuthInput label="Confirmar senha" type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} />
        <Button type="submit" className="w-full">Redefinir senha</Button>
      </form>

      <div className="text-center text-sm text-gray-400">
        Lembrou a senha? <a href="/login" className="text-purple-400 hover:text-purple-300 transition">Voltar ao login</a>
      </div>
    </Card>
  )
}