"use client";

import React from "react";
import Image from "next/image";
import { PERFUMES } from "@/data/perfumes";
import { useCart } from "@/context/CartContext";
import { Sparkles, ShoppingBag, Truck, Gift, ShieldCheck, Check } from "lucide-react";
import { asset } from "@/lib/paths";

export function DuoBundleSection({ onOrder }: { onOrder?: () => void }) {
  const { addToCart } = useCart();
  const duoProduct = PERFUMES.find((p) => p.id === "sen-duo-bundle") || PERFUMES[2];

  return (
    <section id="bundle" className="py-20 relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#C58652]/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-champagne rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-12 shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
          {/* Visual Side */}
          <div className="relative w-full lg:w-1/2 aspect-[3/2] max-w-[540px] rounded-2xl overflow-hidden border border-[#E4C7A8]/30 shadow-2xl group">
            <Image
              src={asset("/images/duo_bundle.webp")}
              alt="سين Duo Bundle (Zeste & Aura)"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#E4C7A8] to-[#C58652] text-[#0C0B0A] font-bold text-xs px-3.5 py-1.5 rounded-full shadow-lg">
              وفر 150 ج.م فوراً
            </div>
            <div className="absolute bottom-4 left-4 right-4 glass-luxury py-2.5 px-4 rounded-xl flex items-center justify-between text-xs text-[#ECE5DA]">
              <span className="text-[#F5E4D2] font-semibold">زجاجتان 50 مل (Zeste رجالي + Aura نسائي)</span>
              <span className="text-[#A5C2B0] font-bold">شحن مجاني لكافة المحافظات</span>
            </div>
          </div>

          {/* Copy & Value Proposition Side */}
          <div className="w-full lg:w-1/2 text-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1C1A18] border border-[#E4C7A8]/40 text-[#E4C7A8] text-xs font-semibold uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#E4C7A8]" strokeWidth={1.5} />
              <span>الثنائية الأرقى • سين</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal mb-4 leading-tight">
              تناغمٌ يكتمل <br />
              <span className="champagne-gradient-text italic font-serif">سين Zeste & Aura</span>
            </h2>

            <p className="text-sm sm:text-base text-[#ABA59C] font-light leading-relaxed mb-6">
              اقتنِ العطرين معاً بسعر ترويجي استثنائي: زجاجة سين Zeste الرجالية المنعشة بنفحات البرتقال الأحمر والسكر المكرمل، وزجاجة سين Aura النسائية الرقيقة بعبير التفاح السكري والمسك الأبيض، مع شحن مجاني وعينتين للضمان الذهبي.
            </p>

            {/* Feature Bullets */}
            <div className="space-y-3 mb-8 text-xs sm:text-sm text-[#ECE5DA]">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E4C7A8]/20 flex items-center justify-center text-[#E4C7A8] shrink-0 font-bold text-xs">
                  ✓
                </div>
                <span>عطر سين Zeste (50ml) + عطر سين Aura (50ml)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E4C7A8]/20 flex items-center justify-center text-[#E4C7A8] shrink-0 font-bold text-xs">
                  ✓
                </div>
                <span>عينتان تجريبيتان 2 مل مجاناً مع كل باقة (الضمان الذهبي الكامل)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E4C7A8]/20 flex items-center justify-center text-[#E4C7A8] shrink-0 font-bold text-xs">
                  ✓
                </div>
                <span className="text-[#A5C2B0] font-semibold">شحن مجاني وسريع لكافة محافظات مصر والدفع عند الاستلام</span>
              </div>
            </div>

            {/* Price & Buy Action */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 border-t border-[#25221F]">
              <div>
                <span className="text-xs text-[#736D65] line-through block">1,300 ج.م</span>
                <span className="font-serif text-3xl font-bold text-[#F5E4D2]">
                  1,150 ج.م
                </span>
                <span className="text-[11px] text-[#ABA59C] block">شامل الضريبة والشحن المجاني لباب بيتك</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  addToCart(duoProduct, 1);
                  onOrder?.();
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#E4C7A8] via-[#F5E4D2] to-[#C58652] text-[#0C0B0A] font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_35px_rgba(228,199,168,0.35)] transition-all flex items-center justify-center gap-2 group"
              >
                <ShoppingBag className="w-4 h-4" strokeWidth={1.75} />
                <span>اطلب باقة الثنائي الآن (الدفع عند الاستلام)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
