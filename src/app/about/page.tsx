"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import {
  Sparkles,
  Award,
  ShieldCheck,
  Droplets,
  ArrowLeft,
  CheckCircle2,
  HeartHandshake,
} from "lucide-react";
import { asset, appLink } from "@/lib/paths";

export default function AboutPage() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-[#FAF8F5] selection:bg-[#C58652]/20 selection:text-[#E4C7A8]">
      <Navbar onOpenFinder={() => {}} />

      {/* Hero Header */}
      <section className="pt-32 pb-20 relative overflow-hidden text-center">
        <div className="absolute top-1/4 right-1/2 translate-x-1/2 w-[600px] h-[300px] bg-[#C58652]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161413] border border-[#C58652]/30 text-[#E4C7A8] text-xs font-medium uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C58652]" strokeWidth={1.5} />
            <span>قصة الدار • L&apos;HISTOIRE DE سين</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-medium mb-6">
            حكاية دار <span className="champagne-gradient-text italic font-serif">سين</span>
          </h1>
          <p className="max-w-2xl mx-auto text-stone-400 text-sm sm:text-base leading-relaxed font-light">
            تقدم دار سين توليفات Eau de Parfum بنوتات واضحة، مع عينة 2 مل تتيح لك تجربة الرائحة قبل فتح الزجاجة الكبيرة.
          </p>
        </div>
      </section>

      {/* Story & Visual Pillars */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#C58652]/30 shadow-2xl bg-[#0C0B0A]">
            <Image
              src={asset("/images/hero.webp")}
              alt="دار سين"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0A]/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 glass-champagne p-4 rounded-2xl text-xs text-stone-300">
              <span className="text-[#E4C7A8] font-medium text-sm block mb-1">
                Zeste وAura • نوتات معلنة
              </span>
              تعرّف على مكونات كل توليفة في صفحات العطور.
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-white">
              لماذا اخترنا أن نكون مختلفين؟
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-light">
              نعرض نوتات العطر ومعلومات الطلب بوضوح، ونرفق عينة 2 مل مع كل زجاجة لتجربتها في المنزل قبل فتح العبوة الأساسية.
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#161413] border border-[#24201D] flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#C58652]/10 text-[#E4C7A8] flex items-center justify-center shrink-0 border border-[#C58652]/20">
                  <Award className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">Eau de Parfum</h4>
                  <p className="text-xs text-stone-400 font-light leading-relaxed">
                    تجد نوتات كل توليفة معلنة في صفحة المنتج، مع عينة 2 مل للتجربة قبل فتح الزجاجة.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#161413] border border-[#24201D] flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#688A75]/15 text-[#8EBBA0] flex items-center justify-center shrink-0 border border-[#688A75]/25">
                  <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">ميثاق الثقة والأمان (العينة 2ml)</h4>
                  <p className="text-xs text-stone-400 font-light leading-relaxed">
                    كل زجاجة 50 مل معها عينة 2 مل. إذا لم يناسبك العطر، تواصل خلال 7 أيام من الاستلام مع إبقاء الزجاجة الكبيرة مغلقة. يتحمل العميل شحن المرتجع عند تغيير الرأي، وتتحمل سين تكلفته عند الخطأ أو العيب؛ ويُرد المبلغ بعد وصول المرتجع وفحصه.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#161413] border border-[#24201D] flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#C58652]/10 text-[#E4C7A8] flex items-center justify-center shrink-0 border border-[#C58652]/20">
                  <HeartHandshake className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">الدفع عند الاستلام</h4>
                  <p className="text-xs text-stone-400 font-light leading-relaxed">
                    لا حاجة لأي بطاقات بنكية أو دفع مسبق. عاين طردك عند باب منزلك وادفع نقداً لمندوب الشحن.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Banner CTA */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#161413] to-[#24201D] border border-[#C58652]/30 text-center relative overflow-hidden">
          <div className="max-w-xl mx-auto space-y-4">
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium">
              هل أنت مستعد لاكتشاف توقيعك العطري؟
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed">
              اختر عطر سين Zeste المنعش أو سين Aura الساحر أو اقتنِ باقة الثنائي الملكية مع الشحن المجاني.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={appLink("/shop")}
                className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#E4C7A8] via-[#D8B28C] to-[#C58652] text-[#0C0B0A] font-semibold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
              >
                تصفح تشكيلة العطور
              </Link>
              <Link
                href={appLink("/duo")}
                className="px-6 py-3.5 rounded-full bg-[#0C0B0A] border border-[#24201D] hover:border-[#C58652]/40 text-stone-200 text-xs font-medium"
              >
                باقة الثنائي الملكية
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cart & Modals */}
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

      <Footer />
    </div>
  );
}
