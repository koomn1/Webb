"use client";

import React from "react";
import Image from "next/image";
import { PERFUMES } from "@/data/perfumes";
import { useCart } from "@/context/CartContext";
import { Sparkles, ShoppingBag, Truck, Gift, ShieldCheck, Check } from "lucide-react";
import { asset } from "@/lib/paths";

export function DuoBundleSection() {
  const { addToCart } = useCart();
  const duoProduct = PERFUMES.find((p) => p.id === "sen-duo-bundle") || PERFUMES[2];

  return (
    <section id="bundle" className="py-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#D4AF37]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-gold border border-[#D4AF37]/40 rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          {/* Visual Side */}
          <div className="relative w-full lg:w-1/2 aspect-[3/2] max-w-[540px] rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl group">
            <Image
              src={asset("/images/duo_bundle.webp")}
              alt="SÈN Duo Bundle (Zeste & Aura)"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-4 right-4 bg-[#D4AF37] text-black font-bold text-xs px-3.5 py-1.5 rounded-full shadow-lg">
              وفر 150 ج.م فوراً
            </div>
            <div className="absolute bottom-4 left-4 right-4 glass-luxury py-2 px-4 rounded-xl flex items-center justify-between text-xs text-zinc-300">
              <span className="text-[#F3E5AB] font-semibold">زجاجتان 50 مل (زيست الرجالي + أورا النسائي)</span>
              <span className="text-emerald-400 font-bold">شحن مجاني لكافة المحافظات</span>
            </div>
          </div>

          {/* Copy & Value Proposition Side */}
          <div className="w-full lg:w-1/2 text-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F3E5AB] text-xs font-semibold uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>العرض الأكثر توفيراً وتميزاً</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal mb-4 leading-tight">
              باقة الثنائي الملكية <br />
              <span className="gold-gradient-text italic font-serif">SÈN Zeste & Aura</span>
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed mb-6">
              اقتنِ العطرين معاً بسعر ترويجي استثنائي: زجاجة SÈN Zeste الرجالية المنعشة بنفحات البرتقال الأحمر والسكر المكرمل، وزجاجة SÈN Aura النسائية الرقيقة بعبير التفاح السكري والمسك الأبيض، مع شحن مجاني وعينتين للضمان الذهبي.
            </p>

            {/* Feature Bullets */}
            <div className="space-y-3 mb-8 text-xs sm:text-sm text-zinc-300">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0 font-bold">
                  ✓
                </div>
                <span>عطر SÈN Zeste (50ml) + عطر SÈN Aura (50ml)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0 font-bold">
                  ✓
                </div>
                <span>عينتان تجريبيتان 2 مل مجاناً مع كل باقة (الضمان الذهبي)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0 font-bold">
                  ✓
                </div>
                <span className="text-emerald-400 font-semibold">شحن مجاني وسريع لكافة محافظات مصر والدفع عند الاستلام</span>
              </div>
            </div>

            {/* Price & Buy Action */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 border-t border-zinc-800">
              <div>
                <span className="text-xs text-zinc-400 line-through block">1,300 ج.م</span>
                <span className="font-serif text-3xl font-bold text-[#F3E5AB]">
                  1,150 ج.م
                </span>
                <span className="text-[11px] text-zinc-500 block">شامل الضريبة والشحن المجاني</span>
              </div>

              <button
                type="button"
                onClick={() => addToCart(duoProduct, 1)}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 group"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>اطلب باقة الثنائي الآن (الدفع عند الاستلام)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
