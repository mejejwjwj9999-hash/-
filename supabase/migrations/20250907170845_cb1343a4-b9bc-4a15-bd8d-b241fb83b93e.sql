-- ===================================
-- رفع جميع محتويات الصفحات إلى قاعدة البيانات
-- ===================================

-- إنشاء الصفحات إذا لم تكن موجودة
INSERT INTO admin_content_pages (page_key, page_name_ar, page_name_en, description_ar, is_active)
VALUES 
    ('homepage', 'الصفحة الرئيسية', 'Homepage', 'الصفحة الرئيسية للكلية', true),
    ('about', 'حول الكلية', 'About College', 'معلومات عن كلية أيلول الجامعية', true),
    ('vision-mission', 'الرؤية والرسالة', 'Vision & Mission', 'رؤية ورسالة الكلية', true),
    ('history', 'تاريخ الكلية', 'College History', 'تاريخ تأسيس وتطور الكلية', true),
    ('accreditation', 'الاعتماد الأكاديمي', 'Academic Accreditation', 'معلومات الاعتماد الأكاديمي', true),
    ('pharmacy', 'كلية الصيدلة', 'Pharmacy College', 'معلومات عن كلية الصيدلة', true),
    ('nursing', 'كلية التمريض', 'Nursing College', 'معلومات عن كلية التمريض', true),
    ('midwifery', 'كلية القبالة', 'Midwifery College', 'معلومات عن كلية القبالة', true),
    ('information-technology', 'تكنولوجيا المعلومات', 'Information Technology', 'معلومات عن تخصص تكنولوجيا المعلومات', true),
    ('business-administration', 'إدارة الأعمال', 'Business Administration', 'معلومات عن تخصص إدارة الأعمال', true),
    ('academic-programs', 'البرامج الأكاديمية', 'Academic Programs', 'جميع البرامج الأكاديمية المتاحة', true),
    ('admissions', 'القبول والتسجيل', 'Admissions', 'معلومات القبول والتسجيل', true),
    ('student-life', 'شؤون الطلاب', 'Student Life', 'الخدمات والأنشطة الطلابية', true),
    ('student-affairs', 'الخدمات الطلابية', 'Student Affairs', 'الخدمات المقدمة للطلاب', true),
    ('media-center', 'المركز الإعلامي', 'Media Center', 'الأخبار والفعاليات', true),
    ('contact', 'تواصل معنا', 'Contact Us', 'معلومات الاتصال والتواصل', true)
ON CONFLICT (page_key) DO NOTHING;

-- ==============================================================
-- الصفحة الرئيسية - Homepage Elements
-- ==============================================================

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'hero_title', 'text', 'مرحباً بكم في كلية أيلول الجامعية', 'Welcome to Eylul University College', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'homepage'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'hero_subtitle', 'rich_text', '<p>صرح علمي حديث يقدم تعليماً عالي الجودة في التخصصات الطبية والتقنية والإدارية</p>', '<p>A modern academic institution providing high-quality education in medical, technical and administrative specializations</p>', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'homepage'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'hero_cta', 'text', 'ابدأ رحلتك الأكاديمية معنا', 'Start Your Academic Journey With Us', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'homepage'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'about_title', 'text', 'عن كلية أيلول', 'About Eylul College', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'homepage'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'about_content', 'rich_text', '<p>كلية أيلول الجامعية هي مؤسسة تعليمية حديثة تأسست في عام 2023 لتقديم تعليم عالي الجودة في مختلف التخصصات. نحن نلتزم بإعداد جيل مؤهل من الكوادر المتخصصة القادرة على المساهمة في التنمية والتطوير.</p>', '<p>Eylul University College is a modern educational institution founded in 2023 to provide high-quality education in various specializations. We are committed to preparing qualified specialized cadres capable of contributing to development and progress.</p>', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'homepage'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'programs_title', 'text', 'برامجنا الأكاديمية', 'Our Academic Programs', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'homepage'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'programs_subtitle', 'text', 'نقدم تخصصات متنوعة تلبي احتياجات سوق العمل المحلي والإقليمي', 'We offer diverse specializations that meet local and regional job market needs', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'homepage'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'news_title', 'text', 'آخر الأخبار', 'Latest News', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'homepage'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'events_title', 'text', 'الفعاليات القادمة', 'Upcoming Events', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'homepage'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'news_subtitle', 'rich_text', '<p>تابع أحدث الأخبار والفعاليات والإعلانات الهامة من كلية أيلول الجامعية</p>', '<p>Follow the latest news, events and important announcements from Eylul University College</p>', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'homepage'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

-- ==============================================================
-- صفحة حول الكلية - About Page
-- ==============================================================

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'page_title', 'text', 'عن كلية أيلول الجامعية', 'About Eylul University College', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'about'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'page_subtitle', 'text', 'كلية حديثة في التعليم العالي تسعى لإعداد جيل متميز من الكوادر المؤهلة في مختلف التخصصات الطبية والتقنية والإدارية', 'A modern higher education college that seeks to prepare a distinguished generation of qualified cadres in various medical, technical and administrative specializations', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'about'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'president_message', 'rich_text', 
'<p>أهلاً وسهلاً بكم في كلية أيلول الجامعية، صرحكم العلمي الحديث الذي يفتح أمامكم آفاق المستقبل المشرق.</p>
<p>تأسست كليتنا في عام 2023م لتكون منارة علم حديثة تواكب أحدث التطورات في التعليم العالي، ونحن نلتزم بتقديم تعليم عالي الجودة يواكب أحدث المعايير الأكاديمية العالمية.</p>
<p>رؤيتنا هي أن نكون من الكليات الرائدة في اليمن والمنطقة، ونحن نعمل جاهدين لتحقيق هذا الهدف من خلال الاستثمار في أعضاء هيئة التدريس المتميزين والمناهج المطورة والمرافق الحديثة.</p>', 
'<p>Welcome to Eylul University College, your modern academic institution that opens bright future horizons for you.</p>
<p>Our college was founded in 2023 to be a modern beacon of knowledge that keeps pace with the latest developments in higher education, and we are committed to providing high-quality education that keeps pace with the latest international academic standards.</p>
<p>Our vision is to be among the leading colleges in Yemen and the region, and we are working hard to achieve this goal by investing in distinguished faculty members, developed curricula and modern facilities.</p>', 
'published', true
FROM admin_content_pages p WHERE p.page_key = 'about'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

-- ==============================================================
-- صفحة الرؤية والرسالة - Vision Mission Page 
-- ==============================================================

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'page_title', 'text', 'الرؤية والرسالة', 'Vision & Mission', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'vision-mission'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'vision_content', 'rich_text', 
'<p>أن نكون كلية رائدة ومتميزة في التعليم العالي والبحث العلمي على المستوى المحلي والإقليمي، نساهم في إعداد كوادر مؤهلة قادرة على المنافسة في سوق العمل المحلي والعالمي.</p>
<p>نسعى لأن نكون المرجع الأول في التعليم التطبيقي والتخصصات النوعية التي تخدم احتياجات المجتمع اليمني والتنمية المستدامة في المنطقة.</p>', 
'<p>To be a leading and distinguished college in higher education and scientific research at the local and regional level, contributing to preparing qualified cadres capable of competing in local and global job markets.</p>
<p>We strive to be the first reference in applied education and qualitative specializations that serve the needs of Yemeni society and sustainable development in the region.</p>', 
'published', true
FROM admin_content_pages p WHERE p.page_key = 'vision-mission'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'mission_content', 'rich_text', 
'<p>تقديم تعليم عالي الجودة في التخصصات الطبية والتقنية والإدارية وفق أحدث المعايير الأكاديمية العالمية، وإجراء البحوث العلمية التطبيقية التي تساهم في حل مشكلات المجتمع.</p>
<p>خدمة المجتمع من خلال برامج التدريب والتطوير المهني والاستشارات التخصصية، وإعداد خريجين مبدعين وملتزمين بالقيم الأخلاقية والمهنية.</p>', 
'<p>Providing high-quality education in medical, technical and administrative specializations according to the latest international academic standards, and conducting applied scientific research that contributes to solving community problems.</p>
<p>Serving the community through training, professional development and specialized consulting programs, and preparing creative graduates committed to ethical and professional values.</p>', 
'published', true
FROM admin_content_pages p WHERE p.page_key = 'vision-mission'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

-- ==============================================================
-- صفحة كلية الصيدلة - Pharmacy Page
-- ==============================================================

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'page_title', 'text', 'كلية الصيدلة', 'College of Pharmacy', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'pharmacy'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'page_subtitle', 'text', 'برنامج بكالوريوس الصيدلة لإعداد صيادلة مؤهلين قادرين على خدمة المجتمع في مجال الرعاية الصحية', 'Bachelor of Pharmacy program to prepare qualified pharmacists capable of serving the community in healthcare', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'pharmacy'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'program_overview', 'rich_text', 
'<p>يهدف برنامج بكالوريوس الصيدلة في كلية أيلول الجامعية إلى إعداد صيادلة مؤهلين ومتخصصين قادرين على العمل في مختلف المجالات الصيدلانية والرعاية الصحية.</p>
<p>يركز البرنامج على تزويد الطلاب بالمعرفة النظرية والمهارات العملية اللازمة لممارسة مهنة الصيدلة بكفاءة واحترافية.</p>', 
'<p>The Bachelor of Pharmacy program at Eylul University College aims to prepare qualified and specialized pharmacists capable of working in various pharmaceutical and healthcare fields.</p>
<p>The program focuses on providing students with the theoretical knowledge and practical skills necessary to practice the pharmacy profession efficiently and professionally.</p>', 
'published', true
FROM admin_content_pages p WHERE p.page_key = 'pharmacy'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

-- ==============================================================
-- صفحة كلية التمريض - Nursing Page
-- ==============================================================

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'page_title', 'text', 'كلية التمريض', 'College of Nursing', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'nursing'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'page_subtitle', 'text', 'برنامج بكالوريوس التمريض لإعداد ممرضين وممرضات مؤهلين للعمل في مختلف المؤسسات الصحية', 'Bachelor of Nursing program to prepare qualified nurses to work in various healthcare institutions', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'nursing'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'program_overview', 'rich_text', 
'<p>يهدف برنامج بكالوريوس التمريض إلى إعداد ممرضين وممرضات متخصصين قادرين على تقديم رعاية تمريضية شاملة وعالية الجودة للمرضى في مختلف الأعمار والحالات الصحية.</p>
<p>يركز البرنامج على الجمع بين المعرفة النظرية والتطبيق العملي في بيئة تعليمية متطورة مجهزة بأحدث المعدات والتقنيات الطبية.</p>', 
'<p>The Bachelor of Nursing program aims to prepare specialized nurses capable of providing comprehensive and high-quality nursing care to patients of all ages and health conditions.</p>
<p>The program focuses on combining theoretical knowledge with practical application in an advanced educational environment equipped with the latest medical equipment and technologies.</p>', 
'published', true
FROM admin_content_pages p WHERE p.page_key = 'nursing'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

-- ==============================================================
-- صفحة كلية القبالة - Midwifery Page
-- ==============================================================

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'page_title', 'text', 'كلية القبالة', 'College of Midwifery', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'midwifery'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'page_subtitle', 'text', 'برنامج بكالوريوس القبالة لإعداد قابلات متخصصات في رعاية الأمومة والطفولة', 'Bachelor of Midwifery program to prepare specialized midwives in maternal and child care', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'midwifery'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'program_overview', 'rich_text', 
'<p>يهدف برنامج بكالوريوس القبالة إلى إعداد قابلات مؤهلات ومتخصصات في رعاية الأمومة والطفولة، قادرات على تقديم رعاية صحية شاملة للنساء أثناء فترات الحمل والولادة وما بعد الولادة.</p>
<p>يركز البرنامج على تطوير المهارات الضرورية لممارسة مهنة القبالة بأمان وكفاءة، مع التركيز على الجوانب الوقائية والعلاجية في صحة المرأة والطفل.</p>', 
'<p>The Bachelor of Midwifery program aims to prepare qualified midwives specialized in maternal and child care, capable of providing comprehensive healthcare to women during pregnancy, childbirth and postpartum periods.</p>
<p>The program focuses on developing necessary skills to practice midwifery safely and efficiently, with emphasis on preventive and therapeutic aspects of womens and childrens health.</p>', 
'published', true
FROM admin_content_pages p WHERE p.page_key = 'midwifery'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

-- ==============================================================
-- صفحة تكنولوجيا المعلومات - IT Page
-- ==============================================================

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'page_title', 'text', 'تكنولوجيا المعلومات', 'Information Technology', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'information-technology'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'page_subtitle', 'text', 'برنامج بكالوريوس تكنولوجيا المعلومات لإعداد متخصصين في مجال التقنية والبرمجة', 'Bachelor of Information Technology program to prepare specialists in technology and programming', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'information-technology'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'program_overview', 'rich_text', 
'<p>يهدف برنامج بكالوريوس تكنولوجيا المعلومات إلى إعداد متخصصين مؤهلين في مجال التكنولوجيا والحاسوب، قادرين على مواكبة التطورات التقنية الحديثة والمساهمة في التحول الرقمي.</p>
<p>يركز البرنامج على تطوير مهارات البرمجة وتطوير التطبيقات وإدارة قواعد البيانات وأمن المعلومات والذكاء الاصطناعي.</p>', 
'<p>The Bachelor of Information Technology program aims to prepare qualified specialists in technology and computing, capable of keeping pace with modern technological developments and contributing to digital transformation.</p>
<p>The program focuses on developing programming skills, application development, database management, information security and artificial intelligence.</p>', 
'published', true
FROM admin_content_pages p WHERE p.page_key = 'information-technology'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

-- ==============================================================
-- صفحة إدارة الأعمال - Business Administration Page
-- ==============================================================

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'page_title', 'text', 'إدارة الأعمال', 'Business Administration', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'business-administration'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'page_subtitle', 'text', 'برنامج بكالوريوس إدارة الأعمال لإعداد قادة وإداريين في مختلف المؤسسات', 'Bachelor of Business Administration program to prepare leaders and administrators in various institutions', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'business-administration'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'program_overview', 'rich_text', 
'<p>يهدف برنامج بكالوريوس إدارة الأعمال إلى إعداد قادة ومديرين مؤهلين قادرين على إدارة المؤسسات والشركات بكفاءة واحترافية عالية.</p>
<p>يركز البرنامج على تطوير مهارات الإدارة والقيادة والتسويق والمحاسبة والموارد البشرية والتخطيط الاستراتيجي.</p>', 
'<p>The Bachelor of Business Administration program aims to prepare qualified leaders and managers capable of managing institutions and companies efficiently and professionally.</p>
<p>The program focuses on developing management, leadership, marketing, accounting, human resources and strategic planning skills.</p>', 
'published', true
FROM admin_content_pages p WHERE p.page_key = 'business-administration'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

-- ==============================================================
-- صفحة القبول والتسجيل - Admissions Page
-- ==============================================================

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'page_title', 'text', 'القبول والتسجيل', 'Admissions & Registration', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'admissions'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'page_subtitle', 'text', 'معلومات شاملة حول شروط القبول وآليات التسجيل في كلية أيلول الجامعية', 'Comprehensive information about admission requirements and registration procedures at Eylul University College', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'admissions'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'admission_requirements', 'rich_text', 
'<h3>شروط القبول العامة:</h3>
<ul>
<li>• الحصول على شهادة الثانوية العامة أو ما يعادلها</li>
<li>• اجتياز اختبار القبول المحدد لكل تخصص</li>
<li>• تقديم المستندات المطلوبة كاملة</li>
<li>• اجتياز المقابلة الشخصية</li>
<li>• سداد الرسوم المقررة</li>
</ul>', 
'<h3>General Admission Requirements:</h3>
<ul>
<li>• High school certificate or equivalent</li>
<li>• Pass the entrance exam for each specialization</li>
<li>• Submit complete required documents</li>
<li>• Pass personal interview</li>
<li>• Pay prescribed fees</li>
</ul>', 
'published', true
FROM admin_content_pages p WHERE p.page_key = 'admissions'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

-- ==============================================================
-- صفحة شؤون الطلاب - Student Life Page
-- ==============================================================

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'page_title', 'text', 'شؤون الطلاب', 'Student Affairs', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'student-life'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'page_subtitle', 'text', 'الخدمات والأنشطة المتنوعة التي نقدمها لطلابنا لضمان تجربة جامعية متكاملة', 'Various services and activities we provide to our students to ensure a comprehensive university experience', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'student-life'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'student_services', 'rich_text', 
'<h3>الخدمات الطلابية:</h3>
<ul>
<li>• الإرشاد الأكاديمي والمهني</li>
<li>• الخدمات الصحية والنفسية</li>
<li>• المكتبة الرقمية والمراجع</li>
<li>• الأنشطة الثقافية والرياضية</li>
<li>• برامج التدريب والتطوير</li>
<li>• خدمات التوظيف ووضع الخريجين</li>
</ul>', 
'<h3>Student Services:</h3>
<ul>
<li>• Academic and career guidance</li>
<li>• Health and psychological services</li>
<li>• Digital library and references</li>
<li>• Cultural and sports activities</li>
<li>• Training and development programs</li>
<li>• Employment services and graduate placement</li>
</ul>', 
'published', true
FROM admin_content_pages p WHERE p.page_key = 'student-life'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

-- ==============================================================
-- صفحة المركز الإعلامي - Media Center Page
-- ==============================================================

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'page_title', 'text', 'المركز الإعلامي', 'Media Center', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'media-center'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'page_subtitle', 'text', 'تابع آخر أخبار وفعاليات وإنجازات كلية أيلول الجامعية', 'Follow the latest news, events and achievements of Eylul University College', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'media-center'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

-- ==============================================================
-- صفحة تواصل معنا - Contact Page
-- ==============================================================

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'page_title', 'text', 'تواصل معنا', 'Contact Us', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'contact'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'page_subtitle', 'text', 'نحن هنا للإجابة على جميع استفساراتكم ومساعدتكم في رحلتكم الأكاديمية', 'We are here to answer all your inquiries and assist you in your academic journey', 'published', true
FROM admin_content_pages p WHERE p.page_key = 'contact'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active)
SELECT p.id, 'contact_info', 'rich_text', 
'<h3>معلومات الاتصال:</h3>
<p><strong>العنوان:</strong> يريم - محافظة إب - الجمهورية اليمنية</p>
<p><strong>الهاتف:</strong> +967-1-234567</p>
<p><strong>البريد الإلكتروني:</strong> info@eylul.edu.ye</p>
<p><strong>ساعات العمل:</strong> السبت - الخميس: 8:00 ص - 4:00 م</p>', 
'<h3>Contact Information:</h3>
<p><strong>Address:</strong> Yarim - Ibb Governorate - Republic of Yemen</p>
<p><strong>Phone:</strong> +967-1-234567</p>
<p><strong>Email:</strong> info@eylul.edu.ye</p>
<p><strong>Working Hours:</strong> Saturday - Thursday: 8:00 AM - 4:00 PM</p>', 
'published', true
FROM admin_content_pages p WHERE p.page_key = 'contact'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, status = 'published';