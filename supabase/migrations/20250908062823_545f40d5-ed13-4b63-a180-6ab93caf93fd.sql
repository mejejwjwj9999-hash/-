-- إثراء محتويات صفحة حول الكلية بعناصر إضافية
INSERT INTO admin_content_elements (
  page_id, element_key, element_type, content_ar, content_en, 
  status, is_active, display_order, created_by, updated_by
)
SELECT 
  p.id,
  'academic_excellence',
  'rich_text',
  E'<h2>التميز الأكاديمي</h2><p>تتميز كلية إيلول بمنهجية تعليمية متطورة تجمع بين النظرية والتطبيق العملي، مع التركيز على:</p><ul><li>التعلم القائم على المشاريع والبحث العلمي</li><li>استخدام أحدث التقنيات في التعليم</li><li>التدريب العملي في مؤسسات متخصصة</li><li>برامج التبادل الأكاديمي مع جامعات عالمية</li><li>ورش العمل والمؤتمرات العلمية المتخصصة</li></ul>',
  E'<h2>Academic Excellence</h2><p>Ayloul College is distinguished by an advanced educational methodology that combines theory and practical application, focusing on:</p><ul><li>Project-based learning and scientific research</li><li>Using the latest technologies in education</li><li>Practical training in specialized institutions</li><li>Academic exchange programs with global universities</li><li>Specialized workshops and scientific conferences</li></ul>',
  'published',
  true,
  5,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'about'
ON CONFLICT (page_id, element_key) DO UPDATE SET
  content_ar = EXCLUDED.content_ar,
  content_en = EXCLUDED.content_en,
  updated_at = now(),
  updated_by = EXCLUDED.updated_by;

INSERT INTO admin_content_elements (
  page_id, element_key, element_type, content_ar, content_en, 
  status, is_active, display_order, created_by, updated_by
)
SELECT 
  p.id,
  'leadership_team',
  'rich_text',
  E'<h2>القيادة الأكاديمية</h2><p>تضم الكلية نخبة من الأكاديميين والباحثين المتميزين:</p><ul><li><strong>العميد:</strong> الأستاذ الدكتور أحمد محمد الحداد - خبرة 25 عاماً في التعليم العالي</li><li><strong>نائب العميد للشؤون الأكاديمية:</strong> الدكتورة فاطمة علي السالم</li><li><strong>نائب العميد للشؤون الإدارية:</strong> الدكتور محمد عبدالله الشامي</li><li><strong>مدير الجودة والاعتماد:</strong> الدكتور سعد إبراهيم المقطري</li></ul>',
  E'<h2>Academic Leadership</h2><p>The college includes a select group of distinguished academics and researchers:</p><ul><li><strong>Dean:</strong> Professor Dr. Ahmed Mohammed Al-Haddad - 25 years experience in higher education</li><li><strong>Vice Dean for Academic Affairs:</strong> Dr. Fatima Ali Al-Salem</li><li><strong>Vice Dean for Administrative Affairs:</strong> Dr. Mohammed Abdullah Al-Shami</li><li><strong>Quality and Accreditation Director:</strong> Dr. Saad Ibrahim Al-Muqtari</li></ul>',
  'published',
  true,
  6,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'about'
ON CONFLICT (page_id, element_key) DO UPDATE SET
  content_ar = EXCLUDED.content_ar,
  content_en = EXCLUDED.content_en,
  updated_at = now(),
  updated_by = EXCLUDED.updated_by;

INSERT INTO admin_content_elements (
  page_id, element_key, element_type, content_ar, content_en, 
  status, is_active, display_order, created_by, updated_by
)
SELECT 
  p.id,
  'contact_cta_button',
  'button',
  'تواصل معنا الآن',
  'Contact Us Now',
  'published',
  true,
  7,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'about'
ON CONFLICT (page_id, element_key) DO UPDATE SET
  content_ar = EXCLUDED.content_ar,
  content_en = EXCLUDED.content_en,
  updated_at = now(),
  updated_by = EXCLUDED.updated_by;