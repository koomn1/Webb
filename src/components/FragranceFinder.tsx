"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PERFUMES, Perfume } from "@/data/perfumes";
import { useCart } from "@/context/CartContext";
import { Sparkles, X, Check, ShoppingBag, Eye, ShieldCheck } from "lucide-react";

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
      <div className="relative w-full max-w-4xl bg-[#101015] border border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 w-9 h-9 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-[#D4AF37] transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>المستشار العطري الذكي • SÈN</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white mb-2">
            اكتشف الهرم العطري والتفاصيل الدقيقة
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            اختر العطر لاستكشاف مكونات القمة والقلب والقاعدة وثبات الزيوت النقية.
          </p>
        </div>

        {/* Product Selector Tabs */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { id: "zeste", label: "SÈN Zeste (رجالي)", icon: "🍊", sub: "حمضيات إيطالية وسكر مكرمل" },
            { id: "aura", label: "SÈN Aura (نسائي)", icon: "🍎", sub: "تفاح سكري وزهور بيضاء" },
            { id: "duo", label: "باقة الثنائي (وفر 150 ج)", icon: "✨", sub: "العطرين معاً + شحن مجاني" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedGender(item.id as any)}
              className={`p-3.5 sm:p-4 rounded-xl text-center border transition-all duration-300 ${
                selectedGender === item.id
                  ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#F3E5AB] shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                  : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-xs font-bold block mb-0.5">{item.label}</div>
              <div className="text-[10px] text-zinc-500 hidden sm:block">{item.sub}</div>
            </button>
          ))}
        </div>

        {/* Selected Perfume Presentation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-5 sm:p-6">
          {/* Visual Column */}
          <div className="relative aspect-[4/5] w-full max-w-[280px] mx-auto rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
            <Image
              src={currentPerfume.image}
              alt={currentPerfume.nameAr}
              fill
              className="object-cover"
            />
            {currentPerfume.badge && (
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-wider">
                {currentPerfume.badge}
              </span>
            )}
          </div>

          {/* Scent Pyramid & Details Column */}
          <div>
            <div className="text-xs text-[#D4AF37] font-semibold tracking-wider uppercase mb-1">
              {currentPerfume.genderAr} • {currentPerfume.volumeMl}ml
            </div>
            <h3 className="font-serif text-2xl text-white font-medium mb-1">
              {currentPerfume.nameAr}
            </h3>
            <p className="text-xs text-zinc-400 mb-4 italic">
              {currentPerfume.taglineAr}
            </p>

            {/* Note Pyramid Tabs */}
            <div className="mb-4">
              <div className="flex border-b border-zinc-800 mb-2.5 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveNoteTab("top")}
                  className={`pb-1.5 px-3 font-medium transition-colors ${
                    activeNoteTab === "top"
                      ? "border-b-2 border-[#D4AF37] text-[#D4AF37]"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  القمة (Top Notes)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveNoteTab("heart")}
                  className={`pb-1.5 px-3 font-medium transition-colors ${
                    activeNoteTab === "heart"
                      ? "border-b-2 border-[#D4AF37] text-[#D4AF37]"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  قلب العطر (Heart)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveNoteTab("base")}
                  className={`pb-1.5 px-3 font-medium transition-colors ${
                    activeNoteTab === "base"
                      ? "border-b-2 border-[#D4AF37] text-[#D4AF37]"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  القاعدة والثبات (Base)
                </button>
              </div>

              {/* Note Pills */}
              <div className="flex flex-wrap gap-1.5 min-h-[38px]">
                {(activeNoteTab === "top"
                  ? currentPerfume.topNotes
                  : activeNoteTab === "heart"
                  ? currentPerfume.heartNotes
                  : currentPerfume.baseNotes
                ).map((note, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs"
                  >
                    • {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Sillage & Longevity Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-6 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/60 text-xs">
              <div>
                <span className="text-zinc-500 block mb-0.5">قوة الفوحان:</span>
                <span className="text-zinc-200 font-medium">{currentPerfume.sillage}</span>
              </div>
              <div>
                <span className="text-zinc-500 block mb-0.5">مدة الثبات:</span>
                <span className="text-zinc-200 font-medium">{currentPerfume.longevity}</span>
              </div>
            </div>

            {/* Price & CTA */}
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-zinc-800">
              <div>
                <div className="text-[11px] text-zinc-400">سعر المنتج:</div>
                <div className="text-xl font-bold text-[#F3E5AB] font-serif">
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
                  className="px-3.5 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 hover:text-white hover:border-[#D4AF37] text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>تفاصيل</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addToCart(currentPerfume, 1);
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#AA820A] text-black text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
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
