-- Align admin policies for student_registration_requests to both role systems
DO $$ BEGIN
  -- Ensure table has RLS enabled
  EXECUTE 'ALTER TABLE public.student_registration_requests ENABLE ROW LEVEL SECURITY';
EXCEPTION WHEN others THEN NULL; END $$;

-- Drop old broad policy and recreate with OR condition to cover both admin systems
DROP POLICY IF EXISTS "Admins can manage registration requests" ON public.student_registration_requests;

CREATE POLICY "Admins can manage registration requests"
ON public.student_registration_requests
FOR ALL
USING (has_admin_access(auth.uid()) OR is_admin(auth.uid()))
WITH CHECK (has_admin_access(auth.uid()) OR is_admin(auth.uid()));

-- Keep public insert policy as-is (create if it doesn't exist)
DO $$ BEGIN
  CREATE POLICY "Public can create registration requests"
  ON public.student_registration_requests
  FOR INSERT
  WITH CHECK (status = 'pending' OR status IS NULL);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;