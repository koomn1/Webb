"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { ProductModal } from "@/components/ProductModal";
import { useCart } from "@/context/CartContext";
import { Perfume } from "@/data/perfumes";
import {
  Compass,
  Sparkles,
  ShoppingBag,
  Eye,
  ShieldCheck,
  ChevronLeft,
  Layers,
  ArrowRight,
  Flame,
} from "lucide-react";
import { asset, appLink } from "@/lib/paths";

export default function FinderPage() {
  const { products, addToCart } = useCart();
  const [selectedPerfumeId, setSelectedPerfumeId] = useState<string>("sen-zeste");
  const [activeTier, setActiveTier] = useState<"top" | "heart" | "base">("top");
  const [audience, setAudience] = useState<"men" | "women" | "both">("men");
  const [scentPreference, setScentPreference] = useState<"citrus" | "sweet">("citrus");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewPerfume, setQuickViewPerfume] = useState<Perfume | null>(null);

  const currentPerfume =
    products.find((p) => p.id === selectedPerfumeId) || products[0];

  const chooseAudience = (choice: "men" | "women" | "both") => {
    setAudience(choice);
    setSelectedPerfumeId(choice === "both" ? "sen-duo-bundle" : choice === "women" ? "sen-aura" : "sen-zeste");
  };

  const tierImages = {
    top: asset("/images/scent_top.webp"),
    heart: asset("/images/scent_heart.webp"),
    base: asset("/images/scent_base.webp"),
  };

  const tierMeta = {
    top: {
      name: "القمة العطرية (Notes de Tête)",
      timeframe: "الانطباع الأول",
      desc: "الانطباع الأول في التوليفة؛ تظهر فيه النوتات العليا المعلنة لكل عطر.",
    },
    heart: {
      name: "قلب العطر (Notes de Cœur)",
      timeframe: "وسط التكوين",
      desc: "النوتات التي تكوّن قلب كل عطر كما هو موضح في قائمته.",
    },
    base: {
      name: "القاعدة العطرية (Notes de Fond)",
      timeframe: "قاعدة التكوين",
      desc: "النوتات الأساسية في التوليفة؛ تختلف تجربة العطر وأثره من شخص إلى آخر.",
    },
  };

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-[#FAF8F5] selection:bg-[#C58652]/20 selection:text-[#E4C7A8]">
      <Navbar onOpenFinder={() => {}} />

      {/* Header */}
      <section className="pt-32 pb-14 text-center relative overflow-hidden">
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-[600px] h-[300px] bg-[#C58652]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161413] border border-[#C58652]/30 text-[#E4C7A8] text-xs font-medium uppercase tracking-widest mb-4">
            <Compass className="w-3.5 h-3.5 text-[#C58652]" strokeWidth={1.5} />
            <span>المستشار العطري التفاعلي • سين</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-white mb-4">
            اكتشف العطر <span className="champagne-gradient-text italic font-serif">الأنسب لذوقك</span>
          </h1>
          <p className="text-stone-400 text-xs sm:text-base font-light max-w-2xl mx-auto leading-relaxed">
            أجب عن سؤالين عن لمن العطر وما إذا كنت تفضّل الحمضيات أو النوتات الحلوة، ثم استكشف الهرم العطري للتوليفة المقترحة.
          </p>

          <div className="mt-8 mx-auto max-w-3xl rounded-2xl border border-[#24201D] bg-[#161413]/90 p-5 text-start">
            <p className="text-xs font-medium text-[#E4C7A8] mb-2">1. لمن تبحث عن العطر؟</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {[
                { id: "men" as const, label: "رجالي" },
                { id: "women" as const, label: "نسائي" },
                { id: "both" as const, label: "العطران معاً" },
              ].map((option) => (
                <button key={option.id} type="button" aria-pressed={audience === option.id} onClick={() => chooseAudience(option.id)} className={`rounded-full border px-4 py-2 text-xs transition-colors ${audience === option.id ? "border-[#C58652] bg-[#C58652]/15 text-[#E4C7A8]" : "border-[#302C28] text-stone-300 hover:border-[#C58652]/50"}`}>
                  {option.label}
                </button>
              ))}
            </div>
            <p className="text-xs font-medium text-[#E4C7A8] mb-2">2. أي اتجاه عطري تفضّل؟</p>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "citrus" as const, label: "حمضي ومنعش" },
                { id: "sweet" as const, label: "حلو وناعم" },
              ].map((option) => (
                <button key={option.id} type="button" aria-pressed={scentPreference === option.id} onClick={() => setScentPreference(option.id)} className={`rounded-full border px-4 py-2 text-xs transition-colors ${scentPreference === option.id ? "border-[#C58652] bg-[#C58652]/15 text-[#E4C7A8]" : "border-[#302C28] text-stone-300 hover:border-[#C58652]/50"}`}>
                  {option.label}
                </button>
              ))}
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-stone-400" aria-live="polite">
              الاقتراح الحالي: <span className="text-stone-200">{currentPerfume.nameAr}</span> — {scentPreference === "citrus" ? `نوتات الافتتاحية: ${currentPerfume.topNotes.join("، ")}` : `نوتات القلب: ${currentPerfume.heartNotes.join("، ")}`}.
            </p>
          </div>

          {/* Fragrance Selector Switch */}
          <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-[#161413] border border-[#24201D] shadow-xl">
            {products.slice(0, 3).map((p) => (
              <button
                key={p.id}
                type="button"
              onClick={() => chooseAudience(p.gender === "Duo" ? "both" : p.gender === "Femme" ? "women" : "men")}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 ${
                  selectedPerfumeId === p.id
                    ? "bg-gradient-to-r from-[#E4C7A8] to-[#C58652] text-[#0C0B0A] font-semibold shadow-md"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                {p.nameAr}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Olfactory Pyramid Section with Real Unused Photography */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#161413] border border-[#C58652]/30 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {/* Visual Interactive Image Container */}
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#24201D] bg-[#0C0B0A] shadow-2xl">
            <Image
              src={tierImages[activeTier]}
              alt={tierMeta[activeTier].name}
              fill
              priority
              className="object-cover transition-all duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0A]/90 via-transparent to-black/30 pointer-events-none" />

            {/* Floating Tier Indicator */}
            <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-[#0C0B0A]/85 backdrop-blur-md border border-[#C58652]/40 text-[#E4C7A8] text-xs font-medium">
              {tierMeta[activeTier].name}
            </div>

            <div className="absolute bottom-4 left-4 right-4 glass-champagne p-3 rounded-xl text-xs text-stone-300 flex items-center justify-between">
              <span className="text-stone-400 font-light">دور المرحلة:</span>
              <span className="text-[#E4C7A8] font-medium">{tierMeta[activeTier].timeframe}</span>
            </div>
          </div>

          {/* Interactive Tier Tabs & Note Dissection */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs text-[#C58652] font-semibold tracking-wider uppercase block mb-1">
                {currentPerfume.genderAr} • {currentPerfume.concentration}
              </span>
              <h2 className="font-serif text-3xl text-white font-medium mb-2">
                {currentPerfume.nameAr}
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 font-light italic mb-6">
                {currentPerfume.taglineAr}
              </p>
            </div>

            {/* Pyramid Level Selectors (Interactive 3 Tiers) */}
            <div className="space-y-3">
              {[
                { id: "top", label: "القمة العطرية (Top)", count: currentPerfume.topNotes.length, notes: currentPerfume.topNotes },
                { id: "heart", label: "قلب العطر (Heart)", count: currentPerfume.heartNotes.length, notes: currentPerfume.heartNotes },
                { id: "base", label: "القاعدة العطرية (Base)", count: currentPerfume.baseNotes.length, notes: currentPerfume.baseNotes },
              ].map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => setActiveTier(tier.id as "top" | "heart" | "base")}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    activeTier === tier.id
                      ? "bg-[#0C0B0A] border-[#C58652] shadow-[0_0_25px_rgba(197,134,82,0.15)]"
                      : "bg-[#161413]/70 border-[#24201D] hover:border-[#38332E]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-white flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          activeTier === tier.id ? "bg-[#C58652] animate-pulse" : "bg-stone-600"
                        }`}
                      />
                      {tier.label}
                    </span>
                    <span className="text-[11px] text-stone-500 font-mono">
                      {tier.count} نغمات نقية
                    </span>
                  </div>

                  {activeTier === tier.id && (
                    <div className="pt-2 border-t border-[#24201D] mt-2 animate-fadeIn">
                      <p className="text-[11px] text-stone-400 font-light mb-3 leading-relaxed">
                        {tierMeta[activeTier].desc}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {tier.notes.map((n, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-lg bg-[#161413] border border-[#24201D] text-xs font-light text-[#E4C7A8]"
                          >
                            • {n}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Performance Indicators */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#0C0B0A] border border-[#24201D] text-xs">
              <div>
                <span className="text-stone-500 block mb-0.5">مدى الفوحان:</span>
                <span className="text-stone-200 font-medium">{currentPerfume.sillage}</span>
              </div>
              <div>
                <span className="text-stone-500 block mb-0.5">مدة الأثر:</span>
                <span className="text-stone-200 font-medium">{currentPerfume.longevity}</span>
              </div>
            </div>

            {/* Price & Order Action */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#24201D]">
              <div>
                <div className="text-[11px] text-stone-400 font-light">القيمة (شامل عينة التجربة):</div>
                <div className="font-serif text-2xl font-medium text-[#E4C7A8]">
                  {currentPerfume.price.toLocaleString()} ج.م
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setQuickViewPerfume(currentPerfume)}
                  className="px-4 py-3 rounded-xl border border-[#24201D] hover:border-[#C58652]/50 text-stone-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>تفاصيل</span>
                </button>
                <button
                  type="button"
                  onClick={() => addToCart(currentPerfume, 1)}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#E4C7A8] via-[#D8B28C] to-[#C58652] text-[#0C0B0A] text-xs font-semibold hover:shadow-[0_0_25px_rgba(197,134,82,0.35)] transition-all flex items-center gap-2 shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                  <span>أضف إلى السلة</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals & Cart */}
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      <ProductModal perfume={quickViewPerfume} onClose={() => setQuickViewPerfume(null)} />

      <Footer />
    </div>
  );
}
