-- إنشاء جدول الواجبات الدراسية
CREATE TABLE public.assignments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_date timestamp with time zone NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'graded', 'overdue')),
  max_grade numeric DEFAULT 100,
  submission_type text DEFAULT 'file' CHECK (submission_type IN ('file', 'text', 'both')),
  instructions text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- إنشاء جدول تسليم الواجبات
CREATE TABLE public.assignment_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id uuid NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL,
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  submission_text text,
  file_path text,
  file_name text,
  grade numeric,
  feedback text,
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'returned')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- إنشاء جدول ملفات المقررات
CREATE TABLE public.course_files (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint,
  file_type text NOT NULL CHECK (file_type IN ('pdf', 'docx', 'ppt', 'pptx', 'mp4', 'mp3', 'jpg', 'png', 'zip')),
  category text DEFAULT 'general' CHECK (category IN ('lecture', 'assignment', 'reference', 'general')),
  description text,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  is_public boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- تحديث جدول الإشعارات لإضافة التصنيفات الجديدة
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS category text DEFAULT 'general' CHECK (category IN ('academic', 'financial', 'general', 'administrative'));

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_assignments_course_id ON public.assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON public.assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_student_id ON public.assignment_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_id ON public.assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_course_files_course_id ON public.course_files(course_id);
CREATE INDEX IF NOT EXISTS idx_notifications_category ON public.notifications(category);

-- تمكين Row Level Security
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.course_files ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للواجبات
CREATE POLICY "Students can view assignments for their enrolled courses" 
ON public.assignments 
FOR SELECT 
USING (
  course_id IN (
    SELECT se.course_id 
    FROM student_enrollments se 
    JOIN student_profiles sp ON se.student_id = sp.id 
    WHERE sp.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all assignments" 
ON public.assignments 
FOR ALL 
USING (is_admin(auth.uid()));

-- سياسات الأمان لتسليم الواجبات
CREATE POLICY "Students can view their own submissions" 
ON public.assignment_submissions 
FOR SELECT 
USING (
  student_id IN (
    SELECT sp.id 
    FROM student_profiles sp 
    WHERE sp.user_id = auth.uid()
  )
);

CREATE POLICY "Students can submit their own assignments" 
ON public.assignment_submissions 
FOR INSERT 
WITH CHECK (
  student_id IN (
    SELECT sp.id 
    FROM student_profiles sp 
    WHERE sp.user_id = auth.uid()
  )
);

CREATE POLICY "Students can update their own submissions" 
ON public.assignment_submissions 
FOR UPDATE 
USING (
  student_id IN (
    SELECT sp.id 
    FROM student_profiles sp 
    WHERE sp.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all submissions" 
ON public.assignment_submissions 
FOR ALL 
USING (is_admin(auth.uid()));

-- سياسات الأمان لملفات المقررات
CREATE POLICY "Students can view files for their enrolled courses" 
ON public.course_files 
FOR SELECT 
USING (
  is_public = true AND course_id IN (
    SELECT se.course_id 
    FROM student_enrollments se 
    JOIN student_profiles sp ON se.student_id = sp.id 
    WHERE sp.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all course files" 
ON public.course_files 
FOR ALL 
USING (is_admin(auth.uid()));

-- إنشاء دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إضافة triggers لتحديث updated_at
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignment_submissions_updated_at BEFORE UPDATE ON public.assignment_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_files_updated_at BEFORE UPDATE ON public.course_files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();