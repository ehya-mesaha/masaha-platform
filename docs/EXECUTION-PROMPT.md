# EXECUTION PROMPT — Ehya Masaha MVP Overhaul

---

## CONTEXT

You are working on **`C:\masa7a\masaha-project`** — an Arabic-first (RTL) space-rental platform built with **Next.js 16 (App Router, Turbopack)**, **Prisma 7** (client generated to `src/generated/prisma`), **PostgreSQL on Supabase**, JWT auth via `jose` (cookie `masaha_token`), Tailwind CSS 4, Tajawal font.

**Read `AGENTS.md` first.** This is not the Next.js you know — APIs and conventions differ from your training data. Consult `node_modules/next/dist/docs/` before writing framework code.

The platform founder reviewed the live MVP and returned a marked-up document. This prompt contains **every required change**. The product is being repositioned, not just polished.

### The four structural shifts driving everything

1. **Brand**: `مساحة` → **`إحياء مساحة`** (Ehya Masaha) — a real Khobar-based company with FAL-licensed real-estate brokerage.
2. **Booking model**: request→seller-approves→confirmed → **direct/instant booking**, with buyer-side cancellation governed by policy.
3. **Search**: one-off single-date browse → **recurring-program search** (date range + weekdays + session time window) with automatic multi-session discounts.
4. **Target customer**: generic tenants → **schools and educational institutions** booking recurring programs.

---

## GLOBAL RULES — APPLY TO ALL WORK

1. **Latin numerals only.** Never render Arabic-Indic digits (`٠١٢٣٤٥٦٧٨٩`). The codebase uses `toLocaleString('ar-SA')`, which produces them. Replace with `'en-US'` (or `ar-SA-u-nu-latn`) everywhere — prices, dates, capacities, counters, stat cards, IDs, ratings.
2. **Times must not reverse.** Time strings currently render backwards in RTL (`12:30 PM` → `PM 30:12`). Wrap every time value and time input in `dir="ltr"`. Also verify the من/إلى column order in availability tables isn't swapped.
3. **Hours only.** All duration counting and pricing is hourly. Remove every "per day" (`باليوم` / `لكل يوم`) option and label.
4. **Bilingual.** The site has a working AR/EN toggle backed by a dictionary at `src/lib/domTranslations.ts` (exact-match map + regex patterns) plus `src/lib/i18n.ts`. **Every new Arabic string you add must get an English entry in `domTranslations.ts`,** or it will stay Arabic when users switch to English.
5. **Mobile-first.** The dashboard shell already has a mobile drawer. All new screens must be fully responsive — several are dense (program search, services grid, pricing tiers). Build responsive from the start, don't retrofit.
6. **Brand palette**: dark green `#1B3A2D`, gold `#C49A3C`, cream `#F7F3EB`. No emoji icons in UI chrome — use SVG icons in brand colors.
7. **Verify with `npx next build`** after each phase. It must pass with zero TypeScript errors.

---

## DECISIONS ALREADY MADE (do not re-litigate)

- Seller wizard stays at **9 steps**; step 5 is renamed `خدمات المساحة`. (A mockup showed 8, but private occupancy depends on the availability step.)
- The identity-verification upload block is **removed from simple signup** and replaced by the richer seller application flow in Phase 7.
- Status timeline for seller applications is **3 steps**, not 5.

---

## ASK BEFORE BUILDING THESE (do not guess)

- **Payments (Phase 9)**: is real PSP integration in scope now, or is `دفع` a placeholder?
- **`محفظتي` (wallet)**: appears in one mockup — in scope?
- **Multi-user seller orgs**: a mockup shows `المستخدمون` in the seller sidebar, implying multiple staff accounts per school. Confirm scope before designing permissions.
- **Discount stacking**: does `خصم البرنامج المتكرر (5%)` stack with the hourly tiers (`3h→5%`, `5h→10%`, `8h→15%`)? Two separate discount mechanisms appear in different mockups.
- **Partner service pricing**: admin edits the quote per request — is the catalog price fixed, or only indicative?

---

# PHASE 0 — QUICK WINS (no schema change)

Do all of this first. Low risk, high visibility.

## 0.1 Global numerals + time direction
Apply Global Rules 1 and 2 across the entire codebase.

## 0.2 Rebrand
- Brand name `مساحة` → **`إحياء مساحة`** (English: **Ehya Masaha**) in navbar, footer, sidebars, page titles, metadata.
- Footer company blurb → replace with:
  > إحياء مساحة شركة ناشئة متخصصة في تعظيم الاستفادة من المساحات غير المستغلة من خلال حلول متكاملة للربط، والتشغيل، والإدارة، والتقنية.
- Contact details everywhere:
  - Email: `info@masaha.sa` → **`info@ehyamesaha.sa`**
  - Phone: `+966 50 000 0000` → **`+966 50 491 3274`**
  - City: `الرياض` → **`الخبر، المملكة العربية السعودية`**
- Logo needs replacing — leave a clearly-marked placeholder component if no asset is supplied.

## 0.3 Role rename
Buyer role label `مشغل (مستأجر)` → **`طالب مساحة`** platform-wide (registration cards, sidebars, admin user tables, badges, filters). Sub-label `أبحث عن مساحة` unchanged. Seller stays `صاحب مساحة`.

## 0.4 Homepage hero (`src/app/page.tsx`)
| Element | New value |
|---|---|
| H1 | **مساحة تناسب احتياجك** |
| Subtitle | **قاعات دراسية، مكاتب، قاعات اجتماعات… مصممة لتصل للمكان الأنسب لك** |
| Eyebrow | `مساحات مختارة بعناية في المملكة` *(unchanged)* |

## 0.5 Homepage value cards: 3 → 5
| # | Title | Description |
|---|---|---|
| 1 | مساحات موثوقة | تم اعتمادها من الفريق المختص. |
| 2 | حجز واضح ومرن | اختر الموعد والمساحة المناسبة بسهولة. |
| 3 | تواصل مباشر | رتّب احتياجك مع صاحب المساحة قبل الحجز. |
| 4 | خدمات تحسّن تجربتك | إضافات تساعدك على تجهيز المساحة لاستخدامك. |
| 5 | دفع سلس وآمن | دفع موحّد ومنظم من داخل المنصة. |

## 0.6 "How it works": 3 → 5 steps
Keep 01–03 as-is, append:
- **04 — اطلب خدمات**
- **05 — ادفع بأمان**

The current step icons render as empty/broken squares — fix or replace with brand-colored SVGs.

## 0.7 Navbar
Add **`من نحن`** and **`تواصل معنا`**.

## 0.8 New page: `من نحن` (`/about`)
Exact content:
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

## 0.9 New page: `تواصل معنا` (`/contact`)
Contact form with a **type selector**: `استفسار` / `اقتراح` / `شكوى`, plus company contact details. Submissions must persist and be visible to admin (model `ContactMessage`, added in Phase 1).

## 0.10 Cancellation policy wording (seller wizard step 8)
| Policy | New wording |
|---|---|
| **مرنة** | استرداد كامل للمبلغ عند الإلغاء قبل **24 ساعة** من موعد الحجز |
| **متوسطة** | استرداد **50%** للمبلغ عند الإلغاء قبل **5 أيام** من موعد الحجز |
| **صارمة** | **غير قابلة للاسترداد** |

## 0.11 Small admin fixes
- `src/app/admin/users/[id]/page.tsx` — add a **confirmation dialog** before granting the `مدير النظام` (admin) role.
- `src/app/admin/spaces/page.tsx` — there is an **empty column header** between النوع and المدينة. Make it a **`تاريخ`** column showing the space's creation/submission date.
- Admin + seller dashboards: replace emoji stat icons (👤🔑👥📋⏳🏢✅) with brand-colored SVG icons, and unify the stat-number colors (currently random blue/purple/green/orange) to the brand palette.

## 0.12 Amenity list cleanup
The amenity catalog contains duplicates: `تكييف`/`تكييف مركزي`, `بروجكتور`/`شاشة عرض`, `مواقف`/`مواقف سيارات`, `كراسي`/`كراسي مريحة`. De-duplicate.

---

# PHASE 1 — SCHEMA FOUNDATION

One migration containing all model changes. Everything downstream depends on this.

## 1.1 New models
| Model | Purpose |
|---|---|
| `SpaceUnit` | Multi-hall units: `label` (e.g. `قاعة 101`), `spaceId`. Bookings reference a unit. |
| `PricingTier` | Long-booking discounts: `minHours`, `discountPercent`, `spaceId`. |
| `PrivateOccupancy` | School internal blocks: `title`, `date`, `startTime`, `endTime`, `status`, `spaceId`. |
| `ServiceCatalog` | Admin-managed master list of the 7 owner services. |
| `SpaceServiceConfig` | Per-space enable/disable + price overrides. **Replaces the free-form `SpaceService` model.** |
| `PartnerService` | Admin-managed catalog of the 7 Ehya Masaha partner services. |
| `PartnerServiceRequest` + `PartnerServiceRequestItem` | The 6-step quote→approve→pay flow, reference format `#SR-2507038`. |
| `BookingService` | Which owner-services a booking ordered (qty, unit price, total). |
| `BookingProgram` | Recurring program: date range, weekdays, session window, generated sessions. |
| `Payment` / `Transaction` | PSP records and refunds. |
| `SellerApplication` | Onboarding request + FAL contract fields: `brokerageContractNo`, `contractSentAt`, `approvalDeadline`, `status`. |
| `Favorite` | المفضلة |
| `Notification` | الإشعارات |
| `SavedSearch` | حفظ هذا البحث |
| `ContactMessage` | تواصل معنا / اقتراحات وشكاوى |

## 1.2 Modified models
- **`Space`**: add `advertisingLicenseNumber` (رقم الترخيص الإعلاني), `publicRef` (format `S202257460001`), `identicalUnitsCount`. Force `pricePeriod = "hour"` or drop the field.
- **`Booking`**: add `unitId`, `totalHours`, `basePrice`, `discountAmount`, `servicesTotal`, `grandTotal`, `paymentStatus`, `programId`, `cancelledAt`, `cancelledBy`, `refundAmount`.
- **`BookingStatus` enum**: rework for direct booking → `CONFIRMED` / `CANCELLED_BY_BUYER` / `CANCELLED_BY_SELLER` / `COMPLETED`.
- **`User`**: add `emailVerifiedAt`, `phoneVerifiedAt`.
- **`DocumentType` enum**: add `TITLE_DEED` (صك) and `POWER_OF_ATTORNEY` (وكالة).

## 1.3 Critical migration note
`Booking.date`, `startTime`, `endTime` are currently `String`. With hourly pricing, recurring programs and conflict detection all landing at once, **migrate these to real `DateTime`** (or a normalized indexed representation) **in this same migration**. Doing it later will be very painful.

## 1.4 Integrity
Direct booking + payment makes double-booking a real money risk. Add a **DB-level uniqueness/exclusion constraint** or use a transaction with row locking on booking creation.

---

# PHASE 2 — DIRECT BOOKING

## 2.1 Buyer side
- Space detail CTA: `اختر موعدك واطلب الحجز` → **`احجز`**
- Remove the text `لن يتم تأكيد أي موعد قبل موافقة صاحب المساحة`
- `حجوزاتي`: add an **`إلغاء الحجز`** button with an explicit notice that the agreed cancellation policy applies, showing the calculated refund amount.

## 2.2 Seller side
- **Delete the accept/reject workflow entirely** — remove `قبول الطلب` / `رفض الطلب` buttons and the `ردك على الطلب` block.
- Rename sidebar item and page: `طلبات الحجز` → **`حجوزاتي`**
- Seller dashboard heading: `آخر طلبات الحجز` → **`آخر الحجوزات`**
- Remove the `بانتظار القبول` status.
- Booking detail must display the **ordered owner-services** for that booking (name, qty, unit price, line total).

---

# PHASE 3 — UNITS + AVAILABILITY ENGINE

> This is the hardest logic in the entire build. Design it once, as a single reusable service — not ad-hoc queries scattered across routes.

## 3.1 Multi-unit spaces
- Add to seller wizard step 1: **`عدد القاعات المماثلة`** (+/− stepper).
- System auto-generates N units labelled `قاعة 101`, `قاعة 102`, `قاعة 103`…
- **Availability and booking become per-unit.** This is what makes `متاحة 4 من 5 مواعيد` possible in search results.

## 3.2 Private occupancy (`الإشغال الخاص`)
New seller capability:
- Button on each space card: **`إشغال خاص`** (alongside `عرض الحجوزات`, `إدارة التوفر`, `إغلاق مؤقت`)
- Panel titled **`إشغال خاص للمدرسة`** with this exact description:
  > احجز فترات للاستخدام الداخلي دون تعديل جدول التوفر الأسبوعي. لن تكون متاحة للمستأجرين وستكون مجانية للمدرسة.
- Fields: `التاريخ` · `من` · `إلى` → button `حفظ الإشغال الخاص`
- List **`الإشغالات الخاصة القادمة`**: title + date + time + status badge (`مؤكد` / `مخطط`). Example entries: `حفل تخرج`, `اليوم الختامي`, `اختبار نهاية الفصل`.
- Behaviour: blocks the slot from public booking **without** modifying weekly availability. Free for the school.

## 3.3 Availability/conflict engine
For any candidate space/unit and any requested session, validate against:
- weekly working hours
- existing bookings
- private occupancies
- temporary closures (`إغلاق مؤقت`)

Must support evaluating **every session in a date range** efficiently, since program search depends on it.

## 3.4 `مساحاتي` page redesign
Replace the current minimal list with:
- Header: `إدارة جميع مساحات مدرستك من مكان واحد…` + `+ إضافة مساحة جديدة` + `تصفية`
- 4 stat cards: `مساحات منشورة` · `إغلاقات مؤقتة قادمة` · `ساعات محجوزة هذا الشهر` · `حجوزات هذا الشهر` (with `+20% عن الشهر الماضي` delta)
- Space card: image, type, price, capacity, **`معرف المساحة: S202257460001`** (copyable), status badge, and the 4 action buttons.

---

# PHASE 4 — RECURRING PROGRAM SEARCH ⭐ (headline feature)

## 4.1 Two search modes (tabs)
- **`برنامج متكرر`** (Recurring program) — DEFAULT
- **`حجز مرة واحدة`** (One-time booking)

## 4.2 Program search form
| Field | Notes |
|---|---|
| المدينة أو الحي | placeholder `مثال: الرياض، العليا` |
| نوع المساحة | dropdown from admin catalog |
| عدد الأشخاص | numeric |
| تاريخ البداية | date |
| تاريخ النهاية | date |
| الأيام المطلوبة | multi-select weekday chips |
| وقت الجلسة من / إلى | session time window |

**Do NOT include a "number of weeks/sessions" field** — it is auto-computed.

- Summary bar: `ملخص البرنامج · ساعتان يوميا لمدة 5 أيام · 01 يونيو إلى 31 يوليو 2026 · الإجمالي: 40 جلسة` + `إعادة تعيين`
- CTA: **`عرض المساحات المتاحة للبرنامج`**
- Extras: `حفظ هذا البحث` · `مشاركة هذه البحث`

## 4.3 Program results page
- Title: `نتائج البحث عن برنامج` → **`ساعتان يوميًا لمدة 5 أيام`** (dynamic)
- `تم العثور على 8 مساحات مناسبة لبرنامجك` + `تعديل البحث`
- Toolbar chips: `تعديل البرنامج` · `ساعتان لكل يوم` · `لمدة 5 أيام` · `الإجمالي: 10 ساعات`
- Toggle: **`إظهار المساحات المتاحة بالكامل فقط`**
- Sort: `ترتيب حسب: السعر (الأقل أولاً)` / `الأقرب`

**Sidebar `ملخص البرنامج`:**
```
عدد الجلسات               5 جلسات
مدة الجلسة                ساعتان لكل جلسة
إجمالي الساعات             10 ساعات
السعر الأساسي              100 ريال / ساعة
─────────────────────────────────────
الإجمالي قبل الخصم          1000 ريال
خصم البرنامج المتكرر (5%)    -50 ريال
─────────────────────────────────────
الإجمالي النهائي            950 ريال

ℹ الخصم المتكرر يُطبق تلقائياً على هذا البرنامج.
  كلما زادت عدد الجلسات، زادت قيمة الخصم.
```

**Result cards must show:**
- Availability badge — **`متاحة لجميع المواعيد`** (green ✓) or **`متاحة 4 من 5 مواعيد`** (amber ⓘ)
- Favorite (heart) icon, capacity badge, name, location, amenity chips
- Full price breakdown: `1000 ريال (100 × 10 ساعات)` → `-50 ريال خصم` → `الإجمالي النهائي 950 ريال`
- CTA: **`حجز هذا البرنامج`**

## 4.4 Filter sidebar
- **Remove the `التسعير` (الكل / بالساعة / باليوم) selector** — hourly only.
- Fix reversed time inputs.
- Rework the `فلترة النتائج` header block.

---

# PHASE 5 — OWNER SERVICES (Tier A)

Fixed catalog. **The seller cannot add services** — remove `+ إضافة خدمة جديدة`. Seller only toggles on/off and sets prices.

## 5.1 The 7 services
| # | Service | Description | Pricing model |
|---|---------|-------------|---------------|
| 1 | **المطبوعات** | إرسال الملفات للطباعة وتوصيلها قبل موعد الحجز | WhatsApp number field + price matrix **لكل 10 صفحات**: أبيض وأسود (وجه واحد 5 / وجهين 8), ملون (وجه واحد 15 / وجهين 25) |
| 2 | **منظم** | لاستقبال الضيوف والتنسيق / الإشراف على الفعالية | سعر للفرد 25 + سعر بالساعة 80 → e.g. `3 منظمين × ساعتين = 3 × 80 × 2 = 480 ريال` |
| 3 | **تنظيف بعد الاستخدام** | تنظيف القاعة وإعادتها لحالتها الأصلية بعد انتهاء الحجز | لكل حجز — 250 ريال |
| 4 | **مياه** | مياه معدنية مع الأكواب | لكل فرد — 7 ريال |
| 5 | **قهوة عربية** | قهوة عربية مع التمور والمستلزمات | لكل فرد — 15 ريال |
| 6 | **شاي** | شاي ساخن مع المستلزمات | لكل فرد — 5 ريال |
| 7 | **ضيافة خفيفة** | تشكيلة خفيفة من المأكولات والمشروبات | free-text detail field (placeholder: `مثال: ميني ساندويتش، معجنات، عصائر، فواكه…`) + لكل فرد — 20 ريال |

## 5.2 Seller wizard step 5 redesign
- Rename step to **`خدمات المساحة`**
- Page title `إضافة خدمات المساحة`, subtitle `اختر الخدمات التي تقدمها وحدد الأسعار والتفاصيل`
- Master toggle: **`تفعيل جميع الخدمات`**
- Category tabs: `الكل` / `الضيافة` / `مطبوعات` / `تنظيم` / `تنظيف`
- Each service = a card with on/off toggle, icon, name, description, and its pricing config.

## 5.3 Buyer-facing
**The space detail page currently does not show services at all.** Add a services section so buyers can see and select add-ons with prices. Selected services must flow into the booking and appear on the seller's booking detail.

---

# PHASE 6 — ADMIN CONTROL

## 6.1 Four managed taxonomies
`/admin/categories` currently has 2 sections. It must become **4**, all fully CRUD-able:
1. **أنواع المساحات** (space types)
2. **المرافق والتجهيزات** (amenities & equipment)
3. **خدمات صاحب المساحة** (the 7 owner services)
4. **خدمات إضافية — خدمات شركاء إحياء مساحة** (the 7 partner services)

Amenities are admin-controlled; sellers can only pick from the list, never add their own.

## 6.2 Admin control over space data
- Admin can **edit any submitted space field**, and reorder/delete its images.
- New field **`رقم الترخيص الإعلاني`** (Advertising License Number), admin-editable, per space.
- Add an **audit trail** — admin will be editing seller-submitted data and adjusting quoted prices; both need a change log for disputes.

## 6.3 Seller-applications admin module
**List `طلبات أصحاب المساحات`**
- Filter `كل الحالات`; search by name / phone / commercial register
- Columns: `المنشأة` · `اسم المدرسة / الفرع` · `رقم السجل التجاري` · `تاريخ الطلب` · `الحالة` · `إجراءات`
- Status badges: `قيد مراجعة البيانات` (amber) · `تم إرسال العقد – 5 أيام متبقية` (blue) · `تم اعتماد العقد` (green) · `انتهت مهلة الموافقة` (red) · `تم رفض العقد` (gray)

**Detail `تفاصيل طلب صاحب المساحة`**
- Request info · attached documents (الهوية / السجل التجاري / صك)
- **`العقد وحالته`**: `رقم عقد الوساطة` · `تاريخ إرسال العقد` · `آخر موعد للموافقة (7 أيام)`
- `ملاحظات المدير` textarea
- Actions: `حفظ وتحديث الحالة` · `رفض الطلب` · `طلب تعديل` · `طلب مستند إضافي`

---

# PHASE 7 — SELLER ONBOARDING REBUILD

## 7.1 Application form
Required documents:
- `الهوية الوطنية` *
- `السجل التجاري` *
- `وثيقة ملكية العقار (صك)` *

Conditional block — **`هل العقار مملوك لأكثر من مالك؟`** (نعم / لا)
- If **نعم** → show `رقم الوكالة لممثل الملاك` * and `إرفاق نسخة الوكالة (اختياري)`
- If **لا** → hide both fields entirely

Consent checkbox (exact legal text):
> أقر بصحة البيانات والمستندات المرفقة، وبأن مقدم الطلب أو معتمد العقد مخول نظامًا بتمثيل مالك العقار أو ملاكه، وأوافق على استخدام هذه البيانات لإعداد عقد الوساطة العقارية عبر منصة **فال** التابعة للهيئة العامة للعقار.

CTA: **`إرسال طلب التسجيل`** (not "create account")

## 7.2 `/success` page
> **تم استلام طلبك بنجاح**
> - سيقوم فريق إحياء مساحة بمراجعة البيانات والمستندات وإعداد عقد وساطة وتسويق عقاري عبر منصة **فال** التابعة للهيئة العامة للعقار.
> - بعد إرسال العقد، سيصل إلى مالك العقار أو معتمد العقد إشعار من الهيئة العامة للعقار يحتوي على رابط مراجعة العقد. **يجب قبول العقد أو رفضه خلال 7 أيام** من تاريخ الإرسال.
> - بعد اعتماد العقد سيتم تفعيل حساب صاحب المساحة، ويمكنكم بعدها إضافة القاعات والمساحات التابعة للعقار.
>
> ⚠️ **ملاحظة:** في حال عدم اتخاذ إجراء خلال 7 أيام تُلغى عملية اعتماد العقد، ويتم التواصل مع فريق إحياء مساحة لإعادة الإجراء.
>
> `[متابعة حالة الطلب]`

## 7.3 `/status` page — 3-step timeline
1. **قيد مراجعة البيانات** — active, badge `جارٍ`
2. **تم إرسال العقد – بانتظار موافقة المالك**
3. **تم تفعيل حساب صاحب المساحة**

Footer: `هل لديك استفسار؟ تواصل مع فريقنا وسنكون سعداء بمساعدتك.` + `[تواصل معنا]`

## 7.4 Verification
Add **email and/or SMS OTP verification** on registration (`تحقق عبر الإيميل / رسائل`).

## 7.5 Scheduled job
The 7-day FAL contract deadline needs a scheduled job to auto-expire applications into the `انتهت مهلة الموافقة` status.

---

# PHASE 8 — PARTNER SERVICES (Tier B)

Platform-provided services from Ehya Masaha partners, requested **after** the hall booking, quoted and confirmed by the Ehya Masaha team.

## 8.1 Catalog (7)
| Service | Description | Price |
|---|---|---|
| منظم | استقبال الضيوف والتنسيق والإشراف على الفعالية | 150 ر.س / للشخص / الساعة |
| تنظيف بعد الاستخدام | تنظيف شامل للمكان بعد انتهاء الفعالية | 250 ر.س |
| تصوير وتوثيق | تصوير احترافي وتوثيق لفعالياتك بجودة عالية | 400 ر.س / للساعة |
| تصوير ومونتاج فيديو | تصوير ومونتاج فيديو احترافي لفعالياتك | 600 ر.س / للفيديو |
| تصميم بوستر | تصميم بوستر إعلاني احترافي لفعالياتك | 200 ر.س / للتصميم |
| إعلان الدورة في برامج التواصل | إعلان دورتك في منصات التواصل الاجتماعي | 300 ر.س / للحملة |
| **طلب خاص** | لدينا شركاء متخصصون، أخبرنا بخدمتك وسنحاول تحقيقها | custom |

## 8.2 Six-step flow
1. **`طلب الخدمات الإضافية`** — header `خدمات شركاء إحياء مساحة`, subtitle `خدمات إضافية تقدمها منصتنا لك من شركاء إحياء مساحة لتسهيل فعالياتك.`, then `اختر الخدمات التي تحتاجها` with checkbox service cards.
2. **`تقديم الطلب`** — review table (`الخدمة` / `التفاصيل` / `الكمية` / `السعر`) + **`المجموع التقديري`** + `ملاحظات إضافية (اختياري)` → buttons `إرسال الطلب للمراجعة` / `حفظ كمسودة`
3. **`طلب قيد المراجعة`** — reference `#SR-2507038`, status badge `قيد المراجعة`, section `ماذا يحدث الآن؟`:
   - سيتم مراجعة طلبك من قبل فريق إحياء مساحة.
   - سنتحقق من التوفر والأسعار مع شركائنا.
   - سوف نرسل لك عرض السعر والتأكيد **خلال 24 ساعة**.
4. **`عرض السعر والتأكيد`** — admin-adjusted quote + `ملاحظات من فريق إحياء مساحة` → `موافق على العرض والمتابعة للدفع` / `رفض الطلب`
5. **`الدفع`** — methods **مدى / Apple Pay / بطاقة ائتمان / تحويل بنكي** + terms checkbox → `دفع 3,030 ر.س` with note `عملية دفع آمنة ومشفرة`
6. **`تأكيد النجاح`** — `تم تأكيد طلبك بنجاح!` + `ماذا بعد؟` + `[الانتقال إلى طلباتي]`

> Prices are **negotiable by admin** between step 2 (تقديري 3,550) and step 4 (عرض 3,030).

---

# PHASE 9 — PAYMENTS

*(Confirm scope first — see "Ask before building".)*

- Methods: **مدى، Apple Pay، بطاقة ائتمان/مدى، تحويل بنكي**
- Secure checkout with terms acceptance
- Required for both hall bookings and partner-service orders
- **Refunds must be driven by the space's cancellation policy** (Flexible / Moderate / Strict per §0.10)
- **VAT**: prices display as VAT-inclusive (`جميع الأسعار تشمل ضريبة القيمة المضافة`) but you need the VAT breakdown for invoices and reports
- `محفظتي` (wallet) — only if confirmed in scope

---

# CROSS-CUTTING WORK

## Notifications
Entirely absent today, but multiple flows assume them:
- FAL contract deadline reminders (7 days)
- "quote ready within 24h" for partner services
- booking confirmations
- cancellation notices

## Review moderation
`SpaceReview.isVisible` exists in the schema but there is **no admin UI** to moderate reviews. Add one.

## Known bugs to fix
| Area | Issue |
|---|---|
| Seller wizard step 2 (الموقع والعنوان) | **Broken.** Google-Maps-link parser fails (`لم نتمكن من قراءة الرابط`). The map also ignores the selected city — city set to `الخبر` but map shows Riyadh coordinates/streets. |
| Seller wizard step 6 | Calendar preview design rejected — needs redesign. Times reversed. |
| Homepage | "How it works" step icons render as empty/broken squares. |
| Throughout | Arabic-Indic numerals; reversed times; emoji icons; off-brand stat colors. |

---

# DEFINITION OF DONE (per phase)

1. `npx next build` passes with zero TypeScript errors.
2. Every new Arabic string has an English entry in `src/lib/domTranslations.ts`; the AR/EN toggle translates the new screens completely.
3. New screens verified responsive at 375px and 1280px.
4. No Arabic-Indic numerals rendered anywhere.
5. No reversed time strings.
6. Changes committed with a descriptive message.
