-- إنشاء صفحة الرئيسية والعناصر المطلوبة
INSERT INTO admin_content_pages (page_key, page_name_ar, page_name_en, description_ar, description_en, is_active) 
VALUES ('homepage', 'الصفحة الرئيسية', 'Homepage', 'عناصر الصفحة الرئيسية', 'Homepage elements', true)
ON CONFLICT (page_key) DO NOTHING;

-- إنشاء صفحة البرامج الأكاديمية
INSERT INTO admin_content_pages (page_key, page_name_ar, page_name_en, description_ar, description_en, is_active) 
VALUES ('programs', 'البرامج الأكاديمية', 'Academic Programs', 'عناصر صفحة البرامج الأكاديمية', 'Academic programs page elements', true)
ON CONFLICT (page_key) DO NOTHING;

-- الحصول على معرف صفحة الرئيسية
DO $$
DECLARE
    homepage_id UUID;
    programs_id UUID;
BEGIN
    -- الحصول على معرف الصفحة الرئيسية
    SELECT id INTO homepage_id FROM admin_content_pages WHERE page_key = 'homepage';
    
    -- الحصول على معرف صفحة البرامج
    SELECT id INTO programs_id FROM admin_content_pages WHERE page_key = 'programs';
    
    -- إدراج عناصر الصفحة الرئيسية
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active) VALUES
    -- عناصر الهيرو
    (homepage_id, 'hero_title', 'text', 'أهلاً بكم في كلية إيلول الجامعية', 'Welcome to Aylol University College', 'published', true),
    (homepage_id, 'hero_subtitle', 'rich_text', 'كلية رائدة في التعليم العالي والبحث العلمي، نسعى لإعداد كوادر مؤهلة تواكب متطلبات سوق العمل المحلي والإقليمي', 'A leading college in higher education and scientific research, we strive to prepare qualified personnel who meet the requirements of the local and regional job market', 'published', true),
    (homepage_id, 'hero_cta', 'text', 'ابدأ رحلتك التعليمية معنا', 'Start your educational journey with us', 'published', true),
    (homepage_id, 'hero_secondary_cta', 'text', 'استكشف برامجنا', 'Explore our programs', 'published', true),
    
    -- عناصر قسم عن الكلية
    (homepage_id, 'about_title', 'text', 'عن كلية إيلول', 'About Aylol College', 'published', true),
    (homepage_id, 'about_description', 'rich_text', 'تأسست كلية إيلول الجامعية بهدف تقديم تعليم عالي الجودة في مختلف التخصصات العلمية والإنسانية، وتتميز الكلية بكادرها التدريسي المتميز وبرامجها الأكاديمية المعتمدة', 'Aylol University College was founded with the goal of providing high-quality education in various scientific and humanities specializations, and the college is distinguished by its excellent teaching staff and accredited academic programs', 'published', true),
    
    -- عناصر الأخبار والفعاليات
    (homepage_id, 'news_title', 'text', 'آخر الأخبار', 'Latest News', 'published', true),
    (homepage_id, 'events_title', 'text', 'الفعاليات القادمة', 'Upcoming Events', 'published', true),
    (homepage_id, 'news_subtitle', 'rich_text', 'تابع أحدث الأخبار والفعاليات والإعلانات الهامة من كلية إيلول الجامعية', 'Follow the latest news, events and important announcements from Aylol University College', 'published', true),
    (homepage_id, 'news_view_all', 'text', 'عرض جميع الأخبار', 'View All News', 'published', true),
    (homepage_id, 'view_academic_calendar', 'text', 'عرض التقويم الأكاديمي', 'View Academic Calendar', 'published', true),
    
    -- عناصر الخدمات السريعة
    (homepage_id, 'quick_services_title', 'text', 'الخدمات السريعة', 'Quick Services', 'published', true),
    (homepage_id, 'quick_services_subtitle', 'rich_text', 'الوصول السريع للخدمات الأكاديمية والإدارية المختلفة', 'Quick access to various academic and administrative services', 'published', true),
    (homepage_id, 'additional_services_title', 'text', 'خدمات إضافية', 'Additional Services', 'published', true),
    (homepage_id, 'help_section_title', 'text', 'هل تحتاج مساعدة؟', 'Need Help?', 'published', true),
    (homepage_id, 'help_section_description', 'rich_text', 'فريق خدمة العملاء متاح للإجابة على استفساراتك وتقديم الدعم اللازم', 'Customer service team is available to answer your questions and provide necessary support', 'published', true),
    (homepage_id, 'help_contact_button', 'text', 'تواصل معنا الآن', 'Contact Us Now', 'published', true),
    (homepage_id, 'help_all_services_button', 'text', 'جميع الخدمات', 'All Services', 'published', true),
    (homepage_id, 'phone_number', 'text', '+967779553944', '+967779553944', 'published', true),
    (homepage_id, 'phone_description', 'text', 'خدمة العملاء - اضغط للاتصال', 'Customer Service - Click to Call', 'published', true),
    (homepage_id, 'email_address', 'text', 'aylolcollege@gmail.com', 'aylolcollege@gmail.com', 'published', true),
    (homepage_id, 'email_description', 'text', 'البريد الإلكتروني - اضغط للإرسال', 'Email - Click to Send', 'published', true),
    
    -- عناصر دعوة للعمل
    (homepage_id, 'cta_title', 'text', 'ابدأ رحلتك التعليمية معنا اليوم', 'Start your educational journey with us today', 'published', true),
    (homepage_id, 'cta_description', 'rich_text', 'انضم إلى مجتمع تعليمي متميز واحصل على تعليم عالي الجودة يؤهلك لسوق العمل', 'Join a distinguished educational community and get high-quality education that qualifies you for the job market', 'published', true),
    (homepage_id, 'cta_button_primary', 'text', 'تقدم للالتحاق الآن', 'Apply Now', 'published', true),
    (homepage_id, 'cta_button_secondary', 'text', 'استكشف برامجنا', 'Explore Our Programs', 'published', true)
    ON CONFLICT (page_id, element_key) DO UPDATE SET
        content_ar = EXCLUDED.content_ar,
        content_en = EXCLUDED.content_en,
        updated_at = CURRENT_TIMESTAMP;

    -- إدراج عناصر الخدمات السريعة
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active) VALUES
    -- خدمات رئيسية
    (homepage_id, 'service_student_portal_title', 'text', 'بوابة الطالب', 'Student Portal', 'published', true),
    (homepage_id, 'service_student_portal_description', 'text', 'الدخول إلى النظام الأكاديمي', 'Access to Academic System', 'published', true),
    (homepage_id, 'service_academic_calendar_title', 'text', 'التقويم الأكاديمي', 'Academic Calendar', 'published', true),
    (homepage_id, 'service_academic_calendar_description', 'text', 'مواعيد الفصول والامتحانات', 'Class and Exam Schedules', 'published', true),
    (homepage_id, 'service_campus_map_title', 'text', 'خريطة الحرم الجامعي', 'Campus Map', 'published', true),
    (homepage_id, 'service_campus_map_description', 'text', 'تعرف على مواقع المباني', 'Learn about building locations', 'published', true),
    (homepage_id, 'service_digital_library_title', 'text', 'المكتبة الرقمية', 'Digital Library', 'published', true),
    (homepage_id, 'service_digital_library_description', 'text', 'الوصول للكتب والمراجع', 'Access to books and references', 'published', true),
    (homepage_id, 'service_customer_service_title', 'text', 'خدمة العملاء', 'Customer Service', 'published', true),
    (homepage_id, 'service_customer_service_description', 'text', 'تواصل معنا مباشرة', 'Contact us directly', 'published', true),
    (homepage_id, 'service_email_title', 'text', 'البريد الإلكتروني', 'Email', 'published', true),
    (homepage_id, 'service_email_description', 'text', 'بريد الطلاب والموظفين', 'Student and staff email', 'published', true),
    
    -- خدمات إضافية
    (homepage_id, 'additional_service_student_forum_title', 'text', 'منتدى الطلاب', 'Student Forum', 'published', true),
    (homepage_id, 'additional_service_student_forum_description', 'text', 'التفاعل مع زملاء الدراسة', 'Interact with classmates', 'published', true),
    (homepage_id, 'additional_service_e_learning_title', 'text', 'نظام التعلم الإلكتروني', 'E-Learning System', 'published', true),
    (homepage_id, 'additional_service_e_learning_description', 'text', 'منصة التعلم عن بعد', 'Distance learning platform', 'published', true),
    (homepage_id, 'additional_service_study_groups_title', 'text', 'المجموعات الدراسية', 'Study Groups', 'published', true),
    (homepage_id, 'additional_service_study_groups_description', 'text', 'انضم للمجموعات الأكاديمية', 'Join academic groups', 'published', true),
    
    -- ميزات
    (homepage_id, 'feature_e_learning_title', 'text', 'التعلم الإلكتروني', 'E-Learning', 'published', true),
    (homepage_id, 'feature_e_learning_description', 'text', 'منصة تعليمية متقدمة', 'Advanced educational platform', 'published', true),
    (homepage_id, 'feature_achievements_title', 'text', 'الإنجازات', 'Achievements', 'published', true),
    (homepage_id, 'feature_achievements_description', 'text', 'تتبع إنجازاتك الأكاديمية', 'Track your academic achievements', 'published', true),
    (homepage_id, 'feature_training_title', 'text', 'التدريب العملي', 'Practical Training', 'published', true),
    (homepage_id, 'feature_training_description', 'text', 'فرص تدريب في الشركات', 'Training opportunities in companies', 'published', true)
    ON CONFLICT (page_id, element_key) DO UPDATE SET
        content_ar = EXCLUDED.content_ar,
        content_en = EXCLUDED.content_en,
        updated_at = CURRENT_TIMESTAMP;

    -- إدراج عناصر البرامج الأكاديمية
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active) VALUES
    (programs_id, 'section_title', 'text', 'برامجنا الأكاديمية', 'Our Academic Programs', 'published', true),
    (programs_id, 'section_description', 'rich_text', 'نقدم برامج أكاديمية متنوعة ومعتمدة تلبي احتياجات سوق العمل المحلي والإقليمي، مع التركيز على الجودة والتميز في التعليم العالي', 'We offer diverse and accredited academic programs that meet the needs of the local and regional job market, focusing on quality and excellence in higher education', 'published', true),
    (programs_id, 'cta_title', 'text', 'هل تريد معرفة المزيد عن برامجنا؟', 'Want to know more about our programs?', 'published', true),
    (programs_id, 'cta_description', 'rich_text', 'احصل على معلومات مفصلة عن متطلبات القبول والمناهج الدراسية', 'Get detailed information about admission requirements and curricula', 'published', true),
    (programs_id, 'cta_button', 'text', 'تحميل دليل البرامج الأكاديمية', 'Download Academic Programs Guide', 'published', true),
    
    -- برامج فردية
    (programs_id, 'pharmacy_name', 'text', 'الصيدلة', 'Pharmacy', 'published', true),
    (programs_id, 'pharmacy_name_en', 'text', 'Pharmacy', 'Pharmacy', 'published', true),
    (programs_id, 'pharmacy_description', 'rich_text', 'برنامج بكالوريوس الصيدلة يعد صيادلة مؤهلين للعمل في المجال الصيدلاني والصحي', 'Bachelor of Pharmacy program prepares qualified pharmacists to work in the pharmaceutical and health field', 'published', true),
    (programs_id, 'pharmacy_degree', 'text', 'بكالوريوس', 'Bachelor', 'published', true),
    (programs_id, 'pharmacy_duration', 'text', '5 سنوات', '5 years', 'published', true),
    (programs_id, 'pharmacy_cta_text', 'text', 'اعرف المزيد', 'Learn More', 'published', true),
    
    (programs_id, 'nursing_name', 'text', 'التمريض', 'Nursing', 'published', true),
    (programs_id, 'nursing_name_en', 'text', 'Nursing', 'Nursing', 'published', true),
    (programs_id, 'nursing_description', 'rich_text', 'برنامج بكالوريوس التمريض لإعداد ممرضين مهنيين لتقديم الرعاية الصحية', 'Bachelor of Nursing program to prepare professional nurses to provide healthcare', 'published', true),
    (programs_id, 'nursing_degree', 'text', 'بكالوريوس', 'Bachelor', 'published', true),
    (programs_id, 'nursing_duration', 'text', '4 سنوات', '4 years', 'published', true),
    (programs_id, 'nursing_cta_text', 'text', 'اعرف المزيد', 'Learn More', 'published', true),
    
    (programs_id, 'midwifery_name', 'text', 'القبالة', 'Midwifery', 'published', true),
    (programs_id, 'midwifery_name_en', 'text', 'Midwifery', 'Midwifery', 'published', true),
    (programs_id, 'midwifery_description', 'rich_text', 'برنامج بكالوريوس القبالة لإعداد قابلات قانونيات لرعاية الأمهات والأطفال', 'Bachelor of Midwifery program to prepare legal midwives for maternal and child care', 'published', true),
    (programs_id, 'midwifery_degree', 'text', 'بكالوريوس', 'Bachelor', 'published', true),
    (programs_id, 'midwifery_duration', 'text', '4 سنوات', '4 years', 'published', true),
    (programs_id, 'midwifery_cta_text', 'text', 'اعرف المزيد', 'Learn More', 'published', true),
    
    (programs_id, 'it_name', 'text', 'تكنولوجيا المعلومات', 'Information Technology', 'published', true),
    (programs_id, 'it_name_en', 'text', 'Information Technology', 'Information Technology', 'published', true),
    (programs_id, 'it_description', 'rich_text', 'برنامج بكالوريوس تكنولوجيا المعلومات لإعداد متخصصين في مجال التقنية', 'Bachelor of Information Technology program to prepare specialists in the field of technology', 'published', true),
    (programs_id, 'it_degree', 'text', 'بكالوريوس', 'Bachelor', 'published', true),
    (programs_id, 'it_duration', 'text', '4 سنوات', '4 years', 'published', true),
    (programs_id, 'it_cta_text', 'text', 'اعرف المزيد', 'Learn More', 'published', true),
    
    (programs_id, 'business_name', 'text', 'إدارة الأعمال', 'Business Administration', 'published', true),
    (programs_id, 'business_name_en', 'text', 'Business Administration', 'Business Administration', 'published', true),
    (programs_id, 'business_description', 'rich_text', 'برنامج بكالوريوس إدارة الأعمال لإعداد قادة وإداريين في مختلف المؤسسات', 'Bachelor of Business Administration program to prepare leaders and administrators in various institutions', 'published', true),
    (programs_id, 'business_degree', 'text', 'بكالوريوس', 'Bachelor', 'published', true),
    (programs_id, 'business_duration', 'text', '4 سنوات', '4 years', 'published', true),
    (programs_id, 'business_cta_text', 'text', 'اعرف المزيد', 'Learn More', 'published', true)
    ON CONFLICT (page_id, element_key) DO UPDATE SET
        content_ar = EXCLUDED.content_ar,
        content_en = EXCLUDED.content_en,
        updated_at = CURRENT_TIMESTAMP;

END $$;