-- إضافة الحقول المفقودة للجدول
ALTER TABLE public.dynamic_academic_programs 
ADD COLUMN IF NOT EXISTS faculty_members jsonb NOT NULL DEFAULT '[]',
ADD COLUMN IF NOT EXISTS yearly_curriculum jsonb NOT NULL DEFAULT '[]',
ADD COLUMN IF NOT EXISTS academic_requirements jsonb NOT NULL DEFAULT '[]',
ADD COLUMN IF NOT EXISTS general_requirements jsonb NOT NULL DEFAULT '[]',
ADD COLUMN IF NOT EXISTS program_statistics jsonb NOT NULL DEFAULT '[]',
ADD COLUMN IF NOT EXISTS career_opportunities_list jsonb NOT NULL DEFAULT '[]',
ADD COLUMN IF NOT EXISTS program_overview_ar text,
ADD COLUMN IF NOT EXISTS program_overview_en text,
ADD COLUMN IF NOT EXISTS student_count int NOT NULL DEFAULT 0;

-- إضافة الفهارس المفقودة
CREATE INDEX IF NOT EXISTS idx_dynamic_programs_display_order ON public.dynamic_academic_programs(display_order ASC);
CREATE INDEX IF NOT EXISTS idx_dynamic_programs_published_active ON public.dynamic_academic_programs(is_active, published_at);

-- إضافة محدث تلقائي لحقل updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_dynamic_programs_set_updated_at ON public.dynamic_academic_programs;
CREATE TRIGGER trg_dynamic_programs_set_updated_at
BEFORE UPDATE ON public.dynamic_academic_programs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- تفعيل RLS وسياسات الوصول
ALTER TABLE public.dynamic_academic_programs ENABLE ROW LEVEL SECURITY;

-- قراءة عامة: يظهر فقط المنشور والنشط
DROP POLICY IF EXISTS "public can read published active programs" ON public.dynamic_academic_programs;
CREATE POLICY "public can read published active programs"
ON public.dynamic_academic_programs
FOR SELECT
TO anon, authenticated
USING (is_active = true AND published_at IS NOT NULL);

-- قراءة كاملة في لوحة الإدارة
DROP POLICY IF EXISTS "authenticated can read all programs (admin)" ON public.dynamic_academic_programs;
CREATE POLICY "authenticated can read all programs (admin)"
ON public.dynamic_academic_programs
FOR SELECT
TO authenticated
USING (true);

-- إنشاء/تعديل/حذف في لوحة الإدارة
DROP POLICY IF EXISTS "authenticated can insert programs" ON public.dynamic_academic_programs;
CREATE POLICY "authenticated can insert programs"
ON public.dynamic_academic_programs
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated can update programs" ON public.dynamic_academic_programs;
CREATE POLICY "authenticated can update programs"
ON public.dynamic_academic_programs
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated can delete programs" ON public.dynamic_academic_programs;
CREATE POLICY "authenticated can delete programs"
ON public.dynamic_academic_programs
FOR DELETE
TO authenticated
USING (true);