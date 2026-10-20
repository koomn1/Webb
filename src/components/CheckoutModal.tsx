"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { EGYPTIAN_GOVERNORATES } from "@/data/perfumes";
import { z } from "zod";
import confetti from "canvas-confetti";
import {
  X,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Phone,
  AlertCircle,
  Copy,
  Check,
  MessageCircle,
  Banknote,
  Tag,
} from "lucide-react";

// Strict Zod Validation Schema for Egyptian COD Checkout adhering to AGENTS.md
const egyptianCheckoutSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "الاسم الكامل يجب أن لا يقل عن 3 أحرف" }),
  phone: z
    .string()
    .regex(/^01[0125][0-9]{8}$/, {
      message: "رقم الموبايل المصري غير صحيح (يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015 ومكون من 11 رقماً)",
    }),
  governorate: z
    .string()
    .min(1, { message: "يرجى اختيار المحافظة لحساب الشحن بدقة" }),
  address: z
    .string()
    .min(6, { message: "يرجى كتابة العنوان التفصيلي (المنطقة، الشارع، رقم المبنى)" }),
  notes: z.string().optional(),
});

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const {
    cart,
    subtotal,
    discountAmount,
    totalAfterDiscount,
    appliedDiscount,
    applyDiscountCode,
    removeDiscountCode,
    createOrder,
  } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    governorate: "القاهرة",
    address: "",
    notes: "",
  });

  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Calculate delivery fee
  const selectedGov = EGYPTIAN_GOVERNORATES.find((g) => g.name === formData.governorate);
  const hasDuoBundle = cart.some((i) => i.perfume.id === "sen-duo-bundle");
  const isFreeShipping = hasDuoBundle || subtotal >= 1000;
  const shippingFee = isFreeShipping ? 0 : selectedGov?.shippingFee || 45;
  const grandTotal = totalAfterDiscount + shippingFee;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError(null);

    const result = egyptianCheckoutSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await createOrder({
        customerName: formData.fullName,
        phone: formData.phone,
        governorate: formData.governorate,
        address: formData.address,
        notes: formData.notes,
        items: cart.map((i) => ({
          name: i.perfume.nameAr,
          quantity: i.quantity,
          price: i.unitPrice,
        })),
        subtotal,
        shippingFee,
        total: grandTotal,
      });

      setConfirmedOrderNumber(order.id);
      setIsSubmitting(false);
      setOrderConfirmed(true);

      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#E4C7A8", "#C58652", "#8EBBA0", "#ffffff"],
        });
      } catch {}
    } catch (error) {
      setIsSubmitting(false);
      setSubmitError(
        error instanceof Error && error.message
          ? `تعذر حفظ الطلب: ${error.message}`
          : "تعذر حفظ الطلب حالياً. لم يتم تأكيده، حاول مرة أخرى."
      );
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(confirmedOrderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappSupportUrl = `https://wa.me/201018995002?text=${encodeURIComponent(
    `مرحباً، أود متابعة طلبي رقم ${confirmedOrderNumber} في دار SÈN Parfums.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="relative w-full max-w-2xl bg-[#0C0B0A] border border-[#C58652]/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.95)] max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 w-9 h-9 flex items-center justify-center rounded-full bg-[#161413] border border-[#24201D] text-stone-400 hover:text-white hover:border-[#C58652]/60 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        {!orderConfirmed ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#C58652]/15 border border-[#C58652]/30 flex items-center justify-center">
                <Truck className="w-4 h-4 text-[#E4C7A8]" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-white font-medium">
                  إتمام الطلب • الدفع عند الاستلام (COD)
                </h2>
                <span className="text-[11px] text-[#C58652] tracking-wider uppercase block">
                  SÈN Haute Parfumerie • خدمة التوصيل الخاص
                </span>
              </div>
            </div>
            <p className="text-xs text-stone-400 mb-6 font-light leading-relaxed">
              ادفع نقداً لمندوب الشحن بعد معاينة الطرد وفحصه، مع ميثاق الثقة والأمان وعينة الـ 2ml المرفقة مجاناً.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1.5">
                  الاسم الكامل لاستلام الشحنة *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="مثال: يوسف محمود بدوي"
                  className={`w-full bg-[#161413] border rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:border-[#C58652] focus:outline-none transition-colors ${
                    errors.fullName ? "border-rose-500/80" : "border-[#24201D]"
                  }`}
                />
                {errors.fullName && (
                  <span className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.fullName}
                  </span>
                )}
              </div>

              {/* Egyptian Mobile */}
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1.5">
                  رقم الموبايل للتواصل والشحن (مصر) *
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="01018995002"
                  className={`w-full bg-[#161413] border rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:border-[#C58652] focus:outline-none font-mono text-end transition-colors ${
                    errors.phone ? "border-rose-500/80" : "border-[#24201D]"
                  }`}
                />
                {errors.phone && (
                  <span className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.phone}
                  </span>
                )}
                <span className="text-[10px] text-stone-500 mt-1 block">
                  سنرسل لك رسالة تأكيد عبر واتساب ورسالة نصية قبل خروج المندوب.
                </span>
              </div>

              {/* Governorate Dropdown */}
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1.5">
                  المحافظة *
                </label>
                <select
                  value={formData.governorate}
                  onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                  className="w-full bg-[#161413] border border-[#24201D] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#C58652] focus:outline-none"
                >
                  {EGYPTIAN_GOVERNORATES.map((g) => (
                    <option key={g.name} value={g.name}>
                      {g.name} {isFreeShipping ? "(شحن مجاني)" : `(شحن: ${g.shippingFee} ج.م)`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Detailed Address */}
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1.5">
                  العنوان بالتفصيل (المنطقة، الشارع، رقم المبنى والشقة) *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="مثال: المعادي الجديدة، شارع النصر، مبنى 14، الدور الخامس"
                  className={`w-full bg-[#161413] border rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:border-[#C58652] focus:outline-none transition-colors ${
                    errors.address ? "border-rose-500/80" : "border-[#24201D]"
                  }`}
                />
                {errors.address && (
                  <span className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.address}
                  </span>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs text-stone-400 font-medium block mb-1.5">
                  ملاحظات التوصيل (اختياري)
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="مثال: الاتصال قبل الوصول بنصف ساعة"
                  className="w-full bg-[#161413] border border-[#24201D] rounded-xl px-4 py-2 text-xs text-white placeholder-stone-500 focus:border-[#C58652] focus:outline-none"
                />
              </div>

              {/* Coupon Code Section */}
              <div className="p-3.5 rounded-2xl bg-[#161413] border border-[#24201D]">
                <label className="text-xs text-stone-300 font-medium block mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#C58652]" />
                  <span>هل لديك كود خصم؟</span>
                </label>
                {appliedDiscount ? (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#688A75]/15 border border-[#688A75]/30 text-xs">
                    <span className="font-mono font-bold text-[#8EBBA0]">
                      {appliedDiscount.code} (خصم: {appliedDiscount.type === "PERCENTAGE" ? `${appliedDiscount.value}%` : `${appliedDiscount.value} ج.م`})
                    </span>
                    <button
                      type="button"
                      onClick={removeDiscountCode}
                      className="text-stone-400 hover:text-rose-400 text-xs font-semibold px-2 py-1"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="أدخل كود الخصم (مثال: SEN10)"
                      dir="ltr"
                      className="flex-1 bg-[#0C0B0A] border border-[#24201D] focus:border-[#C58652] rounded-xl px-3 py-2 text-xs text-white placeholder-stone-600 font-mono uppercase focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 rounded-xl bg-[#0C0B0A] border border-[#C58652]/40 hover:border-[#C58652] text-[#E4C7A8] text-xs font-semibold shrink-0 transition-colors"
                    >
                      تطبيق
                    </button>
                  </div>
                )}
                {couponMsg && (
                  <span
                    className={`text-[11px] block mt-1.5 ${
                      couponMsg.isError ? "text-rose-400" : "text-[#8EBBA0]"
                    }`}
                  >
                    {couponMsg.text}
                  </span>
                )}
              </div>

              {/* Strict COD Payment Method Banner */}
              <div className="p-4 rounded-2xl bg-[#161413] border border-[#C58652]/30 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#C58652]/15 border border-[#C58652]/30 flex items-center justify-center text-[#E4C7A8] shrink-0">
                  <Banknote className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="text-xs">
                  <span className="font-medium text-[#E4C7A8] block mb-0.5">
                    طريقة الدفع: الدفع نقداً عند الاستلام والمعاينة (COD)
                  </span>
                  <span className="text-stone-400 text-[11px] font-light">
                    تدفع القيمة لمندوب التوصيل بعد استلام الطرد وفحصه بكل طمأنينة.
                  </span>
                </div>
              </div>

              {/* Order Summary Recap */}
              <div className="p-4 rounded-2xl bg-[#161413]/50 border border-[#24201D] text-xs space-y-2">
                <div className="flex justify-between text-stone-400">
                  <span>قيمة المقتنيات:</span>
                  <span className="font-mono text-stone-200">{subtotal.toLocaleString()} ج.م</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#8EBBA0]">
                    <span>خصم الكود ({appliedDiscount?.code}):</span>
                    <span className="font-mono font-medium">-{discountAmount.toLocaleString()} ج.م</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-400">
                  <span>رسوم الشحن والتوصيل ({formData.governorate}):</span>
                  <span className={shippingFee === 0 ? "text-[#8EBBA0] font-medium" : "font-mono text-stone-200"}>
                    {shippingFee === 0 ? "توصيل مجاني لكافة المحافظات" : `${shippingFee} ج.م`}
                  </span>
                </div>
                <div className="flex justify-between text-[#8EBBA0]">
                  <span className="flex items-center gap-1.5 font-light">
                    <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.5} />
                    ميثاق الثقة وعينة 2ml الاستكشافية:
                  </span>
                  <span className="font-medium">مرفقة مجاناً</span>
                </div>
                <div className="flex justify-between text-white font-serif text-base pt-2.5 border-t border-[#24201D] font-medium">
                  <span>المبلغ المطلوب عند الاستلام:</span>
                  <span className="text-[#E4C7A8] font-mono text-lg">{grandTotal.toLocaleString()} ج.م</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[50px] py-3.5 rounded-xl bg-gradient-to-r from-[#E4C7A8] via-[#D8B28C] to-[#C58652] text-[#0C0B0A] font-semibold text-xs uppercase tracking-wider hover:shadow-[0_0_30px_rgba(197,134,82,0.35)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#0C0B0A] border-t-transparent rounded-full animate-spin" />
                    <span>جاري تجهيز الطلب وتوجيهه لفريق الشحن...</span>
                  </span>
                ) : (
                  <span>
                    تأكيد الطلب الآن ({grandTotal.toLocaleString()} ج.م عند الاستلام)
                  </span>
                )}
              </button>

              {submitError && (
                <div className="flex items-start gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2.5 text-[11px] leading-relaxed text-rose-300" role="alert">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Support Notice */}
              <div className="text-center text-[11px] text-stone-400 pt-1">
                خدمة العملاء والدعم المباشر:{" "}
                <a href="tel:01018995002" className="text-[#E4C7A8] font-mono font-medium hover:underline">
                  01018995002
                </a>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Success State */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#C58652]/15 border border-[#C58652]/40 flex items-center justify-center text-[#E4C7A8] mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" strokeWidth={1.5} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#161413] text-[#8EBBA0] text-xs font-medium border border-[#688A75]/30 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>تم تسجيل الطلب وتفعيل ميثاق الأمان بنجاح</span>
            </div>

            <h2 className="font-serif text-3xl text-white mb-2 font-medium">
              شكراً لاختيارك دار SÈN
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto mb-6 font-light leading-relaxed">
              تم استلام طلبك باعتناء، وسيتواصل معك مستشار التوصيل لتأكيد موعد التسليم والدفع نقداً عند استلام ومعاينة الزجاجة.
            </p>

            {/* Order Code Box */}
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#161413] border border-[#C58652]/30 mb-6">
              <div className="text-start">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block">كود الطلب المرجعي:</span>
                <span className="font-mono text-base font-medium text-[#E4C7A8]">{confirmedOrderNumber}</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="p-2 rounded-lg bg-[#24201D] hover:bg-[#2e2a26] text-stone-300 hover:text-white transition-colors"
                title="نسخ كود الطلب"
              >
                {copied ? <Check className="w-4 h-4 text-[#8EBBA0]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* WhatsApp direct tracking button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <a
                href={whatsappSupportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20b858] text-[#0C0B0A] font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>متابعة الشحن والتوصيل عبر واتساب</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#161413] border border-[#24201D] hover:border-[#C58652]/40 text-stone-200 text-xs font-medium"
              >
                العودة للتشكيلة
              </button>
            </div>

            <p className="text-[11px] text-stone-500 font-light">
              الدعم المباشر: 01018995002 • youssefbadawy5002@gmail.com
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
