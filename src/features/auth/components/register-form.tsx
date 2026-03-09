"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthInput } from "@/components/ui/auth-input"
import { useToast } from "@/components/ui/toast"

export function RegisterForm() {
  const t = useTranslations("register")
  const router = useRouter()
  const { push } = useToast()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  function validateForm() {
    if (!name.trim()) {
      push({
        title: "Campo obrigatório",
        message: "Informe seu nome.",
        variant: "danger",
        durationMs: 3500,
      })
      return false
    }

    if (!email.trim()) {
      push({
        title: "Campo obrigatório",
        message: "Informe seu e-mail.",
        variant: "danger",
        durationMs: 3500,
      })
      return false
    }

    if (!password) {
      push({
        title: "Campo obrigatório",
        message: "Informe sua senha.",
        variant: "danger",
        durationMs: 3500,
      })
      return false
    }

    if (password.length < 6) {
      push({
        title: "Senha inválida",
        message: "A senha deve ter pelo menos 6 caracteres.",
        variant: "danger",
        durationMs: 3500,
      })
      return false
    }

    if (password !== confirmPassword) {
      push({
        title: "Senhas diferentes",
        message: "A confirmação de senha não confere.",
        variant: "danger",
        durationMs: 3500,
      })
      return false
    }

    return true
  }

  async function handleRegister() {
    if (!validateForm()) return

    try {
      setLoading(true)

      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        push({
          title: "Erro no cadastro",
          message: data?.error || "Não foi possível criar sua conta.",
          variant: "danger",
          durationMs: 4000,
        })
        return
      }

      push({
        title: "Conta criada",
        message: "Cadastro realizado com sucesso. Faça login para continuar.",
        variant: "success",
        durationMs: 3500,
      })

      router.push("/login")
    } catch (error) {
      console.error("Register error:", error)

      push({
        title: "Erro inesperado",
        message: "Ocorreu um erro inesperado ao criar sua conta.",
        variant: "danger",
        durationMs: 4000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card
      padding="lg"
      className="
        w-full max-w-xl md:max-w-2xl
        bg-[#0E1325]/90 backdrop-blur-md
        border border-white/10
        rounded-2xl
        shadow-[0_0_60px_rgba(0,0,0,0.6)]
        px-10 py-10
      "
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold text-white">
            {t("title")}
          </h1>
          <p className="text-base text-gray-400">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <AuthInput
            label={t("nameLabel")}
            type="text"
            placeholder={t("namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <AuthInput
            label={t("emailLabel")}
            type="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <AuthInput
            label={t("passwordLabel")}
            type="password"
            placeholder="••••••••"
            focusColor="orange"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <AuthInput
            label={t("confirmPasswordLabel")}
            type="password"
            placeholder="••••••••"
            focusColor="orange"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button
          className="w-full h-12 text-sm"
          onClick={handleRegister}
          loading={loading}
          disabled={loading}
        >
          {t("registerButton")}
        </Button>

        <div className="text-center text-sm text-gray-400">
          {t("alreadyHaveAccount")}{" "}
          <Link
            href="/login"
            className="text-purple-400 hover:text-purple-300 transition"
          >
            {t("loginLink")}
          </Link>
        </div>
      </div>
    </Card>
  )
}