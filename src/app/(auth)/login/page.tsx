/**
 * LoginPage
 *
 * Route responsible for rendering the user authentication form.
 * This page acts as a thin routing layer, delegating all UI,
 * validation, and authentication logic to the LoginForm component.
 *
 * Follows a feature-based architecture pattern where:
 * - The app layer manages routing.
 * - The auth feature encapsulates authentication logic.
 * - The UI layer provides reusable design system components.
 */

import { LoginForm } from "@/features/auth/components/login-form"

export default function LoginPage() {
  return <LoginForm />
}