"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Sparkles, Phone, Mail, ShieldCheck, Check, MessageCircle, LayoutDashboard } from "lucide-react";
import { appLink } from "@/lib/paths";

export function Footer() {
  const { isSuperAdmin } = useCart();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@") || email.length < 5) {
      setError("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }
    setError("");
    setSubscribed(true);
  };

  return (
    <footer className="bg-[#0C0B0A] border-t border-[#24201D] text-stone-400 text-xs pt-16 pb-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Support & VIP Circle Newsletter */}
        <div className="max-w-3xl mx-auto text-center mb-16 p-8 sm:p-10 rounded-3xl bg-[#161413] border border-[#C58652]/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-32 bg-[#C58652]/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0C0B0A] border border-[#C58652]/30 text-[#E4C7A8] text-[11px] font-medium uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C58652]" strokeWidth={1.5} />
            <span>دائرة SÈN الخاصة • امتيازات حصرية</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl text-white mb-2 font-medium">
            انضم لنخبة متذوقي العطور النيش
          </h3>
          <p className="text-stone-400 text-xs sm:text-sm font-light max-w-lg mx-auto mb-6 leading-relaxed">
            استقبل دعوات الإصدارات المحدودة وامتيازات خاصة على توليفات SÈN Zeste و Aura وتجارب عطرية خاصة تُصنع لك.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
              <div className="flex-1 text-start">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل بريدك الإلكتروني..."
                  className="w-full px-4 py-3 rounded-full bg-[#0C0B0A] border border-[#24201D] text-white placeholder-stone-500 text-xs focus:border-[#C58652] focus:outline-none transition-colors"
                />
                {error && <span className="text-[11px] text-rose-400 block mt-1 ps-3">{error}</span>}
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#E4C7A8] to-[#C58652] text-[#0C0B0A] font-semibold text-xs uppercase tracking-wider hover:brightness-105 transition-all shadow-md shrink-0"
              >
                انضم للدائرة
              </button>
            </form>
          ) : (
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#688A75]/15 border border-[#688A75]/40 text-[#8EBBA0] font-medium text-xs animate-fadeIn">
              <Check className="w-4 h-4" strokeWidth={2} />
              <span>مرحباً بك في دائرة SÈN Haute Parfumerie الخاصة.</span>
            </div>
          )}
        </div>

        {/* Brand & Support Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#24201D] text-start">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <span className="font-serif text-3xl tracking-[0.25em] font-light uppercase text-white block mb-0.5">
              SÈN
            </span>
            <span className="text-[10px] tracking-[0.3em] text-[#C58652] uppercase font-semibold block mb-4">
              HAUTE PARFUMERIE
            </span>
            <p className="text-stone-400 text-xs leading-relaxed mb-4 font-light">
              توليفات عطرية بتركيبات نيش فرنسية مبتكرة وزيوت نقية بتركيز 20%. ثبات استثنائي يتجاوز 14 ساعة مع ميثاق الثقة والأمان.
            </p>
          </div>

          {/* Support Contacts */}
          <div>
            <h4 className="text-white font-medium text-xs uppercase tracking-widest mb-3">
              خدمة العملاء والاستشارات
            </h4>
            <ul className="space-y-2.5 text-stone-400 font-light">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C58652] shrink-0" strokeWidth={1.5} />
                <a href="tel:01018995002" className="hover:text-white font-mono text-sm">
                  01018995002
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" strokeWidth={1.5} />
                <a
                  href="https://wa.me/201018995002"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white text-xs text-[#25D366]"
                >
                  استشارة واتساب مباشرة
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C58652] shrink-0" strokeWidth={1.5} />
                <a href="mailto:youssefbadawy5002@gmail.com" className="hover:text-white font-mono text-[11px]">
                  youssefbadawy5002@gmail.com
                </a>
              </li>
              <li className="text-[11px] text-stone-500 pt-1 font-light">
                فريق الاستشارات العطرية متواجد طوال أيام الأسبوع.
              </li>
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-white font-medium text-xs uppercase tracking-widest mb-3">
              التوليفات الحصرية
            </h4>
            <ul className="space-y-2 text-stone-400 font-light">
              <li>
                <Link href={appLink("/shop")} className="hover:text-[#E4C7A8] transition-colors">
                  عطر SÈN Zeste (رجالي - 650 ج.م)
                </Link>
              </li>
              <li>
                <Link href={appLink("/shop")} className="hover:text-[#E4C7A8] transition-colors">
                  عطر SÈN Aura (نسائي - 650 ج.م)
                </Link>
              </li>
              <li>
                <Link href={appLink("/shop")} className="hover:text-[#E4C7A8] transition-colors">
                  باقة الثنائي الملكية Zeste & Aura (1,150 ج.م)
                </Link>
              </li>
              <li>
                <Link href={appLink("/guarantee")} className="hover:text-[#E4C7A8] transition-colors text-[#E4C7A8]">
                  ميثاق الثقة والأمان (عينة 2ml مجاناً)
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin shortcut (Only Super Admin) & Policies */}
          <div>
            <h4 className="text-white font-medium text-xs uppercase tracking-widest mb-3">
              المعايير والسياسات
            </h4>
            <ul className="space-y-2 text-stone-400 font-light">
              {isSuperAdmin && (
                <li>
                  <Link
                    href={appLink("/admin/dashboard")}
                    className="text-[#E4C7A8] hover:underline flex items-center gap-1.5 font-medium"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#C58652]" />
                    <span>لوحة إدارة الدار (Super Admin)</span>
                  </Link>
                </li>
              )}
              <li>الدفع عند الاستلام والمعاينة لكافة المحافظات</li>
              <li>توصيل سريع ومؤمن بعناية فائقة</li>
              <li>ميثاق استرجاع مريح بعينة الـ 2ml المجانية</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-light">
          <p>© 2026 SÈN Haute Parfumerie. جميع الحقوق محفوظة.</p>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#161413] border border-[#24201D] text-xs font-medium text-[#E4C7A8]">
              الدفع عند الاستلام فقط (Cash on Delivery)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
