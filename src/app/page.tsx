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
import { CustomerFeedbackInvitation } from "@/components/CustomerFeedbackInvitation";
import { PERFUMES } from "@/data/perfumes";
import { useCart } from "@/context/CartContext";
import {
  Sparkles,
  ShieldCheck,
  Truck,
  ArrowLeft,
  ShoppingBag,
  Award,
  Droplets,
  Compass,
} from "lucide-react";
import { appLink } from "@/lib/paths";

export default function LandingPage() {
  const { products } = useCart();
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const displayProducts = products && products.length > 0 ? products : PERFUMES;

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-[#FAF8F5] selection:bg-[#C58652]/20 selection:text-[#E4C7A8]">
      {/* Navigation */}
      <Navbar onOpenFinder={() => setIsFinderOpen(true)} />

      {/* Hero Section */}
      <Hero onOpenFinder={() => setIsFinderOpen(true)} />

      {/* Brand Value Pillars */}
      <section className="py-12 border-y border-[#24201D] bg-[#161413]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#161413] border border-[#24201D] hover:border-[#C58652]/30 transition-colors">
              <Award className="w-5 h-5 text-[#C58652] mx-auto mb-2.5" strokeWidth={1.5} />
              <h4 className="text-xs sm:text-sm font-medium text-white mb-0.5">زيوت نيش فرنسية</h4>
              <p className="text-[11px] text-stone-400 font-light">Eau de Parfum Intense • تركيز 20%</p>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-[#161413] border border-[#24201D] hover:border-[#C58652]/30 transition-colors">
              <ShieldCheck className="w-5 h-5 text-[#8EBBA0] mx-auto mb-2.5" strokeWidth={1.5} />
              <h4 className="text-xs sm:text-sm font-medium text-white mb-0.5">ميثاق الثقة والأمان</h4>
              <p className="text-[11px] text-stone-400 font-light">عينة 2ml مجانية قبل فتح الزجاجة</p>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-[#161413] border border-[#24201D] hover:border-[#C58652]/30 transition-colors">
              <Truck className="w-5 h-5 text-[#C58652] mx-auto mb-2.5" strokeWidth={1.5} />
              <h4 className="text-xs sm:text-sm font-medium text-white mb-0.5">الدفع عند الاستلام</h4>
              <p className="text-[11px] text-stone-400 font-light">توصيل سريع لكافة المحافظات</p>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-[#161413] border border-[#24201D] hover:border-[#C58652]/30 transition-colors">
              <Droplets className="w-5 h-5 text-[#E4C7A8] mx-auto mb-2.5" strokeWidth={1.5} />
              <h4 className="text-xs sm:text-sm font-medium text-white mb-0.5">أثر عطري متوازن</h4>
              <p className="text-[11px] text-stone-400 font-light">أثر عطري مميز وثابت طوال اليوم</p>
            </div>
          </div>
        </div>
      </section>

      {/* Scent Icons Preview Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161413] border border-[#C58652]/30 text-[#E4C7A8] text-xs font-medium uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#C58652]" strokeWidth={1.5} />
              <span>التوقيع العطري الخاص • سين</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-medium text-white tracking-tight mb-4">
              إبداعان يعيدان صياغة التميز
            </h2>
            <p className="text-stone-400 text-xs sm:text-base leading-relaxed font-light">
              صيغت كل قطرة بعناية لتروي فصلاً في حكاية حضورك. اكتشف التباين الآسر بين سطوة Zeste وانسيابية Aura.
            </p>
          </div>

          {/* Cards for Fragrances */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {displayProducts
              .filter((p) => !p.id.includes("bundle") && !p.id.includes("duo"))
              .slice(0, 4)
              .map((perfume) => {
                const isZeste = perfume.id.includes("zeste");
                return (
                  <div
                    key={perfume.id}
                    className="bg-[#161413] border border-[#24201D] hover:border-[#C58652]/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all group shadow-xl"
                  >
                    <div>
                      <div className="relative aspect-square rounded-2xl overflow-hidden mb-6 border border-[#24201D] bg-[#0C0B0A]">
                        <Image
                          src={perfume.image}
                          alt={perfume.name}
                          fill
                          unoptimized={perfume.image?.startsWith("data:") || perfume.image?.startsWith("http")}
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div
                          className={`absolute top-4 right-4 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border ${
                            isZeste
                              ? "bg-[#688A75]/20 text-[#8EBBA0] border-[#688A75]/40"
                              : "bg-[#A86E85]/20 text-[#D19BB0] border-[#A86E85]/40"
                          }`}
                        >
                          {perfume.genderAr}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-serif text-2xl font-medium text-white">{perfume.nameAr}</h3>
                        <div className="text-left">
                          <div className="font-serif text-xl font-medium text-[#E4C7A8]">{perfume.price} ج.م</div>
                        </div>
                      </div>

                    <p className="text-stone-400 text-xs sm:text-sm leading-relaxed mb-4 font-light">
                      {perfume.taglineAr}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {perfume.topNotes.slice(0, 2).concat(perfume.heartNotes.slice(0, 1)).map((n, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md bg-[#0C0B0A] text-stone-300 text-[11px] border border-[#24201D] font-light"
                        >
                          • {n}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={appLink("/shop")}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E4C7A8] via-[#D8B28C] to-[#C58652] text-[#0C0B0A] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(197,134,82,0.35)] transition-all shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                    <span>اقتنِ العطر مع عينة الاختبار 2ml</span>
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              href={appLink("/shop")}
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#E4C7A8] hover:text-white font-medium hover:underline transition-colors"
            >
              <span>استكشف التوليفات الكاملة وباقة الثنائي الملكية</span>
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      {/* Duo Bundle Section */}
      <DuoBundleSection onOrder={() => setIsCheckoutOpen(true)} />

      {/* Golden Guarantee Teaser */}
      <GoldenGuaranteeSection />

      {/* Invite real customer feedback; never render fabricated testimonials. */}
      <CustomerFeedbackInvitation />

      {/* Brand Craftsmanship Story */}
      <section className="py-24 bg-gradient-to-b from-[#0C0B0A] via-[#161413] to-[#0C0B0A] border-t border-[#24201D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-white mb-6">
            رؤية دار <span className="champagne-gradient-text">سين</span>
          </h2>
          <p className="text-stone-300 text-xs sm:text-base leading-relaxed mb-8 font-light">
            تأسست دار سين لتقديم تجربة عطور نيش مستوحاة من مدارس العطور الفرنسية الفاخرة مباشرة لعشاق التميز، مع الحفاظ على أعلى معايير الجودة والنقاء دون وسائط تجارية. نبتكر توليفات نادرة بزجاجات تعكس الوقار والهيبة والأثر المستمر.
          </p>
          <div className="inline-flex items-center gap-6 text-xs text-stone-400 font-light">
            <span>تركيبات عطرية بتركيز 20%</span>
            <span className="text-[#C58652]">•</span>
            <span>الدفع عند الاستلام</span>
            <span className="text-[#C58652]">•</span>
            <span>ميثاق استرداد كامل بالضمان</span>
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
