// next.config.ts
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {},

  // Fix workspace root inference warning (optional but recommended)
  // This should point to your project root (where this next.config.ts is).
  turbopack: {
    root: __dirname,
  },
}

export default withNextIntl(nextConfig)