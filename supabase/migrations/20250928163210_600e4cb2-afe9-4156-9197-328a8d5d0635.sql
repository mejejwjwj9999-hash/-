-- تحديث جدول البرامج الأكاديمية الديناميكية لدعم البيانات المفصلة
-- إضافة أعمدة جديدة لمعلومات البرنامج فقط
ALTER TABLE public.dynamic_academic_programs
ADD COLUMN IF NOT EXISTS program_overview_ar TEXT,
ADD COLUMN IF NOT EXISTS program_overview_en TEXT,
ADD COLUMN IF NOT EXISTS student_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS program_vision_ar TEXT,
ADD COLUMN IF NOT EXISTS program_vision_en TEXT,
ADD COLUMN IF NOT EXISTS program_mission_ar TEXT,
ADD COLUMN IF NOT EXISTS program_mission_en TEXT,
ADD COLUMN IF NOT EXISTS program_objectives JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS graduate_specifications JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS learning_outcomes JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS benchmark_programs JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS program_references JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS job_opportunities JSONB DEFAULT '[]'::jsonb;

-- إنشاء فهرس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_dynamic_programs_key ON public.dynamic_academic_programs(program_key);
CREATE INDEX IF NOT EXISTS idx_dynamic_programs_active ON public.dynamic_academic_programs(is_active);
CREATE INDEX IF NOT EXISTS idx_dynamic_programs_published ON public.dynamic_academic_programs(published_at);