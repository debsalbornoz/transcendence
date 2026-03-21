"use client"

import { useTranslations } from "next-intl"
import { Card } from "@/components/ui/card"

export default function TermsPage() {
  const t = useTranslations("privacy")

  return (
<div className="min-h-screen w-full flex items-center justify-center py-16 px-4">
    <Card
      padding="md"
      className="w-full max-w-[600px]"
      contentClassName="
        bg-[#0E1325]/90
        backdrop-blur-md
        rounded-lg
        shadow-[0_0_30px_rgba(0,0,0,0.45)]
        px-6
        py-8
      "
    >
        <h1 className="text-2xl font-semibold text-white">
          {t("title")}
        </h1>
        
        <div className="text-sm text-gray-300 whitespace-pre-line leading-relaxed text-justify py-6">
  {t.rich("content", {
    bold: (chunks) => <strong className="text-white font-bold">{chunks}</strong>
  })}
</div>
    </Card>
</div>
  )
}
