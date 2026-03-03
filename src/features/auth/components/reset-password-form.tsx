/**
 * ResetPasswordForm
 *
 * Client-side form component responsible for handling
 * password reset confirmation.
 *
 * Features:
 * - Uses next-intl for localized text rendering.
 * - Controlled password and confirmation inputs using React state.
 * - Performs basic client-side validation to ensure passwords match.
 * - Displays success or error feedback via alert messages.
 * - Built with reusable design system components (Card, AuthInput, Button).
 *
 * Currently functions as a mock implementation and will be
 * extended with secure token validation and backend integration
 * in a future iteration.
 */

"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthInput } from "@/components/ui/auth-input"

export function ResetPasswordForm() {
  const t = useTranslations("resetPassword")

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (password !== confirm) {
      alert(t("errorMismatch"))
      return
    }

    alert(t("success"))
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
        {/* Header */}
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold text-white">
            {t("title")}
          </h1>
          <p className="text-sm text-gray-400">
            {t("subtitle")}
          </p>
        </div>

        {/* Form */}
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

          <Button type="submit" className="w-full h-11 text-sm">
            {t("submitButton")}
          </Button>
        </form>

        {/* Back to login */}
        <div className="text-center text-sm text-gray-400">
          {t("backToLogin")}{" "}
          <a
            href="/login"
            className="text-purple-400 hover:text-purple-300 transition"
          >
            {t("backLink")}
          </a>
        </div>
      </div>
    </Card>
  )
}