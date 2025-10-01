-- Drop all existing policies for student_registration_requests
DROP POLICY IF EXISTS "Public can submit registration requests" ON student_registration_requests;
DROP POLICY IF EXISTS "Public can insert registration requests" ON student_registration_requests;
DROP POLICY IF EXISTS "Admins can manage registration requests" ON student_registration_requests;
DROP POLICY IF EXISTS "Admins can view registration requests" ON student_registration_requests;
DROP POLICY IF EXISTS "Admins can update registration requests" ON student_registration_requests;
DROP POLICY IF EXISTS "Admins can delete registration requests" ON student_registration_requests;

-- Create proper RLS policies
CREATE POLICY "Public can submit registration requests" 
ON student_registration_requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view registration requests" 
ON student_registration_requests 
FOR SELECT 
USING (has_admin_access(auth.uid()));

CREATE POLICY "Admins can update registration requests" 
ON student_registration_requests 
FOR UPDATE 
USING (has_admin_access(auth.uid()));

CREATE POLICY "Admins can delete registration requests" 
ON student_registration_requests 
FOR DELETE 
USING (has_admin_access(auth.uid()));

-- Create secure RPC function to get registration requests
CREATE OR REPLACE FUNCTION public.get_registration_requests()
RETURNS TABLE (
  id uuid,
  first_name text,
  last_name text,
  email text,
  phone text,
  address text,
  student_id text,
  college text,
  department text,
  specialization text,
  program_id text,
  department_id text,
  academic_year integer,
  semester integer,
  status text,
  admin_notes text,
  rejection_reason text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  reviewed_at timestamp with time zone,
  reviewed_by uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user has admin access
  IF NOT has_admin_access(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  RETURN QUERY
  SELECT 
    srr.id,
    srr.first_name,
    srr.last_name,
    srr.email,
    srr.phone,
    srr.address,
    srr.student_id,
    srr.college,
    srr.department,
    srr.specialization,
    srr.program_id,
    srr.department_id,
    srr.academic_year,
    srr.semester,
    srr.status,
    srr.admin_notes,
    srr.rejection_reason,
    srr.created_at,
    srr.updated_at,
    srr.reviewed_at,
    srr.reviewed_by
  FROM student_registration_requests srr
  ORDER BY srr.created_at DESC;
END;
$$;

-- Update approve_student_registration to avoid auth.users access
CREATE OR REPLACE FUNCTION public.approve_student_registration(request_id uuid, admin_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_data RECORD;
BEGIN
  -- Check if user has admin access
  IF NOT has_admin_access(admin_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'غير مصرح لك بتنفيذ هذا الإجراء');
  END IF;

  -- Get request data
  SELECT * INTO request_data 
  FROM student_registration_requests 
  WHERE id = request_id AND status = 'pending';

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'الطلب غير موجود أو تم معالجته مسبقاً');
  END IF;

  -- Update request status only (no user creation)
  UPDATE student_registration_requests 
  SET 
    status = 'approved',
    reviewed_at = NOW(),
    reviewed_by = admin_id,
    updated_at = NOW(),
    admin_notes = 'تم اعتماد الطلب - في انتظار إنشاء الحساب'
  WHERE id = request_id;

  RETURN jsonb_build_object(
    'success', true, 
    'message', 'تم اعتماد الطلب بنجاح',
    'student_id', request_data.student_id,
    'note', 'سيتم إنشاء حساب الطالب في خطوة منفصلة'
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Update reject_student_registration to be properly secured
CREATE OR REPLACE FUNCTION public.reject_student_registration(request_id uuid, admin_id uuid, rejection_reason text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user has admin access
  IF NOT has_admin_access(admin_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'غير مصرح لك بتنفيذ هذا الإجراء');
  END IF;

  -- Update request status
  UPDATE student_registration_requests 
  SET 
    status = 'rejected',
    rejection_reason = rejection_reason,
    reviewed_at = NOW(),
    reviewed_by = admin_id,
    updated_at = NOW()
  WHERE id = request_id AND status = 'pending';

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'الطلب غير موجود أو تم معالجته مسبقاً');
  END IF;

  RETURN jsonb_build_object('success', true, 'message', 'تم رفض الطلب بنجاح');

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;