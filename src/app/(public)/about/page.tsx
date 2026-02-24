"use client"
import { useLanguage } from "@/context/LanguageContext"

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t("about.title")} <span className="gradient-text">Muneerul Islam</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-3xl mx-auto leading-relaxed">
            {t("about.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-20 items-center mb-32">
          <div className="animate-slide-in stagger-1">
            <h2 className="text-3xl font-bold mb-8">{t("about.missionTitle")}</h2>
            <p className="text-text-secondary text-lg mb-6 leading-relaxed">
              {t("about.missionDesc")}
            </p>
            <div className="space-y-4">
              {t("about.missionList").map((item: string) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <span className="text-sm">✓</span>
                  </div>
                  <span className="text-text-primary">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative animate-fade-in stagger-2">
            <div className="glass-card aspect-square flex items-center justify-center p-12">
               <span className="text-9xl opacity-20">📖</span>
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-4/5 h-4/5 border-2 border-dashed border-emerald-500/20 rounded-full animate-spin-slow" />
               </div>
            </div>
          </div>
        </div>

        <div className="bg-bg-secondary rounded-3xl p-12 text-center animate-fade-in">
          <h2 className="text-3xl font-bold mb-6">{t("about.historyTitle")}</h2>
          <p className="text-text-secondary text-lg max-w-4xl mx-auto leading-relaxed">
            {t("about.historyDesc")}
          </p>
        </div>
      </div>
    </div>
  )
}
