/**
 * Profile page layout.
 *
 * This page renders the user's profile management interface.
 * It includes a language switcher positioned at the top-right corner
 * and the main profile form component centered on the page.
 *
 * The page:
 * - displays the ProfileForm component where users can view and edit
 *   their personal information
 * - provides a LangSwitcher to allow changing the application's language
 * - applies the application's dark background layout and responsive spacing
 *
 * This page acts as the container layout for user profile management.
 */

import { ProfileForm } from "@/features/profile/components/profile-form"
import { LangSwitcher } from "@/components/ui/lang-switcher"

export default function ProfilePage() {
  return (
    <main className="relative min-h-screen bg-[#070B17] text-white p-6">
      {/* Language switcher */}
      <div className="absolute right-6 top-6 z-20">
        <LangSwitcher />
      </div>

      <div className="mx-auto w-full max-w-5xl">
        <ProfileForm />
      </div>
    </main>
  )
}