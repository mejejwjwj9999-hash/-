-- إضافة بيانات تجريبية للنظام

-- إضافة طالب تجريبي (سيتم ربطه بالمستخدم عند تسجيل الدخول)
INSERT INTO public.student_profiles (
  student_id, first_name, last_name, email, college, department, academic_year, semester, admission_date, phone, status
) VALUES 
('STD2024001', 'أحمد', 'محمد علي', 'ahmed.ali@aylol.edu.ye', 'كلية الصيدلة', 'الصيدلة', 2, 1, '2023-09-01', '+967-777-123456', 'active'),
('STD2024002', 'فاطمة', 'حسن أحمد', 'fatima.hassan@aylol.edu.ye', 'كلية التمريض', 'التمريض', 3, 2, '2022-09-01', '+967-777-123457', 'active'),
('STD2024003', 'محمد', 'عبدالله سالم', 'mohammed.salem@aylol.edu.ye', 'كلية تقنية المعلومات', 'تقنية المعلومات', 1, 1, '2024-09-01', '+967-777-123458', 'active'),
('STD2024004', 'زينب', 'علي يحيى', 'zainab.ali@aylol.edu.ye', 'كلية إدارة الأعمال', 'إدارة الأعمال', 4, 1, '2021-09-01', '+967-777-123459', 'active')
ON CONFLICT (student_id) DO NOTHING;

-- إضافة المقررات
INSERT INTO public.courses (
  course_code, course_name_ar, course_name_en, college, department, credit_hours, description
) VALUES 
-- مقررات الصيدلة
('PHAR101', 'الكيمياء العامة', 'General Chemistry', 'كلية الصيدلة', 'الصيدلة', 3, 'مقرر أساسي في الكيمياء العامة'),
('PHAR201', 'علم العقاقير', 'Pharmacology', 'كلية الصيدلة', 'الصيدلة', 4, 'دراسة تأثير الأدوية على الجسم'),
('PHAR301', 'الصيدلة الإكلينيكية', 'Clinical Pharmacy', 'كلية الصيدلة', 'الصيدلة', 3, 'التطبيق العملي للصيدلة في المستشفيات'),

-- مقررات التمريض
('NURS101', 'أساسيات التمريض', 'Fundamentals of Nursing', 'كلية التمريض', 'التمريض', 4, 'المبادئ الأساسية لمهنة التمريض'),
('NURS201', 'تمريض طبي جراحي', 'Medical Surgical Nursing', 'كلية التمريض', 'التمريض', 5, 'رعاية المرضى في الأقسام الطبية والجراحية'),

-- مقررات تقنية المعلومات
('IT101', 'أساسيات الحاسوب', 'Computer Fundamentals', 'كلية تقنية المعلومات', 'تقنية المعلومات', 3, 'المبادئ الأساسية لعلوم الحاسوب'),
('IT201', 'البرمجة بلغة جافا', 'Java Programming', 'كلية تقنية المعلومات', 'تقنية المعلومات', 4, 'تعلم البرمجة باستخدام لغة جافا'),

-- مقررات إدارة الأعمال
('BUS101', 'مبادئ الإدارة', 'Principles of Management', 'كلية إدارة الأعمال', 'إدارة الأعمال', 3, 'المفاهيم الأساسية في الإدارة'),
('BUS201', 'المحاسبة المالية', 'Financial Accounting', 'كلية إدارة الأعمال', 'إدارة الأعمال', 3, 'أساسيات المحاسبة والتقارير المالية')

ON CONFLICT (course_code) DO NOTHING;

-- إضافة الجداول الدراسية
DO $$
DECLARE
    course_rec RECORD;
BEGIN
    FOR course_rec IN SELECT id, course_code FROM public.courses LOOP
        INSERT INTO public.class_schedule (
            course_id, day_of_week, start_time, end_time, classroom, instructor_name, academic_year, semester
        ) VALUES 
        (course_rec.id, 1, '08:00', '09:30', 'قاعة ' || SUBSTRING(course_rec.course_code, 1, 3) || '-101', 'د. محمد أحمد', '2024-2025', 'الفصل الأول'),
        (course_rec.id, 3, '10:00', '11:30', 'قاعة ' || SUBSTRING(course_rec.course_code, 1, 3) || '-102', 'د. فاطمة علي', '2024-2025', 'الفصل الأول');
    END LOOP;
END $$;

-- إضافة الإشعارات للطلاب
DO $$
DECLARE
    student_rec RECORD;
BEGIN
    FOR student_rec IN SELECT id FROM public.student_profiles LIMIT 4 LOOP
        INSERT INTO public.notifications (
            student_id, title, message, type, priority, is_read, created_at
        ) VALUES 
        (student_rec.id, 'مرحباً بك في كلية أيلول', 'نرحب بك في بداية رحلتك الأكاديمية معنا. يرجى مراجعة جدولك الدراسي والمدفوعات المطلوبة.', 'system', 'normal', false, NOW() - INTERVAL '1 day'),
        (student_rec.id, 'تذكير بموعد الامتحانات', 'بدء امتحانات منتصف الفصل يوم الأحد القادم. يرجى مراجعة الجدول الامتحاني.', 'academic', 'high', false, NOW() - INTERVAL '3 hours'),
        (student_rec.id, 'فاتورة الرسوم الدراسية', 'تم إرسال فاتورة الرسوم الدراسية للفصل الحالي. يرجى السداد قبل تاريخ الاستحقاق.', 'financial', 'medium', true, NOW() - INTERVAL '1 week');
    END LOOP;
END $$;

-- إضافة المدفوعات
DO $$
DECLARE
    student_rec RECORD;
BEGIN
    FOR student_rec IN SELECT id FROM public.student_profiles LIMIT 4 LOOP
        INSERT INTO public.payments (
            student_id, amount, currency, payment_type, payment_status, due_date, academic_year, semester, description, reference_number
        ) VALUES 
        (student_rec.id, 150000, 'YER', 'tuition', 'paid', NOW() - INTERVAL '30 days', '2024-2025', 'الفصل الأول', 'رسوم دراسية - الفصل الأول', 'PAY-2024-' || LPAD((student_rec.id::text)::numeric::int::text, 6, '0')),
        (student_rec.id, 25000, 'YER', 'registration', 'pending', NOW() + INTERVAL '15 days', '2024-2025', 'الفصل الثاني', 'رسوم التسجيل - الفصل الثاني', 'REG-2024-' || LPAD((student_rec.id::text)::numeric::int::text, 6, '0')),
        (student_rec.id, 50000, 'YER', 'lab_fee', 'overdue', NOW() - INTERVAL '5 days', '2024-2025', 'الفصل الأول', 'رسوم المختبرات', 'LAB-2024-' || LPAD((student_rec.id::text)::numeric::int::text, 6, '0'));
    END LOOP;
END $$;

-- إضافة الوثائق
DO $$
DECLARE
    student_rec RECORD;
BEGIN
    FOR student_rec IN SELECT id FROM public.student_profiles LIMIT 4 LOOP
        INSERT INTO public.documents (
            student_id, document_name, document_type, status, is_official, issued_date, file_path, verification_code
        ) VALUES 
        (student_rec.id, 'كشف درجات الفصل الأول 2023-2024', 'transcript', 'active', true, NOW() - INTERVAL '6 months', '/documents/transcript_' || student_rec.id || '.pdf', 'VER-' || UPPER(SUBSTRING(MD5(student_rec.id::text), 1, 8))),
        (student_rec.id, 'شهادة قيد للعام الحالي', 'enrollment_certificate', 'active', true, NOW() - INTERVAL '1 month', '/documents/enrollment_' || student_rec.id || '.pdf', 'VER-' || UPPER(SUBSTRING(MD5(student_rec.id::text || 'enroll'), 1, 8))),
        (student_rec.id, 'خطاب توصية من عميد الكلية', 'recommendation_letter', 'pending', false, NULL, '', NULL);
    END LOOP;
END $$;

-- إضافة طلبات الخدمات
DO $$
DECLARE
    student_rec RECORD;
BEGIN
    FOR student_rec IN SELECT id FROM public.student_profiles LIMIT 4 LOOP
        INSERT INTO public.service_requests (
            student_id, title, service_type, description, status, priority, created_at
        ) VALUES 
        (student_rec.id, 'طلب إفادة قيد للسفارة', 'document_request', 'أحتاج إفادة قيد رسمية مصدقة لتقديمها للسفارة لاستخراج تأشيرة دراسية', 'pending', 'high', NOW() - INTERVAL '2 days'),
        (student_rec.id, 'مشكلة في النظام الأكاديمي', 'technical_support', 'لا أستطيع الوصول إلى درجاتي في النظام الأكاديمي', 'in_progress', 'medium', NOW() - INTERVAL '1 week'),
        (student_rec.id, 'تغيير موعد الامتحان', 'academic_request', 'طلب تأجيل امتحان مادة الإحصاء بسبب ظروف صحية', 'completed', 'normal', NOW() - INTERVAL '2 weeks');
    END LOOP;
END $$;

-- إضافة مواعيد للطلاب
DO $$
DECLARE
    student_rec RECORD;
BEGIN
    FOR student_rec IN SELECT id FROM public.student_profiles LIMIT 4 LOOP
        INSERT INTO public.appointments (
            student_id, title, appointment_type, appointment_date, duration_minutes, location, staff_member, description, status
        ) VALUES 
        (student_rec.id, 'استشارة أكاديمية', 'academic_consultation', NOW() + INTERVAL '3 days' + INTERVAL '10:00' HOUR, 30, 'مكتب الإرشاد الأكاديمي - الدور الثاني', 'د. سارة أحمد', 'مناقشة الخطة الدراسية للفصل القادم', 'scheduled'),
        (student_rec.id, 'لقاء مع المرشد الأكاديمي', 'advisor_meeting', NOW() + INTERVAL '1 week' + INTERVAL '14:00' HOUR, 45, 'مكتب الإرشاد الأكاديمي - مكتب 201', 'د. محمد علي', 'مراجعة الأداء الأكاديمي ومناقشة التحديات', 'scheduled');
    END LOOP;
END $$;

-- إضافة إعدادات النظام
INSERT INTO public.system_settings (setting_key, setting_value, category, description) VALUES 
('site_name', '"كلية أيلول الجامعة"', 'general', 'اسم الموقع الرسمي'),
('contact_email', '"info@aylol.edu.ye"', 'contact', 'البريد الإلكتروني الرسمي'),
('contact_phone', '"+967-1-234567"', 'contact', 'رقم الهاتف الرسمي'),
('academic_year', '"2024-2025"', 'academic', 'العام الأكاديمي الحالي'),
('current_semester', '"الفصل الأول"', 'academic', 'الفصل الدراسي الحالي'),
('registration_open', 'true', 'academic', 'حالة فتح التسجيل'),
('payment_deadline', '"2024-12-31"', 'financial', 'آخر موعد للدفع')
ON CONFLICT (setting_key) DO UPDATE SET 
setting_value = EXCLUDED.setting_value,
updated_at = NOW();