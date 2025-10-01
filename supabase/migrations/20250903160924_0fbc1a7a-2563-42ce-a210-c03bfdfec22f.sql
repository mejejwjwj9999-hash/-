-- إنشاء جداول نظام الواجبات والملفات الدراسية
-- Create enhanced assignments system with detailed tracking
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  max_grade NUMERIC DEFAULT 100,
  submission_type TEXT DEFAULT 'file' CHECK (submission_type IN ('file', 'text', 'both')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assignment submissions table with enhanced tracking
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  submission_text TEXT,
  file_path TEXT,
  file_name TEXT,
  file_size BIGINT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'late', 'rejected')),
  grade NUMERIC,
  feedback TEXT,
  graded_at TIMESTAMP WITH TIME ZONE,
  graded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(assignment_id, student_id)
);

-- Create course files table for file management
CREATE TABLE IF NOT EXISTS public.course_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT NOT NULL,
  category TEXT DEFAULT 'general' CHECK (category IN ('lecture', 'assignment', 'reference', 'general')),
  description TEXT,
  is_public BOOLEAN DEFAULT true,
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update notifications table to support enhanced categorization
ALTER TABLE public.notifications 
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general' CHECK (category IN ('academic', 'financial', 'administrative', 'general')),
  ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal' CHECK (priority IN ('high', 'medium', 'normal')),
  ADD COLUMN IF NOT EXISTS action_url TEXT,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- Enable RLS on new tables
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assignments
CREATE POLICY "Admins can manage all assignments" ON public.assignments
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Students can view assignments for their enrolled courses" ON public.assignments
  FOR SELECT USING (
    course_id IN (
      SELECT se.course_id 
      FROM student_enrollments se 
      JOIN student_profiles sp ON se.student_id = sp.id 
      WHERE sp.user_id = auth.uid()
    )
  );

-- RLS Policies for assignment submissions
CREATE POLICY "Admins can manage all submissions" ON public.assignment_submissions
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Students can view their own submissions" ON public.assignment_submissions
  FOR SELECT USING (
    student_id IN (
      SELECT sp.id 
      FROM student_profiles sp 
      WHERE sp.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can submit their own assignments" ON public.assignment_submissions
  FOR INSERT WITH CHECK (
    student_id IN (
      SELECT sp.id 
      FROM student_profiles sp 
      WHERE sp.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can update their own submissions" ON public.assignment_submissions
  FOR UPDATE USING (
    student_id IN (
      SELECT sp.id 
      FROM student_profiles sp 
      WHERE sp.user_id = auth.uid()
    )
  );

-- RLS Policies for course files
CREATE POLICY "Admins can manage all course files" ON public.course_files
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Students can view files for their enrolled courses" ON public.course_files
  FOR SELECT USING (
    is_public = true AND 
    course_id IN (
      SELECT se.course_id 
      FROM student_enrollments se 
      JOIN student_profiles sp ON se.student_id = sp.id 
      WHERE sp.user_id = auth.uid()
    )
  );

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assignments_updated_at
    BEFORE UPDATE ON public.assignments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assignment_submissions_updated_at
    BEFORE UPDATE ON public.assignment_submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_files_updated_at
    BEFORE UPDATE ON public.course_files
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assignments_course_id ON public.assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON public.assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_student_id ON public.assignment_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_id ON public.assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_course_files_course_id ON public.course_files(course_id);
CREATE INDEX IF NOT EXISTS idx_course_files_category ON public.course_files(category);
CREATE INDEX IF NOT EXISTS idx_notifications_category ON public.notifications(category);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON public.notifications(priority);