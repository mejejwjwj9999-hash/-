
-- إزالة قيود التحقق الحالية وإضافة قيود صحيحة
ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_status_check;

-- إضافة قيد جديد يدعم جميع الحالات المطلوبة
ALTER TABLE documents ADD CONSTRAINT documents_status_check 
CHECK (status IN ('active', 'inactive', 'pending', 'approved', 'rejected', 'expired', 'processing', 'completed', 'cancelled'));

-- التأكد من أن جدول الجدول الدراسي يحتوي على البيانات المطلوبة
-- إضافة بيانات تجريبية للجدول الدراسي إذا لم تكن موجودة
INSERT INTO class_schedule (
  course_id, 
  day_of_week, 
  start_time, 
  end_time, 
  classroom, 
  instructor_name, 
  semester, 
  academic_year
) VALUES 
  (
    (SELECT id FROM courses LIMIT 1), 
    1, -- الاثنين
    '08:00:00', 
    '09:30:00', 
    'قاعة 101', 
    'د. أحمد محمد', 
    'الأول', 
    '2024-2025'
  ),
  (
    (SELECT id FROM courses LIMIT 1), 
    3, -- الأربعاء
    '10:00:00', 
    '11:30:00', 
    'قاعة 102', 
    'د. فاطمة علي', 
    'الأول', 
    '2024-2025'
  )
ON CONFLICT DO NOTHING;

-- إضافة مواد تجريبية إذا لم تكن موجودة
INSERT INTO courses (
  course_code, 
  course_name_ar, 
  course_name_en, 
  credit_hours, 
  department, 
  college
) VALUES 
  ('CS101', 'مقدمة في علوم الحاسوب', 'Introduction to Computer Science', 3, 'علوم الحاسوب', 'كلية الهندسة'),
  ('MATH101', 'الرياضيات الأساسية', 'Basic Mathematics', 3, 'الرياضيات', 'كلية العلوم'),
  ('ENG101', 'اللغة الإنجليزية', 'English Language', 2, 'اللغة الإنجليزية', 'كلية الآداب')
ON CONFLICT (course_code) DO NOTHING;

-- إضافة درجات تجريبية للطلاب
INSERT INTO grades (
  student_id, 
  course_id, 
  semester, 
  academic_year, 
  midterm_grade, 
  final_grade, 
  coursework_grade, 
  total_grade, 
  letter_grade, 
  gpa_points
) 
SELECT 
  sp.id, 
  c.id, 
  'الأول', 
  '2024-2025', 
  85.0, 
  88.0, 
  90.0, 
  87.6, 
  'A', 
  4.0
FROM student_profiles sp 
CROSS JOIN courses c 
LIMIT 10
ON CONFLICT DO NOTHING;
