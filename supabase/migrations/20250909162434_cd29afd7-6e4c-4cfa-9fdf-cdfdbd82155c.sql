-- Check if student_registration_requests table exists and create if needed
CREATE TABLE IF NOT EXISTS public.student_registration_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  student_id TEXT NOT NULL,
  college TEXT NOT NULL,
  department TEXT NOT NULL,
  specialization TEXT NOT NULL,
  program_id TEXT,
  department_id TEXT,
  academic_year INTEGER NOT NULL,
  semester INTEGER NOT NULL,
  password_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID
);

-- Enable Row Level Security
ALTER TABLE public.student_registration_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to insert registration requests
CREATE POLICY "Anyone can create registration requests" 
ON public.student_registration_requests 
FOR INSERT 
WITH CHECK (true);

-- Create policy for admins to view all requests
CREATE POLICY "Admins can view all registration requests" 
ON public.student_registration_requests 
FOR SELECT 
USING (has_admin_access(auth.uid()));

-- Create policy for admins to update requests
CREATE POLICY "Admins can update registration requests" 
ON public.student_registration_requests 
FOR UPDATE 
USING (has_admin_access(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_student_registration_requests_updated_at
BEFORE UPDATE ON public.student_registration_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();