"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { FragranceFinder } from "@/components/FragranceFinder";
import { GOLDEN_GUARANTEE_INFO } from "@/data/perfumes";
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Truck,
  Phone,
  HelpCircle,
  ShoppingBag,
} from "lucide-react";
import { appLink } from "@/lib/paths";

export default function GuaranteePage() {
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const steps = [
    {
      num: "01",
      title: "استلام الطرد والدفع عند المعاينة",
      desc: "توصيل سريع ومؤمن لكافة محافظات مصر. تدفع للمندوب نقداً بعد استلام طردك وفحصه بكل طمأنينة.",
      icon: Truck,
    },
    {
      num: "02",
      title: "اختبار العينة الاستكشافية 2ml المرفقة",
      desc: "كل طرد يتضمن قارورة عينة استكشافية سعة 2ml مطابقة تماماً للزجاجة، ومغلفة بشكل منفصل لتجربتها أولاً بحرية.",
      icon: Sparkles,
    },
    {
      num: "03",
      title: "ملاحظة الفوحان وثبات الزيوت طوال اليوم",
      desc: "استمتع بتدرج النغمات العطرية النيش وثباتها الاستثنائي الذي يتجاوز 14 ساعة على ملابسك وبشرتك.",
      icon: CheckCircle2,
    },
    {
      num: "04",
      title: "الرضا التام أو استرداد كامل القيمة",
      desc: "إن لم يطابق العطر ذائقتك لأي سبب، احتفظ بعينة الـ 2ml، وأعد الزجاجة الكبرى المغلقة واسترد كامل المبلغ دون أي تعقيد أو تكلفة شحن.",
      icon: RotateCcw,
    },
  ];

  const faqs = [
    {
      q: "هل أقوم بسداد أي مبالغ إلكترونياً قبل استلام العطر؟",
      a: "نهائياً! طريقة الدفع الوحيدة المعتمدة لدينا هي الدفع عند الاستلام والمعاينة (Cash on Delivery). تدفع لمندوب التوصيل عند باب منزلك.",
    },
    {
      q: "ماذا لو قمت بفتح زجاجة الـ 50 مل الكبيرة؟",
      a: "يقضي ميثاق الثقة بفتح عينة الـ 2 مل المرفقة واختبارها أولاً، مع بقاء زجاجة الـ 50 مل مغلفة بتغليف المصنع الأصلي في حال الرغبة في الاسترجاع.",
    },
    {
      q: "كيف أطلب استرجاع القيمة في حال لم يطابق العطر ذوقي؟",
      a: "ببساطة تواصل مع فريق خدمة العملاء عبر واتساب 01018995002 أو البريد youssefbadawy5002@gmail.com، وسنرسل مندوبنا لاستلام الزجاجة ورد أموالك فوراً.",
    },
    {
      q: "هل أتحمل مصاريف شحن إعادة المنتج؟",
      a: "لا! دار SÈN تتحمل كافة رسوم إعادة الشحن وفق بنود ميثاق الثقة والأمان المعتمد.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-[#FAF8F5] selection:bg-[#C58652]/20 selection:text-[#E4C7A8]">
      {/* Navigation */}
      <Navbar onOpenFinder={() => setIsFinderOpen(true)} />

      {/* Hero Header */}
      <div className="pt-32 pb-20 bg-gradient-to-b from-[#161413] to-[#0C0B0A] border-b border-[#24201D] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161413] border border-[#688A75]/40 text-[#8EBBA0] text-xs font-medium uppercase tracking-widest mb-6">
            <ShieldCheck className="w-4 h-4 text-[#8EBBA0]" strokeWidth={1.5} />
            <span>ميثاق الثقة والأمان • SÈN Haute Parfumerie</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium text-white tracking-tight mb-6">
            ميثاق الثقة <span className="champagne-gradient-text">والتجربة الآمنة</span>
          </h1>

          <p className="max-w-3xl mx-auto text-stone-400 text-sm sm:text-lg leading-relaxed mb-8 font-light">
            لأننا نثق ببراعة توليفاتنا ونقاء الزيوت الفرنسية النادرة بتركيز 20%، نمنحك تجربة خالية تماماً من أي تردد:
            اختبر العينة الاستكشافية 2 مل أولاً في راحة منزلك، وقرر بكل ثقة.
          </p>

          <Link
            href={appLink("/shop")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#E4C7A8] via-[#D8B28C] to-[#C58652] text-[#0C0B0A] font-semibold text-xs tracking-wider uppercase shadow-xl hover:scale-105 transition-all"
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
            <span>اقتنِ عطرك الآن مع ميثاق الأمان</span>
          </Link>
        </div>
      </div>

      {/* Visual & 4-Step Breakdown */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#C58652]/30 shadow-2xl group">
              <Image
                src={GOLDEN_GUARANTEE_INFO.image}
                alt="ميثاق الثقة والأمان SÈN"
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0A]/85 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 glass-champagne p-4 rounded-2xl text-xs text-stone-200">
                <span className="text-[#E4C7A8] font-medium text-sm block mb-1">
                  زجاجة 50 مل + عينة استكشافية 2 مل مجاناً
                </span>
                جرّب العينة في هدوء منزلك، وقرر بكل ثقة واطمئنان.
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white">
                كيف يعمل ميثاق الثقة في 4 خطوات هادئة؟
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {steps.map((st) => (
                  <div
                    key={st.num}
                    className="p-5 rounded-2xl bg-[#161413] border border-[#24201D] hover:border-[#C58652]/40 transition-colors flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#C58652]/10 text-[#E4C7A8] font-mono font-medium text-sm flex items-center justify-center shrink-0 border border-[#C58652]/20">
                      {st.num}
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-white mb-1">{st.title}</h3>
                      <p className="text-stone-400 text-xs sm:text-sm leading-relaxed font-light">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-3xl mx-auto pt-8 border-t border-[#24201D]">
            <div className="text-center mb-10">
              <HelpCircle className="w-8 h-8 text-[#C58652] mx-auto mb-3" strokeWidth={1.5} />
              <h2 className="font-serif text-2xl font-medium text-white mb-2">الأسئلة الشائعة حول الميثاق</h2>
              <p className="text-stone-400 text-sm font-light">كل ما ترغب بمعرفته لاقتناء عطورك براحة بال تامة</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-[#161413]/60 border border-[#24201D] text-right"
                >
                  <h4 className="text-sm sm:text-base font-medium text-[#E4C7A8] mb-2">{faq.q}</h4>
                  <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-light">{faq.a}</p>
                </div>
              ))}
            </div>

            {/* Hotline Support */}
            <div className="mt-12 p-6 rounded-3xl bg-[#161413] border border-[#C58652]/30 text-center">
              <h3 className="font-serif text-base font-medium text-white mb-2">هل لديك أي استفسار إضافي؟</h3>
              <p className="text-xs text-stone-300 mb-4 font-light">
                فريق الاستشارات العطرية في دار SÈN متواجد يومياً للرد على كافة أسئلتكم ومساعدتكم.
              </p>
              <a
                href="https://wa.me/201018995002"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-[#0C0B0A] font-semibold text-xs hover:brightness-105 transition-all shadow-lg"
              >
                <Phone className="w-4 h-4" />
                <span>تواصل معنا عبر واتساب: 01018995002</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Cart & Modals */}
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      <FragranceFinder
        isOpen={isFinderOpen}
        onClose={() => setIsFinderOpen(false)}
        onSelectPerfume={() => {}}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
