/**
 * ForgotPasswordPage
 *
 * Route responsible for rendering the password recovery form.
 * This page acts as a thin routing layer and delegates all UI
 * and business logic to the ForgotPasswordForm component.
 *
 * Follows a feature-based architecture pattern where:
 * - The app layer handles routing.
 * - The feature layer manages domain logic.
 * - Reusable UI components remain isolated in the design system.
 */

import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form"

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}