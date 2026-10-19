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
    name: "SÈN Zeste",
    nameEn: "SÈN Zeste (Homme)",
    nameAr: "سِيان زيست (رجالي)",
    gender: "Homme",
    genderAr: "عطر رجالي فاخر",
    taglineAr: "انتعاش الحمضيات الإيطالية المشمسة مع دفء السكر المكرمل والأرز",
    taglineEn: "Italian Blood Orange, Crisp Apple, Caramelized Sugar & Cedarwood",
    price: 650,
    comparePrice: 750,
    volumeMl: 50,
    concentration: "Eau de Parfum",
    oilPct: 20,
    topNotes: ["قشور البرتقال الأحمر", "تفاح مقرمش منعش", "برغموت كالابريا"],
    heartNotes: ["سكر مكرمل دافئ", "زهر البرتقال النيرولي", "هيل استوائي"],
    baseNotes: ["أخشاب الأرز الأطلسي", "حبوب التونكا الفاخرة", "عنبر نقي دافئ"],
    sillage: "فوحان قوي وواثق (9.6/10)",
    longevity: "ثبات يتجاوز 14 ساعة",
    image: "/images/zeste.webp",
    descriptionAr:
      "عطر رجالي صُنع خصيصاً للرجل الأنيق الباحث عن حضور مميز وجذاب. يفتتح بنفحات منعشة من البرتقال الأحمر والتفاح المقرمش، يتبعها قلب دافئ من السكر المكرمل وزهر البرتقال، ليستقر على قاعدة فخمة من خشب الأرز والعنبر.",
    descriptionEn:
      "A bold, invigorating masculine signature balancing crisp blood orange and orchard apple with sweet caramelized sugar and deep cedarwood.",
    rating: 4.97,
    reviewsCount: 184,
    badge: "الأكثر مبيعاً للرجال",
    stockQuantity: 48,
    inStock: true,
  },
  {
    id: "sen-aura",
    slug: "sen-aura",
    name: "SÈN Aura",
    nameEn: "SÈN Aura (Femme)",
    nameAr: "سِيان أورا (حريمي)",
    gender: "Femme",
    genderAr: "عطر نسائي ساحر",
    taglineAr: "عبير أنثوي آسر من التفاح السكري، زهور بيضاء، والمسك المخملي",
    taglineEn: "Red Apple, Sweet Spun Sugar, White Florals & Pure Musk",
    price: 650,
    comparePrice: 750,
    volumeMl: 50,
    concentration: "Eau de Parfum",
    oilPct: 20,
    topNotes: ["تفاح أحمر سكري", "برتقال حلو ندي", "برغموت مشرق"],
    heartNotes: ["غزل بنات وسكر ناعم", "باقة زهور بيضاء ملكية", "ياسمين فرنسي"],
    baseNotes: ["مسك أبيض نقي مخملي", "خشب الصندل العطري", "فانيليا ناعمة"],
    sillage: "هالة أنثوية مغناطيسية (9.5/10)",
    longevity: "ثبات يدوم طوال اليوم",
    image: "/images/aura.webp",
    descriptionAr:
      "تحفة أنثوية ناعمة تُشع رقة وجاذبية لا تُقاوم. يتناغم عبير التفاح الأحمر الحلو وغزل البنات مع باقة الزهور البيضاء ليعانق بشرتك بلمسة مخملية من المسك الأبيض وخشب الصندل.",
    descriptionEn:
      "An enchanting feminine aura wrapped in crisp red apple, whimsical spun sugar, and radiant white petals grounded by velvety white musk.",
    rating: 4.98,
    reviewsCount: 219,
    badge: "الأكثر طلباً للنساء",
    stockQuantity: 36,
    inStock: true,
  },
  {
    id: "sen-duo-bundle",
    slug: "sen-duo-bundle",
    name: "SÈN Duo Bundle",
    nameEn: "SÈN Duo Bundle (Zeste + Aura)",
    nameAr: "باقة الثنائي الملكية (زيست + أورا)",
    gender: "Duo",
    genderAr: "باقة العطرين معاً",
    taglineAr: "احصل على عطر Zeste و Aura معاً بخصم 150 ج.م + شحن مجاني لكافة المحافظات",
    taglineEn: "Both Zeste (50ml) & Aura (50ml) + Free Priority Shipping",
    price: 1150,
    comparePrice: 1300,
    volumeMl: 100,
    concentration: "Eau de Parfum (2 x 50ml)",
    oilPct: 20,
    topNotes: ["قشور برتقال أحمر وتفاح سكري"],
    heartNotes: ["سكر مكرمل وزهور بيضاء نادرة"],
    baseNotes: ["أخشاب الأرز والمسك الأبيض والعنبر"],
    sillage: "ثنائي متناغم استثنائي",
    longevity: "أكثر من 14 ساعة",
    image: "/images/duo_bundle.webp",
    descriptionAr:
      "الباقة الأكثر تميزاً واقتصاداً. تتضمن زجاجة SÈN Zeste الرجالية (50 مل) وزجاجة SÈN Aura النسائية (50 مل)، بالإضافة إلى عينتين 2 مل مجاناً للضمان الذهبي مع شحن مجاني وسريع لكافة محافظات مصر.",
    descriptionEn:
      "The definitive dual luxury set. Includes full bottles of SÈN Zeste and SÈN Aura in individual luxury boxes with two complimentary 2ml Golden Guarantee testers.",
    rating: 5.0,
    reviewsCount: 342,
    badge: "وفر 150 ج.م + شحن مجاني",
    stockQuantity: 25,
    inStock: true,
  },
];

export const GOLDEN_GUARANTEE_INFO = {
  titleAr: "الضمان الذهبي من SÈN",
  titleEn: "The SÈN Golden Guarantee",
  image: "/images/golden_guarantee.webp",
  descriptionAr:
    "مع كل زجاجة عطر تطلبها، نرفق عينة تجريبية (2 مل) من نفس العطر مجاناً. جرّب العينة أولاً؛ إذا لم يُناسبك العطر أو لم يلبِّ تطلعاتك، تواصل معنا لاسترجاع الزجاجة الـ 50 مل المغلقة واسترداد 100% من أموالك دون أي تعقيد.",
  descriptionEn:
    "Every 50ml flacon includes a complimentary 2ml tester vial. Test the vial first. If you are not thoroughly captivated, return the sealed 50ml bottle for a 100% immediate refund.",
  pointsAr: [
    "عينة تجريبية 2 مل مجانية مدمجة مع كل زجاجة.",
    "تجربة آمنة 100% في راحة منزلك قبل فتح الزجاجة الكبيرة.",
    "استرداد كامل المبلغ عند إرجاع العبوة الأصلية مغلقة.",
    "الدفع عند الاستلام بعد معاينة الشحنة.",
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
