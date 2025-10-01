-- إضافة بيانات تجريبية كاملة للاختبار
INSERT INTO public.dynamic_academic_programs (
  program_key, title_ar, title_en, description_ar, description_en,
  summary_ar, summary_en, icon_name, icon_color, background_color,
  featured_image, gallery, duration_years, credit_hours, degree_type,
  department_ar, department_en, college_ar, college_en,
  admission_requirements_ar, admission_requirements_en,
  career_opportunities_ar, career_opportunities_en,
  curriculum, contact_info, seo_settings,
  display_order, is_active, is_featured, has_page, page_template, metadata,
  faculty_members, yearly_curriculum, academic_requirements, general_requirements,
  program_statistics, career_opportunities_list, program_overview_ar, program_overview_en,
  student_count, published_at
) VALUES (
  'pharmacy',
  'كلية الصيدلة',
  'College of Pharmacy',
  'برنامج شامل لإعداد صيادلة مؤهلين قادرين على العمل في مختلف مجالات الصيدلة.',
  'Comprehensive program for preparing qualified pharmacists.',
  'إعداد صيادلة قادرين على تقديم رعاية دوائية آمنة وفعالة.',
  'Preparing pharmacists for safe and effective pharmaceutical care.',
  'Pill', '#3b82f6', '#f0f9ff',
  null,
  '[]'::jsonb,
  5, 168, 'bachelor',
  'قسم الصيدلة', 'Pharmacy Department',
  'كلية الصيدلة', 'College of Pharmacy',
  'شروط أكاديمية عامة للقبول في البرنامج', 'General academic requirements for admission',
  'فرص عمل متعددة في القطاعات المختلفة', 'Multiple career opportunities in various sectors',
  '[]'::jsonb,
  jsonb_build_object('email','pharmacy@univ.edu','phone','+970-2-1234567'),
  jsonb_build_object('title','Pharmacy Program','description','SEO description','keywords',jsonb_build_array('pharmacy','health')),
  1, true, true, true, 'default',
  jsonb_build_object('student_count',85),
  -- faculty_members
  jsonb_build_array(
    jsonb_build_object('id','fm-1','name_ar','د. أحمد محمد','position_ar','أستاذ','qualification_ar','دكتوراه في الصيدلة','specialization_ar','صيدلة سريرية','order',1),
    jsonb_build_object('id','fm-2','name_ar','د. ليلى حسن','position_ar','أستاذ مشارك','qualification_ar','ماجستير في علم الأدوية','specialization_ar','علم الأدوية','order',2)
  ),
  -- yearly_curriculum
  jsonb_build_array(
    jsonb_build_object('year_number',1,'year_name_ar','السنة الأولى','total_credit_hours',36,'subjects', jsonb_build_array(
      jsonb_build_object('id','c-101','code','PHAR101','name_ar','مقدمة في الصيدلة','credit_hours',3,'theory_hours',2,'practical_hours',1,'order',1),
      jsonb_build_object('id','c-102','code','CHEM101','name_ar','الكيمياء العامة','credit_hours',4,'theory_hours',3,'practical_hours',1,'order',2)
    )),
    jsonb_build_object('year_number',2,'year_name_ar','السنة الثانية','total_credit_hours',34,'subjects', jsonb_build_array(
      jsonb_build_object('id','c-201','code','PHAR201','name_ar','الكيمياء الدوائية','credit_hours',3,'theory_hours',2,'practical_hours',1,'order',1)
    ))
  ),
  -- academic_requirements
  jsonb_build_array(
    jsonb_build_object('id','ar-1','type','academic','requirement_ar','معدل ثانوية ≥ 85%','is_mandatory',true,'order',1),
    jsonb_build_object('id','ar-2','type','academic','requirement_ar','اجتياز امتحان القبول','is_mandatory',true,'order',2)
  ),
  -- general_requirements
  jsonb_build_array(
    jsonb_build_object('id','gr-1','type','general','requirement_ar','مقابلة شخصية','is_mandatory',true,'order',1),
    jsonb_build_object('id','gr-2','type','general','requirement_ar','فحص طبي','is_mandatory',false,'order',2)
  ),
  -- program_statistics
  jsonb_build_array(
    jsonb_build_object('label_ar','عدد الطلبة','value',85,'order',1),
    jsonb_build_object('label_ar','الساعات المعتمدة','value',168,'order',2),
    jsonb_build_object('label_ar','سنوات الدراسة','value',5,'order',3)
  ),
  -- career_opportunities_list
  jsonb_build_array(
    jsonb_build_object('id','co-1','title_ar','صيدلي سريري','description_ar','العمل في المستشفيات والمراكز الطبية','order',1),
    jsonb_build_object('id','co-2','title_ar','صيدلي صناعي','description_ar','العمل في شركات الأدوية','order',2)
  ),
  -- overview
  'نظرة عامة شاملة على برنامج كلية الصيدلة الذي يهدف إلى إعداد صيادلة مؤهلين...',
  'Comprehensive overview of the Pharmacy program that aims to prepare qualified pharmacists...',
  85,
  now()  -- منشور فوراً
);