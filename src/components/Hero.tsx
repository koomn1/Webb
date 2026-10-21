"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck, Gift, Truck, ArrowLeft, Phone, Droplet, Compass } from "lucide-react";
import { asset, appLink } from "@/lib/paths";

export function Hero({ onOpenFinder }: { onOpenFinder?: () => void }) {
  return (
    <section className="relative min-h-[94vh] flex items-center justify-center overflow-hidden pt-28 pb-16">
      {/* Background Hero Image with Deep Smoked Vignette */}
      <div className="absolute inset-0 z-0">
        <Image
          src={asset("/images/hero.webp")}
          alt="SÈN Haute Parfumerie Zeste & Aura"
          fill
          priority
          className="object-cover object-center scale-105 opacity-45"
        />
        {/* Soft Vignette Overlay in Smoked Espresso */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0A] via-[#0C0B0A]/80 to-[#0C0B0A]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C0B0A] via-transparent to-[#0C0B0A]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#C58652]/10 rounded-full blur-[160px] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-2 sm:pt-4">
        {/* Luxury Brand Monogram Ribbon */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-champagne text-[#F5E4D2] text-xs sm:text-[13px] font-medium mb-6 tracking-widest uppercase shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-[#E4C7A8]" strokeWidth={1.5} />
          <span>دار عطور نيش باريسية • Eau de Parfum Intense بتركيز 20%</span>
        </div>

        {/* Main Headline with Haute Parfumerie Copywriting */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-wide text-white leading-[1.15] mb-6">
          <span className="block text-[#E4C7A8] text-xs sm:text-sm font-sans tracking-[0.45em] uppercase mb-4 font-medium">
            SÈN HAUTE PARFUMERIE • PARIS
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
          <span>50ml Eau de Parfum Intense • تركيز 20% • <strong className="text-white font-serif text-base">650 ج.م</strong> • عينة 2ml مجانية للتجربة قبل فتح العبوة</span>
        </div>

        {/* Action CTAs Linking to Dedicated Independent Pages */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href={appLink("/shop")}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#E4C7A8] via-[#F5E4D2] to-[#C58652] text-[#0C0B0A] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_35px_rgba(228,199,168,0.35)] hover:scale-[1.02] flex items-center justify-center gap-2 group"
          >
            <span>استكشف تشكيلة العطور</span>
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" strokeWidth={2} />
          </Link>

          <Link
            href={appLink("/duo")}
            className="w-full sm:w-auto px-8 py-4 rounded-full glass-luxury border border-[#E4C7A8]/30 text-[#F5E4D2] hover:text-white hover:border-[#E4C7A8] font-medium text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Gift className="w-4 h-4 text-[#E4C7A8]" strokeWidth={1.5} />
            <span>باقة الثنائي الملكية (وفر 150 ج.م + شحن مجاني)</span>
          </Link>

          <Link
            href={appLink("/finder")}
            className="w-full sm:w-auto px-6 py-4 rounded-full bg-[#161413] border border-[#24201D] hover:border-[#C58652]/40 text-stone-300 hover:text-white font-medium text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-[#C58652]" strokeWidth={1.5} />
            <span>المستشار العطري</span>
          </Link>
        </div>

        {/* Trust & Prestige Value Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-[#25221F] text-start sm:text-center">
          <div className="flex items-center sm:justify-center gap-3 text-[#ABA59C]">
            <div className="w-10 h-10 rounded-xl bg-[#1C1A18] border border-[#E4C7A8]/20 flex items-center justify-center text-[#E4C7A8] shrink-0">
              <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-white">ميثاق الثقة 100%</p>
              <p className="text-[#736D65]">عينة 2 مل مجانية مع كل زجاجة لتجربتها أولاً</p>
            </div>
          </div>

          <div className="flex items-center sm:justify-center gap-3 text-[#ABA59C]">
            <div className="w-10 h-10 rounded-xl bg-[#1C1A18] border border-[#E4C7A8]/20 flex items-center justify-center text-[#E4C7A8] shrink-0">
              <Truck className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-white">الدفع عند الاستلام والمعاينة</p>
              <p className="text-[#736D65]">ادفع فقط بعد استلام الشحنة وفحصها</p>
            </div>
          </div>

          <div className="flex items-center sm:justify-center gap-3 text-[#ABA59C]">
            <div className="w-10 h-10 rounded-xl bg-[#1C1A18] border border-[#E4C7A8]/20 flex items-center justify-center text-[#E4C7A8] shrink-0">
              <Phone className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-white">استشارات 01018995002</p>
              <p className="text-[#736D65]">فريق دار SÈN متواجد يومياً لمساعدتك</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
