-- حل جذري نهائي لمشكلة RLS في جدول student_registration_requests
-- إزالة جميع السياسات الحالية وإعادة إنشائها بطريقة صحيحة

-- إيقاف RLS مؤقتاً للتنظيف
ALTER TABLE public.student_registration_requests DISABLE ROW LEVEL SECURITY;

-- إزالة جميع السياسات الموجودة
DROP POLICY IF EXISTS "Allow anonymous registration requests" ON public.student_registration_requests;
DROP POLICY IF EXISTS "Admins can manage all registration requests" ON public.student_registration_requests;
DROP POLICY IF EXISTS "Anyone can create registration requests" ON public.student_registration_requests;
DROP POLICY IF EXISTS "Users can create registration requests" ON public.student_registration_requests;

-- تفعيل RLS مرة أخرى
ALTER TABLE public.student_registration_requests ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسة للسماح للجميع (anon + authenticated) بإدراج البيانات
CREATE POLICY "Enable insert for anonymous users" 
ON public.student_registration_requests 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- إنشاء سياسة للإدارة لقراءة وتحديث جميع الطلبات
CREATE POLICY "Enable all operations for admins" 
ON public.student_registration_requests 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- إنشاء سياسة للسماح للمستخدمين المصادق عليهم بقراءة طلباتهم الخاصة فقط
CREATE POLICY "Enable select for own requests" 
ON public.student_registration_requests 
FOR SELECT 
TO authenticated
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);