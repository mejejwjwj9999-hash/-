-- إضافة الصفحات المفقودة في admin_content_pages
INSERT INTO admin_content_pages (page_key, page_name_ar, page_name_en, description_ar, description_en, is_active, display_order) VALUES
('services', 'الخدمات الطلابية', 'Student Services', 'صفحة الخدمات الطلابية المتنوعة', 'Student services page', true, 6),
('student-affairs', 'شؤون الطلاب', 'Student Affairs', 'صفحة شؤون الطلاب والأنشطة', 'Student affairs and activities page', true, 7)
ON CONFLICT (page_key) DO NOTHING;

-- الحصول على معرفات الصفحات
DO $$
DECLARE
    nursing_page_id UUID;
    pharmacy_page_id UUID;
    midwifery_page_id UUID;
    business_page_id UUID;
    it_page_id UUID;
    services_page_id UUID;
    student_affairs_page_id UUID;
BEGIN
    -- الحصول على معرفات الصفحات
    SELECT id INTO nursing_page_id FROM admin_content_pages WHERE page_key = 'nursing';
    SELECT id INTO pharmacy_page_id FROM admin_content_pages WHERE page_key = 'pharmacy';
    SELECT id INTO midwifery_page_id FROM admin_content_pages WHERE page_key = 'midwifery';
    SELECT id INTO business_page_id FROM admin_content_pages WHERE page_key = 'business-administration';
    SELECT id INTO it_page_id FROM admin_content_pages WHERE page_key = 'information-technology';
    SELECT id INTO services_page_id FROM admin_content_pages WHERE page_key = 'services';
    SELECT id INTO student_affairs_page_id FROM admin_content_pages WHERE page_key = 'student-affairs';

    -- إضافة عناصر التمريض
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order) VALUES
    (nursing_page_id, 'page_title', 'text', 'كلية التمريض', 'Nursing College', 'published', true, 1),
    (nursing_page_id, 'hero_description', 'rich_text', 'برنامج شامل ومتطور لإعداد ممرضين مؤهلين قادرين على تقديم رعاية تمريضية متميزة في مختلف المجالات الصحية', 'Comprehensive program to prepare qualified nurses capable of providing excellent nursing care', 'published', true, 2),
    (nursing_page_id, 'overview_title', 'text', 'نظرة عامة على البرنامج', 'Program Overview', 'published', true, 3),
    (nursing_page_id, 'overview_paragraph_1', 'rich_text', 'يهدف برنامج بكالوريوس التمريض في كلية أيلول الجامعية إلى إعداد ممرضين مؤهلين ومتخصصين قادرين على تقديم رعاية تمريضية شاملة وآمنة للمرضى في مختلف البيئات الصحية.', 'The Bachelor of Nursing program aims to prepare qualified and specialized nurses', 'published', true, 4),
    (nursing_page_id, 'duration_years', 'text', '4', '4', 'published', true, 5),
    (nursing_page_id, 'credit_hours', 'text', '132', '132', 'published', true, 6),
    (nursing_page_id, 'student_count', 'text', '95', '95', 'published', true, 7),
    (nursing_page_id, 'admission_title', 'text', 'شروط القبول', 'Admission Requirements', 'published', true, 8),
    (nursing_page_id, 'academic_requirements', 'rich_text', '<ul><li>شهادة الثانوية العامة (القسم العلمي) بنسبة لا تقل عن 70%</li><li>درجات جيدة في مواد الكيمياء والفيزياء والأحياء</li><li>اجتياز امتحان القبول في المواد العلمية</li></ul>', '<ul><li>High school diploma (Science track) with minimum 70%</li><li>Good grades in Chemistry, Physics and Biology</li></ul>', 'published', true, 9),
    (nursing_page_id, 'careers_title', 'text', 'الفرص المهنية', 'Career Opportunities', 'published', true, 10),
    (nursing_page_id, 'cta_title', 'text', 'ابدأ رحلتك المهنية معنا', 'Start Your Career Journey', 'published', true, 11),
    (nursing_page_id, 'cta_button', 'text', 'قدم طلبك الآن', 'Apply Now', 'published', true, 12)
    ON CONFLICT (page_id, element_key) DO NOTHING;

    -- إضافة عناصر الصيدلة
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order) VALUES
    (pharmacy_page_id, 'page_title', 'text', 'كلية الصيدلة', 'Pharmacy College', 'published', true, 1),
    (pharmacy_page_id, 'hero_description', 'rich_text', 'برنامج متميز لإعداد صيادلة مؤهلين في مختلف مجالات الصيدلة والعلوم الطبية', 'Excellence program to prepare qualified pharmacists in various pharmaceutical fields', 'published', true, 2),
    (pharmacy_page_id, 'overview_title', 'text', 'نظرة عامة على البرنامج', 'Program Overview', 'published', true, 3),
    (pharmacy_page_id, 'overview_paragraph_1', 'rich_text', 'يهدف برنامج بكالوريوس الصيدلة إلى إعداد صيادلة مؤهلين قادرين على ممارسة مهنة الصيدلة بكفاءة عالية في المستشفيات والصيدليات والمؤسسات الطبية.', 'The Bachelor of Pharmacy program aims to prepare qualified pharmacists', 'published', true, 4),
    (pharmacy_page_id, 'duration_years', 'text', '5', '5', 'published', true, 5),
    (pharmacy_page_id, 'credit_hours', 'text', '165', '165', 'published', true, 6),
    (pharmacy_page_id, 'student_count', 'text', '120', '120', 'published', true, 7),
    (pharmacy_page_id, 'admission_title', 'text', 'شروط القبول', 'Admission Requirements', 'published', true, 8),
    (pharmacy_page_id, 'careers_title', 'text', 'الفرص المهنية', 'Career Opportunities', 'published', true, 9),
    (pharmacy_page_id, 'cta_title', 'text', 'انضم إلى كلية الصيدلة', 'Join Pharmacy College', 'published', true, 10),
    (pharmacy_page_id, 'cta_button', 'text', 'قدم طلبك الآن', 'Apply Now', 'published', true, 11)
    ON CONFLICT (page_id, element_key) DO NOTHING;

    -- إضافة عناصر القبالة
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order) VALUES
    (midwifery_page_id, 'page_title', 'text', 'كلية القبالة', 'Midwifery College', 'published', true, 1),
    (midwifery_page_id, 'hero_description', 'rich_text', 'برنامج تخصصي لإعداد قابلات مؤهلات لتقديم رعاية شاملة للأمهات والأطفال', 'Specialized program to prepare qualified midwives for comprehensive maternal and child care', 'published', true, 2),
    (midwifery_page_id, 'overview_title', 'text', 'نظرة عامة على البرنامج', 'Program Overview', 'published', true, 3),
    (midwifery_page_id, 'overview_paragraph_1', 'rich_text', 'يهدف برنامج بكالوريوس القبالة إلى إعداد قابلات مؤهلات قادرات على تقديم رعاية تخصصية للأمهات والمواليد.', 'The Bachelor of Midwifery program aims to prepare qualified midwives', 'published', true, 4),
    (midwifery_page_id, 'duration_years', 'text', '4', '4', 'published', true, 5),
    (midwifery_page_id, 'credit_hours', 'text', '128', '128', 'published', true, 6),
    (midwifery_page_id, 'student_count', 'text', '65', '65', 'published', true, 7),
    (midwifery_page_id, 'admission_title', 'text', 'شروط القبول', 'Admission Requirements', 'published', true, 8),
    (midwifery_page_id, 'careers_title', 'text', 'الفرص المهنية', 'Career Opportunities', 'published', true, 9),
    (midwifery_page_id, 'cta_title', 'text', 'انضمي إلى كلية القبالة', 'Join Midwifery College', 'published', true, 10),
    (midwifery_page_id, 'cta_button', 'text', 'قدمي طلبك الآن', 'Apply Now', 'published', true, 11)
    ON CONFLICT (page_id, element_key) DO NOTHING;

    -- إضافة عناصر إدارة الأعمال
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order) VALUES
    (business_page_id, 'page_title', 'text', 'كلية إدارة الأعمال', 'Business Administration College', 'published', true, 1),
    (business_page_id, 'hero_description', 'rich_text', 'برنامج شامل لإعداد قادة الأعمال والمديرين المؤهلين في عالم الأعمال الحديث', 'Comprehensive program to prepare business leaders and qualified managers', 'published', true, 2),
    (business_page_id, 'overview_title', 'text', 'نظرة عامة على البرنامج', 'Program Overview', 'published', true, 3),
    (business_page_id, 'overview_paragraph_1', 'rich_text', 'يهدف برنامج بكالوريوس إدارة الأعمال إلى إعداد خريجين مؤهلين في مختلف مجالات الإدارة والأعمال.', 'The Bachelor of Business Administration program aims to prepare qualified graduates', 'published', true, 4),
    (business_page_id, 'duration_years', 'text', '4', '4', 'published', true, 5),
    (business_page_id, 'credit_hours', 'text', '128', '128', 'published', true, 6),
    (business_page_id, 'student_count', 'text', '200', '200', 'published', true, 7),
    (business_page_id, 'admission_title', 'text', 'شروط القبول', 'Admission Requirements', 'published', true, 8),
    (business_page_id, 'careers_title', 'text', 'الفرص المهنية', 'Career Opportunities', 'published', true, 9),
    (business_page_id, 'cta_title', 'text', 'ابدأ مسيرتك في الأعمال', 'Start Your Business Career', 'published', true, 10),
    (business_page_id, 'cta_button', 'text', 'قدم طلبك الآن', 'Apply Now', 'published', true, 11)
    ON CONFLICT (page_id, element_key) DO NOTHING;

    -- إضافة عناصر تقنية المعلومات
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order) VALUES
    (it_page_id, 'page_title', 'text', 'كلية تقنية المعلومات', 'Information Technology College', 'published', true, 1),
    (it_page_id, 'hero_description', 'rich_text', 'برنامج حديث لإعداد متخصصين في تقنية المعلومات والحوسبة', 'Modern program to prepare IT and computing specialists', 'published', true, 2),
    (it_page_id, 'overview_title', 'text', 'نظرة عامة على البرنامج', 'Program Overview', 'published', true, 3),
    (it_page_id, 'overview_paragraph_1', 'rich_text', 'يهدف برنامج بكالوريوس تقنية المعلومات إلى إعداد متخصصين مؤهلين في مجال التكنولوجيا والحاسوب.', 'The Bachelor of IT program aims to prepare qualified technology specialists', 'published', true, 4),
    (it_page_id, 'duration_years', 'text', '4', '4', 'published', true, 5),
    (it_page_id, 'credit_hours', 'text', '132', '132', 'published', true, 6),
    (it_page_id, 'student_count', 'text', '150', '150', 'published', true, 7),
    (it_page_id, 'admission_title', 'text', 'شروط القبول', 'Admission Requirements', 'published', true, 8),
    (it_page_id, 'careers_title', 'text', 'الفرص المهنية', 'Career Opportunities', 'published', true, 9),
    (it_page_id, 'cta_title', 'text', 'انضم إلى عالم التقنية', 'Join the Tech World', 'published', true, 10),
    (it_page_id, 'cta_button', 'text', 'قدم طلبك الآن', 'Apply Now', 'published', true, 11)
    ON CONFLICT (page_id, element_key) DO NOTHING;

    -- إضافة عناصر الخدمات الطلابية
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order) VALUES
    (services_page_id, 'page_title', 'text', 'الخدمات الطلابية', 'Student Services', 'published', true, 1),
    (services_page_id, 'hero_description', 'rich_text', 'مجموعة شاملة من الخدمات المصممة لدعم الطلاب أكاديمياً وشخصياً', 'Comprehensive services designed to support students academically and personally', 'published', true, 2),
    (services_page_id, 'overview_title', 'text', 'خدماتنا الطلابية', 'Our Student Services', 'published', true, 3),
    (services_page_id, 'overview_paragraph_1', 'rich_text', 'نوفر في كلية أيلول الجامعية مجموعة متكاملة من الخدمات الطلابية التي تهدف إلى دعم الطلاب في رحلتهم الأكاديمية.', 'We provide comprehensive student services to support students in their academic journey', 'published', true, 4),
    (services_page_id, 'services_list_title', 'text', 'الخدمات المتاحة', 'Available Services', 'published', true, 5),
    (services_page_id, 'academic_services', 'rich_text', '<ul><li>الإرشاد الأكاديمي</li><li>خدمات المكتبة</li><li>المختبرات والمعامل</li></ul>', '<ul><li>Academic Advising</li><li>Library Services</li><li>Labs and Facilities</li></ul>', 'published', true, 6),
    (services_page_id, 'student_support', 'rich_text', '<ul><li>الدعم النفسي والاجتماعي</li><li>الخدمات الصحية</li><li>المساعدات المالية</li></ul>', '<ul><li>Psychological Support</li><li>Health Services</li><li>Financial Aid</li></ul>', 'published', true, 7),
    (services_page_id, 'contact_info', 'rich_text', 'للاستفسار عن الخدمات: هاتف 123456789 | بريد إلكتروني: services@college.edu', 'For inquiries: Phone 123456789 | Email: services@college.edu', 'published', true, 8)
    ON CONFLICT (page_id, element_key) DO NOTHING;

    -- إضافة عناصر شؤون الطلاب
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order) VALUES
    (student_affairs_page_id, 'page_title', 'text', 'شؤون الطلاب', 'Student Affairs', 'published', true, 1),
    (student_affairs_page_id, 'hero_description', 'rich_text', 'قسم شؤون الطلاب يهتم بجميع الأنشطة والفعاليات الطلابية والخدمات الإدارية', 'Student Affairs department manages all student activities, events and administrative services', 'published', true, 2),
    (student_affairs_page_id, 'overview_title', 'text', 'مهام شؤون الطلاب', 'Student Affairs Functions', 'published', true, 3),
    (student_affairs_page_id, 'overview_paragraph_1', 'rich_text', 'يهدف قسم شؤون الطلاب إلى توفير بيئة جامعية محفزة ومساندة للطلاب في جميع جوانب حياتهم الجامعية.', 'Student Affairs aims to provide a stimulating and supportive university environment', 'published', true, 4),
    (student_affairs_page_id, 'activities_title', 'text', 'الأنشطة والفعاليات', 'Activities and Events', 'published', true, 5),
    (student_affairs_page_id, 'activities_list', 'rich_text', '<ul><li>الأنشطة الثقافية والعلمية</li><li>الفعاليات الرياضية</li><li>الرحلات العلمية</li><li>المعارض والمؤتمرات</li></ul>', '<ul><li>Cultural Activities</li><li>Sports Events</li><li>Scientific Trips</li><li>Exhibitions and Conferences</li></ul>', 'published', true, 6),
    (student_affairs_page_id, 'services_title', 'text', 'الخدمات الإدارية', 'Administrative Services', 'published', true, 7),
    (student_affairs_page_id, 'services_list', 'rich_text', '<ul><li>إصدار الوثائق والشهادات</li><li>متابعة الحضور والغياب</li><li>تنظيم الامتحانات</li><li>معالجة الشكاوى والاقتراحات</li></ul>', '<ul><li>Document Issuance</li><li>Attendance Tracking</li><li>Exam Organization</li><li>Complaints and Suggestions</li></ul>', 'published', true, 8),
    (student_affairs_page_id, 'contact_info', 'rich_text', 'مكتب شؤون الطلاب | الطابق الثاني | هاتف: 987654321', 'Student Affairs Office | Second Floor | Phone: 987654321', 'published', true, 9)
    ON CONFLICT (page_id, element_key) DO NOTHING;

END $$;