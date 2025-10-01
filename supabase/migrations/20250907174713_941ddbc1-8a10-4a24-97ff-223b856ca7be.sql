-- إثراء محتويات صفحة حول الكلية بعناصر إضافية
INSERT INTO admin_content_elements (
  page_id, element_key, element_type, content_ar, content_en, 
  status, is_active, display_order, created_by, updated_by
)
SELECT 
  p.id,
  'academic_excellence',
  'rich_text',
  '<h2>التميز الأكاديمي</h2><p>تتميز كلية إيلول بمنهجية تعليمية متطورة تجمع بين النظرية والتطبيق العملي، مع التركيز على:</p><ul><li>التعلم القائم على المشاريع والبحث العلمي</li><li>استخدام أحدث التقنيات في التعليم</li><li>التدريب العملي في مؤسسات متخصصة</li><li>برامج التبادل الأكاديمي مع جامعات عالمية</li><li>ورش العمل والمؤتمرات العلمية المتخصصة</li></ul>',
  '<h2>Academic Excellence</h2><p>Ayloul College is distinguished by an advanced educational methodology that combines theory and practical application, focusing on:</p><ul><li>Project-based learning and scientific research</li><li>Using the latest technologies in education</li><li>Practical training in specialized institutions</li><li>Academic exchange programs with global universities</li><li>Specialized workshops and scientific conferences</li></ul>',
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
  '<h2>القيادة الأكاديمية</h2><p>تضم الكلية نخبة من الأكاديميين والباحثين المتميزين:</p><ul><li><strong>العميد:</strong> الأستاذ الدكتور أحمد محمد الحداد - خبرة 25 عاماً في التعليم العالي</li><li><strong>نائب العميد للشؤون الأكاديمية:</strong> الدكتورة فاطمة علي السالم</li><li><strong>نائب العميد للشؤون الإدارية:</strong> الدكتور محمد عبدالله الشامي</li><li><strong>مدير الجودة والاعتماد:</strong> الدكتور سعد إبراهيم المقطري</li></ul>',
  '<h2>Academic Leadership</h2><p>The college includes a select group of distinguished academics and researchers:</p><ul><li><strong>Dean:</strong> Professor Dr. Ahmed Mohammed Al-Haddad - 25 years experience in higher education</li><li><strong>Vice Dean for Academic Affairs:</strong> Dr. Fatima Ali Al-Salem</li><li><strong>Vice Dean for Administrative Affairs:</strong> Dr. Mohammed Abdullah Al-Shami</li><li><strong>Quality and Accreditation Director:</strong> Dr. Saad Ibrahim Al-Muqtari</li></ul>',
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

-- إثراء صفحة الاعتماد الأكاديمي
INSERT INTO admin_content_elements (
  page_id, element_key, element_type, content_ar, content_en, 
  status, is_active, display_order, created_by, updated_by
)
SELECT 
  p.id,
  'quality_standards',
  'rich_text',
  '<h3>معايير الجودة</h3><p>تطبق الكلية معايير الجودة الدولية في جميع برامجها:</p><ul><li>نظام إدارة الجودة ISO 9001:2015</li><li>معايير الهيئة الوطنية للاعتماد الأكاديمي</li><li>المعايير الأوروبية للتعليم العالي (ESG)</li><li>معايير منظمة الصحة العالمية للتخصصات الطبية</li></ul>',
  '<h3>Quality Standards</h3><p>The college applies international quality standards in all its programs:</p><ul><li>ISO 9001:2015 Quality Management System</li><li>National Academic Accreditation Authority Standards</li><li>European Standards and Guidelines for Higher Education (ESG)</li><li>World Health Organization standards for medical specializations</li></ul>',
  'published',
  true,
  3,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'accreditation'
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
  'certificates_table',
  'rich_text',
  '<h3>الشهادات والتراخيص</h3><table border="1" style="width:100%; border-collapse:collapse;"><thead><tr><th>البرنامج</th><th>جهة الاعتماد</th><th>تاريخ الحصول</th><th>صالح حتى</th></tr></thead><tbody><tr><td>الصيدلة</td><td>وزارة التعليم العالي + منظمة الصحة العالمية</td><td>2020</td><td>2025</td></tr><tr><td>التمريض</td><td>وزارة التعليم العالي + نقابة التمريض</td><td>2019</td><td>2024</td></tr><tr><td>القبالة</td><td>وزارة التعليم العالي + وزارة الصحة</td><td>2021</td><td>2026</td></tr><tr><td>تكنولوجيا المعلومات</td><td>وزارة التعليم العالي</td><td>2018</td><td>2023</td></tr><tr><td>إدارة الأعمال</td><td>وزارة التعليم العالي</td><td>2017</td><td>2022</td></tr></tbody></table>',
  '<h3>Certificates and Licenses</h3><table border="1" style="width:100%; border-collapse:collapse;"><thead><tr><th>Program</th><th>Accrediting Body</th><th>Date Obtained</th><th>Valid Until</th></tr></thead><tbody><tr><td>Pharmacy</td><td>Ministry of Higher Education + WHO</td><td>2020</td><td>2025</td></tr><tr><td>Nursing</td><td>Ministry of Higher Education + Nursing Association</td><td>2019</td><td>2024</td></tr><tr><td>Midwifery</td><td>Ministry of Higher Education + Ministry of Health</td><td>2021</td><td>2026</td></tr><tr><td>Information Technology</td><td>Ministry of Higher Education</td><td>2018</td><td>2023</td></tr><tr><td>Business Administration</td><td>Ministry of Higher Education</td><td>2017</td><td>2022</td></tr></tbody></table>',
  'published',
  true,
  4,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'accreditation'
ON CONFLICT (page_id, element_key) DO UPDATE SET
  content_ar = EXCLUDED.content_ar,
  content_en = EXCLUDED.content_en,
  updated_at = now(),
  updated_by = EXCLUDED.updated_by;

-- إثراء صفحة القبول والتسجيل
INSERT INTO admin_content_elements (
  page_id, element_key, element_type, content_ar, content_en, 
  status, is_active, display_order, created_by, updated_by
)
SELECT 
  p.id,
  'admission_dates',
  'rich_text',
  '<h2>مواعيد القبول للعام الأكاديمي 2024-2025</h2><table border="1" style="width:100%; border-collapse:collapse;"><thead><tr><th>الفترة</th><th>التاريخ</th><th>الملاحظات</th></tr></thead><tbody><tr><td>فتح باب التسجيل</td><td>1 مايو 2024</td><td>للجميع</td></tr><tr><td>انتهاء التسجيل المبكر</td><td>30 يونيو 2024</td><td>خصم 10%</td></tr><tr><td>امتحان القبول</td><td>15 يوليو 2024</td><td>للتخصصات الطبية</td></tr><tr><td>إعلان النتائج</td><td>25 يوليو 2024</td><td>عبر الموقع</td></tr><tr><td>انتهاء التسجيل النهائي</td><td>20 أغسطس 2024</td><td>آخر موعد</td></tr><tr><td>بداية الدراسة</td><td>1 سبتمبر 2024</td><td>الفصل الأول</td></tr></tbody></table>',
  '<h2>Admission Dates for Academic Year 2024-2025</h2><table border="1" style="width:100%; border-collapse:collapse;"><thead><tr><th>Period</th><th>Date</th><th>Notes</th></tr></thead><tbody><tr><td>Registration Opens</td><td>May 1, 2024</td><td>For All</td></tr><tr><td>Early Registration Ends</td><td>June 30, 2024</td><td>10% Discount</td></tr><tr><td>Entrance Exam</td><td>July 15, 2024</td><td>Medical Specializations</td></tr><tr><td>Results Announcement</td><td>July 25, 2024</td><td>Via Website</td></tr><tr><td>Final Registration Ends</td><td>August 20, 2024</td><td>Final Deadline</td></tr><tr><td>Classes Begin</td><td>September 1, 2024</td><td>First Semester</td></tr></tbody></table>',
  'published',
  true,
  3,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'admissions'
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
  'tuition_fees',
  'rich_text',
  '<h2>الرسوم الدراسية (بالريال اليمني)</h2><table border="1" style="width:100%; border-collapse:collapse;"><thead><tr><th>البرنامج</th><th>الرسوم السنوية</th><th>رسوم التسجيل</th><th>رسوم المختبرات</th></tr></thead><tbody><tr><td>الصيدلة</td><td>800,000</td><td>50,000</td><td>100,000</td></tr><tr><td>التمريض</td><td>600,000</td><td>40,000</td><td>80,000</td></tr><tr><td>القبالة</td><td>550,000</td><td>40,000</td><td>75,000</td></tr><tr><td>تكنولوجيا المعلومات</td><td>500,000</td><td>35,000</td><td>60,000</td></tr><tr><td>إدارة الأعمال</td><td>450,000</td><td>30,000</td><td>30,000</td></tr></tbody></table>',
  '<h2>Tuition Fees (YER)</h2><table border="1" style="width:100%; border-collapse:collapse;"><thead><tr><th>Program</th><th>Annual Fees</th><th>Registration Fees</th><th>Lab Fees</th></tr></thead><tbody><tr><td>Pharmacy</td><td>800,000</td><td>50,000</td><td>100,000</td></tr><tr><td>Nursing</td><td>600,000</td><td>40,000</td><td>80,000</td></tr><tr><td>Midwifery</td><td>550,000</td><td>40,000</td><td>75,000</td></tr><tr><td>Information Technology</td><td>500,000</td><td>35,000</td><td>60,000</td></tr><tr><td>Business Administration</td><td>450,000</td><td>30,000</td><td>30,000</td></tr></tbody></table>',
  'published',
  true,
  4,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'admissions'
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
  'apply_now_button',
  'button',
  'تقدم للالتحاق الآن',
  'Apply Now',
  'published',
  true,
  5,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'admissions'
ON CONFLICT (page_id, element_key) DO UPDATE SET
  content_ar = EXCLUDED.content_ar,
  content_en = EXCLUDED.content_en,
  updated_at = now(),
  updated_by = EXCLUDED.updated_by;

-- إثراء صفحة المركز الإعلامي
INSERT INTO admin_content_elements (
  page_id, element_key, element_type, content_ar, content_en, 
  status, is_active, display_order, created_by, updated_by
)
SELECT 
  p.id,
  'recent_news',
  'rich_text',
  '<h2>آخر الأخبار</h2><div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0;"><h3>🎓 تخريج الدفعة العاشرة من كلية الصيدلة</h3><p><strong>التاريخ:</strong> 15 مايو 2024</p><p>احتفلت كلية إيلول بتخريج 85 طالباً وطالبة من كلية الصيدلة في حفل مهيب حضره وزير التعليم العالي وعدد من الشخصيات الأكاديمية والاجتماعية البارزة.</p></div><div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0;"><h3>🏆 حصول الكلية على جائزة التميز في التعليم الطبي</h3><p><strong>التاريخ:</strong> 10 مايو 2024</p><p>حصلت كلية إيلول على جائزة التميز في التعليم الطبي من اتحاد الجامعات العربية تقديراً لجهودها في تطوير المناهج والبرامج الطبية.</p></div>',
  '<h2>Latest News</h2><div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0;"><h3>🎓 Graduation of the 10th Batch from Faculty of Pharmacy</h3><p><strong>Date:</strong> May 15, 2024</p><p>Ayloul College celebrated the graduation of 85 students from the Faculty of Pharmacy in a grand ceremony attended by the Minister of Higher Education and several prominent academic and social figures.</p></div><div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0;"><h3>🏆 College Receives Excellence Award in Medical Education</h3><p><strong>Date:</strong> May 10, 2024</p><p>Ayloul College received the Excellence Award in Medical Education from the Association of Arab Universities in recognition of its efforts in developing medical curricula and programs.</p></div>',
  'published',
  true,
  2,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'media-center'
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
  'upcoming_events',
  'rich_text',
  '<h2>الفعاليات القادمة</h2><div style="background: #f8f9fa; border-left: 4px solid #007bff; padding: 15px; margin: 10px 0;"><h3>📅 المؤتمر العلمي السنوي الخامس</h3><p><strong>التاريخ:</strong> 20-22 يونيو 2024</p><p><strong>الموضوع:</strong> "الابتكار في التعليم الطبي والتكنولوجي"</p><p><strong>المكان:</strong> قاعة المؤتمرات الرئيسية</p></div><div style="background: #f8f9fa; border-left: 4px solid #28a745; padding: 15px; margin: 10px 0;"><h3>🏥 يوم التوظيف الطبي</h3><p><strong>التاريخ:</strong> 5 يوليو 2024</p><p><strong>الوصف:</strong> فرص عمل للخريجين في القطاع الصحي</p><p><strong>المشاركون:</strong> أكثر من 30 مستشفى ومركز صحي</p></div>',
  '<h2>Upcoming Events</h2><div style="background: #f8f9fa; border-left: 4px solid #007bff; padding: 15px; margin: 10px 0;"><h3>📅 5th Annual Scientific Conference</h3><p><strong>Date:</strong> June 20-22, 2024</p><p><strong>Theme:</strong> "Innovation in Medical and Technological Education"</p><p><strong>Venue:</strong> Main Conference Hall</p></div><div style="background: #f8f9fa; border-left: 4px solid #28a745; padding: 15px; margin: 10px 0;"><h3>🏥 Medical Career Day</h3><p><strong>Date:</strong> July 5, 2024</p><p><strong>Description:</strong> Job opportunities for graduates in the health sector</p><p><strong>Participants:</strong> More than 30 hospitals and health centers</p></div>',
  'published',
  true,
  3,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'media-center'
ON CONFLICT (page_id, element_key) DO UPDATE SET
  content_ar = EXCLUDED.content_ar,
  content_en = EXCLUDED.content_en,
  updated_at = now(),
  updated_by = EXCLUDED.updated_by;

-- إثراء صفحة تواصل معنا
INSERT INTO admin_content_elements (
  page_id, element_key, element_type, content_ar, content_en, 
  status, is_active, display_order, created_by, updated_by
)
SELECT 
  p.id,
  'office_hours',
  'rich_text',
  '<h2>ساعات العمل</h2><ul><li><strong>الأحد - الخميس:</strong> 8:00 صباحاً - 4:00 مساءً</li><li><strong>الجمعة:</strong> 8:00 صباحاً - 12:00 ظهراً</li><li><strong>السبت:</strong> مغلق</li></ul><h3>قسم القبول والتسجيل</h3><ul><li><strong>الأحد - الخميس:</strong> 8:00 صباحاً - 3:00 مساءً</li><li>هاتف مباشر: +967-1-234567</li></ul>',
  '<h2>Office Hours</h2><ul><li><strong>Sunday - Thursday:</strong> 8:00 AM - 4:00 PM</li><li><strong>Friday:</strong> 8:00 AM - 12:00 PM</li><li><strong>Saturday:</strong> Closed</li></ul><h3>Admissions Office</h3><ul><li><strong>Sunday - Thursday:</strong> 8:00 AM - 3:00 PM</li><li>Direct Phone: +967-1-234567</li></ul>',
  'published',
  true,
  2,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'contact'
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
  'social_media',
  'rich_text',
  '<h2>تابعونا على وسائل التواصل الاجتماعي</h2><ul><li><strong>فيسبوك:</strong> <a href="#" style="color: #1877f2;">fb.com/AyloulCollege</a></li><li><strong>تويتر:</strong> <a href="#" style="color: #1da1f2;">@AyloulCollege</a></li><li><strong>إنستقرام:</strong> <a href="#" style="color: #e4405f;">@ayloul_college</a></li><li><strong>يوتيوب:</strong> <a href="#" style="color: #ff0000;">Ayloul University College</a></li><li><strong>لينكدإن:</strong> <a href="#" style="color: #0077b5;">Ayloul University College</a></li></ul>',
  '<h2>Follow Us on Social Media</h2><ul><li><strong>Facebook:</strong> <a href="#" style="color: #1877f2;">fb.com/AyloulCollege</a></li><li><strong>Twitter:</strong> <a href="#" style="color: #1da1f2;">@AyloulCollege</a></li><li><strong>Instagram:</strong> <a href="#" style="color: #e4405f;">@ayloul_college</a></li><li><strong>YouTube:</strong> <a href="#" style="color: #ff0000;">Ayloul University College</a></li><li><strong>LinkedIn:</strong> <a href="#" style="color: #0077b5;">Ayloul University College</a></li></ul>',
  'published',
  true,
  3,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'contact'
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
  'contact_form_section',
  'rich_text',
  '<h2>نموذج التواصل السريع</h2><p>للاستفسارات العامة، يرجى ملء النموذج أدناه وسنتواصل معكم خلال 24 ساعة:</p><div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0;"><p><strong>الاستفسارات الشائعة:</strong></p><ul><li>معلومات عن البرامج الأكاديمية</li><li>شروط القبول والتسجيل</li><li>الرسوم الدراسية والمنح</li><li>المرافق والخدمات</li><li>فرص العمل والتدريب</li></ul></div>',
  '<h2>Quick Contact Form</h2><p>For general inquiries, please fill out the form below and we will contact you within 24 hours:</p><div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0;"><p><strong>Common Inquiries:</strong></p><ul><li>Academic programs information</li><li>Admission requirements</li><li>Tuition fees and scholarships</li><li>Facilities and services</li><li>Employment and training opportunities</li></ul></div>',
  'published',
  true,
  4,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'contact'
ON CONFLICT (page_id, element_key) DO UPDATE SET
  content_ar = EXCLUDED.content_ar,
  content_en = EXCLUDED.content_en,
  updated_at = now(),
  updated_by = EXCLUDED.updated_by;

-- إثراء صفحة شؤون الطلاب
INSERT INTO admin_content_elements (
  page_id, element_key, element_type, content_ar, content_en, 
  status, is_active, display_order, created_by, updated_by
)
SELECT 
  p.id,
  'student_activities',
  'rich_text',
  '<h2>الأنشطة الطلابية</h2><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;"><div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;"><h3>🎭 الأنشطة الثقافية</h3><ul><li>المسرح الطلابي</li><li>النادي الأدبي</li><li>مسابقات الشعر والخطابة</li><li>المعارض الفنية</li></ul></div><div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;"><h3>⚽ الأنشطة الرياضية</h3><ul><li>كرة القدم</li><li>كرة السلة</li><li>كرة الطاولة</li><li>ألعاب القوى</li></ul></div><div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;"><h3>🔬 الأنشطة العلمية</h3><ul><li>نادي البحث العلمي</li><li>المختبرات التفاعلية</li><li>المؤتمرات الطلابية</li><li>المشاريع الابتكارية</li></ul></div><div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;"><h3>🤝 الأنشطة الاجتماعية</h3><ul><li>العمل التطوعي</li><li>الحملات التوعوية</li><li>زيارة دور الأيتام</li><li>البرامج البيئية</li></ul></div></div>',
  '<h2>Student Activities</h2><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;"><div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;"><h3>🎭 Cultural Activities</h3><ul><li>Student Theater</li><li>Literary Club</li><li>Poetry and Oratory Competitions</li><li>Art Exhibitions</li></ul></div><div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;"><h3>⚽ Sports Activities</h3><ul><li>Football</li><li>Basketball</li><li>Table Tennis</li><li>Athletics</li></ul></div><div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;"><h3>🔬 Scientific Activities</h3><ul><li>Research Club</li><li>Interactive Labs</li><li>Student Conferences</li><li>Innovation Projects</li></ul></div><div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;"><h3>🤝 Social Activities</h3><ul><li>Volunteer Work</li><li>Awareness Campaigns</li><li>Orphanage Visits</li><li>Environmental Programs</li></ul></div></div>',
  'published',
  true,
  2,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'student-affairs'
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
  'student_support_services',
  'rich_text',
  '<h2>خدمات الدعم الطلابي</h2><div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;"><h3>🎯 مركز الإرشاد الأكاديمي</h3><p>يقدم المركز خدمات الإرشاد والتوجيه للطلاب في جميع المراحل الأكاديمية</p><ul><li>التخطيط الأكاديمي الشخصي</li><li>حل المشكلات الأكاديمية</li><li>التوجيه المهني</li><li>ورش تطوير المهارات</li></ul></div><div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;"><h3>💰 المنح والمساعدات المالية</h3><p>برامج دعم مالي متنوعة للطلاب المتفوقين والمحتاجين</p><ul><li>منح التفوق الأكاديمي (خصم 50%)</li><li>منح الحاجة المالية (خصم 30%)</li><li>منح أبناء الشهداء (مجانية)</li><li>برنامج العمل الطلابي</li></ul></div>',
  '<h2>Student Support Services</h2><div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;"><h3>🎯 Academic Counseling Center</h3><p>The center provides counseling and guidance services to students at all academic levels</p><ul><li>Personal Academic Planning</li><li>Academic Problem Solving</li><li>Career Guidance</li><li>Skills Development Workshops</li></ul></div><div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;"><h3>💰 Scholarships and Financial Aid</h3><p>Various financial support programs for outstanding and needy students</p><ul><li>Academic Excellence Scholarships (50% discount)</li><li>Financial Need Scholarships (30% discount)</li><li>Martyrs' Children Scholarships (Free)</li><li>Student Work Program</li></ul></div>',
  'published',
  true,
  3,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'student-affairs'
ON CONFLICT (page_id, element_key) DO UPDATE SET
  content_ar = EXCLUDED.content_ar,
  content_en = EXCLUDED.content_en,
  updated_at = now(),
  updated_by = EXCLUDED.updated_by;