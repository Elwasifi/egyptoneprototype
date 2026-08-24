# Egypt One — تصور تنفيذ المنصة (UI/UX فقط)

نعم، تنفيذ هذا التصميم كاملاً كواجهة (UI/UX) ممكن بالكامل: لوحة داكنة فاخرة، شريط جانبي متعدد الأقسام، شبكة بطاقات كثيفة، وكل الصفحات الداخلية — بدون باك-إند في هذه المرحلة (بيانات تجريبية ثابتة).

## 1) تحليل الصورة المرفقة

الصفحة الرئيسية مبنية على ثلاث مناطق:

```text
+----------------+-------------------------------------+------------------+
| Sidebar        | Top bar (search / nav / user)       |                  |
| (أقسام مطوية)  |-------------------------------------+------------------|
|                | Hero + Search Tabs                  | Country / My Trip|
|                | Quick Categories (11 أيقونة)        | Currency/Weather |
|                | Discover cards (6)                  | Tourism Intel    |
|                | Ages / Affiliates / Wear Egypt      | Top countries    |
|                | 5 Sector cards                      | Top governorates |
|                | 5 Promo cards                       |                  |
+----------------+-------------------------------------+------------------+
| Trust bar (5 عناصر) + Footer ضخم متعدد الأعمدة                          |
+-------------------------------------------------------------------------+
```

- الهوية: خلفية كحلي/أسود مزرق، ذهبي كلون أساسي (#C9A84C تقريباً)، بطاقات بحواف 12px وحدود خفيفة، صور فوتوغرافية دافئة مع تدرج أسود سفلي للنص.
- الأيقونات: خطية داخل دائرة ذهبية باهتة.
- شارات ملونة: New / Hot / AI.
- الكثافة عالية جداً: معلومات مضغوطة بمسافات صغيرة (نمط لوحة تحكم سياحية لا لاندينج بيدج).

## 2) نظام التصميم (Design System)

- Tokens في `src/styles.css` بصيغة oklch: background كحلي عميق، surface، gold (primary)، gold-soft، success/warn/danger للشارات، حدود بشفافية.
- خطوط: عنوان Display حاد + نص Sans حديث، مع دعم عربي (Cairo/IBM Plex Arabic) لأن المستخدم عربي.
- مكوّنات مشتركة: SectionHeader (عنوان + View all)، MediaCard، StatCard، IconTile، Badge، Sidebar item، RailPanel، TrustItem، Footer.
- دعم RTL/LTR ومحوّل لغة EN/AR.

## 3) الصفحات المقترحة (المرحلة الأولى ~18 صفحة)

1. الرئيسية (كما في الصورة)
2. Discover Egypt (فهرس عام)
3. 27 محافظة (شبكة) + صفحة محافظة مفردة
4. Egypt Through Time (خط زمني)
5. Heritage Sites / Museums / Hidden Heritage (قوالب فهرس + تفصيل)
6. Hotels & Stays (نتائج + فلاتر + تفصيل)
7. Flights / Transport (نتائج بحث)
8. Attractions & Tours
9. Nile & Sea Experiences
10. Guides & Assistants
11. Food & Restaurants
12. Events & Festivals (+ تفصيل فعالية)
13. Smart Trip Planner (متعدد الخطوات)
14. AI Concierge (واجهة محادثة)
15. Deals / Special Offers
16. Invest & Business (هَب + Real Estate + Entertainment)
17. Services (Visa, Health, Safety, Egypt One Pass, Loyalty)
18. Support / Help Center + Document Center

قوالب متكررة: Listing، Detail، Wizard، Dashboard، Chat، Static content.

## 4) القوائم

- شريط جانبي: 4 مجموعات (Plan your trip / Discover Egypt / Invest & Business / Services) + بطاقة AI Concierge أسفله، قابل للطي على الشاشات المتوسطة، ويتحول إلى Drawer على الموبايل.
- شريط علوي: بحث عام، 7 عناصر تنقل، لغة، مفضلة، إشعارات، حساب المستخدم.
- تبويبات داخل الهيرو: Explore / Stays / Flights / Activities / Transport.
- فوتر: 5 أعمدة + متاجر التطبيقات + QR + شارة حكومية.

## 5) الصور

كل بطاقة تحتاج صورة مولّدة بأسلوب موحّد (تصوير سينمائي دافئ، ساعة ذهبية): هيرو الأهرامات، النيل، معابد، متاحف، فنادق، حرف يدوية، ريف، عقارات، طيران. تولَّد ضمن `src/assets` عند التنفيذ.

## 6) الموبايل

عمود واحد، الهيرو مضغوط، الفئات السريعة كشريط أفقي قابل للسحب، اللوحة اليمنى تنزل أسفل المحتوى، تنقّل سفلي من 5 عناصر.

## 7) خطة التنفيذ المقترحة

- المرحلة 1: نظام التصميم + الشِل (Sidebar/Topbar/Footer) + الصفحة الرئيسية كاملة بالصور.
- المرحلة 2: صفحات Discover والمحافظات والتراث.
- المرحلة 3: صفحات الحجز/النتائج + Trip Planner + AI Concierge (واجهة).
- المرحلة 4: Invest & Services & Support + تلميع + RTL + SEO لكل صفحة.

## ملاحظات تقنية

TanStack Start + Tailwind v4، كل صفحة ملف داخل `src/routes` مع `head()` خاص، بيانات تجريبية في `src/data`، بلا باك-إند حتى تطلب تفعيل Lovable Cloud لاحقاً (تسجيل دخول، حجوزات، AI Concierge حقيقي).
