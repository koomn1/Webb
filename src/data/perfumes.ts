import { asset } from "@/lib/paths";

export const FRAGRANCE_CONCENTRATION_LABEL = "Eau de Parfum";
export const FRAGRANCE_OIL_PERCENTAGE = 0;

export interface Perfume {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  nameAr: string;
  gender: "Homme" | "Femme" | "Duo";
  genderAr: string;
  taglineAr: string;
  taglineEn: string;
  price: number; // in EGP
  comparePrice?: number;
  volumeMl: number;
  concentration: string;
  oilPct: number;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  sillage: string;
  longevity: string;
  image: string;
  descriptionAr: string;
  descriptionEn: string;
  rating: number;
  reviewsCount: number;
  badge?: string;
  stockQuantity: number;
  inStock: boolean;
}

export const PERFUMES: Perfume[] = [
  {
    id: "sen-zeste",
    slug: "sen-zeste",
    name: "سين Zeste",
    nameEn: "سين Zeste (Homme)",
    nameAr: "سين زيست (رجالي)",
    gender: "Homme",
    genderAr: "عطر رجالي فاخر",
    taglineAr: "حمضيات مشرقة تلتقي بحلاوة السكر ودفء الأخشاب",
    taglineEn: "Italian Blood Orange, Crisp Apple, Caramelized Sugar & Cedarwood",
    price: 650,
    volumeMl: 50,
    concentration: FRAGRANCE_CONCENTRATION_LABEL,
    oilPct: 0,
    topNotes: ["برتقال أحمر", "تفاح مقرمش", "برغموت"],
    heartNotes: ["سكر مكرمل ومغزول", "نيرولي"],
    baseNotes: ["خشب الأرز", "حبوب التونكا", "عنبر"],
    sillage: "يختلف الفوحان بحسب البشرة والجو وطريقة الاستخدام",
    longevity: "تختلف مدة بقاء العطر بحسب البشرة والجو وطريقة الاستخدام",
    image: asset("/images/zeste.webp"),
    descriptionAr:
      "يفتتح SÈN Zeste بنفحات البرتقال الأحمر والتفاح المقرمش والبرغموت، ثم ينتقل إلى السكر المكرمل والمغزول والنيرولي، ويستقر على قاعدة من خشب الأرز وحبوب التونكا والعنبر.",
    descriptionEn:
      "A bold, invigorating masculine signature balancing crisp blood orange and orchard apple with sweet caramelized sugar and deep cedarwood.",
    rating: 0,
    reviewsCount: 0,
    stockQuantity: 48,
    inStock: true,
  },
  {
    id: "sen-aura",
    slug: "sen-aura",
    name: "سين Aura",
    nameEn: "سين Aura (Femme)",
    nameAr: "سين أورا (حريمي)",
    gender: "Femme",
    genderAr: "عطر نسائي ساحر",
    taglineAr: "تفاح وبرتقال حلو مع سكر مغزول وزهور بيضاء ومسك ناعم",
    taglineEn: "Red Apple, Sweet Spun Sugar, White Florals & Pure Musk",
    price: 650,
    volumeMl: 50,
    concentration: FRAGRANCE_CONCENTRATION_LABEL,
    oilPct: 0,
    topNotes: ["تفاح أحمر", "برتقال حلو", "برغموت"],
    heartNotes: ["سكر مغزول", "زهور بيضاء"],
    baseNotes: ["مسك أبيض", "خشب الصندل"],
    sillage: "يختلف الفوحان بحسب البشرة والجو وطريقة الاستخدام",
    longevity: "تختلف مدة بقاء العطر بحسب البشرة والجو وطريقة الاستخدام",
    image: asset("/images/aura.webp"),
    descriptionAr:
      "يجمع SÈN Aura بين التفاح الأحمر والبرتقال الحلو والبرغموت، وقلب من السكر المغزول والزهور البيضاء، مع قاعدة من المسك الأبيض وخشب الصندل.",
    descriptionEn:
      "An enchanting feminine aura wrapped in crisp red apple, whimsical spun sugar, and radiant white petals grounded by velvety white musk.",
    rating: 0,
    reviewsCount: 0,
    stockQuantity: 36,
    inStock: true,
  },
  {
    id: "sen-duo-bundle",
    slug: "sen-duo-bundle",
    name: "سين Duo Bundle",
    nameEn: "سين Duo Bundle (Zeste + Aura)",
    nameAr: "باقة الثنائي الملكية (زيست + أورا)",
    gender: "Duo",
    genderAr: "باقة العطرين معاً",
    taglineAr: "ثنائية الشغف والأناقة: Zeste الرجالي و Aura النسائي معاً بتوفير 150 ج.م وشحن مجاني",
    taglineEn: "Both Zeste (50ml) & Aura (50ml) + Free Shipping",
    price: 1150,
    comparePrice: 1300,
    volumeMl: 100,
    concentration: `${FRAGRANCE_CONCENTRATION_LABEL} (2 × 50ml)`,
    oilPct: 0,
    topNotes: ["برتقال أحمر", "تفاح مقرمش", "برغموت", "تفاح أحمر", "برتقال حلو"],
    heartNotes: ["سكر مكرمل ومغزول", "نيرولي", "زهور بيضاء"],
    baseNotes: ["خشب الأرز", "حبوب التونكا", "عنبر", "مسك أبيض", "خشب الصندل"],
    sillage: "يختلف الفوحان بحسب البشرة والجو وطريقة الاستخدام",
    longevity: "تختلف مدة بقاء العطر بحسب البشرة والجو وطريقة الاستخدام",
    image: asset("/images/duo_bundle.webp"),
    descriptionAr:
      "تضم باقة SÈN Duo زجاجتي Zeste وAura بحجم 50 مل لكل منهما، مع عينة 2 مل لكل عطر ضمن الضمان الذهبي وشحن مجاني.",
    descriptionEn:
      "The definitive dual luxury set. Includes full bottles of سين Zeste and سين Aura in individual luxury boxes with two complimentary 2ml Golden Guarantee testers.",
    rating: 0,
    reviewsCount: 0,
    badge: "وفر 150 ج.م + شحن مجاني",
    stockQuantity: 25,
    inStock: true,
  },
];

export const GOLDEN_GUARANTEE_INFO = {
  titleAr: "الضمان الذهبي من سين",
  titleEn: "The سين Golden Guarantee",
  image: asset("/images/golden_guarantee.webp"),
  descriptionAr:
    "مع كل زجاجة عطر نرفق عينة 2 مل من نفس العطر. جرّب العينة أولاً؛ وإذا لم يناسبك العطر، تواصل معنا خلال 7 أيام من الاستلام لإرجاع زجاجة 50 مل مغلقة واسترداد قيمتها بعد وصول المرتجع وفحصه. يتحمل العميل تكلفة شحن المرتجع عند تغيير الرأي، وتتحمل سين تكلفته إذا وصل منتج خاطئ أو به عيب.",
  descriptionEn:
    "Every 50ml bottle includes a complimentary 2ml sample. Test the sample first; if it is not right for you, contact us within 7 days of delivery to return the sealed 50ml bottle. A refund is issued after the return arrives and is inspected. Return shipping is paid by the customer for a change of mind; SÈN covers it for an incorrect or defective item.",
  pointsAr: [
    "عينة تجريبية 2 مل مجانية مدمجة مع كل زجاجة.",
    "جرّب العينة في المنزل قبل فتح الزجاجة الكبيرة.",
    "تواصل خلال 7 أيام من الاستلام، مع إبقاء الزجاجة الكبيرة مغلقة.",
    "شحن المرتجع على العميل عند تغيير الرأي؛ وعلى سين في حال الخطأ أو العيب.",
    "يُرد المبلغ بعد وصول المرتجع وفحصه.",
  ],
};

export const EGYPTIAN_GOVERNORATES = [
  { name: "القاهرة", shippingFee: 40 },
  { name: "الجيزة", shippingFee: 40 },
  { name: "الإسكندرية", shippingFee: 45 },
  { name: "القليوبية", shippingFee: 45 },
  { name: "الشرقية", shippingFee: 50 },
  { name: "الدقهلية (المنصورة)", shippingFee: 50 },
  { name: "الغربية (طنطا)", shippingFee: 50 },
  { name: "المنوفية", shippingFee: 50 },
  { name: "البحيرة", shippingFee: 50 },
  { name: "كفر الشيخ", shippingFee: 50 },
  { name: "دمياط", shippingFee: 50 },
  { name: "بورسعيد", shippingFee: 55 },
  { name: "الإسماعيلية", shippingFee: 55 },
  { name: "السويس", shippingFee: 55 },
  { name: "بني سويف", shippingFee: 60 },
  { name: "الفيوم", shippingFee: 60 },
  { name: "المنيا", shippingFee: 65 },
  { name: "أسيوط", shippingFee: 70 },
  { name: "سوهاج", shippingFee: 75 },
  { name: "قنا", shippingFee: 80 },
  { name: "الأقصر", shippingFee: 85 },
  { name: "أسوان", shippingFee: 90 },
  { name: "البحر الأحمر", shippingFee: 90 },
  { name: "جنوب سيناء", shippingFee: 90 },
];
