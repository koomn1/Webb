"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Phone, Mail, ShieldCheck, Check, MessageCircle, LayoutDashboard } from "lucide-react";

export function Footer() {
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
    <footer className="bg-[#050507] border-t border-zinc-900 text-zinc-400 text-xs pt-16 pb-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Support & VIP Club Newsletter */}
        <div className="max-w-3xl mx-auto text-center mb-16 p-8 sm:p-10 rounded-2xl glass-gold border border-[#D4AF37]/30">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 text-[#D4AF37] text-[11px] font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>نادي SÈN الخاص • كود خصم ترحيبي</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl text-white mb-2">
            انضم لدائرة محبي العطور الفاخرة
          </h3>
          <p className="text-zinc-400 text-xs sm:text-sm font-light max-w-lg mx-auto mb-6">
            سجّل بريدك الإلكتروني للحصول على عروض حصرية على باقات SÈN Zeste و Aura وتجارب عطرية خاصة.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
              <div className="flex-1 text-start">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل بريدك الإلكتروني..."
                  className="w-full px-4 py-3 rounded-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:border-[#D4AF37] transition-colors"
                />
                {error && <span className="text-[11px] text-red-400 block mt-1 ps-2">{error}</span>}
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#AA820A] transition-colors shrink-0"
              >
                انضم الآن
              </button>
            </form>
          ) : (
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold text-xs animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>مرحباً بك في نادي SÈN Parfums الخاص.</span>
            </div>
          )}
        </div>

        {/* Brand & Support Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-zinc-900 text-start">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <span className="font-serif text-3xl tracking-[0.25em] font-normal uppercase text-white block mb-1">
              SÈN
            </span>
            <span className="text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase font-semibold block mb-4">
              Parfums
            </span>
            <p className="text-zinc-500 leading-relaxed font-light text-xs">
              دار عطور فاخرة مبنية على الفخامة الهادئة والزيوت النقية. عطور Zeste و Aura تُصاغ لِتَصنع حضورك الخالد في كافة المناسبات.
            </p>
          </div>

          {/* Quick Support Info (Requested Contact Details) */}
          <div>
            <h4 className="text-white font-medium text-xs uppercase tracking-widest mb-3">
              الدعم وخدمة العملاء
            </h4>
            <ul className="space-y-2.5 text-zinc-300">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href="tel:01018995002" className="hover:text-white font-mono font-bold">
                  01018995002
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/201018995002"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline font-mono"
                >
                  محادثة واتساب مباشرة
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href="mailto:youssefbadawy5002@gmail.com" className="hover:text-white font-mono text-[11px]">
                  youssefbadawy5002@gmail.com
                </a>
              </li>
              <li className="text-[11px] text-zinc-500 pt-1">
                خدمة العملاء متاحة طوال أيام الأسبوع من 9 ص حتى 11 م.
              </li>
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-white font-medium text-xs uppercase tracking-widest mb-3">
              منتجات SÈN
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <a href="#products" className="hover:text-[#D4AF37] transition-colors">
                  عطر SÈN Zeste (رجالي - 650 ج.م)
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-[#D4AF37] transition-colors">
                  عطر SÈN Aura (نسائي - 650 ج.م)
                </a>
              </li>
              <li>
                <a href="#bundle" className="hover:text-[#D4AF37] transition-colors">
                  باقة الثنائي Zeste & Aura (1,150 ج.م)
                </a>
              </li>
              <li>
                <a href="#guarantee" className="hover:text-[#D4AF37] transition-colors text-[#F3E5AB]">
                  عينة الضمان الذهبي (2ml مجاناً)
                </a>
              </li>
            </ul>
          </div>

          {/* Admin shortcut & Policies */}
          <div>
            <h4 className="text-white font-medium text-xs uppercase tracking-widest mb-3">
              إدارة المتجر والسياسات
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <Link
                  href="/admin/dashboard"
                  className="text-[#D4AF37] hover:underline flex items-center gap-1.5 font-semibold"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>لوحة تحكم السوبر أدمن</span>
                </Link>
              </li>
              <li>الدفع عند الاستلام فقط لجميع المحافظات</li>
              <li>شحن سريع ومؤمن لباب المنزل</li>
              <li>سياسة استرجاع مجانية بالضمان الذهبي</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© 2026 SÈN Parfums. جميع الحقوق محفوظة.</p>

          <div className="flex items-center gap-3 text-zinc-300">
            <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-[#F3E5AB]">
              💵 الدفع عند الاستلام فقط (Cash on Delivery)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
