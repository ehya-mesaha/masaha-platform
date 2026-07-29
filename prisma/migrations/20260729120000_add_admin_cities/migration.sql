CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "City_name_key" ON "City"("name");

INSERT INTO "City" ("id", "name", "sortOrder", "updatedAt") VALUES
  ('city_riyadh', 'الرياض', 10, CURRENT_TIMESTAMP),
  ('city_jeddah', 'جدة', 20, CURRENT_TIMESTAMP),
  ('city_makkah', 'مكة المكرمة', 30, CURRENT_TIMESTAMP),
  ('city_madinah', 'المدينة المنورة', 40, CURRENT_TIMESTAMP),
  ('city_dammam', 'الدمام', 50, CURRENT_TIMESTAMP),
  ('city_khobar', 'الخبر', 60, CURRENT_TIMESTAMP),
  ('city_dhahran', 'الظهران', 70, CURRENT_TIMESTAMP),
  ('city_tabuk', 'تبوك', 80, CURRENT_TIMESTAMP),
  ('city_buraydah', 'بريدة', 90, CURRENT_TIMESTAMP),
  ('city_hail', 'حائل', 100, CURRENT_TIMESTAMP),
  ('city_taif', 'الطائف', 110, CURRENT_TIMESTAMP),
  ('city_abha', 'أبها', 120, CURRENT_TIMESTAMP),
  ('city_khamis', 'خميس مشيط', 130, CURRENT_TIMESTAMP),
  ('city_najran', 'نجران', 140, CURRENT_TIMESTAMP),
  ('city_jazan', 'جازان', 150, CURRENT_TIMESTAMP),
  ('city_yanbu', 'ينبع', 160, CURRENT_TIMESTAMP),
  ('city_jubail', 'الجبيل', 170, CURRENT_TIMESTAMP),
  ('city_qatif', 'القطيف', 180, CURRENT_TIMESTAMP),
  ('city_ahsa', 'الأحساء', 190, CURRENT_TIMESTAMP),
  ('city_unaizah', 'عنيزة', 200, CURRENT_TIMESTAMP)
ON CONFLICT ("name") DO NOTHING;
