"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowLeft,
  Gift,
} from "lucide-react";

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export function CartDrawer({ onOpenCheckout }: CartDrawerProps) {
  const {
    cart,
    isOpen,
    setIsOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
  } = useCart();

  if (!isOpen) return null;

  // Free shipping on orders over 1000 EGP or if Duo bundle is present
  const hasDuoBundle = cart.some((i) => i.perfume.id === "sen-duo-bundle");
  const freeShippingThreshold = 1000;
  const isFreeShipping = hasDuoBundle || subtotal >= freeShippingThreshold;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-start bg-black/80 backdrop-blur-sm animate-fadeIn" dir="rtl">
      {/* Click outside to close */}
      <div
        className="fixed inset-0"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-[#101015] border-l border-[#D4AF37]/40 h-full flex flex-col z-10 shadow-[10px_0_40px_rgba(0,0,0,0.9)] animate-slideIn">
        {/* Drawer Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-serif text-xl text-white font-medium">
              حقيبة التسوق • SÈN
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-bold">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-[#D4AF37] transition-colors"
            aria-label="إغلاق حقيبة التسوق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-3.5 bg-zinc-950/80 border-b border-zinc-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-zinc-300 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
              {isFreeShipping ? (
                <span className="text-emerald-400 font-semibold">
                  مبارك! طلبك مؤهل للشحن المجاني السريع لكافة المحافظات
                </span>
              ) : (
                <span>
                  أضف <strong className="text-[#F3E5AB]">{remainingForFree.toLocaleString()} ج.م</strong> أخرى للحصول على شحن مجاني
                </span>
              )}
            </span>
            <span className="text-[#D4AF37] font-bold text-[11px]">{isFreeShipping ? 100 : progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] transition-all duration-500 rounded-full"
              style={{ width: `${isFreeShipping ? 100 : progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
              >
                {/* Thumbnail */}
                <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800">
                  <Image
                    src={item.perfume.image}
                    alt={item.perfume.nameAr}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-serif text-base text-white font-medium leading-snug">
                        {item.perfume.nameAr}
                      </h4>
                      <span className="text-[11px] text-[#D4AF37] block">
                        {item.perfume.volumeMl}ml • {item.perfume.concentration}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                      aria-label="حذف المنتج"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Golden Guarantee Tester Badge */}
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 my-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>مرفق عينة 2ml مجانية للضمان الذهبي</span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-zinc-700/80 rounded-lg bg-zinc-900 px-2 py-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-white"
                        aria-label="تقليل"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-semibold text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-white"
                        aria-label="زيادة"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="font-serif font-bold text-base text-[#F3E5AB]">
                      {(item.unitPrice * item.quantity).toLocaleString()} ج.م
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Empty Cart */
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg text-white mb-2">
                حقيبة التسوق فارغة
              </h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto mb-6">
                اختر عطر SÈN Zeste أو SÈN Aura أو باقة الثنائي لبدء تجربة الضمان الذهبي.
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 rounded-full bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider"
              >
                تصفح العطور الآن
              </button>
            </div>
          )}

          {/* Golden Guarantee Card in Cart */}
          {cart.length > 0 && (
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>الضمان الذهبي 100% مفعل تلقائياً:</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                ستصلك عينة 2 مل مطابقة لكل زجاجة طلبتها. جرّب العينة أولاً واستمتع بها، وإذا لم يُعجبك العطر يمكنك استرجاع الزجاجة الـ 50 مل المغلقة واسترداد كامل ثمنها.
              </p>
            </div>
          )}
        </div>

        {/* Drawer Footer with Subtotal & Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-zinc-800 bg-[#0C0C10]">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
              <span>المجموع الفرعي:</span>
              <span className="font-serif text-lg font-bold text-white">
                {subtotal.toLocaleString()} ج.م
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-4">
              <span>الشحن وطريقة الدفع:</span>
              <span className="text-[#D4AF37] font-semibold">
                {isFreeShipping ? "شحن مجاني (الدفع عند الاستلام)" : "الدفع عند الاستلام فقط (COD)"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenCheckout();
              }}
              className="w-full min-h-[48px] py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 group"
            >
              <span>متابعة لطلب العطر (الدفع عند الاستلام)</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
