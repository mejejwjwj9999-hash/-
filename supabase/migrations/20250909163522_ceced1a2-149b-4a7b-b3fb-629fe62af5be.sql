-- Fix RLS for student_registration_requests table
-- Enable RLS
ALTER TABLE public.student_registration_requests ENABLE ROW LEVEL SECURITY;

-- Set default status to pending to prevent issues
ALTER TABLE public.student_registration_requests 
ALTER COLUMN status SET DEFAULT 'pending';

-- Allow public to insert registration requests with restrictions
CREATE POLICY "Public can create registration requests"
ON public.student_registration_requests
FOR INSERT
WITH CHECK (
  status = 'pending' OR status IS NULL
);

-- Allow admins to manage all registration requests
CREATE POLICY "Admins can manage registration requests"
ON public.student_registration_requests
FOR ALL
USING (has_admin_access(auth.uid()))
WITH CHECK (has_admin_access(auth.uid()));