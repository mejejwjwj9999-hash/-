
-- إزالة القيود الموجودة على جدول class_schedule وإعادة إنشائها بشكل صحيح
ALTER TABLE public.class_schedule DROP CONSTRAINT IF EXISTS class_schedule_day_of_week_check;

-- إضافة قيد صحيح لأيام الأسبوع (0-6)
ALTER TABLE public.class_schedule ADD CONSTRAINT class_schedule_day_of_week_check 
CHECK (day_of_week >= 0 AND day_of_week <= 6);

-- التأكد من وجود علاقة خارجية صحيحة مع جدول courses
ALTER TABLE public.class_schedule DROP CONSTRAINT IF EXISTS class_schedule_course_id_fkey;
ALTER TABLE public.class_schedule ADD CONSTRAINT class_schedule_course_id_fkey 
FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;

-- إضافة فهرس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_class_schedule_course_day_time 
ON public.class_schedule(course_id, day_of_week, start_time);

-- إضافة قيد للتأكد من أن وقت البداية أقل من وقت النهاية
ALTER TABLE public.class_schedule DROP CONSTRAINT IF EXISTS class_schedule_time_check;
ALTER TABLE public.class_schedule ADD CONSTRAINT class_schedule_time_check 
CHECK (start_time < end_time);
