-- Update courses table to include academic year, semester, and specialization
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS academic_year INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS semester INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS specialization TEXT DEFAULT 'عام';

-- Create enrollments table to link students with courses
CREATE TABLE IF NOT EXISTS public.student_enrollments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL,
    course_id UUID NOT NULL,
    academic_year INTEGER NOT NULL,
    semester INTEGER NOT NULL,
    enrollment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    status TEXT DEFAULT 'enrolled',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(student_id, course_id, academic_year, semester)
);

-- Update class_schedule to include specialization
ALTER TABLE public.class_schedule 
ADD COLUMN IF NOT EXISTS specialization TEXT DEFAULT 'عام';

-- Update student_profiles to ensure all required fields exist
ALTER TABLE public.student_profiles 
ADD COLUMN IF NOT EXISTS specialization TEXT DEFAULT 'عام',
ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'active';

-- Enable RLS on student_enrollments
ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for student_enrollments
CREATE POLICY "Admins can manage all enrollments" 
ON public.student_enrollments 
FOR ALL 
USING (is_admin(auth.uid()));

CREATE POLICY "Students can view their own enrollments" 
ON public.student_enrollments 
FOR SELECT 
USING (student_id IN (
    SELECT id FROM student_profiles WHERE user_id = auth.uid()
));

-- Create trigger for updating updated_at
CREATE TRIGGER update_student_enrollments_updated_at
    BEFORE UPDATE ON public.student_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_academic_year_semester ON public.courses(academic_year, semester);
CREATE INDEX IF NOT EXISTS idx_courses_specialization ON public.courses(specialization);
CREATE INDEX IF NOT EXISTS idx_class_schedule_specialization ON public.class_schedule(specialization);
CREATE INDEX IF NOT EXISTS idx_student_enrollments_student_id ON public.student_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_student_enrollments_course_id ON public.student_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_specialization ON public.student_profiles(specialization);