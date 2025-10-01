
import React from 'react';
import { Calendar, Users, Building, Award, BookOpen, Trophy } from 'lucide-react';

const History = () => {
  const timeline = [
    {
      year: '2023',
      title: 'تأسيس الكلية',
      description: 'تأسست كلية أيلول الجامعية بقرار من وزارة التعليم العالي والبحث العلمي، لتكون صرحاً علمياً متميزاً في اليمن.',
      icon: Building,
      color: 'bg-university-blue'
    },
    {
      year: '2023',
      title: 'بداية الفصل الأول',
      description: 'استقبلت الكلية أول دفعة من الطلاب في خمسة تخصصات رئيسية، بإجمالي 150 طالباً وطالبة.',
      icon: Users,
      color: 'bg-university-red'
    },
    {
      year: '2023',
      title: 'افتتاح المختبرات',
      description: 'افتتاح مختبرات علمية متطورة مجهزة بأحدث الأجهزة لخدمة التخصصات الطبية والعلمية.',
      icon: Award,
      color: 'bg-university-gold'
    },
    {
      year: '2024',
      title: 'التوسع الأكاديمي',
      description: 'زيادة عدد الطلاب إلى أكثر من 300 طالب وطالبة، وتطوير البرامج الأكاديمية.',
      icon: BookOpen,
      color: 'bg-university-blue'
    },
    {
      year: '2024',
      title: 'الاعتماد الأكاديمي',
      description: 'الحصول على اعتماد هيئة ضمان الجودة والاعتماد الأكاديمي لجميع البرامج.',
      icon: Trophy,
      color: 'bg-university-red'
    }
  ];

  const milestones = [
    {
      number: '2',
      label: 'سنوات من التميز',
      icon: Calendar
    },
    {
      number: '300+',
      label: 'طالب وطالبة',
      icon: Users
    },
    {
      number: '5',
      label: 'تخصصات أكاديمية',
      icon: BookOpen
    },
    {
      number: '25+',
      label: 'عضو هيئة تدريس',
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="hero-section py-20">
        <div className="hero-content container-custom text-center">
          <h1 className="text-page-title text-white mb-6">تاريخ الكلية</h1>
          <p className="text-subtitle text-gray-200 max-w-4xl mx-auto">
            رحلة تأسيس وتطوير كلية أيلول الجامعية منذ انطلاقتها وحتى اليوم، قصة نجاح مليئة بالإنجازات والتطلعات
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">المحطات التاريخية</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            <p className="text-subtitle max-w-3xl mx-auto">
              تتبع مسيرة كلية أيلول الجامعية عبر أهم المحطات والإنجازات التي حققتها منذ التأسيس
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute right-8 top-0 bottom-0 w-1 bg-university-blue-light"></div>
              
              {timeline.map((event, index) => (
                <div key={index} className="relative flex items-start mb-12">
                  {/* Timeline Icon */}
                  <div className={`${event.color} w-16 h-16 rounded-full flex items-center justify-center mr-8 relative z-10 shadow-medium`}>
                    <event.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 card-elevated">
                    <div className="flex items-center mb-4">
                      <h3 className="text-card-title text-university-blue">{event.title}</h3>
                      <span className="bg-university-gold text-university-blue px-3 py-1 rounded-full text-sm font-bold mr-4">
                        {event.year}
                      </span>
                    </div>
                    <p className="text-body">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="section-padding bg-academic-gray-light">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">إنجازاتنا بالأرقام</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            <p className="text-subtitle max-w-3xl mx-auto">
              أرقام تحكي قصة نجاح كلية أيلول الجامعية وتطورها المستمر
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="card-elevated text-center hover:shadow-university transition-all duration-300">
                <milestone.icon className="w-16 h-16 text-university-blue mx-auto mb-6" />
                <h3 className="text-4xl font-bold text-university-blue mb-2 font-cairo">{milestone.number}</h3>
                <p className="text-body font-tajawal">{milestone.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founding Story */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-section-title mb-4">قصة التأسيس</h2>
              <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="card-elevated">
                <h3 className="text-card-title mb-6">الحلم والرؤية</h3>
                <div className="text-body space-y-4 text-right">
                  <p>
                    نشأت فكرة تأسيس كلية أيلول الجامعية من إيمان عميق بأهمية التعليم العالي الجيد 
                    في بناء مستقبل أفضل لليمن. في ظل الحاجة الماسة لمؤسسات تعليمية متطورة تواكب 
                    التطورات العلمية والتكنولوجية الحديثة.
                  </p>
                  <p>
                    اختيرت مدينة يريم لتكون مقراً للكلية نظراً لموقعها الاستراتيجي وتاريخها العريق 
                    في التعليم، ولتساهم في التنمية الأكاديمية والاقتصادية للمنطقة بأكملها.
                  </p>
                </div>
              </div>

              <div className="card-elevated">
                <h3 className="text-card-title mb-6">التحديات والإنجازات</h3>
                <div className="text-body space-y-4 text-right">
                  <p>
                    رغم التحديات التي واجهت الكلية في بداياتها، تمكنت من تحقيق إنجازات مهمة في وقت قصير. 
                    نجحت في استقطاب نخبة من أعضاء هيئة التدريس المتميزين وتوفير بيئة تعليمية محفزة للطلاب.
                  </p>
                  <p>
                    اليوم، تقف كلية أيلول الجامعية كمنارة علمية تفخر بطلابها وخريجيها الذين يساهمون 
                    في خدمة المجتمع في مختلف القطاعات الحيوية.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="section-padding bg-university-blue text-white">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-section-title text-white mb-8">نحو المستقبل</h2>
            <div className="text-body space-y-6 text-center">
              <p className="text-xl text-slate-50">
                تتطلع كلية أيلول الجامعية إلى مستقبل مشرق مليء بالطموحات والإنجازات. نسعى لتوسيع 
                نطاق برامجنا الأكاديمية وتطوير مرافقنا التعليمية لتواكب أحدث المعايير العالمية.
              </p>
              <p className="text-lg text-slate-50">
                هدفنا هو أن نصبح من الجامعات الرائدة في المنطقة، ونساهم بفعالية في التنمية المستدامة 
                وبناء جيل من المتخصصين المؤهلين القادرين على مواجهة تحديات المستقبل.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default History;
