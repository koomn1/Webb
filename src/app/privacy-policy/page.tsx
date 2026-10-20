"use client";

import Link from "next/link";
import { ShieldCheck, LockKeyhole, BellRing, Database, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { appLink } from "@/lib/paths";

const sections = [
  {
    title: "1. نطاق هذه السياسة",
    body: [
      "توضح هذه السياسة كيف تجمع SÈN Haute Parfumerie (ويُشار إليها باسم «SÈN» أو «نحن») البيانات الشخصية عند استخدام الموقع والتطبيق وميزات تسجيل الحساب والشراء وتتبع الطلبات.",
      "باستخدام خدمات SÈN، تقر بأنك قرأت هذه السياسة. إذا كنت لا توافق على أي جزء منها، يرجى عدم إنشاء حساب أو إرسال بيانات شخصية من خلال الخدمة.",
    ],
  },
  {
    title: "2. البيانات التي نجمعها",
    body: [
      "بيانات الحساب: الاسم، البريد الإلكتروني، رقم الهاتف الاختياري، وبيانات المصادقة التي تعالجها خدمة Supabase Auth. لا نطلب كلمة المرور أو نخزنها في قواعد بياناتنا.",
      "بيانات الطلب: اسم المستلم، رقم الهاتف، المحافظة، العنوان التفصيلي، الملاحظات، المنتجات والكميات، قيمة الطلب، كود الخصم، وحالة التوصيل. نحتاج هذه البيانات لتنفيذ طلب الدفع عند الاستلام والتواصل معك بشأنه.",
      "بيانات الاستخدام التقنية: الصفحة الحالية، نوع الجهاز، ومعرّف جلسة عشوائي مؤقت لقياس الزوار النشطين وتحسين أداء الخدمة. لا نستخدم هذه البيانات لبناء ملف إعلاني عنك.",
    ],
  },
  {
    title: "3. كيف نستخدم البيانات",
    body: [
      "نستخدم البيانات لإنشاء الحساب وتسجيل الدخول، معالجة الطلبات، حساب الشحن والخصومات، عرض سجل طلباتك، وتحديثك بشأن حالة التوصيل.",
      "قد نستخدم البريد الإلكتروني إذا اخترت الاشتراك في دائرة SÈN الخاصة لإرسال أخبار الإصدارات والعروض. يمكنك التوقف عن ذلك بالتواصل معنا.",
      "لا نبيع بياناتك الشخصية ولا نؤجرها ولا نستخدمها لتقييم ائتماني أو لاتخاذ قرارات آلية ذات أثر قانوني عليك.",
    ],
  },
  {
    title: "4. الخدمات ومشاركة البيانات",
    body: [
      "نستخدم Supabase لتوفير المصادقة وقاعدة البيانات والتخزين. تتم مشاركة الحد الأدنى اللازم من البيانات مع هذه الخدمة لتشغيل الحسابات والطلبات.",
      "قد نشارك بيانات التواصل والعنوان مع موظفي الشحن أو مزود التوصيل بالقدر اللازم لتسليم الطلب. لا نشارك كلمة المرور أو بيانات الدفع البنكي، والدفع في الوقت الحالي عند الاستلام.",
      "قد نكشف البيانات إذا كان ذلك مطلوباً قانونياً أو ضرورياً لمنع الاحتيال وحماية حقوق SÈN أو مستخدميها.",
    ],
  },
  {
    title: "5. التخزين والأمان",
    body: [
      "نطبق صلاحيات وصول على مستوى الصفوف في قاعدة البيانات بحيث لا يستطيع العميل قراءة طلبات العملاء الآخرين، بينما تقتصر إدارة الطلبات والمنتجات وأكواد الخصم على المسؤولين المصرح لهم.",
      "نستخدم جلسات المصادقة المخصصة لخدمة Supabase، ونحاول تقليل البيانات المخزنة محلياً في المتصفح إلى تفضيلات السلة والواجهة. لا تضع بيانات شديدة الحساسية داخل الملاحظات أو العنوان.",
      "رغم اتخاذ إجراءات تقنية وتنظيمية معقولة، لا يمكن ضمان أمان أي نقل أو تخزين إلكتروني بنسبة 100%. إذا لاحظت نشاطاً غير معتاد في حسابك، تواصل معنا فوراً.",
    ],
  },
  {
    title: "6. الكوكيز والتخزين المحلي",
    body: [
      "قد يستخدم الموقع تخزين المتصفح للاحتفاظ بسلة المشتريات، حالة تسجيل الدخول التي يديرها مزود المصادقة، وتفضيلات مؤقتة مثل كود الخصم. حذف بيانات الموقع من إعدادات المتصفح قد يؤدي إلى فقدان السلة أو تسجيل الخروج.",
      "لا نستخدم ملفات تعريف ارتباط تسويقية من طرف ثالث لتتبع نشاطك عبر مواقع مختلفة ضمن الوظائف الحالية للتطبيق.",
    ],
  },
  {
    title: "7. إشعارات حالة الطلب",
    body: [
      "في صفحة «منتجاتي» قد يطلب المتصفح إذنك لإرسال إشعارات عند تغير حالة طلبك. الإشعارات اختيارية ويمكن إيقافها من إعدادات المتصفح في أي وقت.",
      "لا نستخدم إذن الإشعارات لإرسال رسائل إعلانية من دون موافقتك، وتظهر الإشعارات المحلية فقط عند اكتشاف تغيير في حالة الطلب الذي يظهر في حسابك.",
    ],
  },
  {
    title: "8. مدة الاحتفاظ والحقوق",
    body: [
      "نحتفظ ببيانات الطلب بالقدر اللازم لخدمة ما بعد البيع، الضمان، المحاسبة، وحل النزاعات أو الالتزامات القانونية. نحتفظ ببيانات الحساب ما دام الحساب نشطاً أو حتى تطلب حذفها، ما لم يمنع القانون ذلك.",
      "يمكنك طلب الوصول إلى بياناتك أو تصحيحها أو حذفها أو إيقاف الرسائل التسويقية. قد نطلب معلومات تحقق معقولة قبل تنفيذ الطلب لحماية الحساب.",
    ],
  },
  {
    title: "9. خصوصية الأطفال",
    body: [
      "الخدمة موجهة للبالغين ولا نطلب بيانات من الأطفال عن علم. إذا اعتقدت أن طفلاً أرسل لنا بيانات شخصية، تواصل معنا حتى نتمكن من مراجعتها وحذفها عند الاقتضاء.",
    ],
  },
  {
    title: "10. التحديثات والتواصل",
    body: [
      "قد نحدّث هذه السياسة عند تغيير الخدمات أو المتطلبات القانونية. سنعرض تاريخ النفاذ في أعلى الصفحة، ويُعد استمرار استخدام الخدمة بعد التحديث قبولاً للنسخة المعدلة.",
      "للاستفسارات أو طلبات الخصوصية، تواصل معنا عبر البريد: youssefbadawy5002@gmail.com أو واتساب: 01018995002.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0C0B0A] text-[#FAF8F5] selection:bg-[#C58652]/20 selection:text-[#E4C7A8]">
      <Navbar onOpenFinder={() => {}} />
      <main dir="rtl" className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <header className="relative overflow-hidden rounded-3xl border border-[#C58652]/30 bg-[#161413] px-6 py-12 sm:px-12 sm:py-16 text-center shadow-2xl">
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-80 h-48 rounded-full bg-[#C58652]/10 blur-[100px] pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C58652]/30 bg-[#0C0B0A] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#E4C7A8]">
                <ShieldCheck className="h-4 w-4 text-[#C58652]" strokeWidth={1.5} />
                <span>Application Privacy Policy</span>
              </div>
              <h1 className="mt-6 font-serif text-4xl font-medium text-white sm:text-6xl">سياسة الخصوصية</h1>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-stone-400 sm:text-base">
                خصوصيتك جزء من ميثاق الثقة في SÈN. نوضح هنا ما نحتاجه لتشغيل حسابك وطلبك، وما لا نفعله ببياناتك.
              </p>
              <p className="mt-5 text-[11px] text-[#C58652]">تاريخ النفاذ: 20 أكتوبر 2026</p>
            </div>
          </header>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#24201D] bg-[#161413]/80 p-5">
              <LockKeyhole className="h-5 w-5 text-[#E4C7A8]" strokeWidth={1.5} />
              <h2 className="mt-4 text-sm font-medium text-white">حماية الحساب</h2>
              <p className="mt-2 text-xs leading-6 text-stone-400">لا نطلب كلمة مرورك ولا نعرض طلباتك لعملاء آخرين.</p>
            </div>
            <div className="rounded-2xl border border-[#24201D] bg-[#161413]/80 p-5">
              <Database className="h-5 w-5 text-[#E4C7A8]" strokeWidth={1.5} />
              <h2 className="mt-4 text-sm font-medium text-white">بيانات ضرورية فقط</h2>
              <p className="mt-2 text-xs leading-6 text-stone-400">نجمع ما يلزم لتنفيذ الطلب والدعم وخدمة ما بعد البيع.</p>
            </div>
            <div className="rounded-2xl border border-[#24201D] bg-[#161413]/80 p-5">
              <BellRing className="h-5 w-5 text-[#E4C7A8]" strokeWidth={1.5} />
              <h2 className="mt-4 text-sm font-medium text-white">إشعارات اختيارية</h2>
              <p className="mt-2 text-xs leading-6 text-stone-400">يمكنك التحكم في إشعارات حالة الطلب من إعدادات المتصفح.</p>
            </div>
          </div>

          <article className="mt-8 space-y-8 rounded-3xl border border-[#24201D] bg-[#110F0E] p-6 sm:p-10">
            {sections.map((section) => (
              <section key={section.title} className="border-b border-[#24201D] pb-8 last:border-b-0 last:pb-0">
                <h2 className="font-serif text-2xl font-medium text-[#F5E4D2]">{section.title}</h2>
                <div className="mt-3 space-y-3 text-sm leading-8 text-stone-300">
                  {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </section>
            ))}
          </article>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#C58652]/25 bg-[#161413] p-5 text-center sm:flex-row sm:text-right">
            <p className="text-xs leading-6 text-stone-400">لديك سؤال عن بياناتك أو تريد تقديم طلب خصوصية؟ فريق SÈN جاهز لمساعدتك.</p>
            <Link href={appLink("/")} className="inline-flex items-center gap-2 rounded-full border border-[#E4C7A8]/40 px-5 py-2.5 text-xs text-[#E4C7A8] transition-colors hover:bg-[#E4C7A8]/10">
              العودة للرئيسية <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
