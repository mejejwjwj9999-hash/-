-- Fix content change log function to be SECURITY DEFINER
DROP FUNCTION IF EXISTS public.log_content_changes() CASCADE;

CREATE OR REPLACE FUNCTION public.log_content_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.content_change_log (
    resource_type,
    resource_id,
    action,
    old_data,
    new_data,
    user_id
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
    auth.uid()
  );
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Add INSERT policy for content_change_log
DROP POLICY IF EXISTS "System can insert content change logs" ON public.content_change_log;
CREATE POLICY "System can insert content change logs" 
ON public.content_change_log 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for dynamic_academic_programs table
DROP TRIGGER IF EXISTS trg_log_content_changes_on_dynamic_programs ON public.dynamic_academic_programs;
CREATE TRIGGER trg_log_content_changes_on_dynamic_programs
AFTER INSERT OR UPDATE OR DELETE ON public.dynamic_academic_programs
FOR EACH ROW EXECUTE FUNCTION public.log_content_changes();

-- Remove overly permissive policies on dynamic_academic_programs
DROP POLICY IF EXISTS "authenticated can delete programs" ON public.dynamic_academic_programs;
DROP POLICY IF EXISTS "authenticated can insert programs" ON public.dynamic_academic_programs;
DROP POLICY IF EXISTS "authenticated can read all programs (admin)" ON public.dynamic_academic_programs;
DROP POLICY IF EXISTS "authenticated can update programs" ON public.dynamic_academic_programs;

-- Keep only the proper admin and public policies
-- The existing admin and public policies are already correct