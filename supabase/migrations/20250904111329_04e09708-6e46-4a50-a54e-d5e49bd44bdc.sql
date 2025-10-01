-- إنشاء جدول ملفات المعلمين
CREATE TABLE public.teacher_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  teacher_id TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  department_id TEXT,
  specialization TEXT,
  qualifications TEXT,
  hire_date DATE,
  position TEXT DEFAULT 'معلم',
  office_location TEXT,
  office_hours TEXT,
  bio TEXT,
  profile_image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول مقررات المعلمين
CREATE TABLE public.teacher_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  semester TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  section TEXT,
  schedule_times JSONB,
  classroom TEXT,
  max_students INTEGER DEFAULT 30,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(teacher_id, course_id, semester, academic_year, section)
);

-- إنشاء جدول سجلات الحضور
CREATE TABLE public.attendance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_course_id UUID NOT NULL REFERENCES public.teacher_courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL,
  session_time TIME,
  status TEXT NOT NULL DEFAULT 'absent' CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes TEXT,
  created_by UUID NOT NULL REFERENCES public.teacher_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(teacher_course_id, student_id, attendance_date, session_time)
);

-- إنشاء جدول تفاصيل الدرجات
CREATE TABLE public.grade_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_course_id UUID NOT NULL REFERENCES public.teacher_courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('midterm', 'final', 'quiz', 'assignment', 'participation', 'project')),
  assessment_title TEXT NOT NULL,
  max_score NUMERIC NOT NULL DEFAULT 100,
  score NUMERIC,
  weight NUMERIC DEFAULT 1.0,
  assessment_date DATE,
  feedback TEXT,
  created_by UUID NOT NULL REFERENCES public.teacher_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول إعلانات المعلمين
CREATE TABLE public.teacher_announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  announcement_type TEXT NOT NULL DEFAULT 'general' CHECK (announcement_type IN ('general', 'assignment', 'exam', 'schedule', 'material')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  target_audience TEXT NOT NULL DEFAULT 'students' CHECK (target_audience IN ('students', 'all', 'specific_course')),
  is_published BOOLEAN NOT NULL DEFAULT true,
  publish_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expire_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول مواد المقررات المحسن
CREATE TABLE public.teacher_course_materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_course_id UUID NOT NULL REFERENCES public.teacher_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  material_type TEXT NOT NULL DEFAULT 'lecture' CHECK (material_type IN ('lecture', 'assignment', 'exam', 'reference', 'video', 'audio', 'other')),
  week_number INTEGER,
  is_required BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0,
  uploaded_by UUID NOT NULL REFERENCES public.teacher_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تمكين Row Level Security على جميع الجداول
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grade_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_course_materials ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان لجدول ملفات المعلمين
CREATE POLICY "Admins can manage all teacher profiles"
ON public.teacher_profiles
FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Teachers can view and update their own profile"
ON public.teacher_profiles
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Teachers can update their own profile"
ON public.teacher_profiles
FOR UPDATE
USING (user_id = auth.uid());

-- سياسات الأمان لجدول مقررات المعلمين
CREATE POLICY "Admins can manage all teacher courses"
ON public.teacher_courses
FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Teachers can view their own courses"
ON public.teacher_courses
FOR SELECT
USING (teacher_id IN (SELECT id FROM public.teacher_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Students can view courses they are enrolled in"
ON public.teacher_courses
FOR SELECT
USING (course_id IN (
  SELECT se.course_id 
  FROM student_enrollments se 
  JOIN student_profiles sp ON se.student_id = sp.id 
  WHERE sp.user_id = auth.uid() AND se.status = 'enrolled'
));

-- سياسات الأمان لجدول سجلات الحضور
CREATE POLICY "Admins can manage all attendance records"
ON public.attendance_records
FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Teachers can manage attendance for their courses"
ON public.attendance_records
FOR ALL
USING (teacher_course_id IN (
  SELECT tc.id FROM public.teacher_courses tc 
  JOIN public.teacher_profiles tp ON tc.teacher_id = tp.id 
  WHERE tp.user_id = auth.uid()
));

CREATE POLICY "Students can view their own attendance"
ON public.attendance_records
FOR SELECT
USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

-- سياسات الأمان لجدول تفاصيل الدرجات
CREATE POLICY "Admins can manage all grade details"
ON public.grade_details
FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Teachers can manage grades for their courses"
ON public.grade_details
FOR ALL
USING (teacher_course_id IN (
  SELECT tc.id FROM public.teacher_courses tc 
  JOIN public.teacher_profiles tp ON tc.teacher_id = tp.id 
  WHERE tp.user_id = auth.uid()
));

CREATE POLICY "Students can view their own grades"
ON public.grade_details
FOR SELECT
USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

-- سياسات الأمان لجدول إعلانات المعلمين
CREATE POLICY "Admins can manage all teacher announcements"
ON public.teacher_announcements
FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Teachers can manage their own announcements"
ON public.teacher_announcements
FOR ALL
USING (teacher_id IN (SELECT id FROM public.teacher_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Students can view published announcements"
ON public.teacher_announcements
FOR SELECT
USING (
  is_published = true AND 
  (expire_date IS NULL OR expire_date > now()) AND
  (course_id IS NULL OR course_id IN (
    SELECT se.course_id 
    FROM student_enrollments se 
    JOIN student_profiles sp ON se.student_id = sp.id 
    WHERE sp.user_id = auth.uid() AND se.status = 'enrolled'
  ))
);

-- سياسات الأمان لجدول مواد المقررات
CREATE POLICY "Admins can manage all course materials"
ON public.teacher_course_materials
FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Teachers can manage materials for their courses"
ON public.teacher_course_materials
FOR ALL
USING (teacher_course_id IN (
  SELECT tc.id FROM public.teacher_courses tc 
  JOIN public.teacher_profiles tp ON tc.teacher_id = tp.id 
  WHERE tp.user_id = auth.uid()
));

CREATE POLICY "Students can view public materials for enrolled courses"
ON public.teacher_course_materials
FOR SELECT
USING (
  is_public = true AND
  teacher_course_id IN (
    SELECT tc.id FROM public.teacher_courses tc
    WHERE tc.course_id IN (
      SELECT se.course_id 
      FROM student_enrollments se 
      JOIN student_profiles sp ON se.student_id = sp.id 
      WHERE sp.user_id = auth.uid() AND se.status = 'enrolled'
    )
  )
);

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX idx_teacher_profiles_user_id ON public.teacher_profiles(user_id);
CREATE INDEX idx_teacher_profiles_teacher_id ON public.teacher_profiles(teacher_id);
CREATE INDEX idx_teacher_courses_teacher_id ON public.teacher_courses(teacher_id);
CREATE INDEX idx_teacher_courses_course_id ON public.teacher_courses(course_id);
CREATE INDEX idx_attendance_records_teacher_course_id ON public.attendance_records(teacher_course_id);
CREATE INDEX idx_attendance_records_student_id ON public.attendance_records(student_id);
CREATE INDEX idx_attendance_records_date ON public.attendance_records(attendance_date);
CREATE INDEX idx_grade_details_teacher_course_id ON public.grade_details(teacher_course_id);
CREATE INDEX idx_grade_details_student_id ON public.grade_details(student_id);
CREATE INDEX idx_teacher_announcements_teacher_id ON public.teacher_announcements(teacher_id);
CREATE INDEX idx_teacher_announcements_course_id ON public.teacher_announcements(course_id);
CREATE INDEX idx_teacher_course_materials_teacher_course_id ON public.teacher_course_materials(teacher_course_id);

-- إنشاء trigger لتحديث updated_at تلقائياً
CREATE TRIGGER update_teacher_profiles_updated_at
  BEFORE UPDATE ON public.teacher_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teacher_courses_updated_at
  BEFORE UPDATE ON public.teacher_courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_records_updated_at
  BEFORE UPDATE ON public.attendance_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_grade_details_updated_at
  BEFORE UPDATE ON public.grade_details
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teacher_announcements_updated_at
  BEFORE UPDATE ON public.teacher_announcements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teacher_course_materials_updated_at
  BEFORE UPDATE ON public.teacher_course_materials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- إنشاء دور معلم في النظام
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    -- If app_role doesn't exist, we'll assume it needs to be created
    -- But since we can't modify existing types, we'll work with what exists
    NULL;
  END IF;
END $$;

-- إضافة 'teacher' كقيمة جديدة لـ app_role enum إذا لم تكن موجودة
-- ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'teacher';

-- إنشاء دالة للتحقق من كون المستخدم معلم
CREATE OR REPLACE FUNCTION public.is_teacher(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.teacher_profiles
    WHERE user_id = _user_id AND is_active = true
  )
$$;

-- إنشاء دالة لجلب معرف المعلم من معرف المستخدم
CREATE OR REPLACE FUNCTION public.get_teacher_id(_user_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id
  FROM public.teacher_profiles
  WHERE user_id = _user_id AND is_active = true
  LIMIT 1
$$;