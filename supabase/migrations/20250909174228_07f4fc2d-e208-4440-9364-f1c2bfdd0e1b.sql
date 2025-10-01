-- Fix RLS policies for student_registration_requests table
DROP POLICY IF EXISTS "Allow public registration submissions" ON public.student_registration_requests;
DROP POLICY IF EXISTS "Admins can manage registration requests" ON public.student_registration_requests;

-- Enable RLS on student_registration_requests if not already enabled
ALTER TABLE public.student_registration_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create registration requests
CREATE POLICY "Anyone can submit registration requests" 
ON public.student_registration_requests 
FOR INSERT 
TO public
WITH CHECK (true);

-- Only admins can view registration requests
CREATE POLICY "Admins can view registration requests" 
ON public.student_registration_requests 
FOR SELECT 
TO authenticated
USING (is_admin(auth.uid()));

-- Only admins can update registration requests  
CREATE POLICY "Admins can update registration requests" 
ON public.student_registration_requests 
FOR UPDATE 
TO authenticated
USING (is_admin(auth.uid()));

-- Only admins can delete registration requests
CREATE POLICY "Admins can delete registration requests" 
ON public.student_registration_requests 
FOR DELETE 
TO authenticated
USING (is_admin(auth.uid()));

-- Fix RLS policies for contact_messages table
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can manage all contact messages" ON public.contact_messages;

-- Allow anyone to create contact messages
CREATE POLICY "Anyone can submit contact messages" 
ON public.contact_messages 
FOR INSERT 
TO public
WITH CHECK (true);

-- Only admins can view contact messages
CREATE POLICY "Admins can view contact messages" 
ON public.contact_messages 
FOR SELECT 
TO authenticated
USING (has_admin_access(auth.uid()));

-- Only admins can update contact messages
CREATE POLICY "Admins can update contact messages" 
ON public.contact_messages 
FOR UPDATE 
TO authenticated
USING (has_admin_access(auth.uid()));

-- Update RPC functions to be SECURITY DEFINER with proper search_path
CREATE OR REPLACE FUNCTION public.approve_student_registration(request_id uuid, admin_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  request_data RECORD;
  new_user_id UUID;
  new_profile_id UUID;
  result JSONB;
BEGIN
  -- التحقق من صلاحية المدير
  IF NOT is_admin(admin_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'غير مصرح لك بتنفيذ هذا الإجراء');
  END IF;

  -- الحصول على بيانات الطلب
  SELECT * INTO request_data 
  FROM student_registration_requests 
  WHERE id = request_id AND status = 'pending';

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'الطلب غير موجود أو تم معالجته مسبقاً');
  END IF;

  -- إنشاء حساب المستخدم
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    request_data.email,
    request_data.password_hash,
    NOW(),
    NULL,
    NULL,
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object(
      'first_name', request_data.first_name,
      'last_name', request_data.last_name,
      'phone', request_data.phone,
      'college', request_data.college,
      'department', request_data.department,
      'student_id', request_data.student_id
    ),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ) RETURNING id INTO new_user_id;

  -- إنشاء ملف الطالب
  INSERT INTO student_profiles (
    user_id,
    student_id,
    first_name,
    last_name,
    email,
    phone,
    address,
    college,
    department,
    specialization,
    program_id,
    department_id,
    academic_year,
    semester,
    admission_date,
    account_status
  ) VALUES (
    new_user_id,
    request_data.student_id,
    request_data.first_name,
    request_data.last_name,
    request_data.email,
    request_data.phone,
    request_data.address,
    request_data.college,
    request_data.department,
    request_data.specialization,
    request_data.program_id,
    request_data.department_id,
    request_data.academic_year,
    request_data.semester,
    NOW()::date,
    'active'
  ) RETURNING id INTO new_profile_id;

  -- تحديث حالة الطلب
  UPDATE student_registration_requests 
  SET 
    status = 'approved',
    reviewed_at = NOW(),
    reviewed_by = admin_id,
    updated_at = NOW()
  WHERE id = request_id;

  RETURN jsonb_build_object(
    'success', true, 
    'user_id', new_user_id,
    'profile_id', new_profile_id,
    'student_id', request_data.student_id
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.reject_student_registration(request_id uuid, admin_id uuid, rejection_reason text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- التحقق من صلاحية المدير
  IF NOT is_admin(admin_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'غير مصرح لك بتنفيذ هذا الإجراء');
  END IF;

  -- تحديث حالة الطلب
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

  RETURN jsonb_build_object('success', true);

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$function$;