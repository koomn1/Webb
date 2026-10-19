"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, ShieldCheck, Gift, Truck, ArrowLeft, Phone } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function Hero({ onOpenFinder }: { onOpenFinder: () => void }) {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-28 pb-16">
      {/* Background Hero Image with Deep Vignette */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.webp"
          alt="SÈN Parfums Zeste"
          fill
          priority
          className="object-cover object-center scale-105 opacity-60"
        />
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/70 to-[#08080A]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080A] via-transparent to-[#08080A]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle Brand Ribbon */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold text-[#F3E5AB] text-xs sm:text-sm font-medium mb-6 tracking-widest uppercase animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>عطور نيش مصرية بمقاييس الفخامة الهادئة • 20% تركيز زيوت نقية</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-wide text-white leading-[1.15] mb-6">
          <span className="block text-zinc-300 text-lg sm:text-2xl font-sans tracking-[0.3em] uppercase mb-3">
            SÈN PARFUMS
          </span>
          عطورٌ تُصاغ لِتَصنع <span className="gold-gradient-text font-serif italic">حضورك الخالد</span>
        </h1>

        {/* Brand Mission Description */}
        <p className="max-w-2xl mx-auto text-zinc-300/90 text-sm sm:text-base md:text-lg leading-relaxed mb-8 font-light">
          نجمع بين انتعاش الحمضيات الإيطالية ورقة الزهور البيضاء في زجاجات مصقولة بتركيز <strong className="text-white font-semibold">Eau de Parfum (50ml)</strong>. تذوق فخامة <span className="text-[#F3E5AB]">Zeste الرجالي</span> وسحر <span className="text-[#F3E5AB]">Aura النسائي</span> مع ضمان استرجاع ذهبي كامل.
        </p>

        {/* Pricing tag */}
        <div className="inline-block px-5 py-2 rounded-xl bg-zinc-900/90 border border-[#D4AF37]/40 text-xs sm:text-sm font-medium text-zinc-300 mb-10 shadow-lg">
          سعر الزجاجة: <span className="text-lg font-bold text-[#F3E5AB] font-serif">650 ج.م</span> فقط • الدفع عند الاستلام بعد التجربة
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#products"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-semibold text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-[1.02] flex items-center justify-center gap-2 group"
          >
            <span>استكشف عطور SÈN</span>
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </a>

          <a
            href="#bundle"
            className="w-full sm:w-auto px-8 py-4 rounded-full glass-luxury border border-[#D4AF37]/40 text-[#F3E5AB] hover:text-white hover:border-[#D4AF37] font-medium text-sm tracking-wider uppercase transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Gift className="w-4 h-4 text-[#D4AF37]" />
            <span>باقة العطرين (خصم 150 ج.م + شحن مجاني)</span>
          </a>
        </div>

        {/* Trust & Prestige Value Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-zinc-800/80 text-start sm:text-center">
          <div className="flex items-center sm:justify-center gap-3 text-zinc-400">
            <div className="w-9 h-9 rounded-full bg-zinc-900 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-zinc-200">الضمان الذهبي 100%</p>
              <p className="text-zinc-500">عينة 2 مل مجانية مع كل زجاجة لتجربتها أولاً</p>
            </div>
          </div>

          <div className="flex items-center sm:justify-center gap-3 text-zinc-400">
            <div className="w-9 h-9 rounded-full bg-zinc-900 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-zinc-200">الدفع عند الاستلام</p>
              <p className="text-zinc-500">ادفع فقط بعد استلام الشحنة ومعاينتها</p>
            </div>
          </div>

          <div className="flex items-center sm:justify-center gap-3 text-zinc-400">
            <div className="w-9 h-9 rounded-full bg-zinc-900 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-zinc-200">دعم مباشر 01018995002</p>
              <p className="text-zinc-500">فريق خدمة العملاء متواجد للمساعدة</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
