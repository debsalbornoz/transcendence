/**
 * ForgotPasswordForm
 *
 * Client-side password recovery form used to collect
 * the user's email address.
 *
 * Features:
 * - Uses next-intl for localized text rendering.
 * - Controlled email input managed with React state.
 * - Demonstrates translation variable interpolation
 *   via alert message ({email}).
 * - Built with design system components (Card, AuthInput, Button).
 *
 * Currently operates as a mock implementation and
 * will be integrated with a backend API and database
 * in a future iteration.
 */

"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthInput } from "@/components/ui/auth-input"

export function ForgotPasswordForm() {
  const t = useTranslations("forgotPassword")
  const [email, setEmail] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Uses next-intl variable interpolation: {email}
    alert(t("alertMessage", { email }))
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
            label={t("emailLabel")}
            type="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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