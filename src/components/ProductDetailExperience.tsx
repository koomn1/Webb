"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, Minus, Plus, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PERFUMES, Perfume } from "@/data/perfumes";
import { useCart } from "@/context/CartContext";
import { appLink } from "@/lib/paths";

const noteGroups = [
  { key: "topNotes" as const, label: "الافتتاحية", hint: "النوتات العليا" },
  { key: "heartNotes" as const, label: "قلب العطر", hint: "ملامح التوليفة" },
  { key: "baseNotes" as const, label: "القاعدة", hint: "الأساس العطري" },
];

export function ProductDetailExperience({ perfume }: { perfume: Perfume }) {
  const { addToCart, cart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const inCart = cart.find((item) => item.id === perfume.id)?.quantity ?? 0;
  const isBundle = perfume.gender === "Duo";

  const addSelection = () => addToCart(perfume, quantity);

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-[#FAF8F5] pb-24 md:pb-0" dir="rtl">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pt-32">
        <nav aria-label="مسار التنقل" className="mb-6 flex items-center gap-2 text-xs text-stone-400">
          <Link href={appLink("/")} className="min-h-11 inline-flex items-center hover:text-[#E4C7A8]">الرئيسية</Link>
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <Link href={appLink("/shop")} className="min-h-11 inline-flex items-center hover:text-[#E4C7A8]">التشكيلة</Link>
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-[#E4C7A8]" aria-current="page">{perfume.nameAr}</span>
        </nav>

        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
          <div className="lg:sticky lg:top-28">
            <div className="relative aspect-[4/4.4] overflow-hidden rounded-3xl border border-[#302C28] bg-[#161413] shadow-2xl">
              <Image
                src={perfume.image}
                alt={`عبوة ${perfume.nameAr}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 52vw"
                unoptimized={perfume.image?.startsWith("data:") || perfume.image?.startsWith("http")}
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5 pt-16 sm:p-7 sm:pt-20">
                <span className="inline-flex rounded-full border border-[#E4C7A8]/35 bg-black/40 px-3 py-1.5 text-xs text-[#F5E4D2] backdrop-blur-sm">
                  {perfume.genderAr} · {perfume.volumeMl} مل
                </span>
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#C58652]/35 bg-[#C58652]/10 px-3 py-1 text-[11px] font-medium text-[#E4C7A8]">{perfume.concentration}</span>
              {isBundle && <span className="rounded-full border border-[#8EBBA0]/30 bg-[#8EBBA0]/10 px-3 py-1 text-[11px] text-[#A9CBB7]">شحن مجاني</span>}
            </div>
            <h1 className="font-serif text-3xl font-medium leading-tight text-white sm:text-4xl">{perfume.nameAr}</h1>
            <p className="mt-2 text-sm leading-relaxed text-stone-300">{perfume.taglineAr}</p>
            <p className="mt-5 text-sm leading-7 text-stone-400">{perfume.descriptionAr}</p>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-[#302C28] bg-[#161413]/80 p-4 sm:p-5">
              <div>
                <p className="text-xs text-stone-400">{isBundle ? "زجاجتان، 50 مل لكل واحدة" : `${perfume.volumeMl} مل`}</p>
                <p className="mt-1 font-serif text-3xl font-semibold text-[#F5E4D2]">{perfume.price.toLocaleString()} <span className="text-base">ج.م</span></p>
                {inCart > 0 && <p className="mt-1 text-xs text-[#A9CBB7]">في حقيبتك الآن: {inCart}</p>}
              </div>
              <div className="flex items-center rounded-xl border border-[#3A342F] bg-[#0C0B0A] p-1" aria-label="اختيار الكمية">
                <button type="button" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="min-h-11 min-w-11 rounded-lg text-stone-300 transition-colors hover:bg-[#24201D] hover:text-white disabled:opacity-40" aria-label="تقليل الكمية"><Minus className="mx-auto h-4 w-4" /></button>
                <output className="min-w-10 text-center font-mono text-sm text-white" aria-live="polite">{quantity}</output>
                <button type="button" disabled={quantity >= 20} onClick={() => setQuantity((value) => Math.min(20, value + 1))} className="min-h-11 min-w-11 rounded-lg text-stone-300 transition-colors hover:bg-[#24201D] hover:text-white disabled:opacity-40" aria-label="زيادة الكمية"><Plus className="mx-auto h-4 w-4" /></button>
              </div>
            </div>

            <div className="mt-6 space-y-3" aria-label="الهرم العطري">
              <h2 className="text-sm font-semibold text-white">اكتشف النوتات</h2>
              {noteGroups.map((group, index) => (
                <section key={group.key} className="relative overflow-hidden rounded-2xl border border-[#302C28] bg-[#161413]/75 p-4 pr-5">
                  <span className={`absolute inset-y-0 right-0 w-1 ${index === 0 ? "bg-[#8EBBA0]" : index === 1 ? "bg-[#D19BB0]" : "bg-[#C58652]"}`} aria-hidden="true" />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h3 className="text-sm font-medium text-stone-100">{group.label}</h3>
                    <span className="text-[11px] text-stone-500">{group.hint}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-stone-300">{perfume[group.key].join(" · ")}</p>
                </section>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-2xl border border-[#688A75]/25 bg-[#14231A]/40 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#8EBBA0]" aria-hidden="true" />
                <div><h2 className="text-xs font-semibold text-[#A9CBB7]">العينة والضمان الذهبي</h2><p className="mt-1 text-xs leading-5 text-stone-300">عينة 2 مل مع كل زجاجة. جرّبها أولاً؛ تواصل خلال 7 أيام إذا لم يناسبك العطر مع إبقاء الزجاجة الكبيرة مغلقة.</p></div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-[#302C28] bg-[#161413]/75 p-4">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[#E4C7A8]" aria-hidden="true" />
                <div><h2 className="text-xs font-semibold text-[#F5E4D2]">التوصيل والدفع</h2><p className="mt-1 text-xs leading-5 text-stone-300">الدفع عند الاستلام. تظهر رسوم التوصيل حسب المحافظة في خطوة إتمام الطلب{isBundle ? "؛ شحن هذه الباقة مجاني" : ""}.</p></div>
              </div>
            </div>
            <p className="mt-3 text-[11px] leading-5 text-stone-500">عند تغيير الرأي يتحمل العميل تكلفة شحن المرتجع؛ وتتحمل سين تكلفته عند وصول منتج خاطئ أو معيب. يُرد المبلغ بعد وصول المرتجع وفحصه.</p>

            <div className="mt-7 hidden gap-3 md:flex">
              <button type="button" onClick={addSelection} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E4C7A8] via-[#F5E4D2] to-[#C58652] px-5 py-3 text-sm font-bold text-[#0C0B0A] transition-shadow hover:shadow-[0_0_28px_rgba(228,199,168,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5E4D2]">
                <ShoppingBag className="h-4 w-4" aria-hidden="true" /> أضف إلى الحقيبة · {(perfume.price * quantity).toLocaleString()} ج.م
              </button>
              <Link href={appLink("/shop")} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#3A342F] px-5 py-3 text-sm text-stone-200 transition-colors hover:border-[#E4C7A8]/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4C7A8]">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> التشكيلة
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-16 border-t border-[#24201D] pt-10">
          <h2 className="font-serif text-2xl text-white">استكشف بقية التشكيلة</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {PERFUMES.filter((item) => item.id !== perfume.id).map((item) => (
              <Link key={item.id} href={appLink(`/product/${item.slug}`)} className="group flex min-h-24 items-center gap-4 rounded-2xl border border-[#302C28] bg-[#161413]/70 p-3 transition-colors hover:border-[#C58652]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4C7A8]">
                <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#0C0B0A]"><Image src={item.image} alt="" fill sizes="80px" className="object-cover transition-transform duration-300 group-hover:scale-105" /></span>
                <span className="min-w-0 flex-1"><span className="block text-xs text-stone-400">{item.genderAr}</span><span className="mt-1 block font-serif text-lg text-white">{item.nameAr}</span><span className="mt-1 block text-xs text-[#E4C7A8]">{item.price.toLocaleString()} ج.م</span></span>
                <ChevronLeft className="h-4 w-4 text-stone-500 group-hover:text-[#E4C7A8]" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#C58652]/25 bg-[#0C0B0A]/95 p-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1"><span className="block text-[10px] text-stone-400">الإجمالي · {quantity} {quantity === 1 ? "قطعة" : "قطع"}</span><span className="block font-serif text-lg font-semibold text-[#F5E4D2]">{(perfume.price * quantity).toLocaleString()} ج.م</span></div>
          <button type="button" onClick={addSelection} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E4C7A8] to-[#C58652] px-4 text-xs font-bold text-[#0C0B0A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5E4D2]"><ShoppingBag className="h-4 w-4" aria-hidden="true" />أضف إلى الحقيبة</button>
        </div>
      </div>

      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      <Footer />
    </div>
  );
}
