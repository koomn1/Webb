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
  Package,
  Truck,
  Phone,
  HelpCircle,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { asset, appLink } from "@/lib/paths";

export default function GuaranteePage() {
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const steps = [
    {
      num: "01",
      title: "استلم الشحنة وادفع عند الاستلام",
      desc: "شحن مجاني وسريع لكافة محافظات مصر. يستلم مندوب الشحن المبلغ نقداً عند باب منزلك.",
      icon: Truck,
    },
    {
      num: "02",
      title: "جرّب عينة الـ 2 مل المرفقة",
      desc: "كل طلب يتضمن عينة تجريبية مجانية سعة 2 مل معبأة ومغلفة بشكل منفصل لتجربتها أولاً بحرية تامة.",
      icon: Sparkles,
    },
    {
      num: "03",
      title: "راقب الثبات والفوحان طوال اليوم",
      desc: "استمتع بتدرج النوتات العطرية الملكية وثباتها الاستثنائي الذي يتجاوز 14 ساعة على بشرتك وملابسك.",
      icon: CheckCircle2,
    },
    {
      num: "04",
      title: "الرضا التام أو استرجاع 100% من أموالك",
      desc: "لو لم يُبهرك العطر لأي سبب، احتفظ بعينة الـ 2 مل، وأعد الزجاجة الأصلية الـ 50 مل المغلقة واسترد كامل المبلغ دون سؤال.",
      icon: RotateCcw,
    },
  ];

  const faqs = [
    {
      q: "هل أدفع أي شيء مسبقاً قبل استلام العطر؟",
      a: "نهائياً! طريقة الدفع الوحيدة المعتمدة لدينا هي الدفع عند الاستلام فقط (Cash on Delivery). تدفع للمندوب عند وصول الشحنة إلى باب منزلك.",
    },
    {
      q: "ماذا لو قمت بفتح زجاجة الـ 50 مل الكبيرة؟",
      a: "يشترط الضمان الذهبي فتح عينة الـ 2 مل المرفقة وتجربتها أولاً، مع الحفاظ على زجاجة الـ 50 مل مغلقة بتغليف المصنع في حال رغبتك بالاسترجاع.",
    },
    {
      q: "كيف أطلب استرجاع الأموال في حال لم يعجبني العطر؟",
      a: "ببساطة تواصل مع فريق خدمة العملاء عبر واتساب 01018995002 أو البريد youssefbadawy5002@gmail.com، وسنقوم بإرسال مندوب لاستلام الزجاجة ورد أموالك فوراً.",
    },
    {
      q: "هل سأتحمل رسوم شحن إرجاع المنتج؟",
      a: "لا! في دار SÈN نتحمل رسوم إعادة الشحن كاملة وفق بنود الضمان الذهبي المعتمد.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#08080A] text-[#FCFBFA] selection:bg-[#D4AF37]/20 selection:text-[#F3E5AB]">
      {/* Navigation */}
      <Navbar onOpenFinder={() => setIsFinderOpen(true)} />

      {/* Hero Header */}
      <div className="pt-32 pb-20 bg-gradient-to-b from-[#14141c] to-[#08080A] border-b border-zinc-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-semibold uppercase tracking-widest mb-6">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>سياسة الثقة المطلقة من SÈN Parfums</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6">
            الضمان الذهبي <span className="text-gradient-gold">المعتمد</span>
          </h1>

          <p className="max-w-3xl mx-auto text-zinc-400 text-sm sm:text-lg leading-relaxed mb-8">
            لأننا واثقون من جودة زيوتنا العطرية الفرنسية ونقائها الفائق، نمنحك تجربة خالية تماماً من أي مخاطرة:
            جرب عينة الـ 2 مل المرفقة أولاً، وقرر بنفسك!
          </p>

          <Link
            href={appLink("/shop")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-bold text-sm tracking-wide shadow-xl hover:scale-105 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>اطلب الآن مع الضمان الذهبي</span>
          </Link>
        </div>
      </div>

      {/* Visual & 4-Step Breakdown */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl group">
              <Image
                src={GOLDEN_GUARANTEE_INFO.image}
                alt="الضمان الذهبي SÈN"
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 glass-gold p-4 rounded-xl text-xs text-zinc-200">
                <span className="text-[#F3E5AB] font-bold text-sm block mb-1">
                  زجاجة 50 مل + عينة 2 مل مجاناً
                </span>
                جرّب العينة في هدوء منزلك، وقرر بكل ثقة وأمان.
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                كيف يعمل الضمان الذهبي في 4 خطوات بسيطة؟
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {steps.map((st) => (
                  <div
                    key={st.num}
                    className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 hover:border-[#D4AF37]/50 transition-colors flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] font-black text-sm flex items-center justify-center shrink-0 border border-[#D4AF37]/20">
                      {st.num}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">{st.title}</h3>
                      <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-3xl mx-auto pt-8 border-t border-zinc-900">
            <div className="text-center mb-10">
              <HelpCircle className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-white mb-2">الأسئلة الشائعة حول الضمان</h2>
              <p className="text-zinc-400 text-sm">كل ما ترغب بمعرفته لطلب عطورك براحة بال تامة</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800 text-right"
                >
                  <h4 className="text-sm sm:text-base font-bold text-[#F3E5AB] mb-2">{faq.q}</h4>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>

            {/* Hotline Support */}
            <div className="mt-12 p-6 rounded-2xl glass-gold border border-[#D4AF37]/30 text-center">
              <h3 className="text-base font-bold text-white mb-2">لديك استفسار إضافي؟</h3>
              <p className="text-xs text-zinc-300 mb-4">
                فريق خدمة عملاء دار SÈN متواجد يومياً على مدار الساعة للرد على استفساراتكم.
              </p>
              <a
                href="https://wa.me/201018995002"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-black font-bold text-xs hover:brightness-110 transition-all shadow-lg"
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
