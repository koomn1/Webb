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
  Sparkles,
  ShieldCheck,
  Truck,
  Check,
  ShoppingBag,
  Star,
  ArrowLeft,
  Gift,
  Heart,
  Droplets,
} from "lucide-react";
import { asset, appLink } from "@/lib/paths";

export default function DuoPage() {
  const { products, addToCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedQuickView, setSelectedQuickView] = useState<Perfume | null>(null);
  const [added, setAdded] = useState(false);

  // Find Duo product and individual perfumes
  const duoProduct = products.find((p) => p.id === "sen-duo-bundle") || products[2] || products[0];
  const zesteProduct = products.find((p) => p.id === "sen-zeste") || products[0];
  const auraProduct = products.find((p) => p.id === "sen-aura") || products[1];

  const handleAddDuo = () => {
    if (duoProduct) {
      addToCart(duoProduct, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-[#FAF8F5] selection:bg-[#C58652]/20 selection:text-[#E4C7A8]">
      <Navbar onOpenFinder={() => {}} />

      {/* Hero Showcase for Duo Bundle */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/2 translate-x-1/2 w-[600px] h-[600px] bg-[#C58652]/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb & Tag */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161413] border border-[#C58652]/30 text-[#E4C7A8] text-xs font-medium uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#C58652]" strokeWidth={1.5} />
              <span>الإصدار الملكي المتكامل • SÈN PARIS</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-medium mb-4">
              باقة الثنائي الملكية <span className="champagne-gradient-text italic font-serif">Zeste & Aura</span>
            </h1>
            <p className="max-w-2xl mx-auto text-stone-400 text-xs sm:text-base leading-relaxed font-light">
              التناغم الأرقى بين هيبة الرجل العصري وجاذبية المرأة الآسرة. زجاجتان كاملتان 50 مل + عينتان استكشافيتان 2 مل مع توصيل مجاني وتوفير استثنائي.
            </p>
          </div>

          {/* Main Visual & Offer Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#161413] border border-[#C58652]/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
            {/* Visual Column */}
            <div className="lg:col-span-7 relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#24201D] bg-[#0C0B0A] shadow-2xl group">
              <Image
                src={asset("/images/duo_bundle.webp")}
                alt="باقة الثنائي الملكية SÈN"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-[#0C0B0A]/80 backdrop-blur-md border border-[#C58652]/40 text-[#E4C7A8] text-xs font-semibold">
                وفر 150 ج.م + شحن مجاني
              </div>
              <div className="absolute bottom-4 left-4 right-4 glass-champagne p-3 rounded-xl flex items-center justify-between text-xs text-stone-300">
                <span className="flex items-center gap-1.5 text-[#8EBBA0]">
                  <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
                  <span>مرفق عينتان استكشافيتان 2ml مجاناً</span>
                </span>
                <span className="font-mono text-[#E4C7A8]">2 × 50ml (100ml نقي)</span>
              </div>
            </div>

            {/* Details & CTA Column */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#E4C7A8] mb-2">
                  <div className="flex items-center text-[#C58652]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-mono font-medium">5.0</span>
                  <span className="text-stone-500 font-light">(215 تقييم موثق)</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white mb-2">
                  عطران يكمل كلٌ منهما الآخر
                </h3>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light mb-5">
                  احصل على تجربة دار SÈN كاملة بسعر خاص جداً: سحر انتعاش Zeste الصقلي والجلد المدبوغ، مع نعومة Aura المخملية بتوت العليق وزهور السوسن والمسك الأبيض.
                </p>

                {/* Offer Highlights */}
                <div className="space-y-2.5 text-xs text-stone-300 font-light mb-6">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8EBBA0]" strokeWidth={2} />
                    <span>زجاجة كاملة 50 مل SÈN Zeste (رجالي فاخر)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8EBBA0]" strokeWidth={2} />
                    <span>زجاجة كاملة 50 مل SÈN Aura (حريمي ناعم وساحر)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8EBBA0]" strokeWidth={2} />
                    <span>عينتان استكشافيتان 2 مل لتجربة كل عطر في المنزل أولاً</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8EBBA0]" strokeWidth={2} />
                    <span>شحن وتوصيل مجاني لباب منزلك لكافة المحافظات</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8EBBA0]" strokeWidth={2} />
                    <span>الدفع نقداً عند الاستلام والمعاينة (COD)</span>
                  </div>
                </div>

                {/* Pricing Box */}
                <div className="p-4 rounded-2xl bg-[#0C0B0A] border border-[#24201D] mb-6 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-500 line-through block">
                      1,300 ج.م
                    </span>
                    <span className="font-serif text-3xl font-medium text-[#E4C7A8]">
                      1,150 <span className="text-sm font-sans">ج.م</span>
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#688A75]/20 text-[#8EBBA0] border border-[#688A75]/30 text-xs font-medium">
                    وفر 150 ج.م الآن
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleAddDuo}
                  className={`w-full min-h-[52px] py-4 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-xl ${
                    added
                      ? "bg-[#688A75] text-white"
                      : "bg-gradient-to-r from-[#E4C7A8] via-[#D8B28C] to-[#C58652] text-[#0C0B0A] hover:shadow-[0_0_35px_rgba(197,134,82,0.4)] hover:scale-[1.01]"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" strokeWidth={2} />
                      <span>تمت إضافة باقة الثنائي الملكية للحقيبة!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                      <span>اقتنِ باقة الثنائي الآن (الدفع عند الاستلام)</span>
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-stone-500 font-light">
                  ميثاق الثقة والأمان مفعّل تلقائياً: يحق لك استرجاع الطرد واسترداد كامل أموالك فوراً.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Lifestyle Editorial Feature with Unused Images */}
      <section className="py-20 border-t border-[#24201D] bg-[#161413]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#C58652] block mb-2 font-medium">
              THE SÈN DUALITY • ثنائية الهيبة والرقة
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium mb-3">
              حضورٌ يفرض احترامه، وجاذبيةٌ تأسِر القلوب
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed">
              تعرّف على الملامح العطرية لكل زجاجة في الباقة وكيف يمتزجان ليصنعا هالة من الفخامة المتكاملة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Man Lifestyle - Zeste */}
            <div className="group rounded-3xl overflow-hidden bg-[#161413] border border-[#24201D] hover:border-[#688A75]/50 transition-all shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#0C0B0A]">
                <Image
                  src={asset("/images/lifestyle_man.webp")}
                  alt="عطر SÈN Zeste للرجال"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161413] via-transparent to-transparent" />
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#688A75]/25 border border-[#688A75]/40 text-[#8EBBA0] text-[11px] font-medium backdrop-blur-md">
                  SÈN Zeste • رجالي
                </span>
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="font-serif text-2xl font-medium text-white mb-2">
                  سطوة الانتعاش الصقلي والجلد المدبوغ
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-light mb-4">
                  برغموت كالابريا واليوسفي الصقلي مع دفء السكر المكرمل، يستقران على أخشاب الأرز الأطلسي والجلد المعتق. عطر الثقة والقيادة والهيبة.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-md bg-[#0C0B0A] text-stone-300 text-xs font-light border border-[#24201D]">
                    • برغموت كابري
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#0C0B0A] text-stone-300 text-xs font-light border border-[#24201D]">
                    • سكر مكرمل
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#0C0B0A] text-stone-300 text-xs font-light border border-[#24201D]">
                    • جلد وأرز
                  </span>
                </div>
              </div>
            </div>

            {/* Woman Lifestyle - Aura */}
            <div className="group rounded-3xl overflow-hidden bg-[#161413] border border-[#24201D] hover:border-[#A86E85]/50 transition-all shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#0C0B0A]">
                <Image
                  src={asset("/images/lifestyle_woman.webp")}
                  alt="عطر SÈN Aura للنساء"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161413] via-transparent to-transparent" />
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#A86E85]/25 border border-[#A86E85]/40 text-[#D19BB0] text-[11px] font-medium backdrop-blur-md">
                  SÈN Aura • نسائي
                </span>
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="font-serif text-2xl font-medium text-white mb-2">
                  سحر الأنوثة المخملية والسوسن الأبيض
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-light mb-4">
                  توت العليق الفرنسي والتفاح السكري مع زهور السوسن والياسمين، يستقران على الفانيليا المدغشقرية وخشب الصندل والمسك الأبيض الحريري.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-md bg-[#0C0B0A] text-stone-300 text-xs font-light border border-[#24201D]">
                    • توت وتفاح سكري
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#0C0B0A] text-stone-300 text-xs font-light border border-[#24201D]">
                    • سوسن وياسمين
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#0C0B0A] text-stone-300 text-xs font-light border border-[#24201D]">
                    • صندل ومسك أبيض
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals & Cart */}
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      <ProductModal perfume={selectedQuickView} onClose={() => setSelectedQuickView(null)} />

      <Footer />
    </div>
  );
}
