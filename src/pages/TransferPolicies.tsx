import React from 'react';
import { ArrowRightLeft, FileCheck, CheckCircle, AlertCircle, Clock, BookOpen, Home } from 'lucide-react';
import UnifiedPageHeader from '@/components/ui/unified-page-header';

const TransferPolicies = () => {
  const transferTypes = [
    {
      title: 'التحويل من كلية أخرى',
      description: 'التحويل من كلية أخرى داخل أو خارج اليمن',
      icon: ArrowRightLeft,
      requirements: [
        'شهادة الثانوية العامة الأصلية',
        'كشف درجات معتمد من الكلية المحول منها',
        'شهادة عدم ممانعة من الكلية السابقة',
        'صورة من الهوية الشخصية'
      ]
    },
    {
      title: 'التحويل بين التخصصات',
      description: 'التحويل من تخصص إلى آخر داخل الكلية',
      icon: BookOpen,
      requirements: [
        'موافقة رئيس القسم المحول منه',
        'موافقة رئيس القسم المحول إليه',
        'استيفاء شروط القبول للتخصص الجديد',
        'معدل تراكمي لا يقل عن 2.5'
      ]
    }
  ];

  const transferSteps = [
    {
      step: 1,
      title: 'تقديم الطلب',
      description: 'تعبئة استمارة طلب التحويل وتقديم المستندات المطلوبة',
      icon: FileCheck
    },
    {
      step: 2,
      title: 'المراجعة الأولية',
      description: 'مراجعة الطلب والمستندات من قبل قسم القبول والتسجيل',
      icon: CheckCircle
    },
    {
      step: 3,
      title: 'التقييم الأكاديمي',
      description: 'تقييم المواد المجتازة ومعادلتها مع المنهج المعتمد',
      icon: BookOpen
    },
    {
      step: 4,
      title: 'القرار النهائي',
      description: 'إصدار القرار النهائي وإشعار الطالب بالنتيجة',
      icon: AlertCircle
    }
  ];

  const creditTransferRules = [
    {
      category: 'المواد العامة',
      transferRate: '100%',
      conditions: 'جميع المواد العامة قابلة للتحويل',
      color: 'university-green'
    },
    {
      category: 'مواد التخصص',
      transferRate: '75%',
      conditions: 'المواد المطابقة للمنهج المعتمد',
      color: 'university-blue'
    },
    {
      category: 'المواد الاختيارية',
      transferRate: '50%',
      conditions: 'حسب توصية القسم المختص',
      color: 'university-gold'
    },
    {
      category: 'التدريب العملي',
      transferRate: '25%',
      conditions: 'يتطلب إعادة تقييم',
      color: 'university-red'
    }
  ];

  const importantNotes = [
    'يجب ألا يقل معدل الطالب التراكمي عن 2.0 في الكلية المحول منها',
    'لا يحق للطالب التحويل أكثر من مرة واحدة خلال فترة الدراسة',
    'يتم احتساب المعدل التراكمي من بداية الدراسة في الكلية',
    'بعض التخصصات قد تتطلب امتحان قبول إضافي',
    'الطالب مسؤول عن استكمال أي متطلبات إضافية للتخصص الجديد',
    'لا يمكن التحويل في الفصل الأخير قبل التخرج'
  ];

  return (
    <div className="min-h-screen bg-background">
      <UnifiedPageHeader
        icon={ArrowRightLeft}
        title="شروط وضوابط المقاصة والتحويل"
        subtitle="تعرف على شروط وإجراءات التحويل والمقاصة للطلاب"
        breadcrumbs={[
          { label: 'الرئيسية', href: '/', icon: Home },
          { label: 'شروط وضوابط المقاصة والتحويل', icon: ArrowRightLeft }
        ]}
      />

      {/* Transfer Types */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">أنواع التحويل</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            <p className="text-subtitle max-w-3xl mx-auto">
              نوفر إمكانية التحويل بين الكليات والتخصصات وفقاً لضوابط محددة
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {transferTypes.map((type, index) => (
              <div key={index} className="card-elevated">
                <div className="flex items-center gap-4 mb-6">
                  <type.icon className="w-12 h-12 text-university-blue" />
                  <div>
                    <h3 className="text-card-title">{type.title}</h3>
                    <p className="text-body">{type.description}</p>
                  </div>
                </div>
                
                <h4 className="text-lg font-bold mb-4">المتطلبات:</h4>
                <ul className="space-y-2">
                  {type.requirements.map((requirement, reqIndex) => (
                    <li key={reqIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-university-green mt-0.5 flex-shrink-0" />
                      <span className="text-body">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transfer Process */}
      <section className="section-padding bg-academic-gray-light">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">خطوات التحويل</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            <p className="text-subtitle max-w-3xl mx-auto">
              إجراءات واضحة ومبسطة لعملية التحويل
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {transferSteps.map((step, index) => (
              <div key={index} className="card-elevated text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-university-blue rounded-full mx-auto flex items-center justify-center mb-4">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-university-gold rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{step.step}</span>
                  </div>
                </div>
                <h3 className="text-card-title mb-3">{step.title}</h3>
                <p className="text-body">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credit Transfer Rules */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">قواعد مقاصة الساعات المعتمدة</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            <p className="text-subtitle max-w-3xl mx-auto">
              نسب المقاصة المعتمدة لكل فئة من المواد الدراسية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {creditTransferRules.map((rule, index) => (
              <div key={index} className="card-elevated text-center">
                <div className={`text-4xl font-bold text-${rule.color} mb-3`}>
                  {rule.transferRate}
                </div>
                <h3 className="text-card-title mb-3">{rule.category}</h3>
                <p className="text-body">{rule.conditions}</p>
              </div>
            ))}
          </div>

          <div className="card-elevated bg-university-blue-light">
            <h3 className="text-card-title text-university-blue mb-4">ملاحظة مهمة</h3>
            <p className="text-body">
              تخضع عملية مقاصة الساعات المعتمدة لتقييم مفصل من قبل اللجنة الأكاديمية المختصة، 
              وقد تختلف النسب حسب طبيعة كل مادة ومدى تطابقها مع المنهج المعتمد في الكلية.
            </p>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="section-padding bg-academic-gray-light">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-section-title mb-4">ملاحظات مهمة</h2>
              <div className="w-24 h-1 bg-university-blue mx-auto"></div>
            </div>

            <div className="card-elevated">
              <div className="grid md:grid-cols-2 gap-6">
                {importantNotes.map((note, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-university-red mt-0.5 flex-shrink-0" />
                    <span className="text-body">{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-university-blue text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title text-white mb-6">المواعيد الزمنية</h2>
            <p className="text-subtitle text-gray-200 max-w-3xl mx-auto">
              التوقيتات المحددة لتقديم طلبات التحويل خلال العام الأكاديمي
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-university-gold" />
              </div>
              <h3 className="text-lg font-bold mb-2">بداية الفصل</h3>
              <p className="text-gray-200">الأسبوعان الأولان من بداية كل فصل دراسي</p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileCheck className="w-8 h-8 text-university-gold" />
              </div>
              <h3 className="text-lg font-bold mb-2">فترة المراجعة</h3>
              <p className="text-gray-200">أسبوعان لمراجعة الطلبات والمستندات</p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-university-gold" />
              </div>
              <h3 className="text-lg font-bold mb-2">إعلان النتائج</h3>
              <p className="text-gray-200">في الأسبوع الخامس من بداية الفصل</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TransferPolicies;