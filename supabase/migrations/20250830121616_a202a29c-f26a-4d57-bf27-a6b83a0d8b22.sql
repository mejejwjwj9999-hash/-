-- إصلاح مشكلة الجدول الدراسي وإكمال إعداد البيانات

-- حذف البيانات المعطلة إن وجدت
DELETE FROM public.class_schedule WHERE instructor_name IS NULL;

-- إضافة الجدول الدراسي بطريقة صحيحة
INSERT INTO public.class_schedule (
  course_id, day_of_week, start_time, end_time, classroom, 
  instructor_name, semester, academic_year
) SELECT 
  c.id, 
  CASE 
    WHEN c.course_code = 'CS301' THEN 1 -- الأحد
    WHEN c.course_code = 'CS302' THEN 1 -- الأحد  
    WHEN c.course_code = 'CS303' THEN 2 -- الاثنين
    WHEN c.course_code = 'CS304' THEN 3 -- الثلاثاء
    WHEN c.course_code = 'CS305' THEN 4 -- الأربعاء
    WHEN c.course_code = 'ENG101' THEN 5 -- الخميس
    WHEN c.course_code = 'MATH201' THEN 2 -- الاثنين
    WHEN c.course_code = 'PHY201' THEN 3 -- الثلاثاء
  END,
  CASE 
    WHEN c.course_code = 'CS301' THEN '08:00:00'::time
    WHEN c.course_code = 'CS302' THEN '10:00:00'::time
    WHEN c.course_code = 'CS303' THEN '09:00:00'::time
    WHEN c.course_code = 'CS304' THEN '11:00:00'::time
    WHEN c.course_code = 'CS305' THEN '08:00:00'::time
    WHEN c.course_code = 'ENG101' THEN '10:00:00'::time
    WHEN c.course_code = 'MATH201' THEN '13:00:00'::time
    WHEN c.course_code = 'PHY201' THEN '14:00:00'::time
  END,
  CASE 
    WHEN c.course_code = 'CS301' THEN '09:30:00'::time
    WHEN c.course_code = 'CS302' THEN '11:30:00'::time
    WHEN c.course_code = 'CS303' THEN '10:30:00'::time
    WHEN c.course_code = 'CS304' THEN '12:30:00'::time
    WHEN c.course_code = 'CS305' THEN '09:30:00'::time
    WHEN c.course_code = 'ENG101' THEN '11:30:00'::time
    WHEN c.course_code = 'MATH201' THEN '14:30:00'::time
    WHEN c.course_code = 'PHY201' THEN '15:30:00'::time
  END,
  CASE 
    WHEN c.course_code = 'CS301' THEN 'قاعة 101'
    WHEN c.course_code = 'CS302' THEN 'مختبر 203'
    WHEN c.course_code = 'CS303' THEN 'قاعة 105'
    WHEN c.course_code = 'CS304' THEN 'قاعة 102'
    WHEN c.course_code = 'CS305' THEN 'مختبر 301'
    WHEN c.course_code = 'ENG101' THEN 'قاعة 201'
    WHEN c.course_code = 'MATH201' THEN 'قاعة 301'
    WHEN c.course_code = 'PHY201' THEN 'مختبر 401'
  END,
  CASE 
    WHEN c.course_code = 'CS301' THEN 'د. فاطمة أحمد'
    WHEN c.course_code = 'CS302' THEN 'د. محمد حسن'
    WHEN c.course_code = 'CS303' THEN 'د. سارة علي'
    WHEN c.course_code = 'CS304' THEN 'د. عبدالله محمد'
    WHEN c.course_code = 'CS305' THEN 'د. نورا حسين'
    WHEN c.course_code = 'ENG101' THEN 'د. أمل سالم'
    WHEN c.course_code = 'MATH201' THEN 'د. خالد عبدالله'
    WHEN c.course_code = 'PHY201' THEN 'د. هدى محمد'
  END,
  'الفصل الأول',
  '2024-2025'
FROM public.courses c
WHERE c.course_code IN ('CS301', 'CS302', 'CS303', 'CS304', 'CS305', 'ENG101', 'MATH201', 'PHY201')
  AND NOT EXISTS (
    SELECT 1 FROM public.class_schedule cs 
    WHERE cs.course_id = c.id AND cs.instructor_name IS NOT NULL
  );

-- إضافة بيانات إضافية للنظام
INSERT INTO public.service_requests (
  student_id, service_type, title, description, status, priority
) SELECT 
  sp.id,
  'transcript_request',
  'طلب كشف درجات',
  'طلب الحصول على كشف درجات رسمي للفصل الدراسي الحالي',
  'pending',
  'normal'
FROM public.student_profiles sp
WHERE sp.student_id = 'STD20240001'
  AND NOT EXISTS (
    SELECT 1 FROM public.service_requests sr 
    WHERE sr.student_id = sp.id AND sr.service_type = 'transcript_request'
  );

-- إضافة إعدادات النظام
INSERT INTO public.system_settings (setting_key, setting_value, category, description)
VALUES 
('tuition_fees', '{"undergraduate": 180000, "graduate": 250000, "lab_fee": 35000}', 'financial', 'الرسوم الدراسية حسب المستوى'),
('academic_calendar', '{"semester_start": "2024-09-01", "semester_end": "2025-01-15", "finals_start": "2025-01-01"}', 'academic', 'التقويم الأكاديمي'),
('contact_info', '{"phone": "+967-1-123456", "email": "info@aylol.edu.ye", "address": "صنعاء، الجمهورية اليمنية"}', 'general', 'معلومات الاتصال')
ON CONFLICT (setting_key) DO NOTHING;