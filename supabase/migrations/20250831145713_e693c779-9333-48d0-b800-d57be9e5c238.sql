
-- حل مشكلة قيد day_of_week في جدول class_schedule
ALTER TABLE public.class_schedule DROP CONSTRAINT IF EXISTS class_schedule_day_of_week_check;

-- إعادة إنشاء القيد بشكل صحيح (الأحد = 0 إلى السبت = 6)
ALTER TABLE public.class_schedule ADD CONSTRAINT class_schedule_day_of_week_check 
CHECK (day_of_week >= 0 AND day_of_week <= 6);

-- إضافة قيد للتأكد من صحة البيانات المطلوبة
ALTER TABLE public.class_schedule ALTER COLUMN academic_year SET NOT NULL;
ALTER TABLE public.class_schedule ALTER COLUMN semester SET NOT NULL;
ALTER TABLE public.class_schedule ALTER COLUMN classroom SET NOT NULL;
ALTER TABLE public.class_schedule ALTER COLUMN instructor_name SET NOT NULL;

-- تحديث any existing invalid data
UPDATE public.class_schedule 
SET day_of_week = 0 
WHERE day_of_week < 0 OR day_of_week > 6;

-- إضافة فهرس مركب لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_class_schedule_lookup 
ON public.class_schedule(academic_year, semester, day_of_week, start_time);
