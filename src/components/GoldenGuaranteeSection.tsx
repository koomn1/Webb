"use client";

import React from "react";
import Image from "next/image";
import { ShieldCheck, Sparkles, Phone, PackageCheck, Droplets, Clock, HeartHandshake } from "lucide-react";
import { asset } from "@/lib/paths";

export function GoldenGuaranteeSection() {
  const steps = [
    {
      num: "01",
      title: "استلم وادفع للمندوب",
      desc: "استلم الشحنة وتأكد من سلامة العبوة الخارجية، ثم ادفع قيمة الطلب للمندوب عند التسليم.",
    },
    {
      num: "02",
      title: "اختبر العينة في المنزل (2 مل)",
      desc: "بعد الدفع، افتح العينة 2ml المرفقة من نفس التوليفة وجربها في المنزل قبل فتح الزجاجة الكبيرة.",
    },
    {
      num: "03",
      title: "راقب تطور الرائحة",
      desc: "خذ وقتك لملاحظة النغمات والأثر العطري في ظروفك المعتادة؛ الأداء يختلف حسب البشرة والطقس وطريقة الاستخدام.",
    },
    {
      num: "04",
      title: "استرداد خلال 7 أيام",
      desc: "إن لم يناسبك العطر، تواصل معنا خلال 7 أيام وأعد الزجاجة الكبيرة مغلقة. شحن المرتجع على العميل، إلا عند الخطأ أو العيب.",
    },
  ];

  return (
    <section id="guarantee" className="py-24 bg-[#110F0E] border-t border-b border-[#25221F] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual Side */}
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-[#E4C7A8]/30 shadow-2xl group">
            <Image
              src={asset("/images/golden_guarantee.webp")}
              alt="الضمان الذهبي من سين"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 glass-champagne p-4 rounded-xl text-xs text-[#ECE5DA]">
              <span className="text-[#F5E4D2] font-bold text-sm block mb-1">
                عينة تجريبية 2 مل مجاناً مع كل زجاجة
              </span>
              <span className="text-[#ABA59C]">
                ادفع عند الاستلام، ثم جرّب العينة في منزلك
              </span>
            </div>
          </div>

          {/* Text Story Side */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A261E] border border-[#2B4734] text-[#A5C2B0] text-xs font-semibold uppercase tracking-widest mb-4">
              <ShieldCheck className="w-4 h-4 text-[#688A75]" strokeWidth={1.75} />
              <span>ميثاق الثقة والأمان • سين</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal mb-6 leading-tight">
              تجربةٌ عطرية حرة في منزلك <br />
              <span className="champagne-gradient-text italic font-serif">دون أدنى مخاطرة</span>
            </h2>

            <p className="text-[#ABA59C] text-sm sm:text-base leading-relaxed font-light mb-8">
              نرفق مع كل زجاجة 50 مل عينة 2 مل من نفس التوليفة. ادفع عند الاستلام، جرّب العينة في المنزل، وإذا لم تناسبك يمكنك طلب الإرجاع خلال 7 أيام مع بقاء الزجاجة الكبيرة مغلقة.
            </p>

            {/* 4 Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {steps.map((s, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#181614] border border-[#2B2724]">
                  <span className="font-mono text-[#E4C7A8] font-bold text-base block mb-1">{s.num}</span>
                  <h4 className="font-semibold text-white text-xs mb-1">{s.title}</h4>
                  <p className="text-[11px] text-[#ABA59C] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Support hotline mention */}
            <div className="mt-8 pt-6 border-t border-[#25221F] flex items-center justify-between text-xs text-[#ABA59C]">
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E4C7A8]" strokeWidth={1.5} />
                <span>للاستفسارات ومتابعة الشحنات:</span>
              </span>
              <a href="tel:01018995002" className="text-[#F5E4D2] font-mono font-bold hover:underline">
                01018995002
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
