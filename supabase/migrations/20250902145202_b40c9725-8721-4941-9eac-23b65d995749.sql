-- Database migration: Normalize academic structure and add program fees
-- This migration adds normalized department_id, program_id fields and creates program_fees table

-- 1. Create program_fees table for detailed fee management
CREATE TABLE IF NOT EXISTS public.program_fees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id TEXT NOT NULL,
  academic_year INTEGER NOT NULL,
  semester INTEGER NOT NULL,
  base_fee NUMERIC NOT NULL DEFAULT 0,
  registration_fee NUMERIC NOT NULL DEFAULT 10000,
  library_fee NUMERIC NOT NULL DEFAULT 5000,
  lab_fee NUMERIC NOT NULL DEFAULT 10000,
  exam_fee NUMERIC NOT NULL DEFAULT 8000,
  currency TEXT NOT NULL DEFAULT 'YER',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(program_id, academic_year, semester)
);

-- Enable RLS for program_fees
ALTER TABLE public.program_fees ENABLE ROW LEVEL SECURITY;

-- RLS policies for program_fees
CREATE POLICY "Everyone can view program fees" 
ON public.program_fees 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage program fees" 
ON public.program_fees 
FOR ALL 
USING (is_admin(auth.uid()));

-- 2. Add normalized fields to student_profiles
ALTER TABLE public.student_profiles 
ADD COLUMN IF NOT EXISTS department_id TEXT,
ADD COLUMN IF NOT EXISTS program_id TEXT;

-- 3. Add program_id to payments table  
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS program_id TEXT;

-- 4. Add normalized fields to courses table
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS department_id TEXT,
ADD COLUMN IF NOT EXISTS program_id TEXT;

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_student_profiles_department_id ON public.student_profiles(department_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_program_id ON public.student_profiles(program_id);
CREATE INDEX IF NOT EXISTS idx_payments_program_id ON public.payments(program_id);
CREATE INDEX IF NOT EXISTS idx_courses_department_id ON public.courses(department_id);
CREATE INDEX IF NOT EXISTS idx_courses_program_id ON public.courses(program_id);
CREATE INDEX IF NOT EXISTS idx_program_fees_program_academic ON public.program_fees(program_id, academic_year, semester);

-- 6. Data migration: Map existing department names to department_ids
UPDATE public.student_profiles 
SET department_id = CASE 
  WHEN department ILIKE '%حاسوب%' OR department ILIKE '%تقنية%' OR department ILIKE '%معلومات%' THEN 'tech_science'
  WHEN department ILIKE '%إدارة%' OR department ILIKE '%أعمال%' THEN 'admin_humanities'  
  WHEN department ILIKE '%طب%' OR department ILIKE '%تمريض%' OR department ILIKE '%صيدلة%' OR department ILIKE '%قبالة%' THEN 'medical'
  ELSE 'tech_science' -- Default fallback
END
WHERE department_id IS NULL;

-- Map existing department/college to program_ids for students
UPDATE public.student_profiles 
SET program_id = CASE 
  WHEN (department ILIKE '%حاسوب%' OR department ILIKE '%تقنية%' OR department ILIKE '%معلومات%') 
       OR (college ILIKE '%حاسوب%' OR college ILIKE '%تقنية%') THEN 'it'
  WHEN (department ILIKE '%إدارة%' OR department ILIKE '%أعمال%') 
       OR (college ILIKE '%إدارة%' OR college ILIKE '%أعمال%') THEN 'business'
  WHEN department ILIKE '%تمريض%' OR college ILIKE '%تمريض%' THEN 'nursing'
  WHEN department ILIKE '%صيدلة%' OR college ILIKE '%صيدلة%' THEN 'pharmacy'
  WHEN department ILIKE '%قبالة%' OR college ILIKE '%قبالة%' THEN 'midwifery'
  ELSE 'it' -- Default fallback
END
WHERE program_id IS NULL;

-- 7. Update courses with normalized ids
UPDATE public.courses 
SET department_id = CASE 
  WHEN department ILIKE '%حاسوب%' OR department ILIKE '%تقنية%' OR department ILIKE '%معلومات%' THEN 'tech_science'
  WHEN department ILIKE '%إدارة%' OR department ILIKE '%أعمال%' THEN 'admin_humanities'
  WHEN department ILIKE '%طب%' OR department ILIKE '%تمريض%' OR department ILIKE '%صيدلة%' OR department ILIKE '%قبالة%' THEN 'medical'  
  ELSE 'tech_science'
END
WHERE department_id IS NULL;

UPDATE public.courses 
SET program_id = CASE 
  WHEN (department ILIKE '%حاسوب%' OR department ILIKE '%تقنية%' OR department ILIKE '%معلومات%') 
       OR (college ILIKE '%حاسوب%' OR college ILIKE '%تقنية%') THEN 'it'
  WHEN (department ILIKE '%إدارة%' OR department ILIKE '%أعمال%') 
       OR (college ILIKE '%إدارة%' OR college ILIKE '%أعمال%') THEN 'business'
  WHEN department ILIKE '%تمريض%' OR college ILIKE '%تمريض%' THEN 'nursing'
  WHEN department ILIKE '%صيدلة%' OR college ILIKE '%صيدلة%' THEN 'pharmacy'
  WHEN department ILIKE '%قبالة%' OR college ILIKE '%قبالة%' THEN 'midwifery'
  ELSE 'it'
END
WHERE program_id IS NULL;

-- 8. Update payments with program_ids based on students  
UPDATE public.payments p
SET program_id = sp.program_id
FROM public.student_profiles sp 
WHERE p.student_id = sp.id AND p.program_id IS NULL;

-- 9. Insert default program fees data
INSERT INTO public.program_fees (program_id, academic_year, semester, base_fee, lab_fee) VALUES
-- IT Program fees
('it', 1, 1, 150000, 15000),
('it', 1, 2, 150000, 15000), 
('it', 2, 1, 150000, 15000),
('it', 2, 2, 150000, 15000),
('it', 3, 1, 150000, 15000),
('it', 3, 2, 150000, 15000),
('it', 4, 1, 150000, 15000),
('it', 4, 2, 150000, 15000),

-- Business Program fees  
('business', 1, 1, 120000, 10000),
('business', 1, 2, 120000, 10000),
('business', 2, 1, 120000, 10000),
('business', 2, 2, 120000, 10000),
('business', 3, 1, 120000, 10000),
('business', 3, 2, 120000, 10000),
('business', 4, 1, 120000, 10000),
('business', 4, 2, 120000, 10000),

-- Nursing Program fees
('nursing', 1, 1, 180000, 12000),
('nursing', 1, 2, 180000, 12000),
('nursing', 2, 1, 180000, 12000),
('nursing', 2, 2, 180000, 12000),
('nursing', 3, 1, 180000, 12000),
('nursing', 3, 2, 180000, 12000),
('nursing', 4, 1, 180000, 12000),
('nursing', 4, 2, 180000, 12000),

-- Pharmacy Program fees (5 years)
('pharmacy', 1, 1, 200000, 15000),
('pharmacy', 1, 2, 200000, 15000),
('pharmacy', 2, 1, 200000, 15000),
('pharmacy', 2, 2, 200000, 15000),
('pharmacy', 3, 1, 200000, 15000),
('pharmacy', 3, 2, 200000, 15000),
('pharmacy', 4, 1, 200000, 15000),
('pharmacy', 4, 2, 200000, 15000),
('pharmacy', 5, 1, 200000, 15000),
('pharmacy', 5, 2, 200000, 15000),

-- Midwifery Program fees
('midwifery', 1, 1, 160000, 12000),
('midwifery', 1, 2, 160000, 12000),
('midwifery', 2, 1, 160000, 12000),
('midwifery', 2, 2, 160000, 12000),
('midwifery', 3, 1, 160000, 12000),
('midwifery', 3, 2, 160000, 12000),
('midwifery', 4, 1, 160000, 12000),
('midwifery', 4, 2, 160000, 12000)

ON CONFLICT (program_id, academic_year, semester) DO NOTHING;

-- 10. Add trigger for updating program_fees timestamps
CREATE TRIGGER update_program_fees_updated_at
  BEFORE UPDATE ON public.program_fees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 11. Create validation function for program_id values
CREATE OR REPLACE FUNCTION public.validate_program_id(program_id_val TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN program_id_val IN ('it', 'business', 'nursing', 'pharmacy', 'midwifery');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 12. Create validation function for department_id values  
CREATE OR REPLACE FUNCTION public.validate_department_id(department_id_val TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN department_id_val IN ('tech_science', 'admin_humanities', 'medical');
END;
$$ LANGUAGE plpgsql IMMUTABLE;