"use client";

import React, { useState } from "react";
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
  ArrowLeft,
  Tag,
  Check,
  Percent,
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
    discountAmount,
    totalAfterDiscount,
    appliedDiscount,
    applyDiscountCode,
    removeDiscountCode,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  // Free shipping on orders over 1000 EGP or if Duo bundle is present
  const hasDuoBundle = cart.some((i) => i.perfume.id === "sen-duo-bundle");
  const freeShippingThreshold = 1000;
  const isFreeShipping = hasDuoBundle || subtotal >= freeShippingThreshold;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyDiscountCode(couponInput);
    if (res.success) {
      setCouponMsg({ text: res.message, isError: false });
      setCouponInput("");
    } else {
      setCouponMsg({ text: res.message, isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-start bg-black/80 backdrop-blur-md animate-fadeIn" dir="rtl">
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-[#0C0B0A] border-l border-[#C58652]/30 h-full flex flex-col z-10 shadow-[10px_0_50px_rgba(0,0,0,0.95)] animate-slideIn">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#24201D] flex items-center justify-between bg-[#161413]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#C58652]/15 border border-[#C58652]/30 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#E4C7A8]" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-serif text-lg text-white font-medium tracking-wide">
                المقتنيات العطرية
              </h2>
              <span className="text-[10px] tracking-widest uppercase text-[#C58652]">SÈN Paris • Le Caire</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#24201D] text-[#E4C7A8] font-mono font-medium border border-[#C58652]/20">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#161413] border border-[#24201D] text-stone-400 hover:text-white hover:border-[#C58652]/60 transition-colors"
            aria-label="إغلاق حقيبة التسوق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-3.5 bg-[#161413]/40 border-b border-[#24201D]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-stone-300 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#C58652]" strokeWidth={1.5} />
              {isFreeShipping ? (
                <span className="text-[#8EBBA0] font-medium">
                  طلبك مؤهل لخدمة التوصيل المجاني الخاص لكافة المحافظات
                </span>
              ) : (
                <span>
                  أضف مقتنيات بقيمة <strong className="text-[#E4C7A8] font-mono">{remainingForFree.toLocaleString()} ج.م</strong> للشحن المجاني
                </span>
              )}
            </span>
            <span className="text-[#E4C7A8] font-mono text-[11px]">{isFreeShipping ? 100 : progressPercent}%</span>
          </div>
          <div className="w-full h-1 bg-[#24201D] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C58652] to-[#E4C7A8] transition-all duration-500 rounded-full"
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
                className="flex gap-4 p-4 rounded-2xl bg-[#161413] border border-[#24201D] hover:border-[#C58652]/40 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#0C0B0A] shrink-0 border border-[#24201D]">
                  <Image
                    src={item.perfume.image}
                    alt={item.perfume.nameAr}
                    fill
                    unoptimized={item.perfume.image?.startsWith("data:") || item.perfume.image?.startsWith("http")}
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
                      <span className="text-[11px] text-[#C58652] block font-light">
                        {item.perfume.volumeMl}ml • {item.perfume.concentration}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-500 hover:text-rose-400 p-1 transition-colors"
                      aria-label="حذف المنتج"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </div>

                  {/* Golden Guarantee Tester Badge */}
                  <div className="text-[10px] text-[#8EBBA0] flex items-center gap-1.5 my-1 bg-[#688A75]/10 px-2 py-0.5 rounded-md w-fit border border-[#688A75]/25">
                    <ShieldCheck className="w-3 h-3 text-[#8EBBA0]" strokeWidth={1.5} />
                    <span>مرفق عينة استكشافية 2ml مجانية</span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#24201D] rounded-lg bg-[#0C0B0A] px-2 py-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center text-stone-400 hover:text-white"
                        aria-label="تقليل"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-mono font-semibold text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center text-stone-400 hover:text-white"
                        aria-label="زيادة"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="font-serif font-medium text-base text-[#E4C7A8]">
                      {(item.unitPrice * item.quantity).toLocaleString()} ج.م
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Empty Cart */
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#161413] border border-[#24201D] flex items-center justify-center text-stone-500 mx-auto mb-4">
                <ShoppingBag className="w-7 h-7 text-[#C58652]/60" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-lg text-white mb-2 font-medium">
                حقيبتك بانتظار توقيعك العطري
              </h3>
              <p className="text-xs text-stone-400 max-w-xs mx-auto mb-6 leading-relaxed font-light">
                استكشف توليفات SÈN Zeste المنعشة، أو نعومة SÈN Aura المخملية، أو اقتنِ باقة الثنائي الملكية مع ميثاق الثقة التام.
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#E4C7A8] to-[#C58652] text-[#0C0B0A] text-xs font-semibold uppercase tracking-wider hover:brightness-105 transition-all shadow-md"
              >
                تصفح التوليفات الحصرية
              </button>
            </div>
          )}

          {/* Golden Guarantee Card in Cart */}
          {cart.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#161413]/70 border border-[#688A75]/30 text-xs">
              <div className="flex items-center gap-2 text-[#8EBBA0] font-medium mb-1.5">
                <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
                <span>ميثاق الثقة والأمان (100% Guaranteed):</span>
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed font-light">
                ستصلك عينة استكشافية 2ml مطابقة لكل زجاجة في طردك. اختبر ثبات العطر وفوحانه بهدوء أولاً؛ وإن لم يطابق ذائقتك، يمكنك إرجاع الزجاجة الكبرى المغلقة واسترداد قيمتها فوراً دون أي تكلفة.
              </p>
            </div>
          )}
        </div>

        {/* Drawer Footer with Coupon Code & Subtotal & Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#24201D] bg-[#0C0B0A] space-y-4">
            {/* Coupon Code Section */}
            <div>
              {appliedDiscount ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#688A75]/15 border border-[#688A75]/40 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#8EBBA0]" />
                    <span className="font-mono font-bold text-[#8EBBA0]">{appliedDiscount.code}</span>
                    <span className="text-stone-300 text-[11px]">
                      (خصم {appliedDiscount.type === "PERCENTAGE" ? `${appliedDiscount.value}%` : `${appliedDiscount.value} ج.م`})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeDiscountCode}
                    className="text-stone-400 hover:text-rose-400 p-1 text-[11px]"
                    title="إزالة الكود"
                  >
                    إلغاء
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="كود الخصم (مثال: SEN10)"
                    dir="ltr"
                    className="flex-1 bg-[#161413] border border-[#24201D] focus:border-[#C58652] rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 font-mono uppercase focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#161413] border border-[#C58652]/40 hover:border-[#C58652] text-[#E4C7A8] text-xs font-semibold shrink-0 transition-colors"
                  >
                    تطبيق
                  </button>
                </form>
              )}
              {couponMsg && (
                <span
                  className={`text-[11px] block mt-1 ${
                    couponMsg.isError ? "text-rose-400" : "text-[#8EBBA0]"
                  }`}
                >
                  {couponMsg.text}
                </span>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-stone-400">
              <div className="flex items-center justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-serif text-sm font-medium text-white">
                  {subtotal.toLocaleString()} ج.م
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-[#8EBBA0]">
                  <span>خصم كود الترويج ({appliedDiscount?.code}):</span>
                  <span className="font-mono font-medium">
                    -{discountAmount.toLocaleString()} ج.م
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>التسليم والدفع:</span>
                <span className="text-[#E4C7A8] font-medium">
                  {isFreeShipping ? "توصيل مجاني (الدفع عند المعاينة)" : "الدفع عند الاستلام (COD)"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#24201D] text-white">
                <span className="font-medium">المطلوب عند الاستلام:</span>
                <span className="font-serif text-xl font-medium text-[#E4C7A8]">
                  {totalAfterDiscount.toLocaleString()} ج.م
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenCheckout();
              }}
              className="w-full min-h-[50px] py-3.5 rounded-xl bg-gradient-to-r from-[#E4C7A8] via-[#D8B28C] to-[#C58652] text-[#0C0B0A] font-semibold text-xs uppercase tracking-wider hover:shadow-[0_0_30px_rgba(197,134,82,0.35)] transition-all flex items-center justify-center gap-2 group"
            >
              <span>إتمام الطلب (الدفع عند الاستلام فقط)</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" strokeWidth={2} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
