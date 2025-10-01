-- إضافة أعمدة جديدة لجدول المدفوعات
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS invoice_number TEXT;

-- تحديث الفهارس
CREATE INDEX IF NOT EXISTS idx_payments_invoice_number ON public.payments(invoice_number);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON public.payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(payment_status);

-- التأكد من وجود trigger للتحديث التلقائي للتاريخ
CREATE TRIGGER IF NOT EXISTS update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- إضافة فهارس إضافية للأداء
CREATE INDEX IF NOT EXISTS idx_documents_student_id ON public.documents(student_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON public.documents(document_type);
CREATE INDEX IF NOT EXISTS idx_service_requests_student_id ON public.service_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON public.service_requests(status);
CREATE INDEX IF NOT EXISTS idx_notifications_student_id ON public.notifications(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(is_read);

-- تحسين سياسات الأمان للوثائق
DROP POLICY IF EXISTS "Students can view their own documents" ON public.documents;
CREATE POLICY "Students can view their own documents" 
ON public.documents 
FOR SELECT 
USING (
  student_id IN (
    SELECT id FROM public.student_profiles 
    WHERE user_id = auth.uid()
  )
);

-- إضافة سياسة للسماح للطلاب بطلب وثائق جديدة
CREATE POLICY IF NOT EXISTS "Students can request new documents" 
ON public.documents 
FOR INSERT 
WITH CHECK (
  student_id IN (
    SELECT id FROM public.student_profiles 
    WHERE user_id = auth.uid()
  )
);

-- تحسين سياسات طلبات الخدمات
DROP POLICY IF EXISTS "Students can create their own service requests" ON public.service_requests;
CREATE POLICY "Students can create their own service requests" 
ON public.service_requests 
FOR INSERT 
WITH CHECK (
  student_id IN (
    SELECT id FROM public.student_profiles 
    WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Students can view their own service requests" ON public.service_requests;
CREATE POLICY "Students can view their own service requests" 
ON public.service_requests 
FOR SELECT 
USING (
  student_id IN (
    SELECT id FROM public.student_profiles 
    WHERE user_id = auth.uid()
  )
);

-- السماح للطلاب بتحديث طلباتهم (مثل إلغاء الطلب)
CREATE POLICY IF NOT EXISTS "Students can update their own service requests" 
ON public.service_requests 
FOR UPDATE 
USING (
  student_id IN (
    SELECT id FROM public.student_profiles 
    WHERE user_id = auth.uid()
  )
);