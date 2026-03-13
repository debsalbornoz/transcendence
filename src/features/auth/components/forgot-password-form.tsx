/**
 * Forgot password form component.
 *
 * This client-side component allows users to request a password reset
 * by providing their email address.
 *
 * The component:
 * - collects the user's email and sends a request to the password
 *   recovery API endpoint
 * - displays loading, success, and error states
 * - shows toast notifications for user feedback
 * - optionally displays the generated reset link in development
 *   environments to simplify local testing
 * - allows copying the reset link to the clipboard
 * - provides a direct link to open the reset page
 * - includes a navigation link back to the login page
 *
 * This component is responsible for initiating the password
 * recovery flow in the authentication system.
 */
"use client"

import { useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Copy, CheckCircle2, Mail } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthInput } from "@/components/ui/auth-input"
import { useToast } from "@/components/ui/toast"

export function ForgotPasswordForm() {
  const t = useTranslations("forgotPassword")
  const { push } = useToast()

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [resetUrl, setResetUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!email.trim()) {
      push({
        title: "Campo obrigatório",
        message: "Informe seu e-mail.",
        variant: "danger",
        durationMs: 3500,
      })
      return
    }

    try {
      setLoading(true)
      setResetUrl(null)
      setCopied(false)

      const res = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        push({
          title: "Erro",
          message:
            data?.error || "Não foi possível processar a solicitação.",
          variant: "danger",
          durationMs: 4000,
        })
        return
      }

      setResetUrl(data?.resetUrl ?? null)

      push({
        title: "Solicitação enviada",
        message:
          data?.message ||
          "Se existir uma conta com esse e-mail, você receberá instruções.",
        variant: "success",
        durationMs: 4000,
      })
    } catch (error) {
      console.error("Forgot password error:", error)

      push({
        title: "Erro inesperado",
        message: "Ocorreu um erro inesperado ao solicitar a redefinição.",
        variant: "danger",
        durationMs: 4000,
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleCopyLink() {
    if (!resetUrl) return

    try {
      await navigator.clipboard.writeText(resetUrl)
      setCopied(true)

      push({
        title: "Link copiado",
        message: "O link de redefinição foi copiado para a área de transferência.",
        variant: "success",
        durationMs: 3000,
      })

      window.setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      console.error("Copy reset link error:", error)

      push({
        title: "Erro ao copiar",
        message: "Não foi possível copiar o link de redefinição.",
        variant: "danger",
        durationMs: 3500,
      })
    }
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
            label={t("emailLabel")}
            type="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        {resetUrl && (
          <div className="rounded-2xl border border-blue-400/15 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4 shadow-[0_0_30px_rgba(59,130,246,0.08)]">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/15 bg-white/5 text-blue-300">
                <Mail className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">
                  Link de redefinição gerado
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-400">
                  Ambiente local: copie o link abaixo e abra em uma nova aba para redefinir a senha.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-[#0A1020]/90 p-3">
              <p className="break-all text-xs leading-5 text-gray-300">
                {resetUrl}
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={handleCopyLink}
                variant="secondary"
                className="sm:min-w-[180px]"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copiar link
                  </>
                )}
              </Button>

              <a
                href={resetUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Abrir link
              </a>
            </div>
          </div>
        )}

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