"use client"
import { useLanguage } from "@/context/LanguageContext"
import { PiCheckCircleBold } from "react-icons/pi"

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="py-16 sm:py-24 md:py-32 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center mb-16 sm:mb-20 animate-fade-in w-full">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 sm:mb-6">
            {t("about.title")} <span className="gradient-text">Muneerul Islam</span>
          </h1>
          <p className="text-text-secondary text-base sm:text-lg max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            {t("about.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-20 items-center mb-20 sm:mb-32 w-full">
          <div className="animate-slide-in stagger-1 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8">{t("about.missionTitle")}</h2>
            <p className="text-text-secondary text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed">
              {t("about.missionDesc")}
            </p>
            <div className="space-y-4 sm:space-y-5 text-left inline-block w-full">
              {t("about.missionList").map((item: string) => (
                <div key={item} className="flex items-start sm:items-center gap-3 sm:gap-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5 sm:mt-0">
                    <PiCheckCircleBold className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-text-primary font-medium text-sm sm:text-base">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative animate-fade-in stagger-2 px-4 sm:px-0 mt-8 lg:mt-0">
            <div className="glass-card aspect-square flex items-center justify-center p-8 sm:p-12 w-full max-w-md mx-auto lg:max-w-none">
               <span className="text-8xl sm:text-9xl opacity-20 drop-shadow-lg">📖</span>
               <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8">
                 <div className="w-full h-full border-2 border-dashed border-emerald-500/20 rounded-full animate-spin-slow" />
               </div>
            </div>
          </div>
        </div>

        <div className="bg-bg-secondary rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 text-center animate-fade-in w-full border border-border-color">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6">{t("about.historyTitle")}</h2>
          <p className="text-text-secondary text-base sm:text-lg max-w-4xl mx-auto leading-relaxed">
            {t("about.historyDesc")}
          </p>
        </div>
      </div>
    </div>
  )
}
