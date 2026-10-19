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
  Mail,
  AlertCircle,
  Copy,
  Check,
  MessageCircle,
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
    .min(6, { message: "يرجى كتابة العنوان التفصيلي (المنطقة، الشارع، رقم العمارة أو الفيلا)" }),
  notes: z.string().optional(),
});

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, subtotal, createOrder } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    governorate: "القاهرة",
    address: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Calculate delivery fee
  const selectedGov = EGYPTIAN_GOVERNORATES.find((g) => g.name === formData.governorate);
  const hasDuoBundle = cart.some((i) => i.perfume.id === "sen-duo-bundle");
  const isFreeShipping = hasDuoBundle || subtotal >= 1000;
  const shippingFee = isFreeShipping ? 0 : selectedGov?.shippingFee || 45;
  const grandTotal = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

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
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#D4AF37", "#F3E5AB", "#AA820A", "#ffffff"],
        });
      } catch {}
    } catch {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(confirmedOrderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappSupportUrl = `https://wa.me/201018995002?text=${encodeURIComponent(
    `مرحباً، أود متابعة طلبي رقم ${confirmedOrderNumber} في متجر SÈN Parfums.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="relative w-full max-w-2xl bg-[#111116] border border-[#D4AF37]/50 rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.9)] max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 w-9 h-9 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-[#D4AF37] transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {!orderConfirmed ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <Truck className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-2xl text-white font-medium">
                تأكيد الطلب — الدفع عند الاستلام فقط (COD)
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mb-6">
              ادفع نقداً للمندوب بعد استلام الشحنة ومعاينتها، مع ضمان استرجاع ذهبي 100% بعينة الـ 2ml المجانية.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="text-xs text-zinc-300 font-medium block mb-1">
                  الاسم بالكامل لاستلام الشحنة *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="مثال: أحمد محمود بدوي"
                  className={`w-full bg-zinc-900 border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-[#D4AF37] transition-colors ${
                    errors.fullName ? "border-red-500" : "border-zinc-800"
                  }`}
                />
                {errors.fullName && (
                  <span className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.fullName}
                  </span>
                )}
              </div>

              {/* Egyptian Mobile */}
              <div>
                <label className="text-xs text-zinc-300 font-medium block mb-1">
                  رقم الموبايل للتواصل والشحن (مصر) *
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="01018995002"
                  className={`w-full bg-zinc-900 border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-[#D4AF37] font-mono text-end transition-colors ${
                    errors.phone ? "border-red-500" : "border-zinc-800"
                  }`}
                />
                {errors.phone && (
                  <span className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.phone}
                  </span>
                )}
                <span className="text-[10px] text-zinc-500 mt-0.5 block">
                  سيتم إرسال رسالة تأكيد عبر واتساب ورسالة نصية قبل خروج المندوب.
                </span>
              </div>

              {/* Governorate Dropdown */}
              <div>
                <label className="text-xs text-zinc-300 font-medium block mb-1">
                  المحافظة *
                </label>
                <select
                  value={formData.governorate}
                  onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37]"
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
                <label className="text-xs text-zinc-300 font-medium block mb-1">
                  العنوان بالتفصيل (المنطقة، الشارع، رقم العمارة أو الشقة) *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="مثال: المعادي، شارع النصر، عمارة 15، الدور الرابع"
                  className={`w-full bg-zinc-900 border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-[#D4AF37] transition-colors ${
                    errors.address ? "border-red-500" : "border-zinc-800"
                  }`}
                />
                {errors.address && (
                  <span className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.address}
                  </span>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs text-zinc-400 font-medium block mb-1">
                  ملاحظات خاصة بالمندوب (اختياري)
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="مثال: يرجى الاتصال قبل الوصول بنصف ساعة"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#D4AF37]"
                />
              </div>

              {/* Strict COD Payment Method Banner */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-[#D4AF37]/40 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0 font-bold">
                  💵
                </div>
                <div className="text-xs">
                  <span className="font-bold text-[#F3E5AB] block mb-0.5">
                    طريقة الدفع: الدفع عند الاستلام فقط (Cash on Delivery)
                  </span>
                  <span className="text-zinc-400 text-[11px]">
                    تدفع ثمن الأوردر نقداً لمندوب الشحن عند استلام الطرد ومعاينته.
                  </span>
                </div>
              </div>

              {/* Order Summary Recap */}
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-xs space-y-2">
                <div className="flex justify-between text-zinc-400">
                  <span>قيمة المنتجات:</span>
                  <span className="font-mono">{subtotal.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>مصاريف الشحن ({formData.governorate}):</span>
                  <span className={shippingFee === 0 ? "text-emerald-400 font-bold" : "font-mono"}>
                    {shippingFee === 0 ? "شحن مجاني لكافة المحافظات" : `${shippingFee} ج.م`}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    الضمان الذهبي وعينة 2ml:
                  </span>
                  <span className="font-bold">مرفقة مجاناً</span>
                </div>
                <div className="flex justify-between text-white font-serif text-base pt-2 border-t border-zinc-800 font-bold">
                  <span>المبلغ المطلوب عند الاستلام:</span>
                  <span className="text-[#F3E5AB]">{grandTotal.toLocaleString()} ج.م</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[48px] py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>جاري تسجيل الطلب وإرساله لغرفة العمليات...</span>
                  </span>
                ) : (
                  <span>
                    تأكيد الأوردر الآن ({grandTotal.toLocaleString()} ج.م عند الاستلام)
                  </span>
                )}
              </button>

              {/* Support Notice */}
              <div className="text-center text-[11px] text-zinc-400 pt-1">
                خدمة العملاء والدعم المباشر:{" "}
                <a href="tel:01018995002" className="text-[#D4AF37] font-mono font-bold hover:underline">
                  01018995002
                </a>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Success State */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 text-[#D4AF37] text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>تم تسجيل الأوردر بنجاح مع الضمان الذهبي</span>
            </div>

            <h2 className="font-serif text-3xl text-white mb-2">
              شكراً لاختيارك SÈN Parfums
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto mb-6">
              تم استلام طلبك وسيتواصل معك مندوبنا هاتفياً أو عبر واتساب لتأكيد ميعاد التوصيل والدفع عند الاستلام.
            </p>

            {/* Order Code Box */}
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-zinc-900 border border-[#D4AF37]/40 mb-6">
              <div className="text-start">
                <span className="text-[10px] text-zinc-500 uppercase block">كود الطلب الخاص بك:</span>
                <span className="font-mono text-base font-bold text-[#F3E5AB]">{confirmedOrderNumber}</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                title="نسخ كود الطلب"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* WhatsApp direct tracking button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <a
                href={whatsappSupportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>متابعة الشحن عبر واتساب الدعم</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
              >
                العودة للمتجر
              </button>
            </div>

            <p className="text-[11px] text-zinc-500">
              الدعم الفني: 01018995002 • youssefbadawy5002@gmail.com
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
