"use client";

import React from "react";
import Image from "next/image";
import { ShieldCheck, Sparkles, CheckCircle2, RotateCcw, Truck, Phone } from "lucide-react";
import { asset } from "@/lib/paths";

export function GoldenGuaranteeSection() {
  const steps = [
    {
      num: "01",
      title: "استلم الشحنة",
      desc: "استلم شحنتك من المندوب في أي مكان في مصر وادفع عند الاستلام بعد التأكد من سلامة الصندوق.",
    },
    {
      num: "02",
      title: "جرّب العينة (2 مل)",
      desc: "افتح العينة التجريبية الـ 2ml المجانية المرفقة في الصندوق، ورش منها على معصمك وملابسك.",
    },
    {
      num: "03",
      title: "عِش التجربة والثبات",
      desc: "راقب تطور النوتات العطرية وقوة الفوحان والثبات الفعلي للعطر على مدار ساعات اليوم.",
    },
    {
      num: "04",
      title: "الرضا التام أو استرداد 100%",
      desc: "لو العطر معجبكش لأي سبب، احتفظ بالعينة ورجّع الزجاجة الـ 50 مل المغلقة واسترد فلوسك فوراً.",
    },
  ];

  return (
    <section id="guarantee" className="py-24 bg-[#0A0A0E] border-t border-b border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual Side */}
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl group">
            <Image
              src={asset("/images/golden_guarantee.webp")}
              alt="الضمان الذهبي من SÈN Parfums"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 glass-gold p-4 rounded-xl text-xs text-zinc-200">
              <span className="text-[#F3E5AB] font-bold text-sm block mb-1">
                عينة تجريبية 2 مل مجاناً مع كل زجاجة
              </span>
              <span className="text-zinc-400">
                تجربة خالية من أي مخاطرة • الدفع عند الاستلام فقط
              </span>
            </div>
          </div>

          {/* Text Story Side */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span>الضمان الذهبي الحقيقي من SÈN</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal mb-6 leading-tight">
              جرّب العطر أولاً في بيتك <br />
              <span className="gold-gradient-text italic font-serif">دون أن تخاطر بمليم واحد</span>
            </h2>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light mb-8">
              ثقتنا في جودة زيوت SÈN ونقائها لا حدود لها. لذلك، نرفق مع كل زجاجة 50 مل عينة تجريبية مطابقة تماماً، لتمنحك حرية التجربة والاختبار قبل فتح العبوة الأصلية.
            </p>

            {/* 4 Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {steps.map((s, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <span className="font-mono text-[#D4AF37] font-bold text-base block mb-1">{s.num}</span>
                  <h4 className="font-semibold text-white text-xs mb-1">{s.title}</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Support hotline mention */}
            <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>للاستفسارات وخدمة ما بعد البيع:</span>
              </span>
              <a href="tel:01018995002" className="text-[#F3E5AB] font-mono font-bold hover:underline">
                01018995002
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
