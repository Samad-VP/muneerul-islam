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
    <div className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t("gallery.title").split(" Gallery")[0]} <span className="gradient-text">{t("gallery.title").split("Visual ")[1] || "Gallery"}</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {t("gallery.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {galleryItems.map((item, idx) => (
            <div 
              key={item.title} 
              className={`glass-card overflow-hidden group animate-fade-in stagger-${(idx % 4) + 1}`}
            >
              <div className="aspect-square bg-bg-secondary flex items-center justify-center relative overflow-hidden">
                <span className="text-7xl group-hover:scale-125 transition-transform duration-500">{item.icon}</span>
                <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-6">
                <span className="text-[10px] uppercase tracking-wider text-emerald-500 font-bold">{item.category}</span>
                <h3 className="text-lg font-bold text-text-primary mt-1">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
