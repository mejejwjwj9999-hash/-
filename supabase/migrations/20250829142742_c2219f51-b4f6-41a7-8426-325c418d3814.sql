
-- إضافة بيانات الكليات والأقسام
INSERT INTO courses (course_code, course_name_ar, course_name_en, credit_hours, department, college, description) VALUES
('CS101', 'مقدمة في الحاسوب', 'Introduction to Computer Science', 3, 'علوم الحاسوب', 'كلية تكنولوجيا المعلومات', 'مقدمة أساسية في علوم الحاسوب والبرمجة'),
('CS102', 'البرمجة الأساسية', 'Basic Programming', 4, 'علوم الحاسوب', 'كلية تكنولوجيا المعلومات', 'تعلم أساسيات البرمجة باستخدام Python'),
('MATH101', 'الرياضيات 1', 'Mathematics I', 3, 'الرياضيات', 'كلية العلوم', 'الجبر والهندسة التحليلية'),
('PHY101', 'الفيزياء العامة', 'General Physics', 4, 'الفيزياء', 'كلية العلوم', 'مبادئ الفيزياء الأساسية'),
('ENG101', 'اللغة الإنجليزية', 'English Language', 2, 'اللغة الإنجليزية', 'كلية الآداب', 'قواعد وأساسيات اللغة الإنجليزية'),
('BUS101', 'مبادئ الإدارة', 'Principles of Management', 3, 'إدارة الأعمال', 'كلية إدارة الأعمال', 'أساسيات الإدارة والقيادة'),
('PHARM101', 'الكيمياء الصيدلانية', 'Pharmaceutical Chemistry', 4, 'الصيدلة', 'كلية الصيدلة', 'كيمياء الأدوية والمركبات الصيدلانية'),
('NURS101', 'أساسيات التمريض', 'Nursing Fundamentals', 3, 'التمريض', 'كلية التمريض', 'المبادئ الأساسية للرعاية التمريضية');

-- إضافة الجداول الدراسية
INSERT INTO class_schedule (course_id, day_of_week, start_time, end_time, classroom, instructor_name, academic_year, semester) VALUES
((SELECT id FROM courses WHERE course_code = 'CS101'), 0, '08:00', '09:30', 'مبنى تكنولوجيا المعلومات - قاعة 101', 'د. أحمد محمد علي', '2024', '1'),
((SELECT id FROM courses WHERE course_code = 'CS101'), 2, '08:00', '09:30', 'مبنى تكنولوجيا المعلومات - قاعة 101', 'د. أحمد محمد علي', '2024', '1'),
((SELECT id FROM courses WHERE course_code = 'CS102'), 1, '10:00', '11:30', 'مختبر الحاسوب - مختبر 1', 'د. فاطمة حسن', '2024', '1'),
((SELECT id FROM courses WHERE course_code = 'CS102'), 3, '10:00', '11:30', 'مختبر الحاسوب - مختبر 1', 'د. فاطمة حسن', '2024', '1'),
((SELECT id FROM courses WHERE course_code = 'MATH101'), 0, '12:00', '13:30', 'مبنى العلوم - قاعة 201', 'د. محمود عبدالله', '2024', '1'),
((SELECT id FROM courses WHERE course_code = 'MATH101'), 4, '12:00', '13:30', 'مبنى العلوم - قاعة 201', 'د. محمود عبدالله', '2024', '1'),
((SELECT id FROM courses WHERE course_code = 'PHY101'), 1, '14:00', '15:30', 'مختبر الفيزياء - مختبر 1', 'د. سارة أحمد', '2024', '1'),
((SELECT id FROM courses WHERE course_code = 'ENG101'), 2, '09:00', '10:30', 'مبنى الآداب - قاعة 301', 'د. ياسمين محمد', '2024', '1'),
((SELECT id FROM courses WHERE course_code = 'BUS101'), 3, '11:00', '12:30', 'مبنى إدارة الأعمال - قاعة 401', 'د. خالد عبدالرحمن', '2024', '1'),
((SELECT id FROM courses WHERE course_code = 'PHARM101'), 0, '13:30', '15:00', 'مبنى الصيدلة - قاعة 501', 'د. نورا سليم', '2024', '1'),
((SELECT id FROM courses WHERE course_code = 'NURS101'), 4, '08:30', '10:00', 'مبنى التمريض - قاعة 601', 'د. ريم الزهراني', '2024', '1');

-- إضافة درجات تجريبية للطلاب الحاليين
INSERT INTO grades (student_id, course_id, academic_year, semester, midterm_grade, final_grade, coursework_grade, total_grade, letter_grade, gpa_points, status) VALUES
((SELECT id FROM student_profiles LIMIT 1), (SELECT id FROM courses WHERE course_code = 'CS101'), '2024', '1', 85, 88, 90, 87.7, 'A-', 3.7, 'completed'),
((SELECT id FROM student_profiles LIMIT 1), (SELECT id FROM courses WHERE course_code = 'MATH101'), '2024', '1', 78, 82, 85, 81.5, 'B+', 3.3, 'completed'),
((SELECT id FROM student_profiles LIMIT 1), (SELECT id FROM courses WHERE course_code = 'ENG101'), '2024', '1', 92, 95, 88, 91.8, 'A', 4.0, 'completed'),
((SELECT id FROM student_profiles LIMIT 1), (SELECT id FROM courses WHERE course_code = 'CS102'), '2024', '1', NULL, NULL, 75, NULL, NULL, NULL, 'enrolled'),
((SELECT id FROM student_profiles LIMIT 1), (SELECT id FROM courses WHERE course_code = 'PHY101'), '2024', '1', NULL, NULL, 80, NULL, NULL, NULL, 'enrolled');

-- إضافة إشعارات للطلاب
INSERT INTO notifications (student_id, title, message, type, priority, is_read, expires_at, action_url) VALUES
((SELECT id FROM student_profiles LIMIT 1), 'موعد الامتحان النهائي', 'امتحان مادة البرمجة الأساسية يوم الأحد الساعة 9:00 صباحاً', 'academic', 'high', false, '2024-12-25 23:59:59', '/student-portal?tab=schedule'),
((SELECT id FROM student_profiles LIMIT 1), 'رسوم الفصل الثاني', 'حان موعد دفع رسوم الفصل الثاني. المبلغ المستحق: 1,250,000 ريال', 'financial', 'high', false, '2024-12-30 23:59:59', '/student-portal?tab=payments'),
((SELECT id FROM student_profiles LIMIT 1), 'نتائج الامتحان', 'تم نشر نتائج امتحان منتصف الفصل لمادة الرياضيات', 'academic', 'normal', false, '2024-12-31 23:59:59', '/student-portal?tab=grades'),
((SELECT id FROM student_profiles LIMIT 1), 'تحديث الجدول الدراسي', 'تم تعديل موعد محاضرة الفيزياء العامة', 'academic', 'normal', true, '2024-12-20 23:59:59', '/student-portal?tab=schedule'),
((SELECT id FROM student_profiles LIMIT 1), 'خدمة جديدة', 'أصبح بإمكانك الآن حجز المواصلات الجامعية عبر البوابة', 'service', 'low', false, '2025-01-15 23:59:59', '/student-portal?tab=services');

-- إضافة مواعيد للطلاب
INSERT INTO appointments (student_id, title, description, appointment_date, duration_minutes, appointment_type, staff_member, location, status, notes) VALUES
((SELECT id FROM student_profiles LIMIT 1), 'استشارة أكاديمية', 'مراجعة الخطة الدراسية للفصل القادم', '2024-12-15 10:00:00', 30, 'academic_advising', 'د. علي محمد', 'مكتب الإرشاد الأكاديمي - الدور الثاني', 'scheduled', 'يرجى إحضار كشف الدرجات'),
((SELECT id FROM student_profiles LIMIT 1), 'دعم تقني', 'مشكلة في الوصول للنظام الأكاديمي', '2024-12-18 14:00:00', 45, 'technical_support', 'أ. سارة أحمد', 'مركز الدعم التقني - مبنى الإدارة', 'scheduled', 'مشكلة في كلمة المرور'),
((SELECT id FROM student_profiles LIMIT 1), 'خدمات مالية', 'استفسار عن المنح الدراسية', '2024-12-12 09:00:00', 30, 'financial', 'أ. محمد حسن', 'مكتب الشؤون المالية', 'completed', 'تم توضيح شروط المنحة'),
((SELECT id FROM student_profiles LIMIT 1), 'خدمات السكن', 'حجز السكن الجامعي للفصل القادم', '2024-12-20 11:00:00', 60, 'accommodation', 'أ. فاطمة علي', 'مكتب خدمات السكن', 'scheduled', 'مراجعة الأوراق المطلوبة');

-- إضافة سجل المدفوعات
INSERT INTO payments (student_id, payment_type, amount, currency, payment_status, payment_method, payment_date, due_date, academic_year, semester, reference_number, notes) VALUES
((SELECT id FROM student_profiles LIMIT 1), 'رسوم الفصل الأول', 1250000, 'YER', 'completed', 'تحويل بنكي', '2024-09-15 10:30:00', '2024-09-10 23:59:59', '2024', '1', 'PAY-2024-001', 'دفع رسوم الفصل الأول كاملة'),
((SELECT id FROM student_profiles LIMIT 1), 'رسوم المختبرات', 150000, 'YER', 'completed', 'صرافة محلية', '2024-09-20 14:15:00', '2024-09-15 23:59:59', '2024', '1', 'PAY-2024-002', 'رسوم استخدام المختبرات'),
((SELECT id FROM student_profiles LIMIT 1), 'رسوم الكتب', 350000, 'YER', 'completed', 'محفظة إلكترونية', '2024-10-01 11:45:00', '2024-09-25 23:59:59', '2024', '1', 'PAY-2024-003', 'شراء الكتب الدراسية'),
((SELECT id FROM student_profiles LIMIT 1), 'رسوم الأنشطة', 75000, 'YER', 'completed', 'نقدي', '2024-11-15 09:20:00', '2024-11-10 23:59:59', '2024', '1', 'PAY-2024-004', 'رسوم الأنشطة الطلابية'),
((SELECT id FROM student_profiles LIMIT 1), 'رسوم الفصل الثاني', 1250000, 'YER', 'pending', NULL, NULL, '2024-12-30 23:59:59', '2024', '2', 'PENDING-2024-005', 'رسوم الفصل الثاني - مستحقة');

-- إضافة طلبات الخدمات
INSERT INTO service_requests (student_id, title, description, service_type, status, priority, assigned_to, due_date, documents) VALUES
((SELECT id FROM student_profiles LIMIT 1), 'طلب شهادة إثبات قيد', 'أحتاج شهادة إثبات قيد للعام الدراسي الحالي', 'certificate_request', 'in_progress', 'normal', 'مكتب شؤون الطلاب', '2024-12-20 23:59:59', '{"required_documents": ["هوية شخصية", "صورة شخصية"]}'),
((SELECT id FROM student_profiles LIMIT 1), 'طلب كشف درجات رسمي', 'كشف درجات رسمي للفصول الدراسية المكتملة', 'transcript_request', 'completed', 'normal', 'مكتب التسجيل', '2024-12-10 23:59:59', '{"delivery_method": "pickup", "copies": 2}'),
((SELECT id FROM student_profiles LIMIT 1), 'طلب دعم تقني', 'مشكلة في الوصول للنظام الأكاديمي عبر الجوال', 'technical_support', 'pending', 'high', 'فريق الدعم التقني', '2024-12-18 23:59:59', '{"device_type": "mobile", "browser": "Chrome"}'),
((SELECT id FROM student_profiles LIMIT 1), 'حجز السكن الجامعي', 'طلب حجز غرفة في السكن الجامعي للفصل القادم', 'accommodation', 'under_review', 'normal', 'مكتب خدمات السكن', '2024-12-25 23:59:59', '{"room_type": "double", "special_needs": "none"}');

-- إضافة وثائق الطلاب
INSERT INTO documents (student_id, document_type, document_name, file_path, mime_type, file_size, is_official, issued_date, status, verification_code) VALUES
((SELECT id FROM student_profiles LIMIT 1), 'transcript', 'كشف الدرجات - الفصل الأول 2024', '/documents/transcripts/transcript_2024_1.pdf', 'application/pdf', 245760, true, '2024-11-30 10:00:00', 'active', 'VER-2024-TR-001'),
((SELECT id FROM student_profiles LIMIT 1), 'certificate', 'شهادة إثبات قيد - 2024', '/documents/certificates/enrollment_cert_2024.pdf', 'application/pdf', 189440, true, '2024-12-01 14:30:00', 'active', 'VER-2024-EC-002'),
((SELECT id FROM student_profiles LIMIT 1), 'id_copy', 'صورة الهوية الشخصية', '/documents/id/national_id_copy.pdf', 'application/pdf', 156720, false, '2024-09-01 09:00:00', 'active', NULL),
((SELECT id FROM student_profiles LIMIT 1), 'photo', 'الصورة الشخصية', '/documents/photos/student_photo.jpg', 'image/jpeg', 98304, false, '2024-09-01 09:00:00', 'active', NULL),
((SELECT id FROM student_profiles LIMIT 1), 'medical_report', 'التقرير الطبي', '/documents/medical/medical_report_2024.pdf', 'application/pdf', 312560, true, '2024-09-15 11:15:00', 'active', 'VER-2024-MR-003');

-- تحديث ملف الطالب ببيانات إضافية
UPDATE student_profiles SET 
    phone = '+967-777-123456',
    status = 'active'
WHERE user_id IS NOT NULL;

-- إنشاء تسلسل لأرقام الطلاب إذا لم يكن موجوداً
CREATE SEQUENCE IF NOT EXISTS public.student_id_seq START WITH 1000;

-- إضافة مؤشرات لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_class_schedule_day_time ON class_schedule(day_of_week, start_time);
CREATE INDEX IF NOT EXISTS idx_grades_student_semester ON grades(student_id, academic_year, semester);
CREATE INDEX IF NOT EXISTS idx_payments_student_status ON payments(student_id, payment_status);
CREATE INDEX IF NOT EXISTS idx_notifications_student_read ON notifications(student_id, is_read);
CREATE INDEX IF NOT EXISTS idx_appointments_student_date ON appointments(student_id, appointment_date);
