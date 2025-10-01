import { supabase } from '@/integrations/supabase/client';
import type { DynamicAcademicProgram } from '@/hooks/useDynamicPrograms';

export const seedBusinessData = async () => {
  try {
    // التحقق من وجود بيانات إدارة الأعمال
    const { data: existingData } = await supabase
      .from('dynamic_academic_programs')
      .select('id')
      .eq('program_key', 'business')
      .maybeSingle();

    if (existingData) {
      console.log('بيانات إدارة الأعمال موجودة بالفعل');
      return existingData;
    }

    const businessProgramData: Omit<DynamicAcademicProgram, 'id' | 'created_at' | 'updated_at' | 'published_at'> = {
      program_key: 'business',
      title_ar: 'إدارة الأعمال',
      title_en: 'Business Administration',
      description_ar: 'برنامج إدارة الأعمال هو برنامج أكاديمي شامل يهدف إلى إعداد كوادر إدارية قادرة على قيادة المؤسسات والشركات في بيئة الأعمال المعاصرة، مع التركيز على المهارات الإدارية والقيادية والتحليلية.',
      description_en: 'The Business Administration program is a comprehensive academic program aimed at preparing administrative personnel capable of leading institutions and companies in the contemporary business environment, focusing on managerial, leadership, and analytical skills.',
      summary_ar: 'برنامج متخصص في إدارة الأعمال يؤهل الطلاب للعمل في مجال الإدارة، المالية، التسويق، والموارد البشرية.',
      summary_en: 'A specialized program in business administration that qualifies students to work in management, finance, marketing, and human resources.',
      icon_name: 'Briefcase',
      icon_color: '#059669',
      background_color: '#f0fdf4',
      featured_image: null,
      gallery: [],
      duration_years: 4,
      credit_hours: 132,
      degree_type: 'بكالوريوس',
      department_ar: 'قسم الإدارة والعلوم الإنسانية',
      department_en: 'Department of Administration and Humanities',
      college_ar: 'كلية إيلول الجامعية',
      college_en: 'Eylul University College',
      admission_requirements_ar: 'الحصول على شهادة الثانوية العامة بمعدل لا يقل عن 60%، اجتياز امتحان القبول، إجادة اللغة العربية والإنجليزية.',
      admission_requirements_en: 'Obtaining a high school diploma with a minimum average of 60%, passing the entrance exam, proficiency in Arabic and English.',
      career_opportunities_ar: 'مدير إداري، محلل مالي، مختص تسويق، مدير موارد بشرية، مدير مشاريع، مستشار أعمال.',
      career_opportunities_en: 'Administrative Manager, Financial Analyst, Marketing Specialist, Human Resources Manager, Project Manager, Business Consultant.',
      curriculum: [],
      contact_info: {
        phone: '+964 750 123 5678',
        email: 'business@eylul.edu.iq',
        office: 'مبنى الإدارة والعلوم الإنسانية - الطابق الأول'
      },
      seo_settings: {
        meta_title_ar: 'برنامج إدارة الأعمال - كلية إيلول الجامعية',
        meta_title_en: 'Business Administration Program - Eylul University College',
        meta_description_ar: 'ادرس إدارة الأعمال في كلية إيلول الجامعية. برنامج متخصص معتمد يؤهلك للعمل في مجال الإدارة والتسويق والمالية.',
        meta_description_en: 'Study Business Administration at Eylul University College. A specialized accredited program that qualifies you to work in management, marketing, and finance.',
        keywords_ar: ['إدارة الأعمال', 'الإدارة', 'التسويق', 'المالية', 'الموارد البشرية'],
        keywords_en: ['Business Administration', 'Management', 'Marketing', 'Finance', 'Human Resources']
      },
      display_order: 2,
      is_active: true,
      is_featured: true,
      has_page: true,
      page_template: 'standard',
      metadata: {
        accreditation: 'معتمد من وزارة التعليم العالي والبحث العلمي',
        established_year: '2019',
        program_language: 'العربية والإنجليزية'
      },
      
      // أعضاء هيئة التدريس
      faculty_members: [
        {
          id: 'bus-faculty-1',
          name_ar: 'د. سعد محمود البصري',
          name_en: 'Dr. Saad Mahmoud Al-Basri',
          position_ar: 'رئيس قسم إدارة الأعمال',
          position_en: 'Head of Business Administration Department',
          qualification_ar: 'دكتوراه في إدارة الأعمال',
          qualification_en: 'PhD in Business Administration',
          specialization_ar: 'الإدارة الاستراتيجية والقيادة',
          specialization_en: 'Strategic Management and Leadership',
          university_ar: 'جامعة البصرة',
          university_en: 'University of Basrah',
          email: 's.basri@eylul.edu.iq',
          phone: '+964 750 222 1133',
          profile_image: null,
          bio_ar: 'خبرة أكثر من 18 عاماً في مجال الإدارة والاستشارات، عمل في عدة شركات محلية وإقليمية.',
          bio_en: 'Over 18 years of experience in management and consulting, worked in several local and regional companies.',
          research_interests: ['الإدارة الاستراتيجية', 'القيادة التحويلية', 'إدارة التغيير'],
          publications: ['الإدارة الحديثة في بيئة الأعمال العراقية', 'القيادة الفعالة في المؤسسات'],
          order: 1
        },
        {
          id: 'bus-faculty-2',
          name_ar: 'أ.م.د. زينب علي النجار',
          name_en: 'Asst. Prof. Dr. Zeinab Ali Al-Najjar',
          position_ar: 'أستاذ مساعد - التسويق',
          position_en: 'Assistant Professor - Marketing',
          qualification_ar: 'دكتوراه في التسويق',
          qualification_en: 'PhD in Marketing',
          specialization_ar: 'التسويق الرقمي وسلوك المستهلك',
          specialization_en: 'Digital Marketing and Consumer Behavior',
          university_ar: 'جامعة بغداد',
          university_en: 'University of Baghdad',
          email: 'z.najjar@eylul.edu.iq',
          phone: '+964 750 222 2244',
          profile_image: null,
          bio_ar: 'متخصصة في التسويق الرقمي مع خبرة 14 عاماً في الاستشارات التسويقية.',
          bio_en: 'Specialist in digital marketing with 14 years of experience in marketing consulting.',
          research_interests: ['التسويق الرقمي', 'سلوك المستهلك', 'استراتيجيات العلامة التجارية'],
          publications: ['التسويق الإلكتروني في العراق', 'تأثير وسائل التواصل الاجتماعي على سلوك المستهلك'],
          order: 2
        },
        {
          id: 'bus-faculty-3',
          name_ar: 'م. أحمد خالد الربيعي',
          name_en: 'Mr. Ahmed Khalid Al-Rubai',
          position_ar: 'مدرس - المالية والمحاسبة',
          position_en: 'Lecturer - Finance and Accounting',
          qualification_ar: 'ماجستير في المالية والمصارف',
          qualification_en: 'MSc in Finance and Banking',
          specialization_ar: 'التحليل المالي والاستثمار',
          specialization_en: 'Financial Analysis and Investment',
          university_ar: 'الجامعة المستنصرية',
          university_en: 'Al-Mustansiriya University',
          email: 'a.rubai@eylul.edu.iq',
          phone: '+964 750 222 3355',
          profile_image: null,
          bio_ar: 'محاسب قانوني معتمد مع خبرة 12 عاماً في التحليل المالي والاستثمار.',
          bio_en: 'Certified Public Accountant with 12 years of experience in financial analysis and investment.',
          research_interests: ['التحليل المالي', 'إدارة المخاطر', 'الاستثمار والتمويل'],
          publications: ['التحليل المالي للشركات العراقية', 'إدارة المخاطر في المصارف'],
          order: 3
        }
      ],

      // الخطة الدراسية
      yearly_curriculum: [
        {
          year_number: 1,
          year_name_ar: 'السنة الأولى',
          year_name_en: 'First Year',
          total_credit_hours: 33,
          subjects: [
            {
              id: 'bus-101',
              code: 'BUS101',
              name_ar: 'مبادئ الإدارة',
              name_en: 'Principles of Management',
              credit_hours: 3,
              theory_hours: 3,
              practical_hours: 0,
              prerequisites: [],
              description_ar: 'المفاهيم الأساسية في الإدارة ووظائفها',
              description_en: 'Basic concepts in management and its functions',
              order: 1
            },
            {
              id: 'bus-102',
              code: 'BUS102',
              name_ar: 'مبادئ المحاسبة',
              name_en: 'Principles of Accounting',
              credit_hours: 3,
              theory_hours: 2,
              practical_hours: 2,
              prerequisites: [],
              description_ar: 'أساسيات المحاسبة والقوائم المالية',
              description_en: 'Accounting fundamentals and financial statements',
              order: 2
            },
            {
              id: 'bus-103',
              code: 'BUS103',
              name_ar: 'مبادئ الاقتصاد',
              name_en: 'Principles of Economics',
              credit_hours: 3,
              theory_hours: 3,
              practical_hours: 0,
              prerequisites: [],
              description_ar: 'النظريات الاقتصادية الأساسية',
              description_en: 'Basic economic theories',
              order: 3
            },
            {
              id: 'bus-104',
              code: 'BUS104',
              name_ar: 'الرياضيات للأعمال',
              name_en: 'Business Mathematics',
              credit_hours: 3,
              theory_hours: 3,
              practical_hours: 0,
              prerequisites: [],
              description_ar: 'التطبيقات الرياضية في الأعمال',
              description_en: 'Mathematical applications in business',
              order: 4
            }
          ]
        },
        {
          year_number: 2,
          year_name_ar: 'السنة الثانية',
          year_name_en: 'Second Year',
          total_credit_hours: 36,
          subjects: [
            {
              id: 'bus-201',
              code: 'BUS201',
              name_ar: 'إدارة التسويق',
              name_en: 'Marketing Management',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 2,
              prerequisites: ['BUS101'],
              description_ar: 'استراتيجيات التسويق ومزيج التسويق',
              description_en: 'Marketing strategies and marketing mix',
              order: 1
            },
            {
              id: 'bus-202',
              code: 'BUS202',
              name_ar: 'الإدارة المالية',
              name_en: 'Financial Management',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 2,
              prerequisites: ['BUS102'],
              description_ar: 'التحليل المالي واتخاذ القرارات المالية',
              description_en: 'Financial analysis and financial decision making',
              order: 2
            },
            {
              id: 'bus-203',
              code: 'BUS203',
              name_ar: 'إدارة الموارد البشرية',
              name_en: 'Human Resource Management',
              credit_hours: 3,
              theory_hours: 3,
              practical_hours: 0,
              prerequisites: ['BUS101'],
              description_ar: 'إدارة وتطوير الموارد البشرية',
              description_en: 'Human resource management and development',
              order: 3
            },
            {
              id: 'bus-204',
              code: 'BUS204',
              name_ar: 'إدارة العمليات',
              name_en: 'Operations Management',
              credit_hours: 3,
              theory_hours: 2,
              practical_hours: 2,
              prerequisites: ['BUS101'],
              description_ar: 'تخطيط وإدارة العمليات الإنتاجية',
              description_en: 'Planning and managing production operations',
              order: 4
            }
          ]
        },
        {
          year_number: 3,
          year_name_ar: 'السنة الثالثة',
          year_name_en: 'Third Year',
          total_credit_hours: 33,
          subjects: [
            {
              id: 'bus-301',
              code: 'BUS301',
              name_ar: 'الإدارة الاستراتيجية',
              name_en: 'Strategic Management',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 2,
              prerequisites: ['BUS201', 'BUS202'],
              description_ar: 'التخطيط الاستراتيجي والتحليل البيئي',
              description_en: 'Strategic planning and environmental analysis',
              order: 1
            },
            {
              id: 'bus-302',
              code: 'BUS302',
              name_ar: 'ريادة الأعمال',
              name_en: 'Entrepreneurship',
              credit_hours: 3,
              theory_hours: 2,
              practical_hours: 2,
              prerequisites: ['BUS201'],
              description_ar: 'تطوير الأفكار التجارية وإدارة الشركات الناشئة',
              description_en: 'Developing business ideas and managing startups',
              order: 2
            },
            {
              id: 'bus-303',
              code: 'BUS303',
              name_ar: 'التجارة الإلكترونية',
              name_en: 'E-Commerce',
              credit_hours: 3,
              theory_hours: 2,
              practical_hours: 2,
              prerequisites: ['BUS201'],
              description_ar: 'أسس التجارة الإلكترونية والتسويق الرقمي',
              description_en: 'E-commerce fundamentals and digital marketing',
              order: 3
            },
            {
              id: 'bus-304',
              code: 'BUS304',
              name_ar: 'إدارة المشاريع',
              name_en: 'Project Management',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 2,
              prerequisites: ['BUS204'],
              description_ar: 'تخطيط وتنفيذ ومراقبة المشاريع',
              description_en: 'Project planning, execution, and monitoring',
              order: 4
            }
          ]
        },
        {
          year_number: 4,
          year_name_ar: 'السنة الرابعة',
          year_name_en: 'Fourth Year',
          total_credit_hours: 30,
          subjects: [
            {
              id: 'bus-401',
              code: 'BUS401',
              name_ar: 'إدارة الجودة الشاملة',
              name_en: 'Total Quality Management',
              credit_hours: 3,
              theory_hours: 3,
              practical_hours: 0,
              prerequisites: ['BUS204'],
              description_ar: 'مبادئ إدارة الجودة الشاملة والتحسين المستمر',
              description_en: 'Total quality management principles and continuous improvement',
              order: 1
            },
            {
              id: 'bus-402',
              code: 'BUS402',
              name_ar: 'مشروع التخرج 1',
              name_en: 'Graduation Project I',
              credit_hours: 3,
              theory_hours: 1,
              practical_hours: 4,
              prerequisites: ['BUS301'],
              description_ar: 'مشروع تطبيقي في إدارة الأعمال - الجزء الأول',
              description_en: 'Applied project in business administration - Part I',
              order: 2
            },
            {
              id: 'bus-403',
              code: 'BUS403',
              name_ar: 'الأعمال الدولية',
              name_en: 'International Business',
              credit_hours: 3,
              theory_hours: 3,
              practical_hours: 0,
              prerequisites: ['BUS301'],
              description_ar: 'إدارة الأعمال في البيئة الدولية',
              description_en: 'Business management in international environment',
              order: 3
            },
            {
              id: 'bus-404',
              code: 'BUS404',
              name_ar: 'مشروع التخرج 2',
              name_en: 'Graduation Project II',
              credit_hours: 6,
              theory_hours: 1,
              practical_hours: 10,
              prerequisites: ['BUS402'],
              description_ar: 'مشروع تطبيقي في إدارة الأعمال - الجزء الثاني',
              description_en: 'Applied project in business administration - Part II',
              order: 4
            }
          ]
        }
      ],

      // شروط القبول الأكاديمية
      academic_requirements: [
        {
          id: 'bus-acad-1',
          type: 'academic',
          requirement_ar: 'الحصول على شهادة الثانوية العامة بمعدل لا يقل عن 60%',
          requirement_en: 'Obtaining a high school diploma with a minimum average of 60%',
          is_mandatory: true,
          order: 1
        },
        {
          id: 'bus-acad-2',
          type: 'academic',
          requirement_ar: 'اجتياز امتحان القبول في اللغة العربية والرياضيات',
          requirement_en: 'Passing the entrance exam in Arabic and mathematics',
          is_mandatory: true,
          order: 2
        },
        {
          id: 'bus-acad-3',
          type: 'academic',
          requirement_ar: 'إجادة اللغة الإنجليزية (مستوى متوسط)',
          requirement_en: 'Proficiency in English (intermediate level)',
          is_mandatory: false,
          order: 3
        }
      ],

      // الشروط العامة
      general_requirements: [
        {
          id: 'bus-gen-1',
          type: 'general',
          requirement_ar: 'تقديم كافة الوثائق المطلوبة مصدقة',
          requirement_en: 'Submit all required documents certified',
          is_mandatory: true,
          order: 1
        },
        {
          id: 'bus-gen-2',
          type: 'general',
          requirement_ar: 'دفع الرسوم الدراسية المقررة',
          requirement_en: 'Payment of prescribed tuition fees',
          is_mandatory: true,
          order: 2
        },
        {
          id: 'bus-gen-3',
          type: 'general',
          requirement_ar: 'اجتياز المقابلة الشخصية',
          requirement_en: 'Passing the personal interview',
          is_mandatory: true,
          order: 3
        }
      ],

      // إحصائيات البرنامج
      program_statistics: [
        {
          label_ar: 'عدد الطلاب المسجلين',
          label_en: 'Enrolled Students',
          value: 312,
          icon: 'users',
          order: 1
        },
        {
          label_ar: 'عدد الخريجين',
          label_en: 'Graduates',
          value: 156,
          icon: 'graduation-cap',
          order: 2
        },
        {
          label_ar: 'معدل التوظيف',
          label_en: 'Employment Rate',
          value: '89%',
          icon: 'briefcase',
          order: 3
        },
        {
          label_ar: 'متوسط الراتب',
          label_en: 'Average Salary',
          value: '750,000 د.ع',
          icon: 'dollar-sign',
          order: 4
        }
      ],

      // الفرص المهنية
      career_opportunities_list: [
        {
          id: 'bus-career-1',
          title_ar: 'مدير عام',
          title_en: 'General Manager',
          description_ar: 'إدارة العمليات الشاملة للشركات والمؤسسات',
          description_en: 'Managing comprehensive operations of companies and institutions',
          sector: 'إدارة',
          order: 1
        },
        {
          id: 'bus-career-2',
          title_ar: 'مختص تسويق',
          title_en: 'Marketing Specialist',
          description_ar: 'تطوير وتنفيذ استراتيجيات التسويق',
          description_en: 'Developing and implementing marketing strategies',
          sector: 'تسويق',
          order: 2
        },
        {
          id: 'bus-career-3',
          title_ar: 'محلل مالي',
          title_en: 'Financial Analyst',
          description_ar: 'تحليل البيانات المالية واتخاذ القرارات الاستثمارية',
          description_en: 'Analyzing financial data and making investment decisions',
          sector: 'مالية',
          order: 3
        },
        {
          id: 'bus-career-4',
          title_ar: 'مدير موارد بشرية',
          title_en: 'HR Manager',
          description_ar: 'إدارة وتطوير الكوادر البشرية في المؤسسات',
          description_en: 'Managing and developing human resources in institutions',
          sector: 'موارد بشرية',
          order: 4
        },
        {
          id: 'bus-career-5',
          title_ar: 'رائد أعمال',
          title_en: 'Entrepreneur',
          description_ar: 'تأسيس وإدارة المشاريع التجارية الجديدة',
          description_en: 'Establishing and managing new business ventures',
          sector: 'ريادة أعمال',
          order: 5
        }
      ],

      program_overview_ar: 'برنامج إدارة الأعمال في كلية إيلول الجامعية هو برنامج أكاديمي متميز يهدف إلى إعداد كوادر إدارية مؤهلة قادرة على قيادة المؤسسات في بيئة الأعمال المعاصرة. يتميز البرنامج بمنهج شامل يجمع بين النظريات الإدارية الحديثة والتطبيق العملي، مما يضمن تخريج كوادر قادرة على مواجهة تحديات سوق العمل.',
      program_overview_en: 'The Business Administration program at Eylul University College is a distinguished academic program aimed at preparing qualified administrative personnel capable of leading institutions in the contemporary business environment. The program features a comprehensive curriculum that combines modern management theories with practical application, ensuring the graduation of personnel capable of facing job market challenges.',
      student_count: 312
    };

    const { data, error } = await supabase
      .from('dynamic_academic_programs')
      .insert(businessProgramData as any)
      .select()
      .single();

    if (error) {
      console.error('خطأ في إدراج بيانات إدارة الأعمال:', error);
      throw error;
    }

    console.log('تم إدراج بيانات إدارة الأعمال بنجاح');
    return data;
  } catch (error) {
    console.error('خطأ في seedBusinessData:', error);
    throw error;
  }
};