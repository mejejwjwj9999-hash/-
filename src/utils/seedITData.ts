import { supabase } from '@/integrations/supabase/client';
import type { DynamicAcademicProgram } from '@/hooks/useDynamicPrograms';

export const seedITData = async () => {
  try {
    // التحقق من وجود بيانات تكنولوجيا المعلومات
    const { data: existingData } = await supabase
      .from('dynamic_academic_programs')
      .select('id')
      .eq('program_key', 'it')
      .maybeSingle();

    if (existingData) {
      console.log('بيانات تكنولوجيا المعلومات موجودة بالفعل');
      return existingData;
    }

    const itProgramData: Omit<DynamicAcademicProgram, 'id' | 'created_at' | 'updated_at' | 'published_at'> = {
      program_key: 'it',
      title_ar: 'تكنولوجيا المعلومات',
      title_en: 'Information Technology',
      description_ar: 'برنامج تكنولوجيا المعلومات هو برنامج أكاديمي شامل يهدف إلى إعداد كوادر متخصصة في مجال تكنولوجيا المعلومات والحاسوب، مع التركيز على أحدث التطورات التقنية وتطبيقاتها العملية في بيئة الأعمال المعاصرة.',
      description_en: 'The Information Technology program is a comprehensive academic program aimed at preparing specialized personnel in the field of information technology and computing, with a focus on the latest technological developments and their practical applications in the contemporary business environment.',
      summary_ar: 'برنامج متخصص في تكنولوجيا المعلومات يؤهل الطلاب للعمل في مجال البرمجة، إدارة الشبكات، أمن المعلومات، وتطوير الأنظمة.',
      summary_en: 'A specialized program in information technology that qualifies students to work in programming, network management, information security, and systems development.',
      icon_name: 'Monitor',
      icon_color: '#3b82f6',
      background_color: '#eff6ff',
      featured_image: null,
      gallery: [],
      duration_years: 4,
      credit_hours: 132,
      degree_type: 'بكالوريوس',
      department_ar: 'قسم العلوم التقنية',
      department_en: 'Department of Technical Sciences',
      college_ar: 'كلية إيلول الجامعية',
      college_en: 'Eylul University College',
      admission_requirements_ar: 'الحصول على شهادة الثانوية العامة بمعدل لا يقل عن 65%، اجتياز امتحان القبول، إجادة أساسيات الحاسوب والرياضيات.',
      admission_requirements_en: 'Obtaining a high school diploma with a minimum average of 65%, passing the entrance exam, proficiency in computer basics and mathematics.',
      career_opportunities_ar: 'مطور برمجيات، مدير أنظمة، محلل أمن المعلومات، مطور مواقع ويب، مدير قواعد البيانات، متخصص دعم تقني.',
      career_opportunities_en: 'Software Developer, Systems Administrator, Information Security Analyst, Web Developer, Database Administrator, Technical Support Specialist.',
      curriculum: [],
      contact_info: {
        phone: '+964 750 123 4567',
        email: 'it@eylul.edu.iq',
        office: 'مبنى العلوم التقنية - الطابق الثاني'
      },
      seo_settings: {
        meta_title_ar: 'برنامج تكنولوجيا المعلومات - كلية إيلول الجامعية',
        meta_title_en: 'Information Technology Program - Eylul University College',
        meta_description_ar: 'تعلم أحدث تقنيات المعلومات والحاسوب في برنامج تكنولوجيا المعلومات بكلية إيلول الجامعية. برنامج متخصص معتمد يؤهلك لسوق العمل.',
        meta_description_en: 'Learn the latest information and computer technologies in the Information Technology program at Eylul University College. A specialized accredited program that qualifies you for the job market.',
        keywords_ar: ['تكنولوجيا المعلومات', 'البرمجة', 'الحاسوب', 'أمن المعلومات', 'الشبكات'],
        keywords_en: ['Information Technology', 'Programming', 'Computer', 'Information Security', 'Networks']
      },
      display_order: 1,
      is_active: true,
      is_featured: true,
      has_page: true,
      page_template: 'standard',
      metadata: {
        accreditation: 'معتمد من وزارة التعليم العالي والبحث العلمي',
        established_year: '2020',
        program_language: 'العربية والإنجليزية'
      },
      
      // أعضاء هيئة التدريس
      faculty_members: [
        {
          id: 'it-faculty-1',
          name_ar: 'د. أحمد محمد العراقي',
          name_en: 'Dr. Ahmed Mohammed Al-Iraqi',
          position_ar: 'رئيس قسم تكنولوجيا المعلومات',
          position_en: 'Head of Information Technology Department',
          qualification_ar: 'دكتوراه في علوم الحاسوب',
          qualification_en: 'PhD in Computer Science',
          specialization_ar: 'هندسة البرمجيات وقواعد البيانات',
          specialization_en: 'Software Engineering and Databases',
          university_ar: 'جامعة بغداد',
          university_en: 'University of Baghdad',
          email: 'a.iraqi@eylul.edu.iq',
          phone: '+964 750 111 2233',
          profile_image: null,
          bio_ar: 'خبرة أكثر من 15 عاماً في مجال تطوير الأنظمة وإدارة قواعد البيانات. شارك في تطوير العديد من الأنظمة الحكومية والخاصة.',
          bio_en: 'Over 15 years of experience in systems development and database management. Participated in developing many government and private systems.',
          research_interests: ['هندسة البرمجيات', 'قواعد البيانات الذكية', 'الذكاء الاصطناعي'],
          publications: ['تطوير نظام إدارة المستشفيات الذكي', 'تحليل البيانات الضخمة في القطاع الصحي'],
          order: 1
        },
        {
          id: 'it-faculty-2',
          name_ar: 'أ.م.د. فاطمة علي الموسوي',
          name_en: 'Asst. Prof. Dr. Fatima Ali Al-Mousawi',
          position_ar: 'أستاذ مساعد - أمن المعلومات',
          position_en: 'Assistant Professor - Information Security',
          qualification_ar: 'دكتوراه في أمن المعلومات',
          qualification_en: 'PhD in Information Security',
          specialization_ar: 'أمن الشبكات والتشفير',
          specialization_en: 'Network Security and Cryptography',
          university_ar: 'الجامعة التكنولوجية',
          university_en: 'University of Technology',
          email: 'f.mousawi@eylul.edu.iq',
          phone: '+964 750 111 3344',
          profile_image: null,
          bio_ar: 'متخصصة في أمن المعلومات والتشفير مع خبرة 12 عاماً في مجال حماية الأنظمة والشبكات.',
          bio_en: 'Specialist in information security and cryptography with 12 years of experience in systems and network protection.',
          research_interests: ['أمن الشبكات', 'التشفير المتقدم', 'الأمن السيبراني'],
          publications: ['حماية البيانات في الحوسبة السحابية', 'تطبيقات التشفير في الأنظمة المصرفية'],
          order: 2
        },
        {
          id: 'it-faculty-3',
          name_ar: 'م. علي حسن الخالدي',
          name_en: 'Eng. Ali Hassan Al-Khalidi',
          position_ar: 'مدرس - البرمجة والتطوير',
          position_en: 'Lecturer - Programming and Development',
          qualification_ar: 'ماجستير في هندسة البرمجيات',
          qualification_en: 'MSc in Software Engineering',
          specialization_ar: 'تطوير التطبيقات والمواقع',
          specialization_en: 'Application and Web Development',
          university_ar: 'جامعة البصرة',
          university_en: 'University of Basrah',
          email: 'a.khalidi@eylul.edu.iq',
          phone: '+964 750 111 4455',
          profile_image: null,
          bio_ar: 'مطور محترف مع خبرة 10 سنوات في تطوير التطبيقات المتقدمة والمواقع التفاعلية.',
          bio_en: 'Professional developer with 10 years of experience in developing advanced applications and interactive websites.',
          research_interests: ['تطوير التطبيقات المحمولة', 'تقنيات الويب الحديثة', 'تجربة المستخدم'],
          publications: ['تطوير تطبيقات الهواتف الذكية', 'تحسين أداء المواقع الإلكترونية'],
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
              id: 'it-101',
              code: 'IT101',
              name_ar: 'مقدمة في علوم الحاسوب',
              name_en: 'Introduction to Computer Science',
              credit_hours: 3,
              theory_hours: 2,
              practical_hours: 2,
              prerequisites: [],
              description_ar: 'مبادئ علوم الحاسوب وتطبيقاتها الأساسية',
              description_en: 'Principles of computer science and basic applications',
              order: 1
            },
            {
              id: 'it-102',
              code: 'IT102',
              name_ar: 'الرياضيات للحاسوب',
              name_en: 'Mathematics for Computing',
              credit_hours: 3,
              theory_hours: 3,
              practical_hours: 0,
              prerequisites: [],
              description_ar: 'الرياضيات الأساسية المطلوبة لعلوم الحاسوب',
              description_en: 'Basic mathematics required for computer science',
              order: 2
            },
            {
              id: 'it-103',
              code: 'IT103',
              name_ar: 'برمجة الحاسوب 1',
              name_en: 'Computer Programming I',
              credit_hours: 4,
              theory_hours: 2,
              practical_hours: 4,
              prerequisites: [],
              description_ar: 'أساسيات البرمجة باستخدام لغة C++',
              description_en: 'Programming fundamentals using C++',
              order: 3
            },
            {
              id: 'it-104',
              code: 'IT104',
              name_ar: 'مبادئ إدارة الأعمال',
              name_en: 'Business Administration Principles',
              credit_hours: 3,
              theory_hours: 3,
              practical_hours: 0,
              prerequisites: [],
              description_ar: 'المفاهيم الأساسية في إدارة الأعمال',
              description_en: 'Basic concepts in business administration',
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
              id: 'it-201',
              code: 'IT201',
              name_ar: 'برمجة الحاسوب 2',
              name_en: 'Computer Programming II',
              credit_hours: 4,
              theory_hours: 2,
              practical_hours: 4,
              prerequisites: ['IT103'],
              description_ar: 'البرمجة المتقدمة والبرمجة كائنية التوجه',
              description_en: 'Advanced programming and object-oriented programming',
              order: 1
            },
            {
              id: 'it-202',
              code: 'IT202',
              name_ar: 'هياكل البيانات والخوارزميات',
              name_en: 'Data Structures and Algorithms',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 2,
              prerequisites: ['IT103'],
              description_ar: 'هياكل البيانات الأساسية والخوارزميات',
              description_en: 'Basic data structures and algorithms',
              order: 2
            },
            {
              id: 'it-203',
              code: 'IT203',
              name_ar: 'أساسيات الشبكات',
              name_en: 'Network Fundamentals',
              credit_hours: 3,
              theory_hours: 2,
              practical_hours: 2,
              prerequisites: ['IT101'],
              description_ar: 'مبادئ الشبكات وبروتوكولات الاتصال',
              description_en: 'Network principles and communication protocols',
              order: 3
            },
            {
              id: 'it-204',
              code: 'IT204',
              name_ar: 'قواعد البيانات 1',
              name_en: 'Database Systems I',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 2,
              prerequisites: ['IT102'],
              description_ar: 'تصميم وإدارة قواعد البيانات العلائقية',
              description_en: 'Design and management of relational databases',
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
              id: 'it-301',
              code: 'IT301',
              name_ar: 'هندسة البرمجيات',
              name_en: 'Software Engineering',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 2,
              prerequisites: ['IT201'],
              description_ar: 'مبادئ هندسة البرمجيات ودورة حياة التطوير',
              description_en: 'Software engineering principles and development lifecycle',
              order: 1
            },
            {
              id: 'it-302',
              code: 'IT302',
              name_ar: 'تطوير المواقع الإلكترونية',
              name_en: 'Web Development',
              credit_hours: 4,
              theory_hours: 2,
              practical_hours: 4,
              prerequisites: ['IT201'],
              description_ar: 'تقنيات تطوير المواقع الحديثة',
              description_en: 'Modern web development technologies',
              order: 2
            },
            {
              id: 'it-303',
              code: 'IT303',
              name_ar: 'أمن المعلومات',
              name_en: 'Information Security',
              credit_hours: 3,
              theory_hours: 3,
              practical_hours: 0,
              prerequisites: ['IT203'],
              description_ar: 'مبادئ أمن المعلومات والحماية',
              description_en: 'Information security principles and protection',
              order: 3
            },
            {
              id: 'it-304',
              code: 'IT304',
              name_ar: 'تطبيقات الهواتف المحمولة',
              name_en: 'Mobile Application Development',
              credit_hours: 4,
              theory_hours: 2,
              practical_hours: 4,
              prerequisites: ['IT201'],
              description_ar: 'تطوير تطبيقات الأندرويد و iOS',
              description_en: 'Android and iOS application development',
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
              id: 'it-401',
              code: 'IT401',
              name_ar: 'الذكاء الاصطناعي',
              name_en: 'Artificial Intelligence',
              credit_hours: 3,
              theory_hours: 3,
              practical_hours: 0,
              prerequisites: ['IT202'],
              description_ar: 'مبادئ الذكاء الاصطناعي والتعلم الآلي',
              description_en: 'Artificial intelligence and machine learning principles',
              order: 1
            },
            {
              id: 'it-402',
              code: 'IT402',
              name_ar: 'مشروع التخرج 1',
              name_en: 'Graduation Project I',
              credit_hours: 3,
              theory_hours: 1,
              practical_hours: 4,
              prerequisites: ['IT301'],
              description_ar: 'مشروع تطبيقي شامل - الجزء الأول',
              description_en: 'Comprehensive applied project - Part I',
              order: 2
            },
            {
              id: 'it-403',
              code: 'IT403',
              name_ar: 'إدارة المشاريع التقنية',
              name_en: 'Technical Project Management',
              credit_hours: 3,
              theory_hours: 3,
              practical_hours: 0,
              prerequisites: ['IT301'],
              description_ar: 'إدارة المشاريع التقنية والفرق البرمجية',
              description_en: 'Technical project management and development teams',
              order: 3
            },
            {
              id: 'it-404',
              code: 'IT404',
              name_ar: 'مشروع التخرج 2',
              name_en: 'Graduation Project II',
              credit_hours: 6,
              theory_hours: 1,
              practical_hours: 10,
              prerequisites: ['IT402'],
              description_ar: 'مشروع تطبيقي شامل - الجزء الثاني',
              description_en: 'Comprehensive applied project - Part II',
              order: 4
            }
          ]
        }
      ],

      // شروط القبول الأكاديمية
      academic_requirements: [
        {
          id: 'it-acad-1',
          type: 'academic',
          requirement_ar: 'الحصول على شهادة الثانوية العامة الفرع العلمي بمعدل لا يقل عن 65%',
          requirement_en: 'Obtaining a scientific branch high school diploma with a minimum average of 65%',
          is_mandatory: true,
          order: 1
        },
        {
          id: 'it-acad-2',
          type: 'academic',
          requirement_ar: 'اجتياز امتحان القبول في الرياضيات وأساسيات الحاسوب',
          requirement_en: 'Passing the entrance exam in mathematics and computer basics',
          is_mandatory: true,
          order: 2
        },
        {
          id: 'it-acad-3',
          type: 'academic',
          requirement_ar: 'إجادة اللغة الإنجليزية (مستوى متوسط على الأقل)',
          requirement_en: 'Proficiency in English (at least intermediate level)',
          is_mandatory: true,
          order: 3
        }
      ],

      // الشروط العامة
      general_requirements: [
        {
          id: 'it-gen-1',
          type: 'general',
          requirement_ar: 'تقديم كافة الوثائق المطلوبة مصدقة ومترجمة',
          requirement_en: 'Submit all required documents certified and translated',
          is_mandatory: true,
          order: 1
        },
        {
          id: 'it-gen-2',
          type: 'general',
          requirement_ar: 'دفع الرسوم الدراسية للفصل الأول',
          requirement_en: 'Payment of tuition fees for the first semester',
          is_mandatory: true,
          order: 2
        },
        {
          id: 'it-gen-3',
          type: 'general',
          requirement_ar: 'إجراء الفحص الطبي والحصول على شهادة اللياقة الصحية',
          requirement_en: 'Medical examination and obtaining a health fitness certificate',
          is_mandatory: true,
          order: 3
        }
      ],

      // إحصائيات البرنامج
      program_statistics: [
        {
          label_ar: 'عدد الطلاب المسجلين',
          label_en: 'Enrolled Students',
          value: 245,
          icon: 'users',
          order: 1
        },
        {
          label_ar: 'عدد الخريجين',
          label_en: 'Graduates',
          value: 89,
          icon: 'graduation-cap',
          order: 2
        },
        {
          label_ar: 'معدل التوظيف',
          label_en: 'Employment Rate',
          value: '92%',
          icon: 'briefcase',
          order: 3
        },
        {
          label_ar: 'متوسط الراتب',
          label_en: 'Average Salary',
          value: '850,000 د.ع',
          icon: 'dollar-sign',
          order: 4
        }
      ],

      // الفرص المهنية
      career_opportunities_list: [
        {
          id: 'it-career-1',
          title_ar: 'مطور برمجيات',
          title_en: 'Software Developer',
          description_ar: 'تطوير التطبيقات والأنظمة البرمجية للشركات والمؤسسات',
          description_en: 'Developing applications and software systems for companies and institutions',
          sector: 'تطوير',
          order: 1
        },
        {
          id: 'it-career-2',
          title_ar: 'مدير أنظمة معلومات',
          title_en: 'Information Systems Manager',
          description_ar: 'إدارة وصيانة الأنظمة المعلوماتية في المؤسسات',
          description_en: 'Managing and maintaining information systems in institutions',
          sector: 'إدارة',
          order: 2
        },
        {
          id: 'it-career-3',
          title_ar: 'محلل أمن معلومات',
          title_en: 'Information Security Analyst',
          description_ar: 'حماية المعلومات والأنظمة من التهديدات السيبرانية',
          description_en: 'Protecting information and systems from cyber threats',
          sector: 'أمن',
          order: 3
        },
        {
          id: 'it-career-4',
          title_ar: 'مطور مواقع ويب',
          title_en: 'Web Developer',
          description_ar: 'تصميم وتطوير المواقع الإلكترونية والتطبيقات التفاعلية',
          description_en: 'Designing and developing websites and interactive applications',
          sector: 'تطوير',
          order: 4
        },
        {
          id: 'it-career-5',
          title_ar: 'مدير قواعد البيانات',
          title_en: 'Database Administrator',
          description_ar: 'إدارة وصيانة قواعد البيانات وضمان سلامتها',
          description_en: 'Managing and maintaining databases and ensuring their integrity',
          sector: 'إدارة',
          order: 5
        }
      ],

      program_overview_ar: 'برنامج تكنولوجيا المعلومات في كلية إيلول الجامعية هو برنامج متطور ومعتمد يهدف إلى إعداد كوادر متخصصة في مجال التكنولوجيا والحاسوب. يتميز البرنامج بمنهج شامل يجمع بين الأسس النظرية القوية والتطبيق العملي المكثف، مما يضمن تخريج طلاب مؤهلين لمواجهة تحديات سوق العمل الحديث.',
      program_overview_en: 'The Information Technology program at Eylul University College is an advanced and accredited program aimed at preparing specialized personnel in the field of technology and computing. The program features a comprehensive curriculum that combines strong theoretical foundations with intensive practical application, ensuring the graduation of qualified students to face the challenges of the modern job market.',
      student_count: 245
    };

    const { data, error } = await supabase
      .from('dynamic_academic_programs')
      .insert(itProgramData as any)
      .select()
      .single();

    if (error) {
      console.error('خطأ في إدراج بيانات تكنولوجيا المعلومات:', error);
      throw error;
    }

    console.log('تم إدراج بيانات تكنولوجيا المعلومات بنجاح');
    return data;
  } catch (error) {
    console.error('خطأ في seedITData:', error);
    throw error;
  }
};