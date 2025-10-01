-- Fix the problematic SELECT policy that tries to access auth.users table
-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Users can view registration requests" ON public.student_registration_requests;

-- Create separate policies for different user types
-- Policy for anonymous users (they shouldn't be able to view any requests)
CREATE POLICY "Anonymous users cannot view registration requests" 
ON public.student_registration_requests 
FOR SELECT 
TO anon
USING (false);

-- Policy for authenticated users to view only their own requests
CREATE POLICY "Users can view their own registration requests" 
ON public.student_registration_requests 
FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM auth.users 
  WHERE auth.users.id = auth.uid() 
  AND auth.users.email = student_registration_requests.email
));

-- Policy for admins to view all requests (this should already exist but let's ensure it)
CREATE POLICY "Admins can view all registration requests" 
ON public.student_registration_requests 
FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_roles.user_id = auth.uid() 
  AND user_roles.role = 'admin'::app_role
));