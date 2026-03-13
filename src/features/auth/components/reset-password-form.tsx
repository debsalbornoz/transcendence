/**
 * Reset password form component.
 *
 * This client-side component allows users to set a new password
 * using a password reset token received via email.
 *
 * The component:
 * - reads the reset token from the URL query parameters
 * - validates the presence of the token before allowing the reset flow
 * - collects the new password and confirmation from the user
 * - validates password length and password confirmation
 * - sends the reset request to the password reset API endpoint
 * - displays toast notifications for validation errors, API errors,
 *   successful password updates, and unexpected failures
 * - redirects the user to the login page after a successful reset
 * - shows a fallback UI when the reset token is missing or invalid
 * - provides navigation links to request a new reset link or return to login
 *
 * This component is responsible for completing the password recovery
 * process by validating the token and updating the user's password.
 */

"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { AlertTriangle } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthInput } from "@/components/ui/auth-input"
import { useToast } from "@/components/ui/toast"

export function ResetPasswordForm() {
  const t = useTranslations("resetPassword")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { push } = useToast()

  const token = searchParams.get("token") || ""

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!token) {
      push({
        title: "Link inválido",
        message: "O token de redefinição não foi encontrado.",
        variant: "danger",
        durationMs: 4000,
      })
      return
    }

    if (!password || password.length < 6) {
      push({
        title: "Senha inválida",
        message: "A senha deve ter pelo menos 6 caracteres.",
        variant: "danger",
        durationMs: 4000,
      })
      return
    }

    if (password !== confirm) {
      push({
        title: "Senhas diferentes",
        message: t("errorMismatch"),
        variant: "danger",
        durationMs: 4000,
      })
      return
    }

    try {
      setLoading(true)

      const res = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
          confirmPassword: confirm,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        push({
          title: "Erro ao redefinir senha",
          message: data?.error || "Não foi possível redefinir a senha.",
          variant: "danger",
          durationMs: 4000,
        })
        return
      }

      push({
        title: "Senha redefinida",
        message: data?.message || t("success"),
        variant: "success",
        durationMs: 3500,
      })

      router.push("/login")
    } catch (error) {
      console.error("Reset password error:", error)

      push({
        title: "Erro inesperado",
        message: "Ocorreu um erro inesperado ao redefinir a senha.",
        variant: "danger",
        durationMs: 4000,
      })
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <Card
        padding="lg"
        className="
          w-full max-w-lg
          bg-[#0E1325]/90 backdrop-blur-md
          border border-white/10
          rounded-2xl
          shadow-[0_0_60px_rgba(0,0,0,0.6)]
          px-8 py-8
        "
      >
        <div className="flex flex-col gap-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/15 bg-red-500/10 text-red-300">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-semibold text-white">
              Link inválido
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              O link de redefinição está ausente ou inválido. Solicite um novo link para continuar.
            </p>
          </div>

          <Link href="/forgot-password">
            <Button className="w-full h-11 text-sm">
              Solicitar novo link
            </Button>
          </Link>

          <div className="text-center text-sm text-gray-400">
            {t("backToLogin")}{" "}
            <Link
              href="/login"
              className="text-purple-400 hover:text-purple-300 transition"
            >
              {t("backLink")}
            </Link>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card
      padding="lg"
      className="
        w-full max-w-lg
        bg-[#0E1325]/90 backdrop-blur-md
        border border-white/10
        rounded-2xl
        shadow-[0_0_60px_rgba(0,0,0,0.6)]
        px-8 py-8
      "
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold text-white">
            {t("title")}
          </h1>
          <p className="text-sm text-gray-400">
            {t("subtitle")}
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <AuthInput
            label={t("passwordLabel")}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            focusColor="orange"
          />

          <AuthInput
            label={t("confirmLabel")}
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            focusColor="orange"
          />

          <Button
            type="submit"
            className="w-full h-11 text-sm"
            loading={loading}
            disabled={loading}
          >
            {t("submitButton")}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-400">
          {t("backToLogin")}{" "}
          <Link
            href="/login"
            className="text-purple-400 hover:text-purple-300 transition"
          >
            {t("backLink")}
          </Link>
        </div>
      </div>
    </Card>
  )
}