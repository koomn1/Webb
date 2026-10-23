"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Perfume } from "@/data/perfumes";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Eye, Check, ShieldCheck } from "lucide-react";
import { appLink } from "@/lib/paths";

interface ProductCardProps {
  perfume: Perfume;
  onOpenQuickView: (perfume: Perfume) => void;
}

export function ProductCard({ perfume, onOpenQuickView }: ProductCardProps) {
  const { addToCart } = useCart();
  const [addedEffect, setAddedEffect] = useState(false);

  const handleAddToCart = () => {
    addToCart(perfume, 1);
    setAddedEffect(true);
    setTimeout(() => setAddedEffect(false), 1800);
  };

  const isZeste = perfume.id === "sen-zeste";
  const isAura = perfume.id === "sen-aura";

  return (
    <div className="group relative flex flex-col bg-[#161413] border border-[#2B2724] hover:border-[#E4C7A8]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.7)]">
      {/* Visual Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#100E0D]">
        <Image
          src={perfume.image}
          alt={perfume.nameAr}
          fill
          unoptimized={perfume.image?.startsWith("data:") || perfume.image?.startsWith("http")}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />

        {/* Product badge */}
        {perfume.badge ? (
          <div
            className={`absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-md ${
              isZeste
                ? "bg-[#688A75] text-white"
                : isAura
                ? "bg-[#A86E85] text-white"
                : "bg-gradient-to-r from-[#E4C7A8] to-[#C58652] text-[#0C0B0A]"
            }`}
          >
            {perfume.badge}
          </div>
        ) : null}

        {/* Volume & Type Pill */}
        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full glass-luxury text-[#F5E4D2] text-[10px] font-medium tracking-wider">
          {perfume.genderAr} • {perfume.volumeMl}ml
        </div>

        {/* Quick View Button */}
        <div className="absolute inset-x-3 bottom-3 z-10 flex gap-2 opacity-100 transition-opacity duration-200 md:inset-x-4 md:bottom-4 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          <Link
            href={appLink(`/product/${perfume.slug}`)}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-[#E4C7A8]/55 bg-[#0C0B0A]/85 px-3 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:border-[#E4C7A8] hover:text-[#F5E4D2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5E4D2]"
            aria-label={`تفاصيل ${perfume.nameAr}`}
          >
            تفاصيل العطر
          </Link>
          <button
            type="button"
            onClick={() => onOpenQuickView(perfume)}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-black/70 px-3 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:border-[#E4C7A8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5E4D2]"
            aria-label={`نظرة سريعة على ${perfume.nameAr}`}
          >
            <Eye className="h-3.5 w-3.5 text-[#E4C7A8]" strokeWidth={1.5} />
            <span>نظرة سريعة</span>
          </button>
        </div>
      </div>

      {/* Content & Details */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between">
        <div>
          {/* Concentration */}
          <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[#E4C7A8] tracking-widest font-semibold text-[11px] uppercase">
              {perfume.concentration}
            </span>
          </div>

          {/* Title */}
          <h3 className="mb-1.5 font-serif text-2xl font-medium text-white transition-colors group-hover:text-[#F5E4D2]">
            <Link href={appLink(`/product/${perfume.slug}`)} className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4C7A8]">{perfume.nameAr}</Link>
          </h3>

          {/* Tagline */}
          <p className="text-xs text-[#ABA59C] line-clamp-2 leading-relaxed mb-4 font-light">
            {perfume.taglineAr}
          </p>

          {/* Fragrance Notes Chips */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {perfume.topNotes.slice(0, 2).map((note, i) => (
              <span
                key={i}
                className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#221F1C] border border-[#302C28] text-[#ECE5DA]"
              >
                {note}
              </span>
            ))}
            {perfume.baseNotes.slice(0, 1).map((note, i) => (
              <span
                key={`base-${i}`}
                className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#1C1A18] border border-[#2B2724] text-[#8C847B]"
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        <div>
          {/* Golden Guarantee notice */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#A5C2B0] mb-4 bg-[#14231A]/60 border border-[#254231]/60 px-2.5 py-1.5 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-[#688A75] shrink-0" strokeWidth={1.75} />
            <span>تشمل عينة 2 مل مجانية للضمان الذهبي</span>
          </div>

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#25221F]">
            <div>
              <span className="text-xl font-bold text-[#F5E4D2] font-serif">
                {perfume.price.toLocaleString()} ج.م
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className={`min-h-[44px] px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 shadow-lg ${
                addedEffect
                  ? "bg-[#688A75] text-white"
                  : "bg-gradient-to-r from-[#E4C7A8] via-[#F5E4D2] to-[#C58652] text-[#0C0B0A] hover:shadow-[0_0_25px_rgba(228,199,168,0.35)] hover:scale-[1.02]"
              }`}
              aria-label={`إضافة ${perfume.nameAr} إلى حقيبة التسوق`}
            >
              {addedEffect ? (
                <>
                  <Check className="w-4 h-4" strokeWidth={2} />
                  <span>تمت الإضافة!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" strokeWidth={1.75} />
                  <span>أضف إلى السلة</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
