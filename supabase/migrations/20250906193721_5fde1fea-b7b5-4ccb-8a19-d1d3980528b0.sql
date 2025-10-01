-- إنشاء الصفحات المطلوبة في قاعدة البيانات
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
('contact', 'تواصل معنا', 'Contact Us', 'صفحة معلومات التواصل', true, 10),
('homepage', 'الصفحة الرئيسية', 'Homepage', 'الصفحة الرئيسية للموقع', true, 11);

-- إنشاء المحتوى للصفحة الرئيسية
DO $$
DECLARE
    homepage_id uuid;
BEGIN
    SELECT id INTO homepage_id FROM admin_content_pages WHERE page_key = 'homepage';
    
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order) VALUES
    (homepage_id, 'hero_title', 'text', 'أهلاً بكم في كلية إيلول الجامعية', 'Welcome to Eylul University College', 'published', true, 1),
    (homepage_id, 'hero_subtitle', 'rich_text', 'كلية رائدة في التعليم العالي والبحث العلمي، نسعى لإعداد كوادر مؤهلة تواكب متطلبات سوق العمل المحلي والإقليمي', 'A leading college in higher education and scientific research, we strive to prepare qualified cadres that keep pace with local and regional labor market requirements', 'published', true, 2),
    (homepage_id, 'hero_cta', 'text', 'ابدأ رحلتك التعليمية معنا', 'Start Your Educational Journey With Us', 'published', true, 3),
    (homepage_id, 'about_title', 'text', 'عن كلية إيلول', 'About Eylul College', 'published', true, 4),
    (homepage_id, 'about_description', 'rich_text', 'تأسست كلية إيلول الجامعية بهدف تقديم تعليم عالي الجودة في مختلف التخصصات العلمية والإنسانية، وتتميز الكلية بكادرها التدريسي المتميز وبرامجها الأكاديمية المعتمدة', 'Eylul University College was established with the aim of providing high-quality education in various scientific and humanities disciplines, and the college is distinguished by its distinguished teaching staff and accredited academic programs', 'published', true, 5);
END $$;

-- إنشاء محتوى صفحة الرؤية والرسالة
DO $$
DECLARE
    vision_id uuid;
BEGIN
    SELECT id INTO vision_id FROM admin_content_pages WHERE page_key = 'vision-mission';
    
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order) VALUES
    (vision_id, 'page_title', 'text', 'رؤيتنا ورسالتنا', 'Our Vision & Mission', 'published', true, 1),
    (vision_id, 'vision_title', 'text', 'رؤيتنا', 'Our Vision', 'published', true, 2),
    (vision_id, 'vision_content', 'rich_text', 'أن نكون كلية رائدة في التعليم العالي والبحث العلمي على المستوى المحلي والإقليمي، ونسعى لتحقيق التميز في إعداد الخريجين المؤهلين والمبدعين القادرين على المنافسة في سوق العمل', 'To be a leading college in higher education and scientific research at the local and regional levels, and we strive to achieve excellence in preparing qualified and creative graduates capable of competing in the job market', 'published', true, 3),
    (vision_id, 'mission_title', 'text', 'رسالتنا', 'Our Mission', 'published', true, 4),
    (vision_id, 'mission_content', 'rich_text', 'تقديم برامج تعليمية متميزة ومعتمدة في مختلف التخصصات، وإجراء البحوث العلمية التطبيقية التي تخدم المجتمع، وتنمية قدرات الطلاب العلمية والعملية والإبداعية', 'Providing distinguished and accredited educational programs in various disciplines, conducting applied scientific research that serves society, and developing students'' scientific, practical and creative capabilities', 'published', true, 5);
END $$;

-- إنشاء محتوى صفحة تاريخ الكلية
DO $$
DECLARE
    history_id uuid;
BEGIN
    SELECT id INTO history_id FROM admin_content_pages WHERE page_key = 'history';
    
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order) VALUES
    (history_id, 'page_title', 'text', 'تاريخ كلية إيلول', 'History of Eylul College', 'published', true, 1),
    (history_id, 'founding_title', 'text', 'التأسيس والنشأة', 'Foundation & Establishment', 'published', true, 2),
    (history_id, 'founding_content', 'rich_text', 'تأسست كلية إيلول الجامعية في عام 2010 كمؤسسة تعليمية رائدة تهدف إلى تقديم تعليم عالي الجودة في مختلف التخصصات العلمية والإنسانية', 'Eylul University College was established in 2010 as a leading educational institution aimed at providing high-quality education in various scientific and humanities disciplines', 'published', true, 3),
    (history_id, 'development_title', 'text', 'التطور والإنجازات', 'Development & Achievements', 'published', true, 4),
    (history_id, 'development_content', 'rich_text', 'منذ تأسيسها، شهدت الكلية تطوراً مستمراً في برامجها الأكاديمية ومرافقها التعليمية، وحصلت على الاعتماد الأكاديمي من وزارة التعليم العالي', 'Since its establishment, the college has witnessed continuous development in its academic programs and educational facilities, and has obtained academic accreditation from the Ministry of Higher Education', 'published', true, 5);
END $$;

-- إنشاء محتوى صفحة الاعتماد
DO $$
DECLARE
    accred_id uuid;
BEGIN
    SELECT id INTO accred_id FROM admin_content_pages WHERE page_key = 'accreditation';
    
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order) VALUES
    (accred_id, 'page_title', 'text', 'الاعتماد الأكاديمي', 'Academic Accreditation', 'published', true, 1),
    (accred_id, 'accreditation_content', 'rich_text', 'حصلت كلية إيلول على الاعتماد الأكاديمي من وزارة التعليم العالي والبحث العلمي، وتخضع جميع برامجها الأكاديمية للمراجعة والتقييم المستمر لضمان جودة التعليم', 'Eylul College has obtained academic accreditation from the Ministry of Higher Education and Scientific Research, and all its academic programs are subject to continuous review and evaluation to ensure the quality of education', 'published', true, 2);
END $$;

-- إنشاء محتوى صفحة الصيدلة
DO $$
DECLARE
    pharmacy_id uuid;
BEGIN
    SELECT id INTO pharmacy_id FROM admin_content_pages WHERE page_key = 'pharmacy';
    
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order) VALUES
    (pharmacy_id, 'page_title', 'text', 'كلية الصيدلة', 'College of Pharmacy', 'published', true, 1),
    (pharmacy_id, 'description', 'rich_text', 'يهدف برنامج بكالوريوس الصيدلة إلى إعداد صيادلة مؤهلين ومتخصصين قادرين على العمل في مختلف مجالات الصيدلة والرعاية الصحية', 'The Bachelor of Pharmacy program aims to prepare qualified and specialized pharmacists capable of working in various fields of pharmacy and healthcare', 'published', true, 2),
    (pharmacy_id, 'duration', 'text', '5 سنوات', '5 years', 'published', true, 3),
    (pharmacy_id, 'degree', 'text', 'بكالوريوس الصيدلة', 'Bachelor of Pharmacy', 'published', true, 4);
END $$;

-- إنشاء محتوى صفحة التمريض
DO $$
DECLARE
    nursing_id uuid;
BEGIN
    SELECT id INTO nursing_id FROM admin_content_pages WHERE page_key = 'nursing';
    
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order) VALUES
    (nursing_id, 'page_title', 'text', 'كلية التمريض', 'College of Nursing', 'published', true, 1),
    (nursing_id, 'description', 'rich_text', 'يهدف برنامج بكالوريوس التمريض إلى إعداد ممرضين مهنيين مؤهلين لتقديم الرعاية التمريضية الشاملة في مختلف مؤسسات الرعاية الصحية', 'The Bachelor of Nursing program aims to prepare qualified professional nurses to provide comprehensive nursing care in various healthcare institutions', 'published', true, 2),
    (nursing_id, 'duration', 'text', '4 سنوات', '4 years', 'published', true, 3),
    (nursing_id, 'degree', 'text', 'بكالوريوس التمريض', 'Bachelor of Nursing', 'published', true, 4);
END $$;

-- إنشاء محتوى صفحة القبالة
DO $$
DECLARE
    midwifery_id uuid;
BEGIN
    SELECT id INTO midwifery_id FROM admin_content_pages WHERE page_key = 'midwifery';
    
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order) VALUES
    (midwifery_id, 'page_title', 'text', 'كلية القبالة', 'College of Midwifery', 'published', true, 1),
    (midwifery_id, 'description', 'rich_text', 'يهدف برنامج بكالوريوس القبالة إلى إعداد قابلات قانونيات مؤهلات لتقديم الرعاية المتخصصة للأمهات والأطفال', 'The Bachelor of Midwifery program aims to prepare qualified legal midwives to provide specialized care for mothers and children', 'published', true, 2),
    (midwifery_id, 'duration', 'text', '4 سنوات', '4 years', 'published', true, 3),
    (midwifery_id, 'degree', 'text', 'بكالوريوس القبالة', 'Bachelor of Midwifery', 'published', true, 4);
END $$;

-- إنشاء محتوى صفحة تكنولوجيا المعلومات
DO $$
DECLARE
    it_id uuid;
BEGIN
    SELECT id INTO it_id FROM admin_content_pages WHERE page_key = 'information-technology';
    
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order) VALUES
    (it_id, 'page_title', 'text', 'كلية تكنولوجيا المعلومات', 'College of Information Technology', 'published', true, 1),
    (it_id, 'description', 'rich_text', 'يهدف برنامج بكالوريوس تكنولوجيا المعلومات إلى إعداد متخصصين في مجال التقنية والحاسوب قادرين على مواكبة التطورات التكنولوجية', 'The Bachelor of Information Technology program aims to prepare specialists in the field of technology and computers capable of keeping pace with technological developments', 'published', true, 2),
    (it_id, 'duration', 'text', '4 سنوات', '4 years', 'published', true, 3),
    (it_id, 'degree', 'text', 'بكالوريوس تكنولوجيا المعلومات', 'Bachelor of Information Technology', 'published', true, 4);
END $$;

-- إنشاء محتوى صفحة إدارة الأعمال
DO $$
DECLARE
    business_id uuid;
BEGIN
    SELECT id INTO business_id FROM admin_content_pages WHERE page_key = 'business-administration';
    
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order) VALUES
    (business_id, 'page_title', 'text', 'كلية إدارة الأعمال', 'College of Business Administration', 'published', true, 1),
    (business_id, 'description', 'rich_text', 'يهدف برنامج بكالوريوس إدارة الأعمال إلى إعداد قادة وإداريين مؤهلين للعمل في مختلف المؤسسات الحكومية والخاصة', 'The Bachelor of Business Administration program aims to prepare qualified leaders and administrators to work in various government and private institutions', 'published', true, 2),
    (business_id, 'duration', 'text', '4 سنوات', '4 years', 'published', true, 3),
    (business_id, 'degree', 'text', 'بكالوريوس إدارة الأعمال', 'Bachelor of Business Administration', 'published', true, 4);
END $$;

-- إنشاء محتوى صفحة القبول
DO $$
DECLARE
    admissions_id uuid;
BEGIN
    SELECT id INTO admissions_id FROM admin_content_pages WHERE page_key = 'admissions';
    
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order) VALUES
    (admissions_id, 'page_title', 'text', 'القبول والتسجيل', 'Admissions & Registration', 'published', true, 1),
    (admissions_id, 'requirements_title', 'text', 'شروط القبول', 'Admission Requirements', 'published', true, 2),
    (admissions_id, 'requirements_content', 'rich_text', 'الحصول على شهادة الثانوية العامة أو ما يعادلها بمعدل لا يقل عن 70%، واجتياز المقابلة الشخصية والامتحان التحريري للتخصصات التي تتطلب ذلك', 'Obtaining a high school diploma or equivalent with a grade not less than 70%, and passing the personal interview and written examination for specializations that require it', 'published', true, 3),
    (admissions_id, 'documents_title', 'text', 'الوثائق المطلوبة', 'Required Documents', 'published', true, 4),
    (admissions_id, 'documents_content', 'rich_text', 'صورة عن شهادة الثانوية العامة مصدقة، صورة شخصية، صورة عن الهوية الشخصية، استمارة طلب الالتحاق معبأة ومعتمدة', 'Certified copy of high school diploma, personal photo, copy of personal ID, completed and approved enrollment application form', 'published', true, 5);
END $$;

-- إنشاء محتوى صفحة الاتصال
DO $$
DECLARE
    contact_id uuid;
BEGIN
    SELECT id INTO contact_id FROM admin_content_pages WHERE page_key = 'contact';
    
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order) VALUES
    (contact_id, 'page_title', 'text', 'تواصل معنا', 'Contact Us', 'published', true, 1),
    (contact_id, 'address_title', 'text', 'العنوان', 'Address', 'published', true, 2),
    (contact_id, 'address_content', 'text', 'صنعاء - اليمن', 'Sana''a - Yemen', 'published', true, 3),
    (contact_id, 'phone_title', 'text', 'الهاتف', 'Phone', 'published', true, 4),
    (contact_id, 'phone_content', 'text', '+967 1 234567', '+967 1 234567', 'published', true, 5),
    (contact_id, 'email_title', 'text', 'البريد الإلكتروني', 'Email', 'published', true, 6),
    (contact_id, 'email_content', 'text', 'info@eylul.edu.ye', 'info@eylul.edu.ye', 'published', true, 7);
END $$;