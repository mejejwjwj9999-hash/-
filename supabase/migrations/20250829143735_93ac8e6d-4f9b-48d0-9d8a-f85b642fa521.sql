
-- إنشاء نوع الأدوار
CREATE TYPE public.app_role AS ENUM ('admin', 'student', 'staff');

-- إنشاء جدول أدوار المستخدمين
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- تفعيل RLS على جدول الأدوار
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- إنشاء دالة للتحقق من الدور
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- إنشاء دالة للتحقق من كون المستخدم إدمن
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- سياسات RLS لجدول الأدوار
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- إضافة دور إدمن للمستخدم الأول (يجب تعديل هذا حسب حاجتك)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'admin@aylol.edu.ye'
ON CONFLICT (user_id, role) DO NOTHING;

-- إضافة أدوار الطلاب للمستخدمين الحاليين
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'student'
FROM public.student_profiles
WHERE user_id IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- إنشاء جدول إعدادات النظام
CREATE TABLE public.system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تفعيل RLS على إعدادات النظام
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage system settings"
ON public.system_settings
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Everyone can read public settings"
ON public.system_settings
FOR SELECT
TO authenticated
USING (setting_key IN ('site_name', 'site_logo', 'contact_info', 'academic_calendar'));

-- إدراج إعدادات النظام الافتراضية
INSERT INTO public.system_settings (setting_key, setting_value, description, category) VALUES
('site_name', '"كلية أيلول الجامعية"', 'اسم الموقع', 'general'),
('site_description', '"كلية أيلول الجامعية - التعليم والتميز"', 'وصف الموقع', 'general'),
('contact_email', '"info@aylol.edu.ye"', 'البريد الإلكتروني للتواصل', 'contact'),
('contact_phone', '"+967-1-234567"', 'رقم الهاتف', 'contact'),
('current_academic_year', '"2024"', 'العام الدراسي الحالي', 'academic'),
('current_semester', '"1"', 'الفصل الدراسي الحالي', 'academic'),
('registration_open', 'true', 'حالة التسجيل', 'academic'),
('tuition_fees', '{"semester_1": 1250000, "semester_2": 1250000, "lab_fees": 150000, "books": 350000}', 'الرسوم الدراسية', 'financial');

-- تحديث سياسات RLS للجداول الموجودة للسماح للإدمن بالوصول الكامل
-- جدول الطلاب
CREATE POLICY "Admins can manage all student profiles"
ON public.student_profiles
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- جدول المقررات
CREATE POLICY "Admins can manage all courses"
ON public.courses
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- جدول الجداول الدراسية
CREATE POLICY "Admins can manage all class schedules"
ON public.class_schedule
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- جدول الدرجات
CREATE POLICY "Admins can manage all grades"
ON public.grades
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- جدول الإشعارات
CREATE POLICY "Admins can manage all notifications"
ON public.notifications
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- جدول المواعيد
CREATE POLICY "Admins can manage all appointments"
ON public.appointments
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- جدول المدفوعات
CREATE POLICY "Admins can manage all payments"
ON public.payments
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- جدول طلبات الخدمات
CREATE POLICY "Admins can manage all service requests"
ON public.service_requests
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- جدول الوثائق
CREATE POLICY "Admins can manage all documents"
ON public.documents
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- إنشاء مؤشرات لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON public.system_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON public.system_settings(category);

-- إنشاء trigger لتحديث updated_at
CREATE TRIGGER handle_updated_at_user_roles
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_system_settings
    BEFORE UPDATE ON public.system_settings
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
