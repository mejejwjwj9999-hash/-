
-- 1) منح صلاحية super_admin للمستخدم الحالي في نظام أدوار الإدارة
-- ملاحظة: المعرّف التالي هو مُعرّف المستخدم الحالي الظاهر في السجلات
-- 835a9a91-f356-4dc0-83c2-69d512c9010a
INSERT INTO public.admin_user_roles (user_id, role, is_active, granted_at)
SELECT '835a9a91-f356-4dc0-83c2-69d512c9010a', 'super_admin', true, now()
WHERE NOT EXISTS (
  SELECT 1 FROM public.admin_user_roles 
  WHERE user_id = '835a9a91-f356-4dc0-83c2-69d512c9010a' 
    AND role = 'super_admin'
);

-- 2) سياسات التخزين لبكت site-media

-- قراءة عامة (اختياري ولكن مفيد عند الاستعلام عن storage.objects)
CREATE POLICY "Public can read site-media"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-media');

-- رفع ملفات إلى site-media للمستخدمين الموثّقين الذين لديهم صلاحية إدارة
CREATE POLICY "Admins can upload to site-media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'site-media'
  AND public.has_admin_access(auth.uid())
);

-- تحديث بيانات/استبدال ملف داخل site-media
CREATE POLICY "Admins can update site-media"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'site-media'
  AND public.has_admin_access(auth.uid())
)
WITH CHECK (
  bucket_id = 'site-media'
  AND public.has_admin_access(auth.uid())
);

-- حذف ملفات من site-media
CREATE POLICY "Admins can delete site-media"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'site-media'
  AND public.has_admin_access(auth.uid())
);

-- 3) سياسات جسرية لدعم دور admin في user_roles على جداول الإدارة

-- تمكين مدراء user_roles (is_admin) من إدارة الأخبار والفعاليات
CREATE POLICY "Legacy admins can manage news events"
ON public.admin_news_events
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- تمكين مدراء user_roles (is_admin) من إدارة المكتبة الإعلامية
CREATE POLICY "Legacy admins can manage media"
ON public.admin_media_library
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
