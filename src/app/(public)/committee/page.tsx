"use client"
import { User, Phone, Mail, ShieldCheck } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

const committeeMembers = [
  { name: "Ahmed Abdullah", role: "President", phone: "+91 98765 43210", email: "president@muneerulislam.org" },
  { name: "Mohammed Zakariya", role: "Secretary", phone: "+91 98765 43211", email: "secretary@muneerulislam.org" },
  { name: "Ibrahim Khalid", role: "Treasurer", phone: "+91 98765 43212", email: "treasurer@muneerulislam.org" },
  { name: "Yousuf Hasan", role: "Vice President", phone: "+91 98765 43213", email: "vp@muneerulislam.org" },
  { name: "Zaid Ali", role: "Joint Secretary", phone: "+91 98765 43214", email: "js@muneerulislam.org" },
  { name: "Omar Farooq", role: "Executive Member", phone: "+91 98765 43215", email: "member1@muneerulislam.org" },
]

export default function CommitteePage() {
  const { t } = useLanguage()

  return (
    <div className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
            <ShieldCheck size={14} />
            {t("committee.tag")}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Mahallu <span className="gradient-text">{t("committee.title").split("Mahallu ")[1] || "Committee"}</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {t("committee.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {committeeMembers.map((member, idx) => (
            <div 
              key={member.name} 
              className={`glass-card p-8 animate-fade-in stagger-${(idx % 3) + 1}`}
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                <User size={32} />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-1">{member.name}</h3>
              <p className="text-emerald-500 text-sm font-semibold mb-6">{member.role}</p>
              
              <div className="space-y-3 pt-6 border-t border-border-color">
                <div className="flex items-center gap-3 text-text-secondary">
                  <Phone size={14} />
                  <span className="text-xs">{member.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-text-secondary">
                  <Mail size={14} />
                  <span className="text-xs">{member.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 glass-card p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">{t("committee.electionTitle")}</h2>
            <p className="text-text-secondary max-w-3xl mx-auto">
                {t("committee.electionDesc")}
            </p>
        </div>
      </div>
    </div>
  )
}
