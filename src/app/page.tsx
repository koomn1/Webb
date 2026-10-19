"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { DuoBundleSection } from "@/components/DuoBundleSection";
import { GoldenGuaranteeSection } from "@/components/GoldenGuaranteeSection";
import { FragranceFinder } from "@/components/FragranceFinder";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { Footer } from "@/components/Footer";
import { PERFUMES } from "@/data/perfumes";
import {
  Sparkles,
  ShieldCheck,
  Truck,
  ArrowLeft,
  ShoppingBag,
  Award,
  Flame,
  Droplets,
  Star,
  Check,
} from "lucide-react";
import { asset, appLink } from "@/lib/paths";

export default function LandingPage() {
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#08080A] text-[#FCFBFA] selection:bg-[#D4AF37]/20 selection:text-[#F3E5AB]">
      {/* Navigation */}
      <Navbar onOpenFinder={() => setIsFinderOpen(true)} />

      {/* Hero Section */}
      <Hero onOpenFinder={() => setIsFinderOpen(true)} />

      {/* Brand Value Pillars */}
      <section className="py-12 border-y border-zinc-900 bg-[#0A0A0E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl glass-dark border border-zinc-800/60">
              <Award className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white mb-0.5">زيوت فرنسية أصلية</h4>
              <p className="text-[11px] text-zinc-400">تركيز 20% Extrait de Parfum</p>
            </div>
            <div className="p-4 rounded-2xl glass-dark border border-zinc-800/60">
              <ShieldCheck className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white mb-0.5">الضمان الذهبي</h4>
              <p className="text-[11px] text-zinc-400">عينة 2 مل مجانية مع كل زجاجة</p>
            </div>
            <div className="p-4 rounded-2xl glass-dark border border-zinc-800/60">
              <Truck className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white mb-0.5">الدفع عند الاستلام</h4>
              <p className="text-[11px] text-zinc-400">شحن سريع لكافة محافظات مصر</p>
            </div>
            <div className="p-4 rounded-2xl glass-dark border border-zinc-800/60">
              <Droplets className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white mb-0.5">ثبات يتجاوز 14 ساعة</h4>
              <p className="text-[11px] text-zinc-400">فوحان ملكي وحضور لا يُنسى</p>
            </div>
          </div>
        </div>
      </section>

      {/* Scent Icons Preview Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-semibold uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>التوقيع العطري الأيقوني</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              إبداعان يعيدان تعريف الفخامة
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              تمت صياغة كل قطرة بعناية فائقة لتمنحك تميزاً استثنائياً. اكتشف التناغم بين زيست للرجال وأورا للنساء.
            </p>
          </div>

          {/* Cards for Zeste & Aura */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {PERFUMES.slice(0, 2).map((perfume) => (
              <div
                key={perfume.id}
                className="glass-dark border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#D4AF37] transition-all group shadow-xl"
              >
                <div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-6 border border-zinc-800">
                    <Image
                      src={perfume.image}
                      alt={perfume.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#F3E5AB] border border-[#D4AF37]/30">
                      {perfume.genderAr}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-black text-white">{perfume.nameAr}</h3>
                    <div className="text-xl font-black text-[#D4AF37]">{perfume.price} ج.م</div>
                  </div>

                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-4">
                    {perfume.taglineAr}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {perfume.topNotes.slice(0, 2).concat(perfume.heartNotes.slice(0, 1)).map((n, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-zinc-900 text-zinc-300 text-[11px] border border-zinc-800"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={appLink("/shop")}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>اطلب الآن مع عينة التجربة</span>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href={appLink("/shop")}
              className="inline-flex items-center gap-2 text-sm text-[#F3E5AB] hover:text-white font-bold hover:underline"
            >
              <span>عرض التشكيلة الكاملة وباقة الثنائي الملكية</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Duo Bundle Section */}
      <DuoBundleSection />

      {/* Golden Guarantee Teaser */}
      <GoldenGuaranteeSection />

      {/* Brand Craftsmanship Story */}
      <section className="py-24 bg-gradient-to-b from-[#08080A] via-[#0E0E14] to-[#08080A] border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center mx-auto mb-6 border border-[#D4AF37]/30 text-2xl font-black">
            S
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            فلسفة دار <span className="text-gradient-gold">SÈN Parfums</span>
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-8">
            وُلدت دار SÈN لتقدم تجربة عطور النيش العالمية بأسعار عادلة ومباشرة للعميل دون وسطاء. نجمع بين أحدث تقنيات التقطير الفرنسية وأفخر الزيوت الطبيعية في زجاجات تعكس الهيبة والوقار.
          </p>
          <div className="inline-flex items-center gap-6 text-xs text-zinc-400">
            <span>صُنع بزيوت فرنسية 100%</span>
            <span>•</span>
            <span>دفع عند الاستلام فقط</span>
            <span>•</span>
            <span>ضمان استرجاع الأموال</span>
          </div>
        </div>
      </section>

      {/* Modals & Drawers */}
      <FragranceFinder
        isOpen={isFinderOpen}
        onClose={() => setIsFinderOpen(false)}
        onSelectPerfume={() => {}}
      />
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
