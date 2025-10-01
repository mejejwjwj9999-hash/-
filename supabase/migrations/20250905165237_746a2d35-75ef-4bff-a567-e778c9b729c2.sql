-- Fix RLS policy for student_registration_requests to allow anonymous users to create registration requests

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.student_registration_requests;
DROP POLICY IF EXISTS "Enable select for own requests" ON public.student_registration_requests;
DROP POLICY IF EXISTS "Enable all operations for admins" ON public.student_registration_requests;

-- Create new policies that properly allow anonymous registration
CREATE POLICY "Allow anonymous users to create registration requests"
ON public.student_registration_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Users can view their own registration requests"
ON public.student_registration_requests
FOR SELECT
USING (
  -- Allow if user is admin
  (EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  ))
  OR 
  -- Allow if user owns the request (by email)
  (auth.uid() IS NOT NULL AND email = (
    SELECT email FROM auth.users WHERE id = auth.uid()
  ))
);

CREATE POLICY "Admins can manage all registration requests"
ON public.student_registration_requests
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  )
);