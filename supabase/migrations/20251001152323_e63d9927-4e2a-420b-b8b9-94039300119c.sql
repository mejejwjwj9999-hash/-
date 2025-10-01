-- تحديث جدول teacher_profiles لإضافة الحقول المطلوبة
ALTER TABLE teacher_profiles 
ADD COLUMN IF NOT EXISTS cv_file_url text,
ADD COLUMN IF NOT EXISTS cv_file_name text,
ADD COLUMN IF NOT EXISTS cv_uploaded_at timestamp with time zone;

-- تحديث القيم الافتراضية والقيود
COMMENT ON COLUMN teacher_profiles.department_id IS 'القسم: tech_science (قسم العلوم التقنية والحاسوب), admin_humanities (قسم العلوم الإدارية والإنسانية), medical (قسم العلوم الطبية)';
COMMENT ON COLUMN teacher_profiles.position IS 'المنصب: معيد، دكتور، مدرس دكتور، مدرس، عميد، رئيس قسم';

-- التأكد من وجود سياسة RLS للمسؤولين لإضافة معلمين
DROP POLICY IF EXISTS "Admins can insert teacher profiles" ON teacher_profiles;
CREATE POLICY "Admins can insert teacher profiles"
ON teacher_profiles
FOR INSERT
TO authenticated
WITH CHECK (has_admin_access(auth.uid()));

-- التأكد من سياسة RLS للمسؤولين لتحديث معلومات المعلمين
DROP POLICY IF EXISTS "Admins can update teacher profiles" ON teacher_profiles;
CREATE POLICY "Admins can update teacher profiles"
ON teacher_profiles
FOR UPDATE
TO authenticated
USING (has_admin_access(auth.uid()))
WITH CHECK (has_admin_access(auth.uid()));

-- التأكد من سياسة RLS للقراءة
DROP POLICY IF EXISTS "Everyone can view active teachers" ON teacher_profiles;
CREATE POLICY "Everyone can view active teachers"
ON teacher_profiles
FOR SELECT
TO authenticated
USING (is_active = true OR has_admin_access(auth.uid()));