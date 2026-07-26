# تحليل ملاحظات المؤسس — ehyamesaha.sa MVP
# Founder Feedback Analysis — Full Breakdown

> Source: `ehyamesaha.sa_MVP.pdf` (31 pages of annotated screenshots + mockups)
> Status: **Analysis only — no code changed.** This is the input for the execution prompt.

---

## 0. THE BIG PICTURE (read this first)

The feedback is **not** a list of cosmetic tweaks. It is a **repositioning of the product**. Four structural shifts:

| # | Shift | From (today) | To (required) |
|---|-------|--------------|---------------|
| 1 | **Brand** | "مساحة / Masaha" generic marketplace | **"إحياء مساحة" (Ehya Masaha)** — a real company, Khobar-based, with FAL-licensed real-estate brokerage |
| 2 | **Booking model** | Request → seller approves → confirmed | **Direct booking** (instant), buyer can cancel per policy |
| 3 | **Search** | Browse spaces one-off by single date | **Recurring-program search** (date range + weekdays + time window) with auto multi-session discount |
| 4 | **Customer** | Generic "tenant" | **Schools / educational institutions** (مدارس، مؤسسات تعليمية) booking recurring programs |

Everything else follows from these four.

---

## 1. REBRAND & GLOBAL CHANGES

### 1.1 Identity (p.3, p.16 mockup)
- Brand name: `مساحة` → **`إحياء مساحة`** (English: **Ehya Masaha**). New logo required (founder drew a placeholder box marked "logo").
- Footer company blurb → replace with:
  > إحياء مساحة شركة ناشئة متخصصة في تعظيم الاستفادة من المساحات غير المستغلة من خلال حلول متكاملة للربط، والتشغيل، والإدارة، والتقنية.
- Contact details (footer + everywhere):
  - Email: ~~info@masaha.sa~~ → **info@ehyamesaha.sa**
  - Phone: ~~+966 50 000 0000~~ → **+966 50 491 3274**
  - City: ~~الرياض~~ → **الخبر، المملكة العربية السعودية**

### 1.2 Numerals — HIGH PRIORITY (p.6, p.17)
- Annotations: `#اعتماد الأرقام بهذا الرسم (200)` and `#الأرقام بالعربي (1,2,3)`
- **All numbers must render as Latin digits `0123456789`, never Arabic-Indic `٠١٢٣٤٥٦٧٨٩`.**
- Affects: prices, dates, capacities, counters, stat cards, IDs, ratings.
- Root cause in code: `toLocaleString('ar-SA')` produces `٢٠٠`. Switch to `'en-US'` (or `ar-SA-u-nu-latn`) everywhere.
- Seen wrong on pages: 6, 16, 19, 22, 23, 24.

### 1.3 Time format bug — HIGH PRIORITY (p.6, p.16)
- Annotations: `#معكوس (تنسيق)` and `#تحسين المعكوس`
- Times render **reversed**: `12:30 PM` displays as `PM 30:12`, `08:00 AM` as `AM 00:08`.
- Cause: RTL bidi on time strings. Fix: wrap all time values/inputs in `dir="ltr"` (and check the من/إلى column order in the availability table isn't swapped too).

### 1.4 Role naming (p.7)
- Buyer role label: ~~`مشغل (مستأجر)`~~ → **`طالب مساحة`** (Space Seeker). Sub-label `أبحث عن مساحة` stays.
- Apply platform-wide (registration cards, sidebars, admin user table, badges).
- Seller stays `صاحب مساحة`.

### 1.5 Icons (p.10, p.20, p.28)
- Annotation: `ألوان الهوية` (brand identity colors) with ✗ over emoji icons.
- Admin + seller dashboard stat cards currently use raw emojis (👤 🔑 👥 📋 ⏳ 🏢 ✅). **Replace with proper SVG icons in brand colors** (dark green #1B3A2D + gold #C49A3C). Also the stat numbers are random colors (blue/purple/green/orange) — unify to brand palette.
- Same for the "How it works" step icons on the homepage (p.2) — they render as empty broken squares, marked ✗.

---

## 2. CONTENT / COPY CHANGES

### 2.1 Homepage hero (p.1)
| Element | Old | New |
|---|---|---|
| H1 | مساحة تليق بما تريد إنجازه. | **مساحة تناسب احتياجك** |
| Sub | مكاتب وقاعات تدريب واستوديوهات موثوقة، بتفاصيل واضحة وحجز مرن وتجربة مصممة لتصل إلى المكان المناسب بثقة. | **قاعات دراسية، مكاتب، قاعات اجتماعات… مصممة لتصل للمكان الأنسب لك** |
| Eyebrow | مساحات مختارة بعناية في المملكة | (unchanged) |

### 2.2 Homepage value cards: 3 → 5 (p.1)
| # | Title | Description |
|---|---|---|
| 1 | **مساحات موثوقة** (was موثقة) | تم اعتمادها من الفريق المختص. |
| 2 | **حجز واضح ومرن** (was حجز واضح) | اختر الموعد والمساحة المناسبة بسهولة. |
| 3 | **تواصل مباشر** | رتّب احتياجك مع صاحب المساحة قبل الحجز. |
| 4 | **خدمات تحسّن تجربتك** *(NEW)* | إضافات تساعدك على تجهيز المساحة لاستخدامك. |
| 5 | **دفع سلس وآمن** *(NEW)* | دفع موحّد ومنظم من داخل المنصة. |

> Card 5 implies **in-platform payments** — see §9.

### 2.3 "How it works": 3 → 5 steps (p.2)
Keep 01–03, append:
- **04 — اطلب خدمات** (Request services)
- **05 — ادفع بأمان** (Pay securely)

### 2.4 Navbar (p.1)
Add two items: **`من نحن`** (About Us) and **`تواصل معنا`** (Contact Us).

---

## 3. NEW PAGES

### 3.1 `من نحن` — About Us (content fully supplied on p.4)
```
نبذة عن إحياء مساحة
شركة ناشئة متخصصة في تعظيم الاستفادة من المساحات غير المستغلة من خلال
حلول متكاملة للربط، والتشغيل، والإدارة، والتقنية.

الرؤية
أن تصبح مساحة شركة رائدة في تعظيم الاستفادة من المساحات غير المستغلة.

الرسالة
إحياء المساحات غير المستغلة وتحويلها إلى أصول منتجة اقتصادياً واجتماعياً
من خلال حلول مبتكرة تحقق قيمة مستدامة لجميع الأطراف.

القيم
الثقة · الكفاءة · الشراكة · الاستدامة · الابتكار · الاحترافية
```

### 3.2 `تواصل معنا` — Contact Us + Suggestions/Complaints
- Founder's message: *"نحتاج إضافة رابط للاقتراحات والشكاوى"*
- Needs: contact form with a **type selector** (استفسار / اقتراح / شكوى), plus company contact details.
- Should create a ticket record visible to admin (new model — see §11).

---

## 4. SEARCH ENGINE OVERHAUL ⭐ (biggest single item — p.1, p.5, p.6)

### 4.1 Two search modes (tabs)
- **`برنامج متكرر`** (Recurring program) — DEFAULT/primary
- **`حجز مرة واحدة`** (One-time booking)

### 4.2 Recurring-program search form
| Field | Notes |
|---|---|
| المدينة أو الحي | placeholder: `مثال: الرياض، العليا` |
| نوع المساحة | dropdown from admin catalog |
| عدد الأشخاص | numeric |
| تاريخ البداية | date |
| تاريخ النهاية | date |
| الأيام المطلوبة | multi-select weekday chips |
| وقت الجلسة من / إلى | time range (session window) |
| ~~عدد الأسابيع/الجلسات~~ | **REMOVED** — struck out in red; auto-computed |

- Summary bar: `ملخص البرنامج · ساعتان يوميا لمدة 5 أيام · 01 يونيو إلى 31 يوليو 2026 · الإجمالي: 40 جلسة` + `إعادة تعيين`
- CTA: **`عرض المساحات المتاحة للبرنامج`**
- Extras: `حفظ هذا البحث` (save search), `مشاركة هذه البحث` (share search)

### 4.3 Program results page
- Title: `نتائج البحث عن برنامج` → **`ساعتان يوميًا لمدة 5 أيام`**
- `تم العثور على 8 مساحات مناسبة لبرنامجك` + `تعديل البحث`
- Toolbar chips: `تعديل البرنامج` · `ساعتان لكل يوم` · `لمدة 5 أيام` · `الإجمالي: 10 ساعات`
- Toggle: **`إظهار المساحات المتاحة بالكامل فقط`**
- Sort: `ترتيب حسب: السعر (الأقل أولاً)` / `الأقرب`

**Sidebar — `ملخص البرنامج`:**
```
عدد الجلسات      5 جلسات
مدة الجلسة       ساعتان لكل جلسة
إجمالي الساعات    10 ساعات
السعر الأساسي     100 ريال / ساعة
─────────────────────────────
الإجمالي قبل الخصم         1000 ريال
خصم البرنامج المتكرر (5%)   -50 ريال
─────────────────────────────
الإجمالي النهائي           950 ريال
ℹ الخصم المتكرر يُطبق تلقائياً. كلما زادت عدد الجلسات، زادت قيمة الخصم.
```

**Result cards must show:**
- Availability badge: `متاحة لجميع المواعيد` (green ✓) **or** `متاحة 4 من 5 مواعيد` (amber ⓘ)
- Favorite (heart) icon, capacity badge, name, location, amenity chips
- Full price breakdown: `1000 ريال (100 × 10 ساعات)` → `-50 ريال خصم` → `الإجمالي النهائي 950 ريال`
- CTA: **`حجز هذا البرنامج`**

### 4.4 Filter sidebar changes (p.6)
- Remove **`التسعير` (الكل/بالساعة/باليوم)** selector → hourly only.
- Time inputs: fix reversed format.
- `فلترة النتائج` header marked for rework.

---

## 5. BOOKING MODEL: REQUEST → DIRECT ⭐ (p.23, p.25, p.26, p.27, p.28, p.29)

Founder: *"الحجز المباشر وليس طلب الحجز"* + *"إضافة زر لإلغاء الحجز من طالب المساحة"*

### 5.1 Buyer side
- Space detail CTA: ~~`اختر موعدك واطلب الحجز`~~ → **`احجز`** (p.23)
- Remove reassurance text `لن يتم تأكيد أي موعد قبل موافقة صاحب المساحة`
- **`حجوزاتي`**: add **`إلغاء الحجز`** button + explicit notice that the agreed cancellation policy applies (show refund amount). (p.29)

### 5.2 Seller side
- **Delete** the accept/reject workflow entirely: remove `قبول الطلب` / `رفض الطلب` buttons and the `ردك على الطلب` block (p.26 — both crossed out).
- Sidebar/page: ~~`طلبات الحجز`~~ → **`حجوزاتي`** (p.25)
- Dashboard: ~~`آخر طلبات الحجز`~~ → **`آخر الحجوزات`** (p.28)
- Remove `بانتظار القبول` status (p.27).
- Booking detail must show **ordered space services** — `#تظهر له تفاصيل طلباته من خدمات المساحة إن وجدت` (p.26, p.27).

### 5.3 Status model implication
`BookingStatus` PENDING/ACCEPTED/REJECTED no longer fits. Suggested: `CONFIRMED` / `CANCELLED_BY_BUYER` / `CANCELLED_BY_SELLER` / `COMPLETED` (+ payment status separately).

### 5.4 Hours only
Founder: *"اعتماد التعداد والتسعير بالساعات فقط في الحجوزات"* (p.16, p.17)
- Remove `باليوم` pricing period everywhere (struck out on p.17).
- All duration counting and pricing in **hours**.
- `Space.pricePeriod` becomes obsolete → force `"hour"`.

---

## 6. SERVICES — TWO SEPARATE TIERS ⭐

### 6.1 Tier A — `خدمات صاحب المساحة` (Space Owner Services) (p.15)
Founder: *"تعديل في خدمات صاحب المساحة بحيث تكون محددة غير قابلة للزيادة من عنده"*

- **Remove `+ إضافة خدمة جديدة`.** Seller can only toggle on/off + set price from a **fixed admin-managed catalog of 7**:

| # | Service | Description | Pricing |
|---|---------|-------------|---------|
| 1 | **المطبوعات** | إرسال الملفات للطباعة وتوصيلها قبل موعد الحجز | WhatsApp number field + price matrix **لكل 10 صفحات**: أبيض وأسود (وجه واحد 5 / وجهين 8), ملون (وجه واحد 15 / وجهين 25) |
| 2 | **منظم** | لاستقبال الضيوف والتنسيق / الإشراف على الفعالية | سعر للفرد 25 + سعر بالساعة 80 → `3 منظمين × ساعتين = 3 × 80 × 2 = 480 ريال` |
| 3 | **تنظيف بعد الاستخدام** | تنظيف القاعة وإعادتها لحالتها الأصلية بعد انتهاء الحجز | لكل حجز — 250 ريال |
| 4 | **مياه** | مياه معدنية مع الأكواب | لكل فرد — 7 ريال |
| 5 | **قهوة عربية** | قهوة عربية مع التمور والمستلزمات | لكل فرد — 15 ريال |
| 6 | **شاي** | شاي ساخن مع المستلزمات | لكل فرد — 5 ريال |
| 7 | **ضيافة خفيفة** | تشكيلة خفيفة من المأكولات والمشروبات | free-text detail field (`مثال: ميني ساندويتش، معجنات، عصائر، فواكه…`) + لكل فرد — 20 ريال |

- Page redesign: title `إضافة خدمات المساحة`, master toggle `تفعيل جميع الخدمات`, category tabs `الكل / الضيافة / مطبوعات / تنظيم / تنظيف`, each service = card with on/off toggle + icon + pricing config.
- **These must appear on the buyer's space detail page** — p.24: `#أين خدمات صاحب المساحة؟`

### 6.2 Tier B — `خدمات إضافية (خدمات شركاء إحياء مساحة)` (p.30) — NEW MODULE
Annotation: *"هذي خدمات من المنصة يتم رفع الطلب لها بعد عملية حجز القاعة"*
→ Platform/partner services, requested **after** the hall booking, priced & confirmed by the Ehya Masaha team.

**Catalog (7):**
| Service | Description | Price |
|---|---|---|
| منظم | استقبال الضيوف والتنسيق والإشراف على الفعالية | 150 ر.س / للشخص / الساعة |
| تنظيف بعد الاستخدام | تنظيف شامل للمكان بعد انتهاء الفعالية | 250 ر.س |
| تصوير وتوثيق | تصوير احترافي وتوثيق لفعالياتك بجودة عالية | 400 ر.س / للساعة |
| تصوير ومونتاج فيديو | تصوير ومونتاج فيديو احترافي لفعالياتك | 600 ر.س / للفيديو |
| تصميم بوستر | تصميم بوستر إعلاني احترافي لفعالياتك | 200 ر.س / للتصميم |
| إعلان الدورة في برامج التواصل | إعلان دورتك في منصات التواصل الاجتماعي | 300 ر.س / للحملة |
| **طلب خاص** | لدينا شركاء متخصصون، أخبرنا بخدمتك وسنحاول تحقيقها | custom |

**6-step flow (fully mocked on p.30):**
1. **طلب الخدمات الإضافية** — pick services (checkbox cards)
2. **تقديم الطلب** — review table (الخدمة/التفاصيل/الكمية/السعر) + `المجموع التقديري` + `ملاحظات إضافية` → `إرسال الطلب للمراجعة` / `حفظ كمسودة`
3. **طلب قيد المراجعة** — `#SR-2507038`, status badge, "ماذا يحدث الآن؟" (3 bullets), SLA: **عرض السعر خلال 24 ساعة**
4. **عرض السعر والتأكيد** — admin-adjusted quote + `ملاحظات من فريق إحياء مساحة` → `موافق على العرض والمتابعة للدفع` / `رفض الطلب`
5. **الدفع** — payment methods: **مدى / Apple Pay / بطاقة ائتمان / تحويل بنكي** + terms checkbox → `دفع 3,030 ر.س` (secure)
6. **تأكيد النجاح** — confirmation + `ماذا بعد؟` + `الانتقال إلى طلباتي`

> Note: prices are **negotiable by admin** between step 2 (تقديري 3,550) and step 4 (عرض 3,030).

---

## 7. MULTI-UNIT SPACES ⭐ (p.12)

Founder: *"إمكانية إضافة أكثر من وحدة في حال عنده أكثر من قاعة نفس الشيء وهذا له علاقة بنتائج محرك البحث"*

- Add field to wizard step 1: **`عدد القاعات المماثلة`** (+/− stepper).
- System auto-generates N **units**, numbered: `قاعة 101`, `قاعة 102`, `قاعة 103`…
- **Availability & booking are per-unit.** This is what makes `متاحة 4 من 5 مواعيد` possible in program search — the engine checks unit-level availability across the whole program.
- Requires new `SpaceUnit` model + `Booking.unitId`.

---

## 8. PRIVATE OCCUPANCY (الإشغال الخاص) ⭐ (p.16, p.19)

Founder: *"إضافة زر للمدرسة للإشغال الخاص في الجدولة"*

New seller capability, fully mocked:
- Button on each space card: **`إشغال خاص`** (alongside `عرض الحجوزات`, `إدارة التوفر`, `إغلاق مؤقت`)
- Panel **`إشغال خاص للمدرسة`**:
  > احجز فترات للاستخدام الداخلي دون تعديل جدول التوفر الأسبوعي. لن تكون متاحة للمستأجرين وستكون مجانية للمدرسة.
  - Fields: `التاريخ` · `من` · `إلى` → `حفظ الإشغال الخاص`
- List **`الإشغالات الخاصة القادمة`** with title + date + time + status badge (`مؤكد` / `مخطط`), e.g. `حفل تخرج`, `اليوم الختامي`, `اختبار نهاية الفصل`.
- Blocks the slot from public booking **without** editing weekly availability. Free for the school.

### 8.1 `مساحاتي` page redesign (p.19 → p.16 mockup)
Replace the current minimal list with:
- Header: `إدارة جميع مساحات مدرستك من مكان واحد…` + `+ إضافة مساحة جديدة` + `تصفية`
- 4 stat cards: `مساحات منشورة` · `إغلاقات مؤقتة قادمة` · `ساعات محجوزة هذا الشهر` · `حجوزات هذا الشهر (+20% عن الشهر الماضي)`
- Space card with image, type, price, capacity, **`معرف المساحة: S202257460001`** (copyable), status badge, and the 4 action buttons.

---

## 9. PAYMENTS (implied by p.1 card 5, p.2 step 05, p.30 step 5)
- Methods: **مدى، Apple Pay، بطاقة ائتمان/مدى، تحويل بنكي**
- Secure checkout w/ terms acceptance; "عملية دفع آمنة ومشفرة"
- Needed for both hall bookings and partner-service orders.
- `محفظتي` (My Wallet) appears in a buyer sidebar mockup (p.5) — wallet/balance concept.
- **This is a major workstream** (PSP integration, refunds tied to cancellation policy, VAT).
- Note: pricing preview says **"جميع الأسعار تشمل ضريبة القيمة المضافة"** — VAT-inclusive display required.

---

## 10. SELLER ONBOARDING REBUILD ⭐ (p.8, p.9, p.11)

### 10.1 Registration form
- ✗ Remove the current 2-doc upload block from the simple signup page (p.8).
- New required documents (p.9):
  - `الهوية الوطنية` *
  - `السجل التجاري` *
  - `وثيقة ملكية العقار (صك)` *
- Conditional: **`هل العقار مملوك لأكثر من مالك؟`** نعم/لا
  - If **نعم** → `رقم الوكالة لممثل الملاك` * + `إرفاق نسخة الوكالة (اختياري)`
  - If **لا** → *`#في حال (لا) لا نحتاج رقم الوكالة`* (hide the field)
- Consent checkbox (legal):
  > أقر بصحة البيانات والمستندات المرفقة، وبأن مقدم الطلب أو معتمد العقد مخول نظامًا بتمثيل مالك العقار أو ملاكه، وأوافق على استخدام هذه البيانات لإعداد عقد الوساطة العقارية عبر منصة **فال** التابعة للهيئة العامة للعقار.
- CTA: `إرسال طلب التسجيل` (not "create account")

### 10.2 `/success` page
> تم استلام طلبك بنجاح
> - سيقوم فريق إحياء مساحة بمراجعة البيانات والمستندات وإعداد عقد وساطة وتسويق عقاري عبر منصة **فال** التابعة للهيئة العامة للعقار.
> - بعد إرسال العقد، سيصل إلى مالك العقار أو معتمد العقد إشعار من الهيئة العامة للعقار يحتوي على رابط مراجعة العقد. **يجب قبول العقد أو رفضه خلال 7 أيام** من تاريخ الإرسال.
> - بعد اعتماد العقد سيتم تفعيل حساب صاحب المساحة، ويمكنكم بعدها إضافة القاعات والمساحات التابعة للعقار.
> ⚠ ملاحظة: في حال عدم اتخاذ إجراء خلال 7 أيام تُلغى عملية اعتماد العقد، ويتم التواصل مع فريق إحياء مساحة لإعادة الإجراء.
> [متابعة حالة الطلب]

### 10.3 `/status` page — timeline **3 steps only**
The 5-step version was cut down (steps 2 & 4 struck out in red on p.9):
1. **قيد مراجعة البيانات** ← active, badge `جارٍ`
2. ~~جارٍ إعداد عقد الوساطة~~ **REMOVED**
3. **تم إرسال العقد – بانتظار موافقة المالك**
4. ~~تم اعتماد العقد~~ **REMOVED**
5. **تم تفعيل حساب صاحب المساحة**
- Footer: `هل لديك استفسار؟ تواصل مع فريقنا…` + `تواصل معنا`

### 10.4 Account verification (p.7)
Annotation (double-underlined = high priority): **`تحقق عبر الإيميل / رسائل`**
→ Email and/or SMS OTP verification on registration.

---

## 11. ADMIN CHANGES

### 11.1 Four managed taxonomies (p.30) — founder note: *"إمكانية تعديل وإضافات التصنيفات الأربعة"*
`/admin/categories` currently has 2 sections. Must become **4**, all CRUD-able:
1. **أنواع المساحات** (Space types)
2. **المرافق والتجهيزات** (Amenities & equipment)
3. **خدمات صاحب المساحة** (the 7 owner services)
4. **خدمات إضافية — خدمات شركاء إحياء مساحة** (the 7 partner services)

Also p.14: `#السماح بالإضافة والحذف من مدير المنصة` — amenities are admin-controlled; sellers only pick from the list.
> ⚠ Current amenity list has duplicates (تكييف/تكييف مركزي، بروجكتور/شاشة عرض، مواقف/مواقف سيارات، كراسي/كراسي مريحة) — needs a cleanup pass.

### 11.2 Admin control over space data (p.22)
- `#تحكم الإدارة في المدخلات` — admin can **edit** any submitted space field (and reorder/delete images — numbered 1,2,3 in the annotation).
- `إمكانية إضافة رقم الترخيص الإعلاني` — **NEW field: رقم الترخيص الإعلاني** (Advertising License Number), admin-editable, per space.

### 11.3 Seller-requests admin module (p.11 — marked `= مقترح قابل للتحسين`)
Proposed new admin screens:
- **List `طلبات أصحاب المساحات`**: filter `كل الحالات`, search by name/phone/CR. Columns: المنشأة · اسم المدرسة/الفرع · رقم السجل التجاري · تاريخ الطلب · الحالة · إجراءات.
  Status badges: `قيد مراجعة البيانات` (amber) · `تم إرسال العقد – 5 أيام متبقية` (blue) · `تم اعتماد العقد` (green) · `انتهت مهلة الموافقة` (red) · `تم رفض العقد` (gray)
- **Detail `تفاصيل طلب صاحب المساحة`**: request info, attached docs (الهوية/السجل/صك), **العقد وحالته** (`رقم عقد الوساطة`, `تاريخ إرسال العقد`, `آخر موعد للموافقة (7 أيام)`), `ملاحظات المدير`, and actions: `حفظ وتحديث الحالة` · `رفض الطلب` · `طلب تعديل` · `طلب مستند إضافي`
- Proposed admin sidebar: الرئيسية · طلبات أصحاب المساحات · العقارات والمساحات · العقود · الإعلانات · التراخيص · المعاملات المالية · التقارير · الإعدادات

### 11.4 Smaller admin items
- **p.11** — `هل انت متأكد؟` next to `مدير النظام` role → **add a confirmation dialog** before granting admin.
- **p.21** — `تاريخ ؟` over an empty column in the spaces table → **add a `تاريخ` column** (submission/creation date).

---

## 12. SELLER WIZARD CHANGES (p.12–p.18)

| Step | Change |
|---|---|
| 1 المعلومات الأساسية | **+ `عدد القاعات المماثلة`** stepper (§7) |
| 2 الموقع والعنوان | `#لا يعمل بالشكل الصحيح` — **broken**. Google-Maps-link parser fails (`لم نتمكن من قراءة الرابط`), and the map doesn't follow the selected city (city=الخبر but map shows Riyadh). ✗ on the link field. |
| 4 المرافق والتجهيزات | Admin-managed list only (§11.1) |
| 5 الخدمات الإضافية → **`خدمات المساحة`** | Fixed 7-service catalog, redesigned (§6.1) |
| 6 التوفر والجدول | Time format reversed; **calendar preview heavily scribbled out = redo**; `#اعتماد التعداد بالساعات فقط` |
| 7 التسعير | Remove `باليوم`. Redesign per mockup (§12.1) |
| 8 الشروط والأحكام | Cancellation policy text changes (§12.2) |

### 12.1 Pricing step redesign (p.17 mockup)
- **`السعر الأساسي`**: `السعر الأساسي للساعة` only. *(Two dropdowns below it — min-booking & prep-time — are struck out = remove.)*
- **`خصومات الحجز الطويل`** *(NEW, highlighted)*: automatic tiers when booking more hours
  - `3 ساعات فأكثر → 5%` · `5 ساعات فأكثر → 10%` · `8 ساعات فأكثر → 15%` · `[+ إضافة شريحة]`
- **`معاينة السعر للمستأجر`** live preview card: `100 × 5 = 500` → `-50 (10%)` → `450 ريال`, with note *جميع الأسعار تشمل ضريبة القيمة المضافة*
- **`نصائح للتسعير`** helper card (4 bullets)
- Footer: auto-save indicator `تم الحفظ ✓`; sidebar: `حفظ كمسودة` / `حفظ والخروج`

### 12.2 Cancellation policies (p.18)
| Policy | New wording |
|---|---|
| **مرنة** | استرداد كامل للمبلغ عند الإلغاء قبل **24 ساعة** من موعد الحجز *(unchanged)* |
| **متوسطة** | استرداد **50%** للمبلغ عند الإلغاء قبل **5 أيام** من موعد الحجز |
| **صارمة** | **غير قابلة للاسترداد** *(old "50% before 7 days" struck out)* |

---

## 13. DATA MODEL — REQUIRED CHANGES

Based on `prisma/schema.prisma` as it stands today:

### New models
| Model | Purpose |
|---|---|
| `SpaceUnit` | multi-hall units (§7): `label` (قاعة 101), `spaceId`; bookings reference a unit |
| `PricingTier` | long-booking discounts: `minHours`, `discountPercent`, `spaceId` |
| `PrivateOccupancy` | school internal blocks (§8): `title`, `date`, `startTime`, `endTime`, `status`, `spaceId` |
| `ServiceCatalog` | admin-managed master list of the 7 owner services (§6.1) |
| `SpaceServiceConfig` | per-space enable/disable + price overrides (replaces free-form `SpaceService`) |
| `PartnerService` | admin-managed catalog of the 7 partner services (§6.2) |
| `PartnerServiceRequest` + `PartnerServiceRequestItem` | the 6-step quote/approve/pay flow, ref `#SR-…` |
| `BookingService` | which owner-services a booking ordered (qty, unit price, total) |
| `BookingProgram` | recurring program: date range, weekdays, session window, generated sessions |
| `Payment` / `Transaction` | PSP records, refunds |
| `SellerApplication` | onboarding request + FAL contract fields (`brokerageContractNo`, `contractSentAt`, `approvalDeadline`, status) |
| `Favorite` | المفضلة |
| `Notification` | الإشعارات |
| `SavedSearch` | حفظ هذا البحث |
| `ContactMessage` | تواصل معنا / اقتراحات وشكاوى |

### Modified models
- `Space`: **+ `advertisingLicenseNumber`**, **+ `publicRef`** (`S202257460001`), **+ `identicalUnitsCount`**; drop/force `pricePeriod = "hour"`
- `Booking`: **+ `unitId`**, **+ `totalHours`**, **+ `basePrice`**, **+ `discountAmount`**, **+ `servicesTotal`**, **+ `grandTotal`**, **+ `paymentStatus`**, **+ `programId`**, **+ `cancelledAt` / `cancelledBy` / `refundAmount`**
- `BookingStatus` enum: rework for direct booking (§5.3)
- `User`: **+ `emailVerifiedAt`**, **+ `phoneVerifiedAt`** (§10.4)
- `DocumentType` enum: **+ `TITLE_DEED` (صك)**, **+ `POWER_OF_ATTORNEY` (وكالة)**

---

## 14. BUGS & POLISH FOUND IN THE PDF

| Page | Issue |
|---|---|
| 2 | "How it works" step icons render as empty/broken squares (✗ marked) |
| 6, 16 | Time strings reversed (`PM 30:12`) |
| 6, 16, 19, 22–24 | Arabic-Indic numerals instead of Latin |
| 13 | Location step "لا يعمل بالشكل الصحيح"; Google Maps link parser fails; map ignores selected city |
| 14 | Duplicate amenities in the list |
| 16 | Calendar preview scribbled out — needs redesign |
| 21 | Empty column header in admin spaces table |
| 10, 20, 28 | Emoji icons + off-brand stat number colors |

---

## 15. ADDITIONAL ENHANCEMENTS I'D RECOMMEND (not in the PDF)

Things I noticed reviewing the codebase that the founder didn't flag but that will bite:

1. **Availability/conflict engine doesn't exist yet.** Program search needs to check, for each candidate space/unit, every session in the date range against: weekly working hours, existing bookings, private occupancies, and temporary closures. This is the hardest piece of logic in the whole build — design it as one reusable service, not ad-hoc queries.
2. **`Booking.date/startTime/endTime` are `String`.** With hour-based pricing, recurring programs and conflict detection, these should be real `DateTime` (or at minimum a normalized, indexed representation). Migrating later will be painful.
3. **No transactional integrity on booking creation.** Direct booking + payment means double-booking is now a real money risk — needs a DB-level constraint or transaction with row locking.
4. **No audit trail.** Admin will be editing seller-submitted space data (§11.2) and adjusting quoted prices (§6.2). Both need a change log for disputes.
5. **`SpaceReview` is tied to a booking but there's no moderation queue** — `isVisible` exists but no admin UI to use it.
6. **Notifications are entirely absent** but the flows assume them heavily (contract deadline reminders at 7 days, quote-ready within 24h, booking confirmations, cancellation notices).
7. **The 7-day FAL contract deadline needs a scheduled job** to auto-expire applications (`انتهت مهلة الموافقة` status exists in the mockup).
8. **VAT handling.** Prices display as VAT-inclusive; you'll need the VAT breakdown for invoices/reports regardless.
9. **Seller sidebar in the mockups gained `المستخدمون` and `التقارير المالية`** — implies schools will have **multiple staff accounts under one seller org**. That's a whole sub-account/permissions model not in the schema today. Worth confirming scope early.
10. **Mobile.** The new screens are dense (program search, services grid, pricing tiers). The responsive pass we just did covers the current pages; these new ones need it built in from the start.
11. **`محفظتي` (wallet)** appears in one mockup — confirm whether it's real scope or aspirational.

---

## 16. ⚠ AMBIGUITIES — CONFIRM WITH FOUNDER BEFORE BUILDING

1. **Wizard step count.** p.15 mockup shows **8 steps** (no `التوفر والجدول`, services renamed `خدمات المساحة`); p.17 mockup shows **9 steps** (with `التوفر والجدول`). Which is final? *(My read: keep availability — the private-occupancy feature depends on it — so 9, with step 5 renamed.)*
2. **p.16 top-right handwritten note** (`#نفّذ …`) — could not read reliably. Needs clarification.
3. **p.8** — the ✗ + arrow on identity verification: delete it from signup entirely, or **move** it into the new seller application flow? *(My read: it's replaced by the richer flow in §10.1.)*
4. **Payments scope** — is PSP integration in this phase, or is `دفع` a placeholder for now?
5. **`محفظتي` / wallet** — in scope?
6. **Multi-user seller orgs** (`المستخدمون` in seller sidebar) — in scope?
7. **Partner services pricing** — admin edits the quote per request; is there a fixed price list too, or is the catalog price only indicative?
8. **Does the recurring discount (`خصم البرنامج المتكرر 5%`) stack with the long-booking tiers** (`3h→5%`, `5h→10%`, `8h→15%`)? Two separate discount mechanisms appear in different mockups.

---

## 17. SUGGESTED BUILD ORDER

| Phase | Contents | Why first |
|---|---|---|
| **0. Quick wins** | Latin numerals, time `dir="ltr"`, rebrand text/contacts, role rename, About + Contact pages, nav items, homepage copy + 5 cards, 5 steps, cancellation policy wording, admin confirm-dialog, spaces-table date column | Low risk, high visibility, no schema change |
| **1. Schema foundation** | All model changes in §13 as one migration; normalize Booking date/time | Everything downstream depends on it |
| **2. Direct booking** | Remove request/approve, buyer cancel + refund calc, seller "حجوزاتي", hours-only | Core model change |
| **3. Units + availability engine** | `SpaceUnit`, private occupancy, conflict checker | Unblocks search |
| **4. Program search** | Two modes, program form, results, discounts, per-unit availability badges | The headline feature |
| **5. Services Tier A** | Fixed catalog, seller config, buyer display, booking line items | |
| **6. Admin control** | 4 taxonomies, space data editing, ad-license field, seller-requests module | |
| **7. Seller onboarding** | Application form, /success, /status, OTP verification, 7-day job | |
| **8. Services Tier B** | Partner services 6-step flow | Depends on payments |
| **9. Payments** | PSP, refunds, VAT, wallet | Largest external dependency |

---

*Analysis complete — 31/31 pages reviewed, every annotation and mockup catalogued.*
