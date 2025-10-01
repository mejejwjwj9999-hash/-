-- تحديث بيانات برنامج إدارة الأعمال مع البيانات الجديدة
UPDATE public.dynamic_academic_programs 
SET 
  program_overview_ar = 'يهدف برنامج إدارة الأعمال إلى إعداد وتأهيل الخريجين وتزويدهم بالمعرفة والمهارات الإدارية اللازمة لإدارة المنظمات بكفاءة وفعالية، ويغطي البرنامج مجموعة واسعة من المقررات مثل المحاسبة والمالية والتسويق وإدارة الموارد البشرية وإدارة العمليات وإدارة المشاريع وريادة الأعمال، كما يسهم في تحسين مهارات الخريجين القابلة للتحويل إلى برامج دراسات عليا.',
  program_overview_en = 'The Business Administration program aims to prepare and qualify graduates by providing them with the knowledge and administrative skills necessary to manage organizations efficiently and effectively. The program covers a wide range of courses such as accounting, finance, marketing, human resources management, operations management, project management, and entrepreneurship.',
  student_count = 120,
  program_vision_ar = 'التميز والريادة في التعليم والبحث في مجال إدارة الأعمال',
  program_vision_en = 'Excellence and leadership in education and research in business administration',
  program_mission_ar = 'توفير تعليم متميز والتوسع في البحث العلمي وتعزيز وتطوير الخريجين في مجال إدارة الأعمال من خلال ذلك التطوير',
  program_mission_en = 'Providing excellent education, expanding scientific research, and enhancing and developing graduates in business administration through such development',
  program_objectives = '[
    {
      "ar": "تنمية المعرفة والمهارات الإدارية اللازمة للخريج",
      "en": "Developing the necessary administrative knowledge and skills for graduates"
    },
    {
      "ar": "تصميم المناهج الدراسية الحديثة واستخدام أساليب تدريس مبتكرة وتفاعلية",
      "en": "Designing modern curricula and using innovative and interactive teaching methods"
    },
    {
      "ar": "تطوير برامج بحثية في إدارة الأعمال تسهم في إنتاج المعرفة الجديدة",
      "en": "Developing research programs in business administration that contribute to producing new knowledge"
    },
    {
      "ar": "تشجيع الخريجين على إجراء أبحاث مستقلة والمشاركة في مشاريع بحثية",
      "en": "Encouraging graduates to conduct independent research and participate in research projects"
    },
    {
      "ar": "تطوير مهارات رواد الأعمال وتشجيعهم على تحويل الأفكار الابتكارية إلى مشاريع ناجحة",
      "en": "Developing entrepreneurial skills and encouraging them to transform innovative ideas into successful projects"
    },
    {
      "ar": "تعزيز توجهات الخريجين وتوسيع آفاقهم ومعارفهم",
      "en": "Enhancing graduates orientations and expanding their horizons and knowledge"
    },
    {
      "ar": "تمكين الخريجين من خدمة المجتمع وحل المشكلات الاجتماعية والاقتصادية",
      "en": "Enabling graduates to serve society and solve social and economic problems"
    }
  ]'::jsonb,
  graduate_specifications = '[
    {
      "ar": "يتميز خريج برنامج إدارة الأعمال بالعديد من المواصفات",
      "en": "Business administration program graduate is distinguished by many specifications"
    },
    {
      "ar": "لديه معرفة كافية بأساسيات ومفاهيم إدارة الأعمال",
      "en": "Has sufficient knowledge of business administration fundamentals and concepts"
    },
    {
      "ar": "ذو قدرة عالية على صناعة القرارات",
      "en": "Has high ability in decision making"
    },
    {
      "ar": "يتصف بالقدرة على التأثير على الآخرين كإداري ناجح",
      "en": "Characterized by the ability to influence others as a successful administrator"  
    },
    {
      "ar": "يمتلك القدرة على ابتكار وإدارة الأعمال كرائد أعمال",
      "en": "Has the ability to innovate and manage business as an entrepreneur"
    },
    {
      "ar": "ملتزم بأخلاقيات العمل والمعايير القانونية",
      "en": "Committed to work ethics and legal standards"
    },
    {
      "ar": "يمتلك مهارات التعاون والتفاوض الجيد",
      "en": "Possesses cooperation and good negotiation skills"
    }
  ]'::jsonb,
  learning_outcomes = '[
    {
      "category": "knowledge",
      "title_ar": "المعرفة والفهم",
      "title_en": "Knowledge and Understanding",
      "outcomes": [
        {
          "ar": "يظهر المعرفة بالنظريات والنماذج المتعلقة بأساسيات علم الإدارة وفلسفتها وتطبيقاتها المختلفة",
          "en": "Demonstrates knowledge of theories and models related to management science fundamentals, philosophy, and various applications"
        },
        {
          "ar": "يعمل على تزويد الطالب بالمعرفة والمهارات اللازمة لفهم خصائص المنظمات وأهدافها ووظائفها",
          "en": "Works to provide students with knowledge and skills necessary to understand organizations characteristics, objectives, and functions"
        },
        {
          "ar": "يناقش المفاهيم القانونية والسياسية والاقتصادية والاجتماعية والثقافية المتعلقة بإدارة الأعمال",
          "en": "Discusses legal, political, economic, social, and cultural concepts related to business administration"
        }
      ]
    },
    {
      "category": "skills",
      "title_ar": "المهارات",
      "title_en": "Skills",
      "outcomes": [
        {
          "ar": "التفكير بطريقة إبداعية في حل المشكلات المتعلقة بإدارة الأعمال",
          "en": "Creative thinking in solving problems related to business administration"
        },
        {
          "ar": "تحليل البيئة الاقتصادية والسياسية والقانونية والتكنولوجية",
          "en": "Analyzing economic, political, legal, and technological environment"
        },
        {
          "ar": "إعداد الخطط الاستراتيجية والتنفيذية لنماذج الأعمال",
          "en": "Preparing strategic and operational plans for business models"
        },
        {
          "ar": "ممارسة مهارات القيادة وإدارة فرق العمل المختلفة",
          "en": "Practicing leadership skills and managing different work teams"
        },
        {
          "ar": "توظيف تكنولوجيا المعلومات بكفاءة وفاعلية في الأعمال",
          "en": "Employing information technology efficiently and effectively in business"
        }
      ]
    },
    {
      "category": "competencies",
      "title_ar": "الكفاءات",
      "title_en": "Competencies",
      "outcomes": [
        {
          "ar": "تقديم المبادرات الفردية والجماعية والمشاريع",
          "en": "Presenting individual and group initiatives and projects"
        },
        {
          "ar": "يتواصل بفعالية ويدير فرق العمل بكفاءة مراعيا تعاليم الدين والهوية الوطنية الإسلامية",
          "en": "Communicates effectively and manages work teams efficiently, considering religious teachings and Islamic national identity"
        },
        {
          "ar": "يوظف مهارات التعامل مع الحاسوب بفعالية في المجال",
          "en": "Employs computer skills effectively in the field"
        },
        {
          "ar": "يعد تقارير ويعد خطط استراتيجية فاعلة للمؤسسة التي يعمل فيها",
          "en": "Prepares reports and develops effective strategic plans for the organization they work in"
        }
      ]
    }
  ]'::jsonb,
  job_opportunities = '[
    {
      "ar": "إدارة المشاريع كمدير عمل في القطاعات الصناعية المتنوعة",
      "en": "Project management as a business manager in various industrial sectors"
    },
    {
      "ar": "التسويق والمبيعات، حيث تتولى مسؤولية تنفيذ حملات إعلانية والتعامل مع العملاء",
      "en": "Marketing and sales, where you take responsibility for implementing advertising campaigns and dealing with customers"
    },
    {
      "ar": "إدارة الموارد البشرية، حيث تتولى مسؤولية توظيف وتطوير البرامج التدريبية للموظفين",
      "en": "Human resources management, where you take responsibility for recruiting and development programs for employees"
    },
    {
      "ar": "إعداد التقارير في مجال المحاسبة والمالية، سواء في الشركات أو التخطيط المالي",
      "en": "Preparing reports in accounting and finance, whether in companies or financial planning"
    },
    {
      "ar": "ريادة الأعمال وتأسيس مشروعك الخاص",
      "en": "Entrepreneurship and establishing your own business"
    },
    {
      "ar": "إدارة الأعمال والتنسيق بين الإدارات المختلفة في المؤسسات والشركات",
      "en": "Business management and coordination between different departments in institutions and companies"
    },
    {
      "ar": "إدارة سلسلة التوريد وتنظيم وتخطيط تدفق المواد والسلع في الشركات",
      "en": "Supply chain management and organizing and planning the flow of materials and goods in companies"
    },
    {
      "ar": "العمل في القطاع المصرفي، سواء في التأمين أو إدارة المخاطر أو المبيعات",
      "en": "Working in the banking sector, whether in insurance, risk management, or sales"
    },
    {
      "ar": "إدارة العلاقات العامة والتواصل الداخلي والخارجي للشركات وبناء صورتها",
      "en": "Public relations management and internal and external communication for companies and building their image"
    }
  ]'::jsonb,
  benchmark_programs = '[
    {
      "university_ar": "جامعة حضرموت",
      "university_en": "Hadramout University",
      "location": "اليمن - حضرموت",
      "program_name": "برنامج بكالوريوس إدارة الأعمال"
    },
    {
      "university_ar": "جامعة العلوم والتكنولوجيا",
      "university_en": "University of Science and Technology",
      "location": "اليمن",
      "program_name": "برنامج بكالوريوس إدارة الأعمال"
    },
    {
      "university_ar": "جامعة الأقصى",
      "university_en": "Al-Aqsa University",
      "location": "فلسطين",
      "program_name": "برنامج بكالوريوس إدارة الأعمال"
    },
    {
      "university_ar": "جامعة اليرموك",
      "university_en": "Yarmouk University",
      "location": "الأردن",
      "program_name": "برنامج بكالوريوس إدارة الأعمال"
    },
    {
      "university_ar": "جامعة كولومبو",
      "university_en": "University of Colombo",
      "location": "سريلانكا",
      "program_name": "كلية إدارة الأعمال"
    }
  ]'::jsonb
WHERE program_key = 'business';