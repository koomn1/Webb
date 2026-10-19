"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PERFUMES, Perfume } from "@/data/perfumes";
import { useCart } from "@/context/CartContext";
import { Sparkles, X, ShoppingBag, Eye, ShieldCheck, Compass } from "lucide-react";

interface FragranceFinderProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPerfume: (perfume: Perfume) => void;
}

export function FragranceFinder({ isOpen, onClose, onSelectPerfume }: FragranceFinderProps) {
  const { addToCart } = useCart();
  const [selectedGender, setSelectedGender] = useState<"zeste" | "aura" | "duo">("zeste");
  const [activeNoteTab, setActiveNoteTab] = useState<"top" | "heart" | "base">("heart");

  if (!isOpen) return null;

  const currentPerfume =
    selectedGender === "zeste"
      ? PERFUMES[0]
      : selectedGender === "aura"
      ? PERFUMES[1]
      : PERFUMES[2];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="relative w-full max-w-4xl bg-[#0C0B0A] border border-[#C58652]/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.95)] max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 w-9 h-9 flex items-center justify-center rounded-full bg-[#161413] border border-[#24201D] text-stone-400 hover:text-white hover:border-[#C58652]/60 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#C58652]/10 border border-[#C58652]/30 text-[#E4C7A8] text-xs font-medium uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5 text-[#C58652]" strokeWidth={1.5} />
            <span>المستشار العطري • SÈN Haute Parfumerie</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white mb-2 font-medium">
            استكشاف الهرم العطري والنفحات النقية
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed">
            تعرّف على تدرج النغمات العطرية، من انتعاش الافتتاحية إلى عمق قلب العطر ورسوخ القاعدة الملكية.
          </p>
        </div>

        {/* Product Selector Tabs */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { id: "zeste", label: "SÈN Zeste (رجالي)", tag: "انتعاش برغموت كابري والجلد المدبوغ", accent: "border-[#688A75]/50 bg-[#688A75]/10 text-[#8EBBA0]" },
            { id: "aura", label: "SÈN Aura (نسائي)", tag: "توت بري وزهور السوسن المخملية", accent: "border-[#A86E85]/50 bg-[#A86E85]/10 text-[#D19BB0]" },
            { id: "duo", label: "باقة الثنائي الملكية", tag: "التجربة الكاملة معاً + توصيل مجاني", accent: "border-[#C58652]/50 bg-[#C58652]/10 text-[#E4C7A8]" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedGender(item.id as any)}
              className={`p-3.5 sm:p-4 rounded-2xl text-center border transition-all duration-300 ${
                selectedGender === item.id
                  ? item.accent + " shadow-[0_0_25px_rgba(197,134,82,0.15)]"
                  : "bg-[#161413] border-[#24201D] text-stone-400 hover:border-stone-700 hover:text-stone-200"
              }`}
            >
              <div className="text-xs font-medium block mb-1">{item.label}</div>
              <div className="text-[10px] opacity-75 hidden sm:block font-light">{item.tag}</div>
            </button>
          ))}
        </div>

        {/* Selected Perfume Presentation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#161413]/60 border border-[#24201D] rounded-2xl p-5 sm:p-7">
          {/* Visual Column */}
          <div className="relative aspect-[4/5] w-full max-w-[280px] mx-auto rounded-2xl overflow-hidden border border-[#24201D] shadow-2xl">
            <Image
              src={currentPerfume.image}
              alt={currentPerfume.nameAr}
              fill
              className="object-cover"
            />
            {currentPerfume.badge && (
              <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#161413]/90 backdrop-blur-md border border-[#C58652]/40 text-[#E4C7A8] text-[10px] font-medium tracking-wider uppercase">
                {currentPerfume.badge}
              </span>
            )}
          </div>

          {/* Scent Pyramid & Details Column */}
          <div>
            <div className="text-xs text-[#C58652] font-medium tracking-wider uppercase mb-1">
              {currentPerfume.genderAr} • {currentPerfume.volumeMl}ml • {currentPerfume.concentration}
            </div>
            <h3 className="font-serif text-2xl text-white font-medium mb-1">
              {currentPerfume.nameAr}
            </h3>
            <p className="text-xs text-stone-400 mb-5 font-light italic">
              {currentPerfume.taglineAr}
            </p>

            {/* Note Pyramid Tabs */}
            <div className="mb-5">
              <div className="flex border-b border-[#24201D] mb-3 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveNoteTab("top")}
                  className={`pb-2 px-3 font-medium transition-colors ${
                    activeNoteTab === "top"
                      ? "border-b-2 border-[#C58652] text-[#E4C7A8]"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  القمة (Top Notes)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveNoteTab("heart")}
                  className={`pb-2 px-3 font-medium transition-colors ${
                    activeNoteTab === "heart"
                      ? "border-b-2 border-[#C58652] text-[#E4C7A8]"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  قلب العطر (Heart)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveNoteTab("base")}
                  className={`pb-2 px-3 font-medium transition-colors ${
                    activeNoteTab === "base"
                      ? "border-b-2 border-[#C58652] text-[#E4C7A8]"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  القاعدة والثبات (Base)
                </button>
              </div>

              {/* Note Pills */}
              <div className="flex flex-wrap gap-2 min-h-[38px]">
                {(activeNoteTab === "top"
                  ? currentPerfume.topNotes
                  : activeNoteTab === "heart"
                  ? currentPerfume.heartNotes
                  : currentPerfume.baseNotes
                ).map((note, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-[#0C0B0A] border border-[#24201D] text-stone-300 text-xs font-light"
                  >
                    • {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Sillage & Longevity Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-6 p-3.5 rounded-xl bg-[#0C0B0A] border border-[#24201D] text-xs">
              <div>
                <span className="text-stone-500 block mb-0.5">مدى الفوحان والأثر:</span>
                <span className="text-stone-200 font-medium">{currentPerfume.sillage}</span>
              </div>
              <div>
                <span className="text-stone-500 block mb-0.5">ثبات الزيوت النقية:</span>
                <span className="text-stone-200 font-medium">{currentPerfume.longevity}</span>
              </div>
            </div>

            {/* Price & CTA */}
            <div className="flex items-center justify-between gap-4 pt-3 border-t border-[#24201D]">
              <div>
                <div className="text-[11px] text-stone-400">القيمة:</div>
                <div className="text-xl font-medium text-[#E4C7A8] font-serif">
                  {currentPerfume.price.toLocaleString()} ج.م
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onSelectPerfume(currentPerfume);
                    onClose();
                  }}
                  className="px-3.5 py-2.5 rounded-xl border border-[#24201D] hover:border-[#C58652]/50 text-stone-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>تفاصيل</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addToCart(currentPerfume, 1);
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E4C7A8] to-[#C58652] text-[#0C0B0A] text-xs font-semibold hover:brightness-105 transition-all shadow-md flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>أضف للسلة (COD)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
