-- إضافة الصفحات المفقودة وتحديث الموجودة
INSERT INTO admin_content_pages (page_key, page_name_ar, page_name_en, description_ar, is_active, display_order) VALUES
('vision-mission', 'الرؤية والرسالة', 'Vision & Mission', 'صفحة رؤية ورسالة الكلية', true, 1),
('history', 'تاريخ الكلية', 'College History', 'صفحة تاريخ وتأسيس الكلية', true, 2),
('accreditation', 'الاعتماد الأكاديمي', 'Academic Accreditation', 'صفحة الاعتماد والشهادات الأكاديمية', true, 3),
('pharmacy', 'كلية الصيدلة', 'Pharmacy College', 'صفحة تخصص الصيدلة', true, 4),
('nursing', 'كلية التمريض', 'Nursing College', 'صفحة تخصص التمريض', true, 5),
('midwifery', 'كلية القبالة', 'Midwifery College', 'صفحة تخصص القبالة', true, 6),
('information-technology', 'تكنولوجيا المعلومات', 'Information Technology', 'صفحة تخصص تكنولوجيا المعلومات', true, 7),
('business-administration', 'إدارة الأعمال', 'Business Administration', 'صفحة تخصص إدارة الأعمال', true, 8),
('admissions', 'القبول والتسجيل', 'Admissions', 'صفحة القبول والتسجيل بالكلية', true, 9),
('homepage', 'الصفحة الرئيسية', 'Homepage', 'الصفحة الرئيسية للموقع', true, 11)
ON CONFLICT (page_key) DO UPDATE SET
  page_name_ar = EXCLUDED.page_name_ar,
  page_name_en = EXCLUDED.page_name_en,
  description_ar = EXCLUDED.description_ar,
  display_order = EXCLUDED.display_order;

-- تحديث صفحة الاتصال الموجودة
UPDATE admin_content_pages SET 
  page_name_ar = 'تواصل معنا',
  page_name_en = 'Contact Us',
  description_ar = 'صفحة معلومات التواصل',
  display_order = 10
WHERE page_key = 'contact';