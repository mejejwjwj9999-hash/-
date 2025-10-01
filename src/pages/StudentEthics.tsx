import React from 'react';
import { Shield, Users, BookOpen, Heart, Star, AlertTriangle } from 'lucide-react';

const StudentEthics = () => {
  const ethicalPrinciples = [
    {
      title: 'الأمانة الأكاديمية',
      description: 'التزام الطالب بالصدق والنزاهة في جميع الأعمال الأكاديمية',
      icon: Shield,
      details: [
        'عدم الغش في الامتحانات',
        'تجنب الانتحال في البحوث والتقارير',
        'الاعتراف بالمصادر والمراجع',
        'التعاون الأكاديمي المشروع'
      ]
    },
    {
      title: 'الاحترام المتبادل',
      description: 'احترام جميع أعضاء المجتمع الجامعي من طلاب وأساتذة وموظفين',
      icon: Users,
      details: [
        'التعامل بأدب مع الآخرين',
        'احترام الآراء المختلفة',
        'تجنب العنف اللفظي أو الجسدي',
        'المحافظة على كرامة الآخرين'
      ]
    },
    {
      title: 'المسؤولية الاجتماعية',
      description: 'تحمل المسؤولية تجاه المجتمع والبيئة الجامعية',
      icon: Heart,
      details: [
        'المشاركة في الأنشطة المجتمعية',
        'المحافظة على البيئة الجامعية',
        'مساعدة الزملاء المحتاجين',
        'تمثيل الكلية بصورة مشرفة'
      ]
    },
    {
      title: 'التميز والإبداع',
      description: 'السعي نحو التفوق الأكاديمي والمهني والشخصي',
      icon: Star,
      details: [
        'الاجتهاد في الدراسة',
        'تطوير المهارات الذاتية',
        'المشاركة في الأنشطة العلمية',
        'الابتكار والإبداع'
      ]
    }
  ];

  const academicMisconduct = [
    {
      type: 'الغش في الامتحانات',
      examples: [
        'استخدام مواد غير مصرح بها',
        'النقل من طالب آخر',
        'استخدام الأجهزة الإلكترونية'
      ],
      consequences: 'رسوب في المادة + إنذار أكاديمي'
    },
    {
      type: 'الانتحال العلمي',
      examples: [
        'نسخ أعمال الآخرين دون إذن',
        'عدم توثيق المصادر',
        'تقديم نفس العمل لأكثر من مادة'
      ],
      consequences: 'رسوب في المادة + تنبيه خطي'
    },
    {
      type: 'التزوير',
      examples: [
        'تزوير الوثائق الرسمية',
        'تزوير التوقيعات',
        'تعديل الدرجات'
      ],
      consequences: 'فصل من الكلية'
    }
  ];

  const positiveValues = [
    {
      value: 'الصدق',
      description: 'أساس جميع التعاملات الأكاديمية والشخصية'
    },
    {
      value: 'العدالة',
      description: 'التعامل بإنصاف مع جميع أفراد المجتمع الجامعي'
    },
    {
      value: 'التسامح',
      description: 'قبول الاختلافات وتقدير التنوع الثقافي'
    },
    {
      value: 'التعاون',
      description: 'العمل الجماعي لتحقيق الأهداف المشتركة'
    },
    {
      value: 'المثابرة',
      description: 'الاستمرار في السعي نحو تحقيق الأهداف'
    },
    {
      value: 'المبادرة',
      description: 'اتخاذ خطوات إيجابية نحو التطوير والتحسين'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="hero-section text-white py-16">
        <div className="hero-content">
          <div className="container-custom">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                  <Shield size={48} className="text-university-gold" />
                </div>
              </div>
              <h1 className="text-page-title text-white mb-4">سلوكيات وأخلاقيات الطالب الجامعي</h1>
              <p className="text-subtitle text-white/90 max-w-2xl mx-auto">
                مبادئ وقيم أخلاقية توجه سلوك الطالب في رحلته الأكاديمية
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ethical Principles */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">المبادئ الأخلاقية الأساسية</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            <p className="text-subtitle max-w-3xl mx-auto">
              القيم الأساسية التي يجب على كل طالب التمسك بها
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {ethicalPrinciples.map((principle, index) => (
              <div key={index} className="card-elevated">
                <div className="flex items-start gap-4 mb-6">
                  <principle.icon className="w-12 h-12 text-university-blue flex-shrink-0" />
                  <div>
                    <h3 className="text-card-title mb-2">{principle.title}</h3>
                    <p className="text-body">{principle.description}</p>
                  </div>
                </div>
                
                <h4 className="text-lg font-bold mb-4">التفاصيل:</h4>
                <ul className="space-y-2">
                  {principle.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-university-blue rounded-full"></div>
                      <span className="text-body">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Misconduct */}
      <section className="section-padding bg-academic-gray-light">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">المخالفات الأكاديمية والعواقب</h2>
            <div className="w-24 h-1 bg-university-red mx-auto mb-6"></div>
            <p className="text-subtitle max-w-3xl mx-auto text-university-red">
              السلوكيات المحظورة والعقوبات المترتبة عليها
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {academicMisconduct.map((misconduct, index) => (
              <div key={index} className="card-elevated border-l-4 border-university-red">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-8 h-8 text-university-red" />
                  <h3 className="text-card-title text-university-red">{misconduct.type}</h3>
                </div>
                
                <h4 className="text-lg font-bold mb-3">أمثلة:</h4>
                <ul className="space-y-2 mb-6">
                  {misconduct.examples.map((example, exampleIndex) => (
                    <li key={exampleIndex} className="flex items-start gap-2">
                      <span className="text-university-red text-lg">•</span>
                      <span className="text-body">{example}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="bg-university-red-light p-4 rounded-lg">
                  <h4 className="font-bold text-university-red mb-2">العواقب:</h4>
                  <p className="text-body">{misconduct.consequences}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Positive Values */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">القيم الإيجابية المطلوبة</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            <p className="text-subtitle max-w-3xl mx-auto">
              الصفات والقيم التي نسعى لترسيخها في شخصية الطالب الجامعي
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {positiveValues.map((valueItem, index) => (
              <div key={index} className="card-elevated text-center hover:shadow-university transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-university-blue to-university-gold rounded-full mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-card-title mb-3">{valueItem.value}</h3>
                <p className="text-body">{valueItem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code of Conduct */}
      <section className="section-padding bg-university-blue text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title text-white mb-6">ميثاق الشرف الأكاديمي</h2>
            <p className="text-subtitle text-gray-200 max-w-3xl mx-auto">
              التزام كل طالب بالمبادئ الأخلاقية والأكاديمية
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-university-gold mb-4">أتعهد بأن:</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 text-right">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-university-gold mt-1 flex-shrink-0" />
                    <span>أكون صادقاً في جميع أعمالي الأكاديمية</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-university-gold mt-1 flex-shrink-0" />
                    <span>أحترم حقوق الملكية الفكرية للآخرين</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-university-gold mt-1 flex-shrink-0" />
                    <span>أتعامل بأدب واحترام مع جميع أفراد المجتمع الجامعي</span>
                  </li>
                </ul>
                
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-university-gold mt-1 flex-shrink-0" />
                    <span>أساهم في خلق بيئة تعليمية إيجابية</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-university-gold mt-1 flex-shrink-0" />
                    <span>أمثل كليتي ووطني بأفضل صورة</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-university-gold mt-1 flex-shrink-0" />
                    <span>أسعى للتميز في دراستي وسلوكي</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentEthics;