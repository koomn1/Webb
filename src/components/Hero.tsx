"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, ShieldCheck, Gift, Truck, ArrowLeft, Phone, Droplet } from "lucide-react";
import { asset } from "@/lib/paths";

export function Hero({ onOpenFinder }: { onOpenFinder: () => void }) {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-28 pb-16">
      {/* Background Hero Image with Deep Smoked Vignette */}
      <div className="absolute inset-0 z-0">
        <Image
          src={asset("/images/hero.webp")}
          alt="SÈN Parfums Zeste & Aura"
          fill
          priority
          className="object-cover object-center scale-105 opacity-50"
        />
        {/* Soft Vignette Overlay in Smoked Espresso */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0A] via-[#0C0B0A]/75 to-[#0C0B0A]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C0B0A] via-transparent to-[#0C0B0A]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C58652]/10 rounded-full blur-[160px] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Luxury Brand Monogram Ribbon */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-champagne text-[#F5E4D2] text-xs sm:text-[13px] font-medium mb-6 tracking-widest uppercase shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-[#E4C7A8]" strokeWidth={1.5} />
          <span>دار عطور نيش فرنسية • زيوت نقية 100% بتركيز Extrait de Parfum</span>
        </div>

        {/* Main Headline with Haute Parfumerie Copywriting */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-wide text-white leading-[1.12] mb-6">
          <span className="block text-[#E4C7A8] text-xs sm:text-sm font-sans tracking-[0.45em] uppercase mb-4 font-medium">
            SÈN HAUTE PARFUMERIE
          </span>
          أثرٌ عطريٌ <span className="champagne-gradient-text font-serif italic">يسبق حضورك</span>
        </h1>

        {/* Brand Narrative Copywriting */}
        <p className="max-w-2xl mx-auto text-[#ABA59C] text-sm sm:text-base md:text-lg leading-relaxed mb-8 font-light">
          حين تلتقي ندرة الزيوت الفرنسية بفلسفة الفخامة الهادئة. صغنا <strong className="text-white font-medium">Zeste للرجل</strong> بنفحات البرتقال الأحمر والسكر المكرمل، و <strong className="text-white font-medium">Aura للأنثى</strong> بعبير التفاح المخملي والمسك الأبيض. اختبر فخامة النيش أولاً في منزلك عبر عينتك المجانية مع كل زجاجة.
        </p>

        {/* Price & Guarantee Pill */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1C1A18]/90 border border-[#E4C7A8]/30 text-xs sm:text-sm font-medium text-[#ECE5DA] mb-10 shadow-xl">
          <Droplet className="w-4 h-4 text-[#C58652]" strokeWidth={1.75} />
          <span>50ml Eau de Parfum • <strong className="text-white font-serif text-base">650 ج.م</strong> • عينة 2ml مجانية للتجربة قبل فتح العبوة</span>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#products"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#E4C7A8] via-[#F5E4D2] to-[#C58652] text-[#0C0B0A] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_35px_rgba(228,199,168,0.35)] hover:scale-[1.02] flex items-center justify-center gap-2 group"
          >
            <span>استكشف التوقيع العطري</span>
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" strokeWidth={2} />
          </a>

          <a
            href="#bundle"
            className="w-full sm:w-auto px-8 py-4 rounded-full glass-luxury border border-[#E4C7A8]/30 text-[#F5E4D2] hover:text-white hover:border-[#E4C7A8] font-medium text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Gift className="w-4 h-4 text-[#E4C7A8]" strokeWidth={1.5} />
            <span>باقة الثنائي الملكية (خصم 150 ج.م + شحن مجاني)</span>
          </a>
        </div>

        {/* Trust & Prestige Value Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-[#25221F] text-start sm:text-center">
          <div className="flex items-center sm:justify-center gap-3 text-[#ABA59C]">
            <div className="w-10 h-10 rounded-xl bg-[#1C1A18] border border-[#E4C7A8]/20 flex items-center justify-center text-[#E4C7A8] shrink-0">
              <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-white">الضمان الحقيقي 100%</p>
              <p className="text-[#736D65]">عينة 2 مل مجانية مع كل زجاجة لتجربتها أولاً</p>
            </div>
          </div>

          <div className="flex items-center sm:justify-center gap-3 text-[#ABA59C]">
            <div className="w-10 h-10 rounded-xl bg-[#1C1A18] border border-[#E4C7A8]/20 flex items-center justify-center text-[#E4C7A8] shrink-0">
              <Truck className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-white">الدفع عند الاستلام (COD)</p>
              <p className="text-[#736D65]">ادفع فقط بعد استلام الشحنة ومعاينتها</p>
            </div>
          </div>

          <div className="flex items-center sm:justify-center gap-3 text-[#ABA59C]">
            <div className="w-10 h-10 rounded-xl bg-[#1C1A18] border border-[#E4C7A8]/20 flex items-center justify-center text-[#E4C7A8] shrink-0">
              <Phone className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-white">خدمة العملاء 01018995002</p>
              <p className="text-[#736D65]">فريق دار SÈN متواجد يومياً لمساعدتك</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
