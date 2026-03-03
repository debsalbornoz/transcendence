/**
 * RegisterForm
 *
 * Client-side user registration form UI.
 *
 * Features:
 * - Fully internationalized using next-intl.
 * - Built with reusable design system components (Card, AuthInput, Button).
 * - Provides structured input fields for name, email, password,
 *   and password confirmation.
 * - Includes navigation link to the login page.
 *
 * Currently serves as a visual foundation for the registration flow
 * and will be extended with validation and backend integration
 * in future iterations.
 */

"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthInput } from "@/components/ui/auth-input"

export function RegisterForm() {
  const t = useTranslations("register")

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
        {/* Header */}
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold text-white">
            {t("title")}
          </h1>
          <p className="text-base text-gray-400">
            {t("subtitle")}
          </p>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <AuthInput
            label={t("nameLabel")}
            type="text"
            placeholder={t("namePlaceholder")}
          />

          <AuthInput
            label={t("emailLabel")}
            type="email"
            placeholder={t("emailPlaceholder")}
          />

          <AuthInput
            label={t("passwordLabel")}
            type="password"
            placeholder="••••••••"
            focusColor="orange"
          />

          <AuthInput
            label={t("confirmPasswordLabel")}
            type="password"
            placeholder="••••••••"
            focusColor="orange"
          />
        </div>

        {/* Main Button */}
        <Button className="w-full h-12 text-sm">
          {t("registerButton")}
        </Button>

        {/* Login Redirect */}
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