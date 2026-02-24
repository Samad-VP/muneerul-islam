"use client"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

export default function ContactPage() {
  const { t } = useLanguage()

  return (
    <div className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t("contact.title").split(" Touch")[0]} <span className="gradient-text">{t("contact.title").split("Get in ")[1] || "Touch"}</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="animate-slide-in stagger-1">
            <h2 className="text-3xl font-bold mb-8">{t("contact.infoTitle")}</h2>
            <p className="text-text-secondary mb-12 text-lg">
              {t("contact.infoDesc")}
            </p>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                  <MapPin size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">{t("contact.locationTitle")}</h4>
                  <p className="text-text-secondary leading-relaxed">
                    Muneerul Islam Mahallu Committee<br />
                    Near Juma Masjid, Main Road, Kerala, India
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                  <Mail size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">{t("contact.emailTitle")}</h4>
                  <p className="text-text-secondary">
                    info@muneerulislam.org<br />
                    committee@muneerulislam.org
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                  <Phone size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">{t("contact.phoneTitle")}</h4>
                  <p className="text-text-secondary">
                    +91 123 456 7890<br />
                    +91 987 654 3210
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-fade-in stagger-2">
            <div className="glass-card p-10">
              <h3 className="text-2xl font-bold mb-8">{t("contact.formTitle")}</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t("contact.fullName")}</label>
                    <input type="text" className="input-field py-4" placeholder="Enter your name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t("contact.emailLabel")}</label>
                    <input type="email" className="input-field py-4" placeholder="Enter your email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t("contact.subject")}</label>
                  <input type="text" className="input-field py-4" placeholder="How can we help?" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t("contact.message")}</label>
                  <textarea className="input-field py-4 min-h-[150px] resize-none" placeholder="Your message here..."></textarea>
                </div>
                <button type="button" className="btn-primary w-full justify-center py-4 text-base">
                  {t("contact.send")} <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
