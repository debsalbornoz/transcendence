/**
 * RegisterPage
 *
 * Route responsible for rendering the user registration form.
 * This page serves as a thin routing layer, delegating all UI,
 * validation, and account creation logic to the RegisterForm component.
 */

import { RegisterForm } from "@/features/auth/components/register-form"

export default function RegisterPage() {
  return <RegisterForm />
}