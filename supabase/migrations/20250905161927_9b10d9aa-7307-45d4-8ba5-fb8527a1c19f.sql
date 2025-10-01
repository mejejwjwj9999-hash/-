-- إصلاح سياسات RLS لجدول student_registration_requests
-- إزالة السياسة الحالية وإنشاء سياسة جديدة تسمح للجميع بإنشاء طلبات التسجيل

DROP POLICY IF EXISTS "Users can create registration requests" ON public.student_registration_requests;

-- إنشاء سياسة جديدة تسمح للجميع بإنشاء طلبات التسجيل
CREATE POLICY "Anyone can create registration requests" 
ON public.student_registration_requests 
FOR INSERT 
TO public 
WITH CHECK (true);

-- التأكد من أن الجدول يحتوي على RLS مفعل
ALTER TABLE public.student_registration_requests ENABLE ROW LEVEL SECURITY;