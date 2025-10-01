-- إصلاح مشكلة RLS لجدول student_registration_requests بشكل جذري
-- إزالة جميع السياسات الحالية وإنشاء سياسة جديدة تسمح للجميع (بما في ذلك غير المصرح لهم) بإنشاء طلبات التسجيل

-- إزالة جميع السياسات الحالية
DROP POLICY IF EXISTS "Anyone can create registration requests" ON public.student_registration_requests;
DROP POLICY IF EXISTS "Users can create registration requests" ON public.student_registration_requests;
DROP POLICY IF EXISTS "Admins can manage all registration requests" ON public.student_registration_requests;

-- إنشاء سياسة جديدة تسمح للجميع بإنشاء طلبات التسجيل (حتى غير المصرح لهم)
CREATE POLICY "Allow anonymous registration requests" 
ON public.student_registration_requests 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- إنشاء سياسة للإدارة لإدارة جميع الطلبات
CREATE POLICY "Admins can manage all registration requests" 
ON public.student_registration_requests 
FOR ALL 
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- التأكد من أن الجدول يحتوي على RLS مفعل
ALTER TABLE public.student_registration_requests ENABLE ROW LEVEL SECURITY;