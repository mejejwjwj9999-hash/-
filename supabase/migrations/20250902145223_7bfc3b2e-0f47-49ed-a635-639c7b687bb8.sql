-- Fix security linter warnings: Set search_path for validation functions

-- Fix validation functions with proper search_path
CREATE OR REPLACE FUNCTION public.validate_program_id(program_id_val TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN program_id_val IN ('it', 'business', 'nursing', 'pharmacy', 'midwifery');
END;
$$ LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.validate_department_id(department_id_val TEXT)  
RETURNS BOOLEAN AS $$
BEGIN
  RETURN department_id_val IN ('tech_science', 'admin_humanities', 'medical');
END;
$$ LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER SET search_path = public;