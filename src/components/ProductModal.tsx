"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Perfume } from "@/data/perfumes";
import { useCart } from "@/context/CartContext";
import { X, ShoppingBag, Check, ShieldCheck, Sparkles, Phone } from "lucide-react";

interface ProductModalProps {
  perfume: Perfume | null;
  onClose: () => void;
}

export function ProductModal({ perfume, onClose }: ProductModalProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!perfume) return null;

  const totalPrice = perfume.price * quantity;

  const handleAdd = () => {
    addToCart(perfume, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  const isZeste = perfume.id === "sen-zeste";
  const isAura = perfume.id === "sen-aura";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="relative w-full max-w-4xl bg-[#0C0B0A] border border-[#C58652]/30 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.95)] max-h-[94vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-[#0C0B0A]/80 border border-[#24201D] text-stone-400 hover:text-white hover:border-[#C58652]/60 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Visual Column */}
        <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto min-h-[300px] md:min-h-full bg-[#161413] flex items-center justify-center p-6 border-b md:border-b-0 md:border-l border-[#24201D]">
          <Image
            src={perfume.image}
            alt={perfume.nameAr}
            fill
            unoptimized={perfume.image?.startsWith("data:") || perfume.image?.startsWith("http")}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0A]/80 via-transparent to-transparent pointer-events-none" />

          {perfume.badge && (
            <span
              className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-medium tracking-wider uppercase backdrop-blur-md border ${
                isZeste
                  ? "bg-[#688A75]/20 text-[#8EBBA0] border-[#688A75]/40"
                  : isAura
                  ? "bg-[#A86E85]/20 text-[#D19BB0] border-[#A86E85]/40"
                  : "bg-[#C58652]/20 text-[#E4C7A8] border-[#C58652]/40"
              }`}
            >
              {perfume.badge}
            </span>
          )}

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-stone-300 glass-champagne px-4 py-2.5 rounded-2xl">
            <span className="font-light">{perfume.concentration} (20% زيوت نقية)</span>
            <span className="text-[#E4C7A8] font-mono font-medium">{perfume.volumeMl}ml</span>
          </div>
        </div>

        {/* Details & Sensory Profile Column */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto max-h-[60vh] md:max-h-[94vh]">
          {/* Header */}
          <div className="flex items-center gap-1.5 text-xs text-[#E4C7A8] mb-1">
            <span className="text-[#C58652]">الملف العطري</span>
          </div>

          <h2 className="font-serif text-3xl text-white font-medium mb-1">
            {perfume.nameAr}
          </h2>
          <p className="text-xs text-[#C58652] font-medium tracking-wide mb-4">
            {perfume.taglineAr}
          </p>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-6 font-light">
            {perfume.descriptionAr}
          </p>

          {/* Olfactory Pyramid */}
          <div className="mb-6 p-4 rounded-2xl bg-[#161413] border border-[#24201D]">
            <h4 className="text-xs font-medium text-stone-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C58652]" strokeWidth={1.5} />
              <span>الهرم العطري والتكوين الباريسي</span>
            </h4>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-stone-500 font-medium block mb-0.5">القمة العطرية (Top Notes):</span>
                <span className="text-stone-200 font-light">{perfume.topNotes.join(" • ")}</span>
              </div>
              <div>
                <span className="text-stone-500 font-medium block mb-0.5">قلب العطر (Heart Notes):</span>
                <span className="text-stone-200 font-light">{perfume.heartNotes.join(" • ")}</span>
              </div>
              <div>
                <span className="text-stone-500 font-medium block mb-0.5">القاعدة والثبات (Base Notes):</span>
                <span className="text-stone-200 font-light">{perfume.baseNotes.join(" • ")}</span>
              </div>
            </div>
          </div>

          {/* Sillage & Longevity */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-3.5 rounded-xl bg-[#161413]/60 border border-[#24201D] text-xs">
            <div>
              <span className="text-stone-500 block mb-0.5">مدى الفوحان والأثر:</span>
              <span className="text-stone-200 font-medium">{perfume.sillage}</span>
            </div>
            <div>
              <span className="text-stone-500 block mb-0.5">ثبات الزيوت النقية:</span>
              <span className="text-stone-200 font-medium">{perfume.longevity}</span>
            </div>
          </div>

          {/* Golden Guarantee notice */}
          <div className="p-4 rounded-2xl bg-[#161413] border border-[#688A75]/30 text-xs mb-6">
            <div className="flex items-center gap-2 text-[#8EBBA0] font-medium mb-1">
              <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
              <span>ميثاق الثقة والأمان (100% Guaranteed):</span>
            </div>
            <p className="text-[11px] text-stone-300 leading-relaxed font-light">
              ستحصل على عينة 2 مل مطابقة ومغلفة لتجربتها أولاً. في حال لم يطابق العطر ذوقك، يمكنك استرجاع الزجاجة الـ 50 مل المغلقة واسترداد كامل قيمتها دون أي سؤال أو تكلفة.
            </p>
          </div>

          {/* Quantity and Price */}
          <div className="flex items-center justify-between gap-4 mb-6">
            {/* Quantity Counter */}
            <div className="flex items-center border border-[#24201D] rounded-xl bg-[#161413] px-3 py-1.5">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-white font-bold"
                aria-label="تقليل الكمية"
              >
                -
              </button>
              <span className="w-8 text-center text-sm font-mono font-semibold text-white">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-white font-bold"
                aria-label="زيادة الكمية"
              >
                +
              </button>
            </div>

            {/* Total Price */}
            <div className="text-start">
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block">الإجمالي (الدفع عند المعاينة):</span>
              <span className="font-serif text-2xl font-medium text-[#E4C7A8]">
                {totalPrice.toLocaleString()} ج.م
              </span>
            </div>
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={handleAdd}
            className={`w-full min-h-[50px] py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg mb-4 ${
              added
                ? "bg-[#688A75] text-white"
                : "bg-gradient-to-r from-[#E4C7A8] via-[#D8B28C] to-[#C58652] text-[#0C0B0A] hover:shadow-[0_0_30px_rgba(197,134,82,0.35)]"
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" strokeWidth={2} />
                <span>تمت الإضافة لحقيبة المقتنيات بنجاح</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                <span>إضافة إلى حقيبة الطلب (الدفع عند الاستلام)</span>
              </>
            )}
          </button>

          {/* Contact Support */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 pt-3 border-t border-[#24201D]">
            <Phone className="w-3.5 h-3.5 text-[#C58652]" strokeWidth={1.5} />
            <span>استشارة عطرية مباشرة: </span>
            <a href="tel:01018995002" className="text-[#E4C7A8] font-mono font-medium hover:underline">
              01018995002
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
