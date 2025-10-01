-- إضافة الصفحات المفقودة
INSERT INTO admin_content_pages (page_key, page_name_ar, page_name_en, description_ar, description_en, is_active) 
VALUES 
('student-services', 'الخدمات الطلابية', 'Student Services', 'صفحة الخدمات الطلابية والأنشطة', 'Student services and activities page', true),
('vision-mission', 'الرؤية والرسالة', 'Vision & Mission', 'رؤية ورسالة الكلية', 'College vision and mission', true),
('college-history', 'تاريخ الكلية', 'College History', 'تاريخ تأسيس وتطور الكلية', 'History and development of the college', true),
('pharmacy', 'كلية الصيدلة', 'Faculty of Pharmacy', 'معلومات عن كلية الصيدلة', 'Information about Faculty of Pharmacy', true),
('nursing', 'كلية التمريض', 'Faculty of Nursing', 'معلومات عن كلية التمريض', 'Information about Faculty of Nursing', true),
('midwifery', 'كلية القبالة', 'Faculty of Midwifery', 'معلومات عن كلية القبالة', 'Information about Faculty of Midwifery', true),
('information-technology', 'تكنولوجيا المعلومات', 'Information Technology', 'برنامج تكنولوجيا المعلومات', 'Information Technology program', true),
('business-administration', 'إدارة الأعمال', 'Business Administration', 'برنامج إدارة الأعمال', 'Business Administration program', true)
ON CONFLICT (page_key) DO NOTHING;

-- إضافة البرامج الأكاديمية
INSERT INTO admin_academic_programs (
  program_code, name_ar, name_en, department_ar, department_en, 
  description_ar, description_en, degree_type, duration_years, credit_hours,
  admission_requirements_ar, admission_requirements_en,
  career_opportunities_ar, career_opportunities_en,
  status, is_featured, display_order, created_by, updated_by
) VALUES 
(
  'PHARM', 'الصيدلة', 'Pharmacy', 'الكليات الطبية', 'Medical Faculties',
  'برنامج الصيدلة يهدف إلى إعداد الطلاب لمهنة الصيدلة والعمل في القطاع الصحي',
  'The Pharmacy program aims to prepare students for the pharmacy profession and work in the healthcare sector',
  'bachelor', 5, 160,
  'شهادة الثانوية العامة القسم العلمي بمعدل لا يقل عن 85%',
  'High school diploma (Scientific section) with minimum 85% grade',
  'العمل في الصيدليات، المستشفيات، شركات الأدوية، والبحث العلمي',
  'Work in pharmacies, hospitals, pharmaceutical companies, and scientific research',
  'published', true, 1, auth.uid(), auth.uid()
),
(
  'NURS', 'التمريض', 'Nursing', 'الكليات الطبية', 'Medical Faculties',
  'برنامج التمريض يهدف إلى إعداد ممرضين مؤهلين للعمل في المجال الصحي',
  'The Nursing program aims to prepare qualified nurses to work in the healthcare field',
  'bachelor', 4, 132,
  'شهادة الثانوية العامة القسم العلمي بمعدل لا يقل عن 75%',
  'High school diploma (Scientific section) with minimum 75% grade',
  'العمل في المستشفيات، المراكز الصحية، والرعاية المنزلية',
  'Work in hospitals, health centers, and home care',
  'published', true, 2, auth.uid(), auth.uid()
),
(
  'MIDW', 'القبالة', 'Midwifery', 'الكليات الطبية', 'Medical Faculties',
  'برنامج القبالة يهدف إلى إعداد قابلات مؤهلات لرعاية الأمهات والأطفال',
  'The Midwifery program aims to prepare qualified midwives for maternal and child care',
  'bachelor', 4, 132,
  'شهادة الثانوية العامة القسم العلمي بمعدل لا يقل عن 70%',
  'High school diploma (Scientific section) with minimum 70% grade',
  'العمل في المستشفيات، مراكز الأمومة والطفولة، والعيادات النسائية',
  'Work in hospitals, maternal and child centers, and gynecological clinics',
  'published', true, 3, auth.uid(), auth.uid()
),
(
  'IT', 'تكنولوجيا المعلومات', 'Information Technology', 'كلية التكنولوجيا والعلوم', 'Faculty of Technology and Sciences',
  'برنامج تكنولوجيا المعلومات يهدف إلى إعداد متخصصين في مجال التكنولوجيا',
  'The Information Technology program aims to prepare specialists in the field of technology',
  'bachelor', 4, 132,
  'شهادة الثانوية العامة بمعدل لا يقل عن 70%',
  'High school diploma with minimum 70% grade',
  'العمل في شركات التكنولوجيا، البنوك، والمؤسسات الحكومية',
  'Work in technology companies, banks, and government institutions',
  'published', true, 4, auth.uid(), auth.uid()
),
(
  'BA', 'إدارة الأعمال', 'Business Administration', 'كلية الإدارة والعلوم الإنسانية', 'Faculty of Management and Humanities',
  'برنامج إدارة الأعمال يهدف إلى إعداد قادة ومديرين مؤهلين',
  'The Business Administration program aims to prepare qualified leaders and managers',
  'bachelor', 4, 132,
  'شهادة الثانوية العامة بمعدل لا يقل عن 65%',
  'High school diploma with minimum 65% grade',
  'العمل في الشركات، البنوك، المؤسسات التجارية، وريادة الأعمال',
  'Work in companies, banks, commercial institutions, and entrepreneurship',
  'published', true, 5, auth.uid(), auth.uid()
);

-- إضافة محتويات الصفحة الرئيسية
INSERT INTO admin_content_elements (
  page_id, element_key, element_type, content_ar, content_en, 
  status, is_active, display_order, created_by, updated_by
)
SELECT 
  p.id,
  'hero_title',
  'text',
  'مرحباً بكم في كلية إيلول الجامعية',
  'Welcome to Ayloul University College',
  'published',
  true,
  1,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'homepage'
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
  'hero_subtitle',
  'text',
  'التميز في التعليم العالي والبحث العلمي',
  'Excellence in Higher Education and Scientific Research',
  'published',
  true,
  2,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'homepage'
ON CONFLICT (page_id, element_key) DO UPDATE SET
  content_ar = EXCLUDED.content_ar,
  content_en = EXCLUDED.content_en,
  updated_at = now(),
  updated_by = EXCLUDED.updated_by;

-- محتويات صفحة حول الكلية
INSERT INTO admin_content_elements (
  page_id, element_key, element_type, content_ar, content_en, 
  status, is_active, display_order, created_by, updated_by
)
SELECT 
  p.id,
  'history_section',
  'rich_text',
  '<h2>تاريخ الكلية</h2><p>تأسست كلية إيلول الجامعية عام 2010 كمؤسسة تعليمية رائدة في مجال التعليم العالي. بدأت الكلية بهدف تقديم تعليم عالي الجودة يواكب المعايير الدولية ويلبي احتياجات السوق المحلي والإقليمي.</p><p>منذ تأسيسها، حققت الكلية نمواً مستمراً وتطوراً ملحوظاً في برامجها الأكاديمية ومرافقها التعليمية، حيث تضم اليوم أكثر من 5 تخصصات متنوعة في المجالات الطبية والتكنولوجية والإدارية.</p>',
  '<h2>College History</h2><p>Ayloul University College was established in 2010 as a leading educational institution in higher education. The college began with the goal of providing high-quality education that meets international standards and serves local and regional market needs.</p><p>Since its establishment, the college has achieved continuous growth and remarkable development in its academic programs and educational facilities, now comprising more than 5 diverse specializations in medical, technological, and administrative fields.</p>',
  'published',
  true,
  3,
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
  'facilities_section',
  'rich_text',
  '<h2>المرافق والتجهيزات</h2><p>تضم الكلية مرافق تعليمية حديثة تشمل:</p><ul><li>قاعات دراسية مجهزة بأحدث التقنيات</li><li>مختبرات علمية متطورة</li><li>مكتبة شاملة تحتوي على آلاف المراجع</li><li>مراكز حاسوب متقدمة</li><li>قاعات مؤتمرات وورش عمل</li><li>مرافق رياضية وترفيهية</li></ul>',
  '<h2>Facilities and Equipment</h2><p>The college includes modern educational facilities including:</p><ul><li>Classrooms equipped with the latest technologies</li><li>Advanced scientific laboratories</li><li>Comprehensive library with thousands of references</li><li>Advanced computer centers</li><li>Conference halls and workshops</li><li>Sports and recreational facilities</li></ul>',
  'published',
  true,
  4,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'about'
ON CONFLICT (page_id, element_key) DO UPDATE SET
  content_ar = EXCLUDED.content_ar,
  content_en = EXCLUDED.content_en,
  updated_at = now(),
  updated_by = EXCLUDED.updated_by;

-- محتويات صفحة الرؤية والرسالة
INSERT INTO admin_content_elements (
  page_id, element_key, element_type, content_ar, content_en, 
  status, is_active, display_order, created_by, updated_by
)
SELECT 
  p.id,
  'vision_content',
  'rich_text',
  '<h2>رؤيتنا</h2><p>أن نكون مؤسسة تعليمية رائدة في المنطقة، تتميز بجودة التعليم والبحث العلمي، وتساهم في بناء مجتمع المعرفة وتنمية الكوادر المؤهلة القادرة على المنافسة محلياً وإقليمياً وعالمياً.</p>',
  '<h2>Our Vision</h2><p>To be a leading educational institution in the region, distinguished by quality education and scientific research, contributing to building a knowledge society and developing qualified personnel capable of competing locally, regionally, and globally.</p>',
  'published',
  true,
  1,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'vision-mission'
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
  'mission_content',
  'rich_text',
  '<h2>رسالتنا</h2><p>تقديم تعليم عالي الجودة في مختلف التخصصات العلمية والإنسانية، وإجراء البحوث العلمية المتميزة، وخدمة المجتمع من خلال:</p><ul><li>توفير برامج أكاديمية معتمدة تواكب التطورات العالمية</li><li>إعداد خريجين مؤهلين ومتميزين</li><li>تطوير البحث العلمي والإبداع</li><li>بناء شراكات مع القطاعين العام والخاص</li><li>المساهمة في التنمية المستدامة للمجتمع</li></ul>',
  '<h2>Our Mission</h2><p>Providing high-quality education in various scientific and humanities disciplines, conducting distinguished scientific research, and serving the community through:</p><ul><li>Providing accredited academic programs that keep pace with global developments</li><li>Preparing qualified and distinguished graduates</li><li>Developing scientific research and creativity</li><li>Building partnerships with public and private sectors</li><li>Contributing to sustainable community development</li></ul>',
  'published',
  true,
  2,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'vision-mission'
ON CONFLICT (page_id, element_key) DO UPDATE SET
  content_ar = EXCLUDED.content_ar,
  content_en = EXCLUDED.content_en,
  updated_at = now(),
  updated_by = EXCLUDED.updated_by;

-- محتويات صفحة الاعتماد الأكاديمي
INSERT INTO admin_content_elements (
  page_id, element_key, element_type, content_ar, content_en, 
  status, is_active, display_order, created_by, updated_by
)
SELECT 
  p.id,
  'accreditation_intro',
  'rich_text',
  '<h2>الاعتماد الأكاديمي</h2><p>تحرص كلية إيلول الجامعية على الحصول على الاعتماد الأكاديمي من الجهات المختصة محلياً وإقليمياً، مما يضمن جودة التعليم ومعادلة الشهادات.</p>',
  '<h2>Academic Accreditation</h2><p>Ayloul University College is committed to obtaining academic accreditation from competent authorities locally and regionally, ensuring quality education and degree equivalency.</p>',
  'published',
  true,
  1,
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
  'accreditation_bodies',
  'rich_text',
  '<h3>جهات الاعتماد</h3><ul><li>وزارة التعليم العالي والبحث العلمي - الجمهورية اليمنية</li><li>اتحاد الجامعات العربية</li><li>منظمة الصحة العالمية (للتخصصات الطبية)</li><li>الاتحاد الدولي للصيادلة (FIP)</li></ul>',
  '<h3>Accrediting Bodies</h3><ul><li>Ministry of Higher Education and Scientific Research - Republic of Yemen</li><li>Association of Arab Universities</li><li>World Health Organization (for medical specializations)</li><li>International Pharmaceutical Federation (FIP)</li></ul>',
  'published',
  true,
  2,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'accreditation'
ON CONFLICT (page_id, element_key) DO UPDATE SET
  content_ar = EXCLUDED.content_ar,
  content_en = EXCLUDED.content_en,
  updated_at = now(),
  updated_by = EXCLUDED.updated_by;

-- محتويات صفحة القبول والتسجيل
INSERT INTO admin_content_elements (
  page_id, element_key, element_type, content_ar, content_en, 
  status, is_active, display_order, created_by, updated_by
)
SELECT 
  p.id,
  'admission_requirements',
  'rich_text',
  '<h2>شروط القبول العامة</h2><ul><li>شهادة الثانوية العامة أو ما يعادلها</li><li>اجتياز امتحان القبول (إن وجد)</li><li>استيفاء الشروط الخاصة بكل تخصص</li><li>تقديم الوثائق المطلوبة مصدقة</li><li>دفع رسوم التسجيل</li></ul>',
  '<h2>General Admission Requirements</h2><ul><li>High school diploma or equivalent</li><li>Pass entrance exam (if applicable)</li><li>Meet specific requirements for each specialization</li><li>Submit required certified documents</li><li>Pay registration fees</li></ul>',
  'published',
  true,
  1,
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
  'required_documents',
  'rich_text',
  '<h3>الوثائق المطلوبة</h3><ul><li>شهادة الثانوية العامة الأصلية</li><li>كشف درجات الثانوية العامة</li><li>صورة شخصية حديثة</li><li>صورة من الهوية الشخصية</li><li>شهادة حسن سيرة وسلوك</li><li>شهادة طبية</li></ul>',
  '<h3>Required Documents</h3><ul><li>Original high school certificate</li><li>High school transcript</li><li>Recent personal photo</li><li>Copy of personal ID</li><li>Good conduct certificate</li><li>Medical certificate</li></ul>',
  'published',
  true,
  2,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'admissions'
ON CONFLICT (page_id, element_key) DO UPDATE SET
  content_ar = EXCLUDED.content_ar,
  content_en = EXCLUDED.content_en,
  updated_at = now(),
  updated_by = EXCLUDED.updated_by;

-- محتويات صفحة المركز الإعلامي
INSERT INTO admin_content_elements (
  page_id, element_key, element_type, content_ar, content_en, 
  status, is_active, display_order, created_by, updated_by
)
SELECT 
  p.id,
  'media_center_intro',
  'rich_text',
  '<h2>المركز الإعلامي</h2><p>يهدف المركز الإعلامي في كلية إيلول إلى نقل أنشطة وأخبار الكلية للمجتمع الأكاديمي والمحلي، وتوفير المعلومات الدقيقة حول برامج الكلية وأنشطتها المختلفة.</p>',
  '<h2>Media Center</h2><p>The Media Center at Ayloul College aims to communicate the college''s activities and news to the academic and local community, providing accurate information about the college''s programs and various activities.</p>',
  'published',
  true,
  1,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'media-center'
ON CONFLICT (page_id, element_key) DO UPDATE SET
  content_ar = EXCLUDED.content_ar,
  content_en = EXCLUDED.content_en,
  updated_at = now(),
  updated_by = EXCLUDED.updated_by;

-- محتويات صفحة تواصل معنا
INSERT INTO admin_content_elements (
  page_id, element_key, element_type, content_ar, content_en, 
  status, is_active, display_order, created_by, updated_by
)
SELECT 
  p.id,
  'contact_info',
  'rich_text',
  '<h2>معلومات التواصل</h2><p><strong>العنوان:</strong> صنعاء - اليمن</p><p><strong>هاتف:</strong> +967-1-123456</p><p><strong>بريد إلكتروني:</strong> info@ayloul.edu.ye</p><p><strong>موقع الويب:</strong> www.ayloul.edu.ye</p>',
  '<h2>Contact Information</h2><p><strong>Address:</strong> Sana''a - Yemen</p><p><strong>Phone:</strong> +967-1-123456</p><p><strong>Email:</strong> info@ayloul.edu.ye</p><p><strong>Website:</strong> www.ayloul.edu.ye</p>',
  'published',
  true,
  1,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'contact'
ON CONFLICT (page_id, element_key) DO UPDATE SET
  content_ar = EXCLUDED.content_ar,
  content_en = EXCLUDED.content_en,
  updated_at = now(),
  updated_by = EXCLUDED.updated_by;

-- محتويات صفحة البرامج الأكاديمية
INSERT INTO admin_content_elements (
  page_id, element_key, element_type, content_ar, content_en, 
  status, is_active, display_order, created_by, updated_by
)
SELECT 
  p.id,
  'programs_intro',
  'rich_text',
  '<h2>البرامج الأكاديمية</h2><p>تقدم كلية إيلول الجامعية مجموعة متنوعة من البرامج الأكاديمية المعتمدة في مختلف التخصصات، مصممة لتلبية احتياجات سوق العمل وتطوير قدرات الطلاب.</p>',
  '<h2>Academic Programs</h2><p>Ayloul University College offers a diverse range of accredited academic programs in various disciplines, designed to meet labor market needs and develop student capabilities.</p>',
  'published',
  true,
  1,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'academic-programs'
ON CONFLICT (page_id, element_key) DO UPDATE SET
  content_ar = EXCLUDED.content_ar,
  content_en = EXCLUDED.content_en,
  updated_at = now(),
  updated_by = EXCLUDED.updated_by;

-- محتويات صفحة الخدمات الطلابية
INSERT INTO admin_content_elements (
  page_id, element_key, element_type, content_ar, content_en, 
  status, is_active, display_order, created_by, updated_by
)
SELECT 
  p.id,
  'services_intro',
  'rich_text',
  '<h2>الخدمات الطلابية</h2><p>تقدم كلية إيلول مجموعة شاملة من الخدمات الطلابية لدعم الطلاب أكاديمياً واجتماعياً ونفسياً.</p>',
  '<h2>Student Services</h2><p>Ayloul College provides a comprehensive range of student services to support students academically, socially, and psychologically.</p>',
  'published',
  true,
  1,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'student-services'
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
  'services_list',
  'rich_text',
  '<h3>خدماتنا تشمل:</h3><ul><li>الإرشاد الأكاديمي</li><li>الدعم النفسي والاجتماعي</li><li>الأنشطة الطلابية والثقافية</li><li>الخدمات الصحية</li><li>المنح والمساعدات المالية</li><li>التدريب والتطوير المهني</li><li>خدمات المكتبة الإلكترونية</li><li>النشاطات الرياضية</li></ul>',
  '<h3>Our services include:</h3><ul><li>Academic counseling</li><li>Psychological and social support</li><li>Student and cultural activities</li><li>Health services</li><li>Scholarships and financial aid</li><li>Training and professional development</li><li>Electronic library services</li><li>Sports activities</li></ul>',
  'published',
  true,
  2,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'student-services'
ON CONFLICT (page_id, element_key) DO UPDATE SET
  content_ar = EXCLUDED.content_ar,
  content_en = EXCLUDED.content_en,
  updated_at = now(),
  updated_by = EXCLUDED.updated_by;

-- محتويات صفحة شؤون الطلاب
INSERT INTO admin_content_elements (
  page_id, element_key, element_type, content_ar, content_en, 
  status, is_active, display_order, created_by, updated_by
)
SELECT 
  p.id,
  'student_affairs_intro',
  'rich_text',
  '<h2>شؤون الطلاب</h2><p>تهتم دائرة شؤون الطلاب بجميع الأمور المتعلقة بالطلاب من التسجيل حتى التخرج، وتوفر الدعم اللازم لضمان نجاحهم الأكاديمي.</p>',
  '<h2>Student Affairs</h2><p>The Student Affairs Department handles all student-related matters from registration to graduation, providing necessary support to ensure their academic success.</p>',
  'published',
  true,
  1,
  auth.uid(),
  auth.uid()
FROM admin_content_pages p WHERE p.page_key = 'student-affairs'
ON CONFLICT (page_id, element_key) DO UPDATE SET
  content_ar = EXCLUDED.content_ar,
  content_en = EXCLUDED.content_en,
  updated_at = now(),
  updated_by = EXCLUDED.updated_by;