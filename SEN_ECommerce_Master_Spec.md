# وثيقة المواصفات التقنية والبرومبت الهندسي الشامل لمتجر SÈN Parfums
**Comprehensive Technical Specification, System Prompt & Architecture Blueprint**

---

## 1. نظرة عامة على المشروع والهوية (Project Overview & Identity)

* **اسم البراند:** SÈN Parfums.
* **طبيعة المنصة:** متجر إلكتروني فاخر ذو صفحة هبوط تفاعلية وتجربة شراء سلسة (D2C E-commerce Platform) مبني على مبدأ الفخامة الهادئة (*Quiet Luxury & Minimalism*).
* **الهدف التقني:** بناء متجر عالي السرعة (Sub-second loading)، بحركات بصرية آسرة (Immersive Motion Design) باستخدام GSAP، مع مسار شراء مخصص بنقرة واحدة (One-page frictionless checkout) مهيأ لخدمة السوق المصري والدفع عند الاستلام (COD) والبطاقات البنكية، مع لوحة تحكم إدارية متكاملة (Admin Dashboard).
* **المنتجات الأساسية:**
  1. **SÈN Zeste:** عطر رجالي (قشور برتقال، تفاح مقرمش، برغموت، سكر مكرمل، أخشاب الأرز، وعنبر).
  2. **SÈN Aura:** عطر نسائي (تفاح أحمر، برغموت، قطرات برتقال، غزل بنات وسكر، مسك أبيض نقي).
  3. **SÈN Duo Bundle:** باقة العطرين معاً بسعر ترويجي وشحن مجاني.
  4. **العينة التجريبية (Discovery Sample 2ml):** مدمجة تلقائياً مع كل طلب كـ "الضمان الذهبي".

---

## 2. الستاك التقني والمكتبات (Tech Stack & Libraries)

```
┌────────────────────────────────────────────────────────────────────────┐
│                               FRONTEND                                 │
│  Next.js 15 (App Router) • React 19 • TypeScript • Tailwind CSS v4     │
│  Shadcn UI • Lucide Icons • Zustand (State) • TanStack Query           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────┴────────────────────────────────────┐
│                         ANIMATION & INTERACTIONS                       │
│  GSAP 3 + ScrollTrigger + SplitType • @studio-freight/lenis (Scroll)   │
│  Framer Motion (Micro-interactions & Page Transitions)                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────┴────────────────────────────────────┐
│                           BACKEND & DATABASE                           │
│  Next.js Server Actions & Route Handlers • Prisma ORM                  │
│  PostgreSQL (Supabase / Neon) • Redis (Upstash for Rate Limiting)      │
│  NextAuth.js v5 (Auth.js) / Iron Session (Admin Auth)                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────┴────────────────────────────────────┐
│                       PAYMENTS, MEDIA & LOGISTICS                      │
│  Cloudinary / AWS S3 (Optimized Media) • Paymob / Fawry SDKs           │
│  Bosta / Shipblu Shipping Webhooks • Resend (Transactional Emails)     │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.1 حزمة المكتبات الأساسية (`package.json` Dependencies)
* **Core:** `next`, `react`, `react-dom`, `typescript`, `@types/react`.
* **Styling & UI:** `tailwindcss`, `clsx`, `tailwind-merge`, `class-variance-authority`, `@radix-ui/react-*`, `lucide-react`.
* **Motion & Creative:** `gsap`, `@studio-freight/lenis`, `framer-motion`, `split-type`, `canvas-confetti`.
* **Data & Backend:** `@prisma/client`, `prisma`, `@neondatabase/serverless`, `@upstash/ratelimit`, `@upstash/redis`, `zod`.
* **Auth & Security:** `next-auth@beta`, `bcryptjs`, `jose`.
* **Media & Form Handling:** `react-hook-form`, `@hookform/resolvers`, `cloudinary`, `sharp`.

---

## 3. معمارية الحركات وتجربة المستخدم (GSAP & Motion Architecture)

تعتمد تجربة الموقع على نقل إحساس الفخامة عبر الحركات البصرية السلسة وغير المزعجة، مع دعم الـ Smooth Scrolling لدمج النوتات العطرية بصرياً:

### 3.1 إعداد Lenis + GSAP ScrollTrigger
```typescript
// components/providers/SmoothScrollProvider.tsx
"use client";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return <>{children}</>;
}
```

### 3.2 حركة الكشف عن الزجاجة والهرم العطري (Parallax Reveal)
* **Hero Section:** تكبير تدريجي وتلاشي للزجاجة (`scale: 1.1 -> 1.0` و `opacity: 0 -> 1`) مع تفكيك عناوين "SÈN" عبر `SplitType` ليظهر النص كلمة بكلمة.
* **Sticky Scent Pyramid Section:** تثبيت صورة الزجاجة في المنتصف عبر `ScrollTrigger.create({ pin: true })`، بينما تتتابع نوتات العطر (القمة: البرتقال والتفاح، القلب: السكر والكراميل، القاعدة: أخشاب الأرز والعنبر) بالظهور على جانبي الشاشة بحسب نسبة التمرير.
* **Magnetic Buttons:** جميع أزرار "أضف للسلة" وزر الشراء المباشر تتمتع بحركة مغناطيسية تتبع مؤشر الماوس مع تأثير Glow ناعم.

---

## 4. هيكل الصفحات والمكونات (Site Structure & Pages)

```
app/
├── (shop)/
│   ├── layout.tsx                # رأس الموقع الفاخر، السلة العائمة، الفوتر
│   ├── page.tsx                  # Landing Page الرئيسية فائقة التفاعل
│   ├── products/
│   │   ├── zeste/page.tsx        # صفحة تفاصيل عطر SÈN Zeste
│   │   └── aura/page.tsx         # صفحة تفاصيل عطر SÈN Aura
│   ├── checkout/page.tsx         # صفحة الشراء المباشر بنقرة واحدة
│   ├── order-tracking/page.tsx   # تتبع الطلب بالرقم والموبايل
│   └── order-success/page.tsx    # صفحة نجاح الطلب مع زر الواتساب والتفاصيل
├── (admin)/
│   ├── admin/login/page.tsx      # تسجيل دخول المسؤول المؤمن
│   └── admin/dashboard/
│       ├── layout.tsx            # شريط جانبي للوحة التحكم
│       ├── page.tsx              # الإحصائيات العامة والمبيعات الحية
│       ├── orders/page.tsx       # إدارة الطلبات، الفواتير، والشحن
│       ├── inventory/page.tsx    # مخزون الزجاجات والعينات والزيوت
│       ├── coupons/page.tsx      # أكواد الخصم والعروض الترويجية
│       └── customers/page.tsx    # قاعدة بيانات العملاء والـ LTV
└── api/
    ├── checkout/route.ts         # معالجة الطلب وتطبيق الخصم وحجزه
    ├── webhooks/
    │   ├── paymob/route.ts       # إشعار تأكيد الدفع الإلكتروني
    │   └── shipping/route.ts     # تحديث حالة الشحنة تلقائياً من شركة الشحن
    └── upload/route.ts           # رفع صور المنتجات إلى CDN
```

---

## 5. مخطط قاعدة البيانات وجداول Prisma (Database Architecture)

مخطط PostgreSQL احترافي مصمم للسرعة، وسلامة المعاملات المالية (ACID Compliance)، ودعم التوسع:

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  CUSTOMER
  ADMIN
  OPERATOR
}

enum OrderStatus {
  PENDING           // تم الطلب وبانتظار التأكيد الهاتفي / مراجعة الدفع
  CONFIRMED         // تم تأكيد الأوردر ومطابقته
  PROCESSING        // قيد التجهيز والتعبئة
  SHIPPED           // تم التسليم لشركة الشحن
  DELIVERED         // تم الاستلام بنجاح
  CANCELLED         // تم الإلغاء
  RETURNED          // تم المرتجع (الضمان الذهبي)
}

enum PaymentMethod {
  COD               // الدفع عند الاستلام
  CARD              // بطاقة بنكية
  WALLET            // محافظ إلكترونية (فودافون كاش، إلخ)
}

enum PaymentStatus {
  UNPAID
  PAID
  REFUNDED
}

model User {
  id            String    @id @default(cuid())
  name          String
  phone         String    @unique
  email         String?   @unique
  passwordHash  String?
  role          Role      @default(CUSTOMER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  orders        Order[]

  @@index([phone])
}

model Product {
  id            String          @id @default(cuid())
  slug          String          @unique // "sen-zeste", "sen-aura"
  nameAr        String
  nameEn        String
  gender        String          // "Homme", "Femme", "Unisex"
  subtitleAr    String
  subtitleEn    String
  descriptionAr String
  descriptionEn String
  price         Decimal         @db.Decimal(10, 2)
  comparePrice  Decimal?        @db.Decimal(10, 2)
  sku           String          @unique
  volumeMl      Int             @default(50)
  concentration String          @default("Eau de Parfum")
  oilPct        Int             @default(20)
  stockQuantity Int             @default(0)
  isFeatured    Boolean         @default(true)
  isActive      Boolean         @default(true)
  topNotes      String[]
  heartNotes    String[]
  baseNotes     String[]
  images        ProductImage[]
  orderItems    OrderItem[]
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
}

model ProductImage {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  url       String
  alt       String?
  isPrimary Boolean  @default(false)
  sortOrder Int      @default(0)
}

model Order {
  id              String        @id @default(cuid())
  orderNumber     String        @unique // e.g. "SEN-1004"
  userId          String?
  user            User?         @relation(fields: [userId], references: [id])
  customerName    String
  customerPhone   String
  customerPhoneAlt String?
  customerEmail   String?
  governorate     String        // المحافظة
  city            String        // المدينة / المركز
  shippingAddress String        // العنوان التفصيلي
  orderNotes      String?
  subtotal        Decimal       @db.Decimal(10, 2)
  shippingCost    Decimal       @db.Decimal(10, 2) @default(0.00)
  discountAmount  Decimal       @db.Decimal(10, 2) @default(0.00)
  totalAmount     Decimal       @db.Decimal(10, 2)
  couponCode      String?
  status          OrderStatus   @default(PENDING)
  paymentMethod   PaymentMethod @default(COD)
  paymentStatus   PaymentStatus @default(UNPAID)
  paymentRef      String?       // كود مرجعي لبوابة الدفع
  trackingNumber  String?       // بوليصة شحن بوسطة / شيب بلو
  trackingUrl     String?
  sampleIncluded  Boolean       @default(true) // تفعيل عينة الضمان الذهبي تلقائياً
  items           OrderItem[]
  timeline        OrderTimeline[]
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([orderNumber])
  @@index([customerPhone])
  @@index([status])
}

model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  quantity  Int      @default(1)
  unitPrice Decimal  @db.Decimal(10, 2)
  total     Decimal  @db.Decimal(10, 2)
}

model OrderTimeline {
  id        String      @id @default(cuid())
  orderId   String
  order     Order       @relation(fields: [orderId], references: [id], onDelete: Cascade)
  status    OrderStatus
  note      String?
  createdBy String?     // اسم المسؤول الذي قام بالتعديل
  createdAt DateTime    @default(now())
}

model Coupon {
  id            String    @id @default(cuid())
  code          String    @unique
  discountPct   Int?      // نسبة مئوية (مثلاً 10%)
  discountFixed Decimal?  @db.Decimal(10, 2)
  minSpend      Decimal?  @db.Decimal(10, 2)
  maxUses       Int?
  usedCount     Int       @default(0)
  expiresAt     DateTime?
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
}

model InventoryLog {
  id          String   @id @default(cuid())
  itemType    String   // "BOTTLE_50ML", "SAMPLE_2ML", "CAP", "BOX", "OIL_GRAMS"
  changeQty   Int
  newBalance  Int
  reason      String   // "PRODUCTION", "SALE", "DAMAGE", "RETURN"
  loggedBy    String
  createdAt   DateTime @default(now())
}
```

---

## 6. مواصفات لوحة التحكم للمسؤول (Admin Dashboard)

لوحة تحكم سريعة وعصرية مبنية بـ Shadcn UI تدعم إدارة دورة حياة الأوردر لحظياً:

### 6.1 بطاقات القياس الرئيسية (KPI Cards)
1. **صافي الإيرادات اليومية والشهرية (Net Revenue):** محتسبة بعد استبعاد الطلبات الملغاة والمرتجعة.
2. **معدل تأكيد الطلبات (Confirmation Rate):** نسبة الطلبات التي تحولت من `PENDING` إلى `CONFIRMED`.
3. **متوسط قيمة الطلب (Average Order Value - AOV):** تتبع زيادة السلة عند شراء عطرين (Duo Bundle).
4. **مخزون الأمان (Low Stock Alerts):** تنبيه فوري عند نزول زجاجات عطر Zeste أو Aura أو عينات الـ 2ml عن 15 وحدة.

### 6.2 نظام إدارة الطلبات وبوليصة الشحن (Order Fulfilment Workflow)
* جدول بيانات يدعم الفلترة بالمحافظة، رقم التليفون، والحالة.
* زر مخصص بنقرة واحدة: **"تأكيد الطلب وإرسال رسالة واتساب للعميل"** (توليد رابط WhatsApp مباشر يحتوي على تفاصيل الأوردر وكود الشحنة).
* زر **"تصدير بوليصة الشحن"** متكامل مباشرة مع Webhook شركة الشحن (Bosta API) لسحب البوليصة وإرفاق رقم التتبع `trackingNumber` في ثوانٍ.
* نافذة مخصصة للتعامل مع **"استرجاع الضمان الذهبي"**؛ توثق سبب الإرجاع وحالة العبوة الأصلية.

---

## 7. الأمان، التحقق، والأداء العالي (Security, Defense & Performance)

### 7.1 مكافحة الطلبات الوهمية على الدفع عند الاستلام (Anti-Fake Orders / COD Bot Defense)
* **Rate Limiting عبر Upstash Redis:** منع إنشاء أكثر من أوردر واحد كل 5 دقائق لنفس الـ IP أو نفس رقم الهاتف لمنع هجمات الإغراق.
* **التحقق برمز Cloudflare Turnstile الخفي:** لحجب برامج التتبع والسبام دون إزعاج المشتري باختبارات الكابتشا التقليدية المعقدة.
* **فحص صحة أرقام الهواتف المصرية:** باستخدام `Zod Regex` للتأكد من أن الرقم يبدأ بـ `010`, `011`, `012`, `015` ويتكون من 11 رقماً صحيحاً قبل السماح بإنشاء السجل في قاعدة البيانات.

### 7.2 أمان لوحة التحكم (Admin Hardening)
* تشفير كلمات المرور باستخدام `bcryptjs` مع 12 Salt Rounds.
* مصادقة الجلسة (Session Authentication) عبر `HttpOnly, Secure, SameSite=Strict` Cookies لمنع هجمات XSS و CSRF.
* حماية مسارات الـ API بلوحة الإدارة عبر Next.js Middleware يفحص الـ Role والتوكن قبل السماح بالوصول.

### 7.3 معالجة الوسائط وسرعة التحميل (Media Pipeline)
* تحويل وتخزين كافة صور المنتجات بصيغتي **WebP** و **AVIF** الحديثة لتوفير 70% من حجم النقل.
* تضمين `blurDataURL` (Placeholder ضبابي بحجم بيكسل متناهي الصغر) لكل صورة لمنع الـ Layout Shift (CLS = 0).
* استضافة الصور على CDN مخصص لضمان استجابة أقل من 50ms للمستخدمين في مصر والشرق الأوسط.

---

## 8. البرومبت الهندسي الشامل للتنفيذ (The Master Prompt for AI & Developers)

> انسخ هذا البرومبت الموجه لنماذج الذكاء الاصطناعي (مثل Cursor أو Claude Code) لبدء بناء المشروع بالكامل:

```markdown
You are a Staff Full-Stack Engineer and Creative UI/UX Specialist. 
Your task is to build a high-converting, quiet-luxury e-commerce web application for "SÈN Parfums", a luxury niche fragrance brand.

### Brand DNA:
- Products:
  1. "SÈN Zeste" (Men - Eau de Parfum 50ml, 650 EGP): Top notes of blood orange, crisp apple, Italian bergamot; Heart of caramelized sugar, neroli; Base of cedarwood, tonka bean, amber.
  2. "SÈN Aura" (Women - Eau de Parfum 50ml, 650 EGP): Top notes of red apple, sweet orange, bergamot; Heart of spun sugar, white florals; Base of white musk, sandalwood.
  3. "SÈN Duo Bundle" (1,150 EGP + Free Shipping).
- Unique Selling Point: "The Golden Guarantee" (Every 50ml bottle includes a free 2ml sample vial; customer tests the sample first, and can return the sealed 50ml bottle for a 100% refund).

### Tech Stack & Architecture:
- Framework: Next.js 15 (App Router), React 19, TypeScript.
- Styling: Tailwind CSS v4, Shadcn UI, Lucide Icons.
- Creative Motion: GSAP 3 with ScrollTrigger, @studio-freight/lenis smooth scrolling, Framer Motion for micro-interactions.
- State: Zustand (Cart drawer, sample management, checkout state).
- DB & ORM: PostgreSQL with Prisma ORM (Schema must include User, Product, ProductImage, Order, OrderItem, OrderTimeline, Coupon, InventoryLog).
- Form Handling & Validation: React Hook Form + Zod (Strict Egyptian mobile validation: ^01[0125][0-9]{8}$).
- Security: Upstash Redis Rate Limiting on checkout API, Cloudflare Turnstile bot protection, NextAuth/Iron Session with RBAC for Admin routes.

### Primary Deliverables:
1. Setup Smooth Scrolling Provider with Lenis and sync it with GSAP ScrollTrigger ticker.
2. Build an immersive Landing Page (`/`):
   - Hero section with split-text kinetic typography and bottle floating parallax.
   - Interactive Fragrance Pyramid component for both perfumes (Interactive slider revealing Top, Heart, Base notes).
   - "Golden Guarantee" visual explainer section.
   - Bundle Call-To-Action with dynamic price recalculation.
3. Build a Frictionless 1-Step Checkout (`/checkout`):
   - Optimized for Egyptian Cash on Delivery (COD) and Card payments.
   - Automated delivery cost calculation based on selected Egyptian governorate.
   - Real-time coupon code verification endpoint.
4. Implement complete Prisma Database schema with relations and migrations.
5. Create Secure Admin Dashboard (`/admin/dashboard`):
   - Real-time orders table with status transition workflow (PENDING -> CONFIRMED -> SHIPPED -> DELIVERED).
   - One-click WhatsApp customer message generator.
   - Inventory tracking for 50ml bottles and 2ml sample testers.

Adhere strictly to production-grade clean code, modular architecture, responsive design (Mobile-first), and zero-CLS web performance.
```

---
*تم إنشاء وتوثيق هذا الملف لحفظ المعمارية البرمجية لمتجر SÈN Parfums.*