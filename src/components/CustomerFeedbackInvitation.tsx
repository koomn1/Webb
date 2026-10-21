"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Quote, ShieldCheck, Star } from "lucide-react";
import {
  fetchPublishedProductReviews,
  PublicProductReview,
} from "@/lib/supabase";

const feedbackMessage = encodeURIComponent(
  "مرحباً دار SÈN، جرّبت عينة العطر وأود مشاركة انطباعي."
);

export function CustomerFeedbackInvitation() {
  const [publishedReviews, setPublishedReviews] = useState<PublicProductReview[]>([]);

  useEffect(() => {
    let isMounted = true;
    void fetchPublishedProductReviews().then((reviews) => {
      if (isMounted) setPublishedReviews(reviews.slice(0, 5));
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      {publishedReviews.length >= 3 && (
        <section
          aria-labelledby="customer-reviews-title"
          className="border-y border-[#24201D] bg-[#100F0E] py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#C58652]/30 bg-[#1C1A18] px-3.5 py-1.5 text-xs text-[#E4C7A8]">
                <Quote className="h-3.5 w-3.5" aria-hidden="true" />
                <span>آراء بموافقة أصحابها</span>
              </div>
              <h2 id="customer-reviews-title" className="font-serif text-2xl font-medium text-white sm:text-3xl">
                تجارب حقيقية مع SÈN
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-400">
                كلمات شاركها عملاء جرّبوا العطر ووافقوا على نشر انطباعاتهم.
              </p>
            </div>

            <div
              className={`grid gap-4 ${publishedReviews.length >= 4 ? "md:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-3"}`}
            >
              {publishedReviews.map((review) => (
                <blockquote
                  key={review.id}
                  className="flex h-full flex-col rounded-2xl border border-[#302C28] bg-[#161413] p-5 sm:p-6"
                >
                  {review.rating !== null && (
                    <div className="mb-3 flex items-center gap-1" aria-label={`تقييم ${review.rating} من 5`}>
                      {Array.from({ length: review.rating }, (_, index) => (
                        <Star key={index} className="h-3.5 w-3.5 fill-[#E4C7A8] text-[#E4C7A8]" aria-hidden="true" />
                      ))}
                      <span className="sr-only">{review.rating} من 5</span>
                    </div>
                  )}
                  <Quote className="mb-3 h-5 w-5 text-[#C58652]" aria-hidden="true" />
                  <p className="flex-1 text-sm leading-7 text-stone-200">“{review.quote}”</p>
                  <footer className="mt-5 flex items-center justify-between gap-3 border-t border-[#302C28] pt-4 text-xs">
                    <span className="font-medium text-[#E4C7A8]">{review.reviewer_label}</span>
                    <span className="text-stone-500">{review.product_name}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

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
    </div>
  );
}
