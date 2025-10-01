-- إنشاء البرامج الأكاديمية المفقودة مع بيانات حقيقية شاملة

-- برنامج تقنية المعلومات
INSERT INTO dynamic_academic_programs (
  program_key,
  title_ar,
  title_en,
  description_ar,
  description_en,
  summary_ar,
  summary_en,
  icon_name,
  icon_color,
  background_color,
  featured_image,
  gallery,
  duration_years,
  credit_hours,
  degree_type,
  department_ar,
  department_en,
  college_ar,
  college_en,
  admission_requirements_ar,
  admission_requirements_en,
  career_opportunities_ar,
  career_opportunities_en,
  curriculum,
  contact_info,
  seo_settings,
  display_order,
  is_active,
  is_featured,
  has_page,
  page_template,
  metadata,
  published_at,
  faculty_members,
  yearly_curriculum,
  academic_requirements,
  general_requirements,
  program_statistics,
  career_opportunities_list,
  program_overview_ar,
  program_overview_en,
  student_count
) VALUES (
  'it',
  'برنامج تقنية المعلومات',
  'Information Technology Program',
  'يهدف برنامج بكالوريوس تقنية المعلومات في كلية أيلول الجامعية إلى إعداد خريجين مؤهلين في مجال تقنية المعلومات والحاسوب، قادرين على مواكبة التطورات التكنولوجية الحديثة والمساهمة في التحول الرقمي في اليمن والمنطقة.',
  'The Information Technology program at Ayloul University College aims to prepare qualified graduates in the field of information technology and computers.',
  'برنامج شامل لإعداد متخصصين في تقنية المعلومات وعلوم الحاسوب',
  'Comprehensive program for IT and computer science specialists',
  'monitor',
  '#3b82f6',
  '#eff6ff',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
  '[]'::jsonb,
  4,
  132,
  'bachelor',
  'قسم العلوم التقنية والحاسوب',
  'Department of Technical Sciences and Computer',
  'كلية الحاسوب',
  'College of Computer Science',
  'معدل ثانوية لا يقل عن 80% في التخصص العلمي',
  'High school average of at least 80% in scientific specialization',
  'مطور برمجيات، محلل أنظمة، مهندس شبكات، أخصائي أمن المعلومات',
  'Software developer, systems analyst, network engineer, information security specialist',
  '[]'::jsonb,
  '{"email": "it@ayloul.edu.ye", "phone": "+967-1-234567", "office": "مبنى كلية الحاسوب - الطابق الثاني"}'::jsonb,
  '{"title": "برنامج تقنية المعلومات", "keywords": ["تقنية المعلومات", "حاسوب", "برمجة"], "description": "برنامج بكالوريوس تقنية المعلومات"}'::jsonb,
  2,
  true,
  true,
  true,
  'standard',
  '{"student_count": 120}'::jsonb,
  now(),
  '[
    {
      "id": "it-fm-1",
      "name_ar": "د. أحمد محمد الشامي",
      "name_en": "Dr. Ahmed Mohammed Al-Shami",
      "position_ar": "أستاذ دكتور",
      "position_en": "Professor",
      "qualification_ar": "دكتوراه في علوم الحاسوب",
      "qualification_en": "PhD in Computer Science",
      "specialization_ar": "هندسة البرمجيات",
      "specialization_en": "Software Engineering",
      "email": "a.shami@ayloul.edu.ye",
      "order": 1
    },
    {
      "id": "it-fm-2",
      "name_ar": "د. فاطمة علي الزهراني",
      "name_en": "Dr. Fatima Ali Al-Zahrani",
      "position_ar": "أستاذ مشارك",
      "position_en": "Associate Professor",
      "qualification_ar": "دكتوراه في أمن المعلومات",
      "qualification_en": "PhD in Information Security",
      "specialization_ar": "أمن المعلومات والشبكات",
      "specialization_en": "Information Security and Networks",
      "email": "f.zahrani@ayloul.edu.ye",
      "order": 2
    }
  ]'::jsonb,
  '[
    {
      "year_number": 1,
      "year_name_ar": "السنة الأولى",
      "year_name_en": "First Year",
      "total_credit_hours": 32,
      "subjects": [
        {
          "id": "it-101",
          "code": "IT101",
          "name_ar": "مقدمة في الحاسوب",
          "name_en": "Introduction to Computer",
          "credit_hours": 3,
          "theory_hours": 2,
          "practical_hours": 1,
          "order": 1
        },
        {
          "id": "it-102",
          "code": "MATH101",
          "name_ar": "الرياضيات المتقطعة",
          "name_en": "Discrete Mathematics",
          "credit_hours": 3,
          "theory_hours": 3,
          "practical_hours": 0,
          "order": 2
        }
      ]
    },
    {
      "year_number": 2,
      "year_name_ar": "السنة الثانية",
      "year_name_en": "Second Year",
      "total_credit_hours": 34,
      "subjects": [
        {
          "id": "it-201",
          "code": "IT201",
          "name_ar": "البرمجة الكينونية",
          "name_en": "Object-Oriented Programming",
          "credit_hours": 4,
          "theory_hours": 3,
          "practical_hours": 1,
          "order": 1
        }
      ]
    }
  ]'::jsonb,
  '[
    {
      "id": "it-ar-1",
      "type": "academic",
      "requirement_ar": "معدل ثانوية عامة لا يقل عن 80%",
      "requirement_en": "High school GPA of at least 80%",
      "is_mandatory": true,
      "order": 1
    },
    {
      "id": "it-ar-2",
      "type": "academic",
      "requirement_ar": "اجتياز امتحان القبول في الرياضيات والفيزياء",
      "requirement_en": "Pass entrance exam in mathematics and physics",
      "is_mandatory": true,
      "order": 2
    }
  ]'::jsonb,
  '[
    {
      "id": "it-gr-1",
      "type": "general",
      "requirement_ar": "مقابلة شخصية",
      "requirement_en": "Personal interview",
      "is_mandatory": true,
      "order": 1
    },
    {
      "id": "it-gr-2",
      "type": "general",
      "requirement_ar": "فحص طبي شامل",
      "requirement_en": "Comprehensive medical examination",
      "is_mandatory": false,
      "order": 2
    }
  ]'::jsonb,
  '[
    {
      "id": "it-stat-1",
      "label_ar": "عدد الطلبة",
      "label_en": "Number of Students",
      "value": 120,
      "icon_name": "users",
      "order": 1
    },
    {
      "id": "it-stat-2",
      "label_ar": "الساعات المعتمدة",
      "label_en": "Credit Hours",
      "value": 132,
      "icon_name": "clock",
      "order": 2
    },
    {
      "id": "it-stat-3",
      "label_ar": "سنوات الدراسة",
      "label_en": "Years of Study",
      "value": 4,
      "icon_name": "calendar",
      "order": 3
    }
  ]'::jsonb,
  '[
    {
      "id": "it-co-1",
      "title_ar": "مطور برمجيات",
      "title_en": "Software Developer",
      "description_ar": "تطوير التطبيقات والأنظمة البرمجية",
      "description_en": "Developing applications and software systems",
      "sector": "تقنية المعلومات",
      "order": 1
    },
    {
      "id": "it-co-2",
      "title_ar": "مهندس شبكات",
      "title_en": "Network Engineer",
      "description_ar": "تصميم وإدارة الشبكات والبنية التحتية",
      "description_en": "Designing and managing networks and infrastructure",
      "sector": "الاتصالات",
      "order": 2
    }
  ]'::jsonb,
  '<p>يهدف برنامج بكالوريوس تقنية المعلومات في كلية أيلول الجامعية إلى إعداد خريجين مؤهلين ومتميزين في مجال تقنية المعلومات والحاسوب، قادرين على مواكبة التطورات التكنولوجية الحديثة والمساهمة الفعالة في التحول الرقمي.</p>',
  '<p>The Information Technology program at Ayloul University College aims to prepare qualified and distinguished graduates in the field of information technology and computers.</p>',
  120
);

-- برنامج إدارة الأعمال
INSERT INTO dynamic_academic_programs (
  program_key,
  title_ar,
  title_en,
  description_ar,
  description_en,
  summary_ar,
  summary_en,
  icon_name,
  icon_color,
  background_color,
  featured_image,
  gallery,
  duration_years,
  credit_hours,
  degree_type,
  department_ar,
  department_en,
  college_ar,
  college_en,
  admission_requirements_ar,
  admission_requirements_en,
  career_opportunities_ar,
  career_opportunities_en,
  curriculum,
  contact_info,
  seo_settings,
  display_order,
  is_active,
  is_featured,
  has_page,
  page_template,
  metadata,
  published_at,
  faculty_members,
  yearly_curriculum,
  academic_requirements,
  general_requirements,
  program_statistics,
  career_opportunities_list,
  program_overview_ar,
  program_overview_en,
  student_count
) VALUES (
  'business',
  'برنامج إدارة الأعمال',
  'Business Administration Program',
  'يهدف برنامج بكالوريوس إدارة الأعمال إلى إعداد قادة المستقبل في عالم الأعمال، وتزويدهم بالمعرفة والمهارات اللازمة لإدارة المؤسسات بكفاءة وفعالية في بيئة الأعمال المتغيرة.',
  'The Business Administration program aims to prepare future leaders in the business world.',
  'برنامج شامل لإعداد قادة الأعمال والإدارة الحديثة',
  'Comprehensive program for business leaders and modern management',
  'briefcase',
  '#059669',
  '#ecfdf5',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
  '[]'::jsonb,
  4,
  128,
  'bachelor',
  'قسم الإدارة والعلوم الإنسانية',
  'Department of Management and Humanities',
  'كلية الإدارة والأعمال',
  'College of Management and Business',
  'معدل ثانوية لا يقل عن 75% في أي تخصص',
  'High school average of at least 75% in any specialization',
  'مدير عام، محلل مالي، مستشار إداري، رائد أعمال',
  'General manager, financial analyst, management consultant, entrepreneur',
  '[]'::jsonb,
  '{"email": "business@ayloul.edu.ye", "phone": "+967-1-234568", "office": "مبنى كلية الإدارة - الطابق الأول"}'::jsonb,
  '{"title": "برنامج إدارة الأعمال", "keywords": ["إدارة", "أعمال", "قيادة"], "description": "برنامج بكالوريوس إدارة الأعمال"}'::jsonb,
  3,
  true,
  false,
  true,
  'standard',
  '{"student_count": 95}'::jsonb,
  now(),
  '[
    {
      "id": "bus-fm-1",
      "name_ar": "د. سعد عبدالله المقطري",
      "name_en": "Dr. Saad Abdullah Al-Muqtari",
      "position_ar": "أستاذ دكتور",
      "position_en": "Professor",
      "qualification_ar": "دكتوراه في إدارة الأعمال",
      "qualification_en": "PhD in Business Administration",
      "specialization_ar": "الإدارة الاستراتيجية",
      "specialization_en": "Strategic Management",
      "email": "s.muqtari@ayloul.edu.ye",
      "order": 1
    }
  ]'::jsonb,
  '[
    {
      "year_number": 1,
      "year_name_ar": "السنة الأولى",
      "year_name_en": "First Year",
      "total_credit_hours": 30,
      "subjects": [
        {
          "id": "bus-101",
          "code": "BUS101",
          "name_ar": "مبادئ الإدارة",
          "name_en": "Principles of Management",
          "credit_hours": 3,
          "theory_hours": 3,
          "practical_hours": 0,
          "order": 1
        }
      ]
    }
  ]'::jsonb,
  '[
    {
      "id": "bus-ar-1",
      "type": "academic",
      "requirement_ar": "معدل ثانوية عامة لا يقل عن 75%",
      "requirement_en": "High school GPA of at least 75%",
      "is_mandatory": true,
      "order": 1
    }
  ]'::jsonb,
  '[
    {
      "id": "bus-gr-1",
      "type": "general",
      "requirement_ar": "مقابلة شخصية",
      "requirement_en": "Personal interview",
      "is_mandatory": true,
      "order": 1
    }
  ]'::jsonb,
  '[
    {
      "id": "bus-stat-1",
      "label_ar": "عدد الطلبة",
      "label_en": "Number of Students",
      "value": 95,
      "icon_name": "users",
      "order": 1
    }
  ]'::jsonb,
  '[
    {
      "id": "bus-co-1",
      "title_ar": "مدير عام",
      "title_en": "General Manager",
      "description_ar": "إدارة الشركات والمؤسسات",
      "description_en": "Managing companies and institutions",
      "sector": "الأعمال",
      "order": 1
    }
  ]'::jsonb,
  '<p>برنامج شامل يهدف إلى إعداد قادة الأعمال المستقبليين</p>',
  '<p>Comprehensive program aimed at preparing future business leaders</p>',
  95
);

-- برنامج التمريض
INSERT INTO dynamic_academic_programs (
  program_key,
  title_ar,
  title_en,
  description_ar,
  description_en,
  summary_ar,
  summary_en,
  icon_name,
  icon_color,
  background_color,
  featured_image,
  gallery,
  duration_years,
  credit_hours,
  degree_type,
  department_ar,
  department_en,
  college_ar,
  college_en,
  admission_requirements_ar,
  admission_requirements_en,
  career_opportunities_ar,
  career_opportunities_en,
  curriculum,
  contact_info,
  seo_settings,
  display_order,
  is_active,
  is_featured,
  has_page,
  page_template,
  metadata,
  published_at,
  faculty_members,
  yearly_curriculum,
  academic_requirements,
  general_requirements,
  program_statistics,
  career_opportunities_list,
  program_overview_ar,
  program_overview_en,
  student_count
) VALUES (
  'nursing',
  'برنامج التمريض',
  'Nursing Program',
  'يهدف برنامج بكالوريوس التمريض إلى إعداد ممرضين وممرضات مؤهلين علمياً وعملياً لتقديم الرعاية التمريضية الشاملة والآمنة للمرضى في مختلف البيئات الصحية.',
  'The Nursing program aims to prepare qualified nurses scientifically and practically.',
  'برنامج متخصص لإعداد كوادر التمريض المؤهلة',
  'Specialized program for preparing qualified nursing staff',
  'heart',
  '#dc2626',
  '#fef2f2',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
  '[]'::jsonb,
  4,
  140,
  'bachelor',
  'قسم العلوم الطبية',
  'Department of Medical Sciences',
  'كلية العلوم الطبية',
  'College of Medical Sciences',
  'معدل ثانوية لا يقل عن 85% في التخصص العلمي',
  'High school average of at least 85% in scientific specialization',
  'ممرض/ة في المستشفيات، العيادات، رعاية منزلية',
  'Nurse in hospitals, clinics, home care',
  '[]'::jsonb,
  '{"email": "nursing@ayloul.edu.ye", "phone": "+967-1-234569", "office": "مبنى كلية العلوم الطبية - الطابق الثالث"}'::jsonb,
  '{"title": "برنامج التمريض", "keywords": ["تمريض", "صحة", "رعاية"], "description": "برنامج بكالوريوس التمريض"}'::jsonb,
  4,
  true,
  true,
  true,
  'standard',
  '{"student_count": 75}'::jsonb,
  now(),
  '[
    {
      "id": "nur-fm-1",
      "name_ar": "د. مريم أحمد الحداد",
      "name_en": "Dr. Maryam Ahmed Al-Haddad",
      "position_ar": "أستاذ مشارك",
      "position_en": "Associate Professor",
      "qualification_ar": "دكتوراه في التمريض",
      "qualification_en": "PhD in Nursing",
      "specialization_ar": "تمريض الأطفال",
      "specialization_en": "Pediatric Nursing",
      "email": "m.haddad@ayloul.edu.ye",
      "order": 1
    }
  ]'::jsonb,
  '[
    {
      "year_number": 1,
      "year_name_ar": "السنة الأولى",
      "year_name_en": "First Year",
      "total_credit_hours": 32,
      "subjects": [
        {
          "id": "nur-101",
          "code": "NUR101",
          "name_ar": "أساسيات التمريض",
          "name_en": "Fundamentals of Nursing",
          "credit_hours": 4,
          "theory_hours": 3,
          "practical_hours": 1,
          "order": 1
        }
      ]
    }
  ]'::jsonb,
  '[
    {
      "id": "nur-ar-1",
      "type": "academic",
      "requirement_ar": "معدل ثانوية عامة لا يقل عن 85%",
      "requirement_en": "High school GPA of at least 85%",
      "is_mandatory": true,
      "order": 1
    }
  ]'::jsonb,
  '[
    {
      "id": "nur-gr-1",
      "type": "general",
      "requirement_ar": "فحص طبي شامل",
      "requirement_en": "Comprehensive medical examination",
      "is_mandatory": true,
      "order": 1
    }
  ]'::jsonb,
  '[
    {
      "id": "nur-stat-1",
      "label_ar": "عدد الطلبة",
      "label_en": "Number of Students",
      "value": 75,
      "icon_name": "users",
      "order": 1
    }
  ]'::jsonb,
  '[
    {
      "id": "nur-co-1",
      "title_ar": "ممرض/ة مستشفيات",
      "title_en": "Hospital Nurse",
      "description_ar": "العمل في المستشفيات والمراكز الطبية",
      "description_en": "Working in hospitals and medical centers",
      "sector": "الصحة",
      "order": 1
    }
  ]'::jsonb,
  '<p>برنامج متخصص في إعداد كوادر التمريض المؤهلة</p>',
  '<p>Specialized program for preparing qualified nursing staff</p>',
  75
);

-- برنامج القبالة
INSERT INTO dynamic_academic_programs (
  program_key,
  title_ar,
  title_en,
  description_ar,
  description_en,
  summary_ar,
  summary_en,
  icon_name,
  icon_color,
  background_color,
  featured_image,
  gallery,
  duration_years,
  credit_hours,
  degree_type,
  department_ar,
  department_en,
  college_ar,
  college_en,
  admission_requirements_ar,
  admission_requirements_en,
  career_opportunities_ar,
  career_opportunities_en,
  curriculum,
  contact_info,
  seo_settings,
  display_order,
  is_active,
  is_featured,
  has_page,
  page_template,
  metadata,
  published_at,
  faculty_members,
  yearly_curriculum,
  academic_requirements,
  general_requirements,
  program_statistics,
  career_opportunities_list,
  program_overview_ar,
  program_overview_en,
  student_count
) VALUES (
  'midwifery',
  'برنامج القبالة',
  'Midwifery Program',
  'يهدف برنامج بكالوريوس القبالة إلى إعداد قابلات مؤهلات علمياً وعملياً لتقديم الرعاية الصحية المتخصصة للأمهات والأطفال حديثي الولادة.',
  'The Midwifery program aims to prepare qualified midwives scientifically and practically.',
  'برنامج متخصص في رعاية الأمومة والطفولة',
  'Specialized program in maternal and child care',
  'baby',
  '#7c3aed',
  '#faf5ff',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
  '[]'::jsonb,
  4,
  138,
  'bachelor',
  'قسم العلوم الطبية',
  'Department of Medical Sciences',
  'كلية العلوم الطبية',
  'College of Medical Sciences',
  'معدل ثانوية لا يقل عن 80% في التخصص العلمي',
  'High school average of at least 80% in scientific specialization',
  'قابلة في المستشفيات، العيادات النسائية، مراكز الأمومة',
  'Midwife in hospitals, gynecological clinics, maternity centers',
  '[]'::jsonb,
  '{"email": "midwifery@ayloul.edu.ye", "phone": "+967-1-234570", "office": "مبنى كلية العلوم الطبية - الطابق الثاني"}'::jsonb,
  '{"title": "برنامج القبالة", "keywords": ["قبالة", "أمومة", "طفولة"], "description": "برنامج بكالوريوس القبالة"}'::jsonb,
  5,
  true,
  false,
  true,
  'standard',
  '{"student_count": 45}'::jsonb,
  now(),
  '[
    {
      "id": "mid-fm-1",
      "name_ar": "د. عائشة محمد الكبسي",
      "name_en": "Dr. Aisha Mohammed Al-Kabsi",
      "position_ar": "أستاذ مساعد",
      "position_en": "Assistant Professor",
      "qualification_ar": "دكتوراه في القبالة",
      "qualification_en": "PhD in Midwifery",
      "specialization_ar": "صحة الأم والطفل",
      "specialization_en": "Maternal and Child Health",
      "email": "a.kabsi@ayloul.edu.ye",
      "order": 1
    }
  ]'::jsonb,
  '[
    {
      "year_number": 1,
      "year_name_ar": "السنة الأولى",
      "year_name_en": "First Year",
      "total_credit_hours": 30,
      "subjects": [
        {
          "id": "mid-101",
          "code": "MID101",
          "name_ar": "أساسيات القبالة",
          "name_en": "Fundamentals of Midwifery",
          "credit_hours": 4,
          "theory_hours": 3,
          "practical_hours": 1,
          "order": 1
        }
      ]
    }
  ]'::jsonb,
  '[
    {
      "id": "mid-ar-1",
      "type": "academic",
      "requirement_ar": "معدل ثانوية عامة لا يقل عن 80%",
      "requirement_en": "High school GPA of at least 80%",
      "is_mandatory": true,
      "order": 1
    }
  ]'::jsonb,
  '[
    {
      "id": "mid-gr-1",
      "type": "general",
      "requirement_ar": "فحص طبي شامل",
      "requirement_en": "Comprehensive medical examination",
      "is_mandatory": true,
      "order": 1
    }
  ]'::jsonb,
  '[
    {
      "id": "mid-stat-1",
      "label_ar": "عدد الطلبة",
      "label_en": "Number of Students",
      "value": 45,
      "icon_name": "users",
      "order": 1
    }
  ]'::jsonb,
  '[
    {
      "id": "mid-co-1",
      "title_ar": "قابلة قانونية",
      "title_en": "Licensed Midwife",
      "description_ar": "العمل في المستشفيات ومراكز الأمومة",
      "description_en": "Working in hospitals and maternity centers",
      "sector": "الصحة",
      "order": 1
    }
  ]'::jsonb,
  '<p>برنامج متخصص في رعاية الأمومة والطفولة</p>',
  '<p>Specialized program in maternal and child care</p>',
  45
);