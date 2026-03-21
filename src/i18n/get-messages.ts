/**
 * Loads localized translation messages for the application.
 *
 * This function dynamically imports translation files based on the
 * provided locale and returns them grouped by feature/module.
 *
 * The function:
 * - receives the current locale (e.g., "pt", "en", "es")
 * - dynamically imports JSON translation files from the locales directory
 * - loads messages for authentication, tenant selection, dashboard users,
 *   and profile sections
 * - uses Promise.all to load all translation files in parallel
 *
 * The returned object contains all translation namespaces required
 * by the application and is typically consumed by the i18n provider
 * to supply localized text to the UI.
 */

import type { Locale } from "@/context/lang-context"

export async function getMessages(locale: Locale) {
  const [
    login,
    register,
    forgotPassword,
    resetPassword,
    selectTenant,
    dashboardUsers,
    profile,
    terms,
    privacy,
  ] = await Promise.all([
    import(`@/locales/${locale}/login.json`).then((m) => m.default),
    import(`@/locales/${locale}/register.json`).then((m) => m.default),
    import(`@/locales/${locale}/forgot-password.json`).then((m) => m.default),
    import(`@/locales/${locale}/reset-password.json`).then((m) => m.default),
    import(`@/locales/${locale}/select-tenant.json`).then((m) => m.default),
    import(`@/locales/${locale}/dashboard-users.json`).then((m) => m.default),
    import(`@/locales/${locale}/profile.json`).then((m) => m.default),
    import(`@/locales/${locale}/terms.json`).then((m) => m.default),
    import(`@/locales/${locale}/privacy.json`).then((m) => m.default),
  ])

  return {
    login,
    register,
    forgotPassword,
    resetPassword,
    selectTenant,
    dashboardUsers,
    profile,
    terms,
    privacy,
  } as const
}
