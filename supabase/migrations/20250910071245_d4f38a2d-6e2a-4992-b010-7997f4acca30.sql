-- Fix RLS policies for student_registration_requests to allow public registration
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can submit registration requests" ON student_registration_requests;
DROP POLICY IF EXISTS "Public can insert registration requests" ON student_registration_requests;
DROP POLICY IF EXISTS "Anyone can submit registration requests" ON student_registration_requests;

-- Create new policy that allows anyone (including anonymous users) to insert registration requests
CREATE POLICY "Anyone can submit registration requests" 
ON student_registration_requests 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Ensure the table allows anonymous access for inserts
-- The other policies for SELECT, UPDATE, DELETE should remain admin-only
CREATE POLICY "Admins can view registration requests" 
ON student_registration_requests 
FOR SELECT 
TO authenticated
USING (has_admin_access(auth.uid()));

CREATE POLICY "Admins can update registration requests" 
ON student_registration_requests 
FOR UPDATE 
TO authenticated
USING (has_admin_access(auth.uid()));

CREATE POLICY "Admins can delete registration requests" 
ON student_registration_requests 
FOR DELETE 
TO authenticated
USING (has_admin_access(auth.uid()));