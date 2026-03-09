"use client"
import { useLanguage } from "@/context/LanguageContext"
import { PiImagesDuotone } from "react-icons/pi"

export default function GalleryPage() {
  const { t } = useLanguage()

  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 w-full mesh-gradient overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-primary" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter">
            {t("gallery.title").split(" Gallery")[0]} <span className="gradient-text drop-shadow-sm">{t("gallery.title").split("Visual ")[1] || "Gallery"}</span>
          </h1>
          <p className="text-text-primary/70 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium">
            {t("gallery.subtitle")}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 w-full py-20 pb-40">
        <div className="flex flex-col items-center justify-center py-24 sm:py-32 px-6 text-center glass-card border-none bg-emerald-500/5 shadow-premium animate-fade-in stagger-1 rounded-[3rem] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-gold/10 opacity-30" />
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white shadow-premium flex items-center justify-center text-emerald-500 mb-10 group-hover:scale-110 transition-transform duration-500 relative z-10 border border-emerald-500/20">
            <PiImagesDuotone size={56} className="opacity-80" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black mb-6 text-text-primary tracking-tight relative z-10">New Content Uploading Soon</h2>
          <p className="text-text-primary/70 text-lg sm:text-xl max-w-xl mx-auto font-medium leading-relaxed relative z-10">
            We are currently gathering and curating the latest photos from our community events. Check back soon for updates!
          </p>
          
          {/* Visual accent */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
        </div>
      </div>
    </div>
  )
}
