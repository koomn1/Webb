import { MessageCircle, ShieldCheck } from "lucide-react";

const feedbackMessage = encodeURIComponent(
  "مرحباً دار SÈN، جرّبت عينة العطر وأود مشاركة انطباعي."
);

export function CustomerFeedbackInvitation() {
  return (
    <section
      aria-labelledby="customer-feedback-title"
      className="border-y border-[#24201D] bg-gradient-to-l from-[#161413] via-[#100F0E] to-[#161413] py-16 sm:py-20"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:flex-row lg:justify-between lg:text-right">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#C58652]/30 bg-[#1C1A18] px-3.5 py-1.5 text-xs text-[#E4C7A8]">
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>تجربتك تهمّنا</span>
          </div>
          <h2 id="customer-feedback-title" className="font-serif text-2xl font-medium text-white sm:text-3xl">
            جرّبت العينة؟ شاركنا انطباعك
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-400">
            رأيك يساعدنا على تطوير تجربتك ويمنح العملاء صورة صادقة عن العطر. أرسل ملاحظتك إلى فريق SÈN بعد التجربة.
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-stone-500">
            <ShieldCheck className="h-3.5 w-3.5 text-[#8EBBA0]" aria-hidden="true" />
            <span>لا ننشر أي اقتباس أو اسم عميل إلا بعد أخذ موافقته.</span>
          </p>
        </div>

        <a
          href={`https://wa.me/201018995002?text=${feedbackMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="إرسال انطباعك عن العينة إلى SÈN عبر واتساب"
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-[#C58652]/40 bg-[#1C1A18] px-6 py-3 text-sm font-medium text-[#E4C7A8] transition-colors hover:border-[#E4C7A8] hover:bg-[#24201D]"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          <span>شارك تجربتك عبر واتساب</span>
        </a>
      </div>
    </section>
  );
}
