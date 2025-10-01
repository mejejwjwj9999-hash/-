-- إنشاء جدول طلبات التسجيل المعلقة
CREATE TABLE public.student_registration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  student_id TEXT NOT NULL UNIQUE,
  college TEXT NOT NULL,
  department TEXT NOT NULL,
  specialization TEXT NOT NULL,
  program_id TEXT,
  department_id TEXT,
  academic_year INTEGER DEFAULT 1,
  semester INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  rejection_reason TEXT,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID
);

-- إضافة حقل التخصص لجدول student_profiles
ALTER TABLE public.student_profiles 
ADD COLUMN IF NOT EXISTS specialization TEXT DEFAULT 'عام',
ADD COLUMN IF NOT EXISTS address TEXT;

-- إنشاء فهارس للبحث السريع
CREATE INDEX idx_student_registration_requests_status ON public.student_registration_requests(status);
CREATE INDEX idx_student_registration_requests_email ON public.student_registration_requests(email);
CREATE INDEX idx_student_registration_requests_student_id ON public.student_registration_requests(student_id);

-- تفعيل RLS للجدول الجديد
ALTER TABLE public.student_registration_requests ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات RLS
CREATE POLICY "Admins can manage all registration requests" 
ON public.student_registration_requests 
FOR ALL 
USING (is_admin(auth.uid()));

CREATE POLICY "Users can create registration requests" 
ON public.student_registration_requests 
FOR INSERT 
WITH CHECK (true);

-- إنشاء وظيفة لمعالجة طلبات التسجيل المعتمدة
CREATE OR REPLACE FUNCTION public.approve_student_registration(request_id UUID, admin_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- إنشاء وظيفة لرفض طلبات التسجيل
CREATE OR REPLACE FUNCTION public.reject_student_registration(
  request_id UUID, 
  admin_id UUID, 
  rejection_reason TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- إنشاء ترايجر لتحديث updated_at
CREATE TRIGGER update_student_registration_requests_updated_at
BEFORE UPDATE ON public.student_registration_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();