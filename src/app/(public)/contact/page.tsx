"use client"
import { PiEnvelopeDuotone, PiPhoneCallDuotone, PiMapPinDuotone, PiPaperPlaneRightBold } from "react-icons/pi"
import { useLanguage } from "@/context/LanguageContext"

export default function ContactPage() {
  const { t } = useLanguage()

  return (
    <div className="py-16 sm:py-24 md:py-32 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center mb-16 sm:mb-20 animate-fade-in w-full">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 sm:mb-6">
            {t("contact.title").split(" Touch")[0]} <span className="gradient-text">{t("contact.title").split("Get in ")[1] || "Touch"}</span>
          </h1>
          <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-0">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 w-full">
          {/* Contact Info */}
          <div className="animate-slide-in stagger-1 w-full text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8">{t("contact.infoTitle")}</h2>
            <p className="text-text-secondary mb-10 sm:mb-12 text-base sm:text-lg">
              {t("contact.infoDesc")}
            </p>

            <div className="space-y-6 sm:space-y-8 uppercase tracking-wide">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                  <PiMapPinDuotone size={28} />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="font-bold text-base sm:text-lg mb-1">{t("contact.locationTitle")}</h4>
                  <p className="text-text-secondary leading-relaxed text-sm sm:text-base normal-case">
                    Muneerul Islam Mahallu Committee<br />
                    Near Juma Masjid, Main Road, Kerala, India
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                  <PiEnvelopeDuotone size={28} />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="font-bold text-base sm:text-lg mb-1">{t("contact.emailTitle")}</h4>
                  <p className="text-text-secondary text-sm sm:text-base normal-case">
                    info@muneerulislam.org<br />
                    committee@muneerulislam.org
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                  <PiPhoneCallDuotone size={28} />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="font-bold text-base sm:text-lg mb-1">{t("contact.phoneTitle")}</h4>
                  <p className="text-text-secondary text-sm sm:text-base normal-case">
                    +91 123 456 7890<br />
                    +91 987 654 3210
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-fade-in stagger-2 w-full">
            <div className="glass-card p-6 sm:p-10 w-full">
              <h3 className="text-xl sm:text-2xl font-extrabold mb-6 sm:mb-8 text-center sm:text-left">{t("contact.formTitle")}</h3>
              <form className="space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t("contact.fullName")}</label>
                    <input type="text" className="input-field py-3.5 sm:py-4 w-full" placeholder="Enter your name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t("contact.emailLabel")}</label>
                    <input type="email" className="input-field py-3.5 sm:py-4 w-full" placeholder="Enter your email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t("contact.subject")}</label>
                  <input type="text" className="input-field py-3.5 sm:py-4 w-full" placeholder="How can we help?" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t("contact.message")}</label>
                  <textarea className="input-field py-3.5 sm:py-4 min-h-[120px] sm:min-h-[150px] resize-none w-full" placeholder="Your message here..."></textarea>
                </div>
                <button type="button" className="btn-primary w-full justify-center py-3.5 sm:py-4 text-sm sm:text-base">
                  {t("contact.send")} <PiPaperPlaneRightBold size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
