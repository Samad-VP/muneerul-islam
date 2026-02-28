"use client"
import { useLanguage } from "@/context/LanguageContext"

const galleryItems = [
  { title: "Eid Celebration 2024", category: "Event", icon: "🌙" },
  { title: "Annual General Body", category: "Meeting", icon: "👥" },
  { title: "Education Awards", category: "Program", icon: "🎓" },
  { title: "Mosque Renovation", category: "Project", icon: "🏗️" },
  { title: "Ramadan Iftar", category: "Religious", icon: "🕌" },
  { title: "Healthcare Camp", category: "Social", icon: "🏥" },
  { title: "Madrasa Sports", category: "Sports", icon: "🏆" },
  { title: "Community Lunch", category: "Social", icon: "🍛" },
  { title: "Youth Seminar", category: "Education", icon: "💡" },
]

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
          {galleryItems.map((item, idx) => (
            <div 
              key={item.title} 
              className={`glass-card overflow-hidden group animate-fade-in stagger-${(idx % 4) + 1} flex flex-col hover:shadow-lg transition-shadow border border-border-color hover:border-emerald-500/30 w-full`}
            >
              <div className="aspect-square bg-bg-secondary flex items-center justify-center relative overflow-hidden w-full">
                <span className="text-6xl sm:text-7xl group-hover:scale-125 transition-transform duration-500 drop-shadow-md">{item.icon}</span>
                <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-5 sm:p-6 w-full">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-emerald-500 font-extrabold">{item.category}</span>
                <h3 className="text-base sm:text-lg font-extrabold text-text-primary mt-1.5 sm:mt-2">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
