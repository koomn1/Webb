# معايير وقواعد المشروع (Project Standards & Agent Rules)

يلتزم المساعد البرمجي (Antigravity Agent) والمهندسون العاملون على هذا المشروع بتطبيق الركائز والمعايير التالية بصرامة في جميع المهام البرمجية والتصميمية:

---

## أولاً: معايير الأمان والحماية (Security Standards)

### 1. التحقق وتطهير المدخلات (Schema Validation & Sanitization)
- **مبدأ عدم الثقة (Never Trust Client Input):** التحقق الإلزامي من جميع المدخلات في الخادم (Server-side) قبل معالجتها، والتحقق الاستباقي في العميل (Client-side) لتحسين تجربة الاستخدام.
- **استخدام Zod:** نمذجة والتحقق من صحة كافة هياكل البيانات والـ API Payloads ومعاملات الاستعلام باستخدام مخططات `zod`.
- **الوقاية من هجمات الحقن و XSS:**
  - تطهير المخرجات النصية عند عرض أي محتوى يُدخله المستخدم.
  - عدم استخدام `dangerouslySetInnerHTML` إلا بعد التطهير الصارم بمكتبات مخصصة (مثل DOMPurify).
  - استخدام الاستعلامات المجهزة (Parameterized Queries) والـ ORMs لمنع SQL/NoSQL Injection.

### 2. إدارة الهوية والجلسات (Robust Auth & Token Handling)
- **تخزين الرموز الحساسة:** يُمنع منعاً باتاً تخزين Refresh Tokens أو الرموز الحساسة في `localStorage` أو `sessionStorage`.
- **الكوكيز الآمنة:** استخدام كوكيز محمية بالخواص (`HttpOnly`, `Secure`, `SameSite=Strict` أو `Lax`) للرموز المحدثة وجلسات التوثيق.
- **إدارة دورة حياة الرموز:**
  - استخدام فترات صلاحية قصيرة للـ Access Tokens مع تدوير الرموز (Token Rotation).
  - تطبيق تدفقات OAuth 2.0 القياسية مع PKCE في واجهات العميل وتطبيقات الويب.

### 3. التحكم في الصلاحيات وأمان البيانات (Authorization & RLS)
- **فحص الملكية (Prevent IDOR):** التحقق من أحقية وصول المستخدم للمورد المطلوب صراحة (`userId === resource.ownerId`) في كل طلب واستعلام.
- **أمان مستوى الصفوف (Row-Level Security - RLS):** تطبيق سياسات RLS مباشرة على مستوى قاعدة البيانات لضمان عدم تسريب بيانات مستخدم لآخر حتى في حال وجود ثغرة برمجية في طبقة التطبيق.
- **الوصول الأقل صلاحية (Least Privilege):** قصر صلاحيات المفاتيح والاتصالات وقواعد البيانات على الحد الأدنى اللازم فقط.

### 4. الترويسات وحماية الشبكة (Security Headers & Rate Limiting)
- **ترويسات الأمان:**
  - تفعيل سياسة أمان المحتوى الصارمة (**CSP**) لمنع تنفيذ سكربتات غير موثوقة.
  - ضبط **CORS** بدقة للسماح للنطاقات المعتمدة فقط.
  - تفعيل ترويسات `X-Content-Type-Options: nosniff` و `X-Frame-Options: DENY` و `Strict-Transport-Security`.
- **تقييد المعدل (Rate Limiting):** فرض حدود على معدل الطلبات لمسارات المصادقة (تسجيل الدخول، استعادة كلمة المرور) ومسارات الـ APIs الحساسة لمنع هجمات التخمين و Brute Force.

### 5. إدارة الأسرار وسلسلة التوريد (Secrets & Supply Chain)
- **عزل المفاتيح:** عزل كافة المفاتيح السرية (API Keys, Secrets) عبر متغيرات البيئة وعدم تضمينها مطلقاً في حزم العميل (Client Bundle). استخدام بادئة `NEXT_PUBLIC_` للمتغيرات العامة فقط.
- **فحص التبعيات:** إجراء فحص دوري للثغرات الأمنية باستخدام `npm audit` ومراقبة التبعيات دورياً.

---

## ثانياً: معايير واجهة وتجربة المستخدم (UI / UX Standards)

### 1. نظام التصميم والرموز الدلالية (Design System & Semantic Tokens)
- **مقياس المسافات (Spacing Scale):** الالتزام الصارم بمقياس موحد معتمد على مضاعفات 4 أو 8 (مثل 4px, 8px, 12px, 16px, 24px, 32px).
- **السلم الطباعي (Typography Scale):** اعتماد أحجام وأوزان خطوط محددة وواضحة ترسي تسلسلاً بصرياً جلياً (H1 -> H6 -> Body -> Caption).
- **الرموز الدلالية (Semantic Tokens):** استخدام متغيرات CSS وأصناف Tailwind المبنية على معانٍ وظيفية (مثل `bg-background`, `bg-card`, `text-primary`, `text-muted-foreground`, `border-border`).

### 2. القوانين النفسية لتجربة المستخدم (UX Heuristics & Laws)
- **قانون فيتس (Fitts's Law):**
  - جعل الأزرار وعناصر الدعوة للإجراء (CTA) ذات مساحة نقر كافية ومريحة (الحد الأدنى 44x44px للعناصر التفاعلية).
  - مراعاة منطقة الإبهام (Thumb Zone) في تصميم شاشات الموبايل.
- **قانون هيك (Hick's Law):**
  - تقليل الخيارات المتاحة للمستخدم لتفادي شلل اتخاذ القرار.
  - تطبيق الإفصاح التدريجي (Progressive Disclosure) لعرض الخيارات المتقدمة عند الحاجة فقط.
- **مبادئ نيلسن (Nielsen Heuristics):**
  - الحفاظ الدائم على وضوح حالة النظام (System Status Visibility) عبر مؤشرات التفاعل وحالات التحميل.
  - إتاحة مسار تراجع واضح وسهل (Undo / Cancel) للعمليات الحساسة.

### 3. إمكانية الوصول والشمولية (Accessibility - WCAG 2.1 AA)
- **تباين الألوان (Color Contrast):** ضمان تحقيق نسبة تباين لا تقل عن 4.5:1 للنصوص العادية، و 3:1 للنصوص الكبيرة والعناصر التفاعلية.
- **التنقل عبر لوحة المفاتيح:** دعم كامل لـ `Tab` و `Enter` و `Escape` مع توفير حالات تركيز مرئية بارزة (`focus-visible:ring`).
- **HTML الدلالي و ARIA:**
  - استخدام عناصر HTML الأصلية (`button`, `a`, `nav`, `main`, `header`, `dialog`).
  - استخدام سمات ARIA فقط عند غياب البديل القياسي، والاعتماد على مكونات Radix UI المهيأة مسبقاً لدعم إمكانية الوصول.
  - إضافة نصوص بديلة واضحة (`alt`) للصور التوضيحية وتجاهل الصور التزيينية (`aria-hidden="true"`).

### 4. الأداء المتصور والتفاعلات الدقيقة (Perceived Performance & Micro-interactions)
- **تحديثات الواجهة الاستباقية (Optimistic UI):** تحديث الواجهة فوراً عند تنفيذ تفاعلات شائعة (إعجاب، حفظ، تبديل المفاتيح) مع التراجع الذكي في حال فشل الخادم.
- **هياكل التحميل (Skeleton Loaders):** استخدام هياكل التحميل المطابقة لحجم وشكل المحتوى القادم بدلاً من شاشات التحميل الفارغة.
- **الميكرو-أنيميشن (Micro-interactions):** مدة الحركات والانتقالات لا تتجاوز 150-300ms وتخدم وظيفة واضحة للتغذية الراجعة، مع احترام إعدادات `prefers-reduced-motion`.

### 5. تصميم حالات الخطأ والحالات الفارغة (Error & Empty States)
- **رسائل خطأ قابلة للتنفيذ (Actionable Feedback):** صياغة رسائل خطأ واضحة ومهذبة تشرح ما حدث بدقة وكيفية إصلاحه (مثل زر "إعادة المحاولة" أو توجيه لمسار بديل).
- **تصميم الحالات الفارغة (Empty States):** استغلال الشاشات الخالية لتوجيه وتحفيز المستخدم على اتخاذ خطوته الأولى عبر رسم توضيحي مناسب، ورسالة تشجيعية، وزر تفاعلي مباشر (CTA).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
