-- إضافة بيانات تجريبية للجداول الدراسية والمقررات مطابقة لبيانات الطالب

-- إدخال مقرر يناسب بيانات الطالب الحالي (قسم العلوم التقنية والحاسوب، برنامج it، السنة 1، الفصل 1)
INSERT INTO courses (
  id,
  course_code, 
  course_name_ar,
  course_name_en,
  credit_hours,
  department,
  college,
  department_id,
  program_id,
  academic_year,
  semester,
  description
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
  'CS101',
  'مقدمة في علوم الحاسوب',
  'Introduction to Computer Science',
  3,
  'قسم العلوم التقنية والحاسوب',
  'كلية الحاسوب',
  'tech_science',
  'it',
  1,
  1,
  'مقدمة في مفاهيم البرمجة وعلوم الحاسوب الأساسية'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO courses (
  id,
  course_code, 
  course_name_ar,
  course_name_en,
  credit_hours,
  department,
  college,
  department_id,
  program_id,
  academic_year,
  semester,
  description
) VALUES (
  'b2c3d4e5-f6g7-8901-bcde-2345678901bc',
  'MATH101',
  'الرياضيات العامة',
  'General Mathematics',
  4,
  'قسم العلوم التقنية والحاسوب',
  'كلية الحاسوب',
  'tech_science',
  'it',
  1,
  1,
  'مبادئ الرياضيات والجبر المطلوبة لطلاب تقنية المعلومات'
) ON CONFLICT (id) DO NOTHING;

-- تسجيل الطالب في المقررات
INSERT INTO student_enrollments (
  student_id,
  course_id,
  academic_year,
  semester,
  status,
  enrollment_date
) VALUES (
  '7e51f907-e35c-4dae-805b-b440a57bf535',
  'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
  1,
  1,
  'enrolled',
  now()
) ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO student_enrollments (
  student_id,
  course_id,
  academic_year,
  semester,
  status,
  enrollment_date
) VALUES (
  '7e51f907-e35c-4dae-805b-b440a57bf535',
  'b2c3d4e5-f6g7-8901-bcde-2345678901bc',
  1,
  1,
  'enrolled',
  now()
) ON CONFLICT (student_id, course_id) DO NOTHING;

-- إضافة جداول دراسية للمقررات المُسجل فيها الطالب
INSERT INTO class_schedule (
  id,
  course_id,
  day_of_week,
  start_time,
  end_time,
  classroom,
  instructor_name,
  academic_year,
  semester
) VALUES (
  'd4e5f6g7-h8i9-0123-cdef-4567890123cd',
  'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
  1, -- الإثنين
  '08:00:00',
  '09:30:00',
  'قاعة الحاسوب 101',
  'د. أحمد محمد',
  '1',
  '1'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO class_schedule (
  id,
  course_id,
  day_of_week,
  start_time,
  end_time,
  classroom,
  instructor_name,
  academic_year,
  semester
) VALUES (
  'e5f6g7h8-i9j0-1234-deff-5678901234de',
  'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
  3, -- الأربعاء
  '10:00:00',
  '11:30:00',
  'قاعة الحاسوب 102',
  'د. أحمد محمد',
  '1',
  '1'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO class_schedule (
  id,
  course_id,
  day_of_week,
  start_time,
  end_time,
  classroom,
  instructor_name,
  academic_year,
  semester
) VALUES (
  'f6g7h8i9-j0k1-2345-efgh-6789012345ef',
  'b2c3d4e5-f6g7-8901-bcde-2345678901bc',
  2, -- الثلاثاء
  '09:00:00',
  '10:30:00',
  'قاعة الرياضيات 201',
  'د. فاطمة أحمد',
  '1',
  '1'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO class_schedule (
  id,
  course_id,
  day_of_week,
  start_time,
  end_time,
  classroom,
  instructor_name,
  academic_year,
  semester
) VALUES (
  'g7h8i9j0-k1l2-3456-fghi-7890123456fg',
  'b2c3d4e5-f6g7-8901-bcde-2345678901bc',
  4, -- الخميس
  '11:00:00',
  '12:30:00',
  'قاعة الرياضيات 202',
  'د. فاطمة أحمد',
  '1',
  '1'
) ON CONFLICT (id) DO NOTHING;