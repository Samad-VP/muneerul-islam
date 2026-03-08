"use client"
import { useLanguage } from "@/context/LanguageContext"

import { PiImagesDuotone } from "react-icons/pi"

export default function GalleryPage() {
  const { t } = useLanguage()

  return (
    <div className="py-16 sm:py-24 md:py-32 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center mb-16 sm:mb-20 animate-fade-in w-full">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 sm:mb-6">
            {t("gallery.title").split(" Gallery")[0]} <span className="gradient-text">{t("gallery.title").split("Visual ")[1] || "Gallery"}</span>
          </h1>
          <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-0">
            {t("gallery.subtitle")}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-20 px-4 text-center glass-card border border-border-color animate-fade-in stagger-1">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-6">
            <PiImagesDuotone size={40} className="sm:w-12 sm:h-12" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 text-text-primary">New Content Uploading Soon</h2>
          <p className="text-text-secondary text-base sm:text-lg max-w-md">
            We are currently gathering and curating the latest photos from our community events. Check back soon for updates!
          </p>
        </div>
      </div>
    </div>
  )
}
