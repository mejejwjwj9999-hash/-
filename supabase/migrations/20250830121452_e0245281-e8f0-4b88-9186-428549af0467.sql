-- إصلاح مشاكل الأمان وإعداد قواعد البيانات الكاملة

-- إصلاح دالة handle_new_student لمشكلة search_path
CREATE OR REPLACE FUNCTION public.handle_new_student()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.student_profiles (
    user_id,
    student_id,
    first_name,
    last_name,
    email,
    college,
    department,
    academic_year,
    semester,
    admission_date
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'student_id', 'STD' || to_char(now(), 'YYYYMMDD') || LPAD(nextval('public.student_id_seq')::text, 4, '0')),
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'college', 'غير محدد'),
    COALESCE(NEW.raw_user_meta_data->>'department', 'غير محدد'),
    COALESCE((NEW.raw_user_meta_data->>'academic_year')::integer, 1),
    COALESCE((NEW.raw_user_meta_data->>'semester')::integer, 1),
    COALESCE((NEW.raw_user_meta_data->>'admission_date')::date, now()::date)
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_student: %', SQLERRM;
    RETURN NEW;
END;
$function$;

-- إضافة بيانات نموذجية للطلاب
INSERT INTO public.student_profiles (
  student_id, first_name, last_name, email, college, department, 
  academic_year, semester, admission_date, phone
) VALUES 
('STD20240001', 'أحمد', 'محمد علي', 'ahmed.mohammed@aylol.edu.ye', 'كلية الهندسة والتكنولوجيا', 'علوم الحاسوب', 3, 1, '2022-09-01', '+967-77-123-4567'),
('STD20240002', 'فاطمة', 'أحمد حسن', 'fatima.ahmed@aylol.edu.ye', 'كلية الطب', 'الطب العام', 2, 1, '2023-09-01', '+967-77-234-5678'),
('STD20240003', 'محمد', 'سالم قاسم', 'mohammed.salem@aylol.edu.ye', 'كلية إدارة الأعمال', 'إدارة الأعمال', 4, 1, '2021-09-01', '+967-77-345-6789')
ON CONFLICT (student_id) DO NOTHING;

-- إضافة المواد الدراسية
INSERT INTO public.courses (
  course_code, course_name_ar, course_name_en, credit_hours, 
  college, department, description
) VALUES
-- مواد علوم الحاسوب
('CS301', 'خوارزميات البيانات', 'Data Algorithms', 3, 'كلية الهندسة والتكنولوجيا', 'علوم الحاسوب', 'دراسة الخوارزميات وهياكل البيانات المتقدمة'),
('CS302', 'قواعد البيانات', 'Database Systems', 3, 'كلية الهندسة والتكنولوجيا', 'علوم الحاسوب', 'تصميم وإدارة قواعد البيانات'),
('CS303', 'الشبكات الحاسوبية', 'Computer Networks', 4, 'كلية الهندسة والتكنولوجيا', 'علوم الحاسوب', 'أساسيات الشبكات والاتصالات'),
('CS304', 'هندسة البرمجيات', 'Software Engineering', 3, 'كلية الهندسة والتكنولوجيا', 'علوم الحاسوب', 'منهجيات تطوير البرمجيات'),
('CS305', 'الذكاء الاصطناعي', 'Artificial Intelligence', 4, 'كلية الهندسة والتكنولوجيا', 'علوم الحاسوب', 'مقدمة في الذكاء الاصطناعي والتعلم الآلي'),
-- مواد عامة
('ENG101', 'اللغة الإنجليزية (1)', 'English Language I', 2, 'كلية الآداب', 'اللغة الإنجليزية', 'أساسيات اللغة الإنجليزية'),
('MATH201', 'الرياضيات المتقدمة', 'Advanced Mathematics', 4, 'كلية العلوم', 'الرياضيات', 'حساب التفاضل والتكامل والجبر الخطي'),
('PHY201', 'الفيزياء التطبيقية', 'Applied Physics', 3, 'كلية العلوم', 'الفيزياء', 'المبادئ الأساسية للفيزياء وتطبيقاتها')
ON CONFLICT (course_code) DO NOTHING;

-- إضافة الجدول الدراسي
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
WHERE NOT EXISTS (
  SELECT 1 FROM public.class_schedule cs WHERE cs.course_id = c.id
);

-- إضافة الدرجات
INSERT INTO public.grades (
  student_id, course_id, semester, academic_year,
  midterm_grade, coursework_grade, final_grade, total_grade,
  letter_grade, gpa_points, status
) SELECT 
  sp.id,
  c.id,
  'الفصل الأول',
  '2024-2025',
  CASE 
    WHEN c.course_code = 'CS301' THEN 85.0
    WHEN c.course_code = 'CS302' THEN 78.0
    WHEN c.course_code = 'ENG101' THEN 82.0
    WHEN c.course_code = 'MATH201' THEN 88.0
    WHEN c.course_code = 'PHY201' THEN 80.0
  END,
  CASE 
    WHEN c.course_code = 'CS301' THEN 90.0
    WHEN c.course_code = 'CS302' THEN 85.0
    WHEN c.course_code = 'ENG101' THEN 88.0
    WHEN c.course_code = 'MATH201' THEN 92.0
    WHEN c.course_code = 'PHY201' THEN 85.0
  END,
  CASE 
    WHEN c.course_code = 'CS301' THEN 87.0
    WHEN c.course_code = 'CS302' THEN 80.0
    WHEN c.course_code = 'ENG101' THEN 85.0
    WHEN c.course_code = 'MATH201' THEN 90.0
    WHEN c.course_code = 'PHY201' THEN 83.0
  END,
  CASE 
    WHEN c.course_code = 'CS301' THEN 87.3
    WHEN c.course_code = 'CS302' THEN 81.0
    WHEN c.course_code = 'ENG101' THEN 85.0
    WHEN c.course_code = 'MATH201' THEN 90.0
    WHEN c.course_code = 'PHY201' THEN 82.7
  END,
  CASE 
    WHEN c.course_code = 'CS301' THEN 'A'
    WHEN c.course_code = 'CS302' THEN 'B+'
    WHEN c.course_code = 'ENG101' THEN 'B+'
    WHEN c.course_code = 'MATH201' THEN 'A'
    WHEN c.course_code = 'PHY201' THEN 'B+'
  END,
  CASE 
    WHEN c.course_code = 'CS301' THEN 4.0
    WHEN c.course_code = 'CS302' THEN 3.5
    WHEN c.course_code = 'ENG101' THEN 3.5
    WHEN c.course_code = 'MATH201' THEN 4.0
    WHEN c.course_code = 'PHY201' THEN 3.5
  END,
  'مكتملة'
FROM public.student_profiles sp
CROSS JOIN public.courses c
WHERE sp.student_id = 'STD20240001' 
  AND c.course_code IN ('CS301', 'CS302', 'ENG101', 'MATH201', 'PHY201')
  AND NOT EXISTS (
    SELECT 1 FROM public.grades g 
    WHERE g.student_id = sp.id AND g.course_id = c.id
  );

-- إضافة المدفوعات
INSERT INTO public.payments (
  student_id, payment_type, amount, payment_status, payment_date, 
  due_date, semester, academic_year, currency, payment_method
) SELECT 
  sp.id,
  'رسوم دراسية',
  180000.00,
  'مدفوع',
  '2024-09-15'::timestamptz,
  '2024-09-30'::timestamptz,
  'الفصل الأول',
  '2024-2025',
  'YER',
  'تحويل بنكي'
FROM public.student_profiles sp
WHERE sp.student_id = 'STD20240001'
  AND NOT EXISTS (
    SELECT 1 FROM public.payments p 
    WHERE p.student_id = sp.id AND p.payment_type = 'رسوم دراسية'
  );

INSERT INTO public.payments (
  student_id, payment_type, amount, payment_status, payment_date, 
  due_date, semester, academic_year, currency
) SELECT 
  sp.id,
  'رسوم مختبر',
  35000.00,
  'مدفوع',
  '2024-09-20'::timestamptz,
  '2024-10-15'::timestamptz,
  'الفصل الأول',
  '2024-2025',
  'YER'
FROM public.student_profiles sp
WHERE sp.student_id = 'STD20240001'
  AND NOT EXISTS (
    SELECT 1 FROM public.payments p 
    WHERE p.student_id = sp.id AND p.payment_type = 'رسوم مختبر'
  );

-- إضافة الإشعارات
INSERT INTO public.notifications (
  student_id, type, title, message, priority, expires_at
) SELECT 
  sp.id,
  'academic',
  'موعد الامتحان النهائي',
  'يرجى مراجعة جدول الامتحانات النهائية المحدث. امتحان مادة خوارزميات البيانات يوم الأحد الموافق 15 يناير 2025.',
  'high',
  '2025-01-15'::timestamptz
FROM public.student_profiles sp
WHERE sp.student_id = 'STD20240001'
  AND NOT EXISTS (
    SELECT 1 FROM public.notifications n 
    WHERE n.student_id = sp.id AND n.type = 'academic'
  );

INSERT INTO public.notifications (
  student_id, type, title, message, priority
) SELECT 
  sp.id,
  'financial',
  'تذكير بموعد الدفع',
  'يرجى دفع رسوم الامتحانات قبل تاريخ 30 نوفمبر 2024 لتجنب أي تأخير في التسجيل.',
  'normal'
FROM public.student_profiles sp
WHERE sp.student_id = 'STD20240001'
  AND NOT EXISTS (
    SELECT 1 FROM public.notifications n 
    WHERE n.student_id = sp.id AND n.type = 'financial'
  );

-- إضافة الوثائق
INSERT INTO public.documents (
  student_id, document_name, document_type, file_path, 
  is_official, status, issued_date
) SELECT 
  sp.id,
  'كشف الدرجات - الفصل الأول 2024-2025',
  'transcript',
  '/documents/transcripts/STD20240001_2024_1.pdf',
  true,
  'active',
  '2024-12-01'::timestamptz
FROM public.student_profiles sp
WHERE sp.student_id = 'STD20240001'
  AND NOT EXISTS (
    SELECT 1 FROM public.documents d 
    WHERE d.student_id = sp.id AND d.document_type = 'transcript'
  );

INSERT INTO public.documents (
  student_id, document_name, document_type, file_path, 
  is_official, status, issued_date
) SELECT 
  sp.id,
  'شهادة تسجيل - 2024-2025',
  'enrollment_certificate',
  '/documents/certificates/STD20240001_enrollment.pdf',
  true,
  'active',
  '2024-09-01'::timestamptz
FROM public.student_profiles sp
WHERE sp.student_id = 'STD20240001'
  AND NOT EXISTS (
    SELECT 1 FROM public.documents d 
    WHERE d.student_id = sp.id AND d.document_type = 'enrollment_certificate'
  );

-- إضافة المواعيد
INSERT INTO public.appointments (
  student_id, title, description, appointment_date, 
  appointment_type, location, staff_member, status
) SELECT 
  sp.id,
  'استشارة أكاديمية',
  'مناقشة الخطة الدراسية للفصل القادم وتحديد المواد المطلوبة',
  '2024-12-20 10:00:00'::timestamptz,
  'academic',
  'مكتب الإرشاد الأكاديمي - الطابق الثاني',
  'د. أحمد سالم',
  'scheduled'
FROM public.student_profiles sp
WHERE sp.student_id = 'STD20240001'
  AND NOT EXISTS (
    SELECT 1 FROM public.appointments a 
    WHERE a.student_id = sp.id AND a.appointment_type = 'academic'
  );

-- إنشاء دالة لحساب المعدل التراكمي
CREATE OR REPLACE FUNCTION public.calculate_gpa(student_uuid uuid)
RETURNS numeric
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT COALESCE(
    ROUND(
      SUM(g.gpa_points * c.credit_hours) / NULLIF(SUM(c.credit_hours), 0),
      2
    ),
    0.00
  )
  FROM public.grades g
  JOIN public.courses c ON g.course_id = c.id
  WHERE g.student_id = student_uuid 
    AND g.status = 'مكتملة'
    AND g.gpa_points IS NOT NULL;
$function$;