/**
 * ResetPasswordPage
 *
 * Route responsible for rendering the password reset form.
 * This page functions as a thin routing layer, delegating all UI,
 * token handling, validation, and password update logic to the
 * ResetPasswordForm component.
 *

 */

import { ResetPasswordForm } from "@/features/auth/components/reset-password-form"

export default function ResetPasswordPage() {
  return <ResetPasswordForm />
}