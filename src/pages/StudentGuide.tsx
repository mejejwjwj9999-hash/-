import React from 'react';
import { BookOpen, Download, FileText, Info, CheckCircle, Home } from 'lucide-react';
import UnifiedHeroSection from '@/components/ui/unified-hero-section';
import UnifiedBackButton from '@/components/ui/unified-back-button';

const StudentGuide = () => {
  const guideSection = [
    {
      title: 'نظام القبول والتسجيل',
      icon: FileText,
      topics: [
        'شروط القبول',
        'إجراءات التسجيل',
        'المستندات المطلوبة',
        'الرسوم الدراسية'
      ]
    },
    {
      title: 'النظام الأكاديمي',
      icon: BookOpen,
      topics: [
        'نظام الساعات المعتمدة',
        'متطلبات التخرج',
        'نظام التقديرات',
        'الخطة الدراسية'
      ]
    },
    {
      title: 'حقوق وواجبات الطالب',
      icon: CheckCircle,
      topics: [
        'الحقوق الأكاديمية',
        'الواجبات والالتزامات',
        'السلوك الأكاديمي',
        'آليات التظلم'
      ]
    },
    {
      title: 'الخدمات الطلابية',
      icon: Info,
      topics: [
        'الخدمات الأكاديمية',
        'الأنشطة الطلابية',
        'الدعم النفسي',
        'خدمات المكتبة'
      ]
    }
  ];

  const downloads = [
    {
      title: 'دليل الطالب الجامعي الكامل',
      description: 'النسخة الكاملة من دليل الطالب لجميع التخصصات',
      size: '2.5 MB',
      type: 'PDF'
    },
    {
      title: 'لائحة الامتحانات والتقييم',
      description: 'قواعد وإجراءات الامتحانات والتقييم',
      size: '1.2 MB',
      type: 'PDF'
    },
    {
      title: 'دليل الخدمات الطلابية',
      description: 'شرح شامل لجميع الخدمات المتاحة للطلاب',
      size: '900 KB',
      type: 'PDF'
    },
    {
      title: 'نماذج وإستمارات الطلاب',
      description: 'مجموعة النماذج والإستمارات المطلوبة',
      size: '1.8 MB',
      type: 'ZIP'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeroSection
        icon={BookOpen}
        title="دليل الطالب الجامعي"
        subtitle="دليل شامل يحتوي على جميع المعلومات التي يحتاجها الطالب خلال رحلته الأكاديمية"
        breadcrumb={
          <UnifiedBackButton 
            breadcrumbs={[
              { label: 'الرئيسية', href: '/', icon: Home },
              { label: 'دليل الطالب الجامعي', icon: BookOpen }
            ]}
          />
        }
      />

      {/* Guide Sections */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">محتويات الدليل</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            <p className="text-subtitle max-w-3xl mx-auto">
              يغطي الدليل جميع الجوانب الأكاديمية والإدارية التي تهم الطالب
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {guideSection.map((section, index) => (
              <div key={index} className="card-elevated hover:shadow-university transition-all duration-300">
                <section.icon className="w-12 h-12 text-university-blue mb-4" />
                <h3 className="text-card-title mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-university-blue rounded-full"></div>
                      <span className="text-body text-right">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Information */}
      <section className="section-padding bg-academic-gray-light">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-section-title mb-4">معلومات مهمة للطلاب</h2>
              <div className="w-24 h-1 bg-university-blue mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="card-elevated">
                <h3 className="text-card-title text-university-blue mb-4">نظام الدراسة</h3>
                <ul className="text-body space-y-3">
                  <li>• نظام الساعات المعتمدة</li>
                  <li>• فصلان دراسيان + فصل صيفي اختياري</li>
                  <li>• الحد الأدنى للتخرج: 132 ساعة معتمدة</li>
                  <li>• نظام التقديرات من A إلى F</li>
                  <li>• الحد الأدنى للمعدل التراكمي: 2.0</li>
                </ul>
              </div>

              <div className="card-elevated">
                <h3 className="text-card-title text-university-blue mb-4">الحضور والغياب</h3>
                <ul className="text-body space-y-3">
                  <li>• الحد الأقصى للغياب: 25% من الساعات</li>
                  <li>• إنذار أكاديمي عند تجاوز نسبة الغياب</li>
                  <li>• إمكانية الحرمان من الامتحان النهائي</li>
                  <li>• ضرورة تقديم عذر مقبول للغياب</li>
                  <li>• توثيق الحضور في كل محاضرة</li>
                </ul>
              </div>

              <div className="card-elevated">
                <h3 className="text-card-title text-university-blue mb-4">الامتحانات</h3>
                <ul className="text-body space-y-3">
                  <li>• امتحانات دورية خلال الفصل</li>
                  <li>• امتحان منتصف الفصل (30%)</li>
                  <li>• الامتحان النهائي (50%)</li>
                  <li>• أعمال السنة والمشاركة (20%)</li>
                </ul>
              </div>

              <div className="card-elevated">
                <h3 className="text-card-title text-university-blue mb-4">الخدمات الأكاديمية</h3>
                <ul className="text-body space-y-3">
                  <li>• الإرشاد الأكاديمي المستمر</li>
                  <li>• المكتبة الرقمية والتقليدية</li>
                  <li>• مختبرات علمية متخصصة</li>
                  <li>• برامج تدريبية وورش عمل</li>
                  <li>• دعم نفسي واجتماعي</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Downloads */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">تحميل الوثائق</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            <p className="text-subtitle max-w-3xl mx-auto">
              حمل النسخ الإلكترونية من جميع الوثائق والنماذج المطلوبة
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {downloads.map((download, index) => (
              <div key={index} className="card-elevated">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-card-title mb-2">{download.title}</h3>
                    <p className="text-body mb-3">{download.description}</p>
                    <div className="flex items-center gap-4 text-small text-academic-gray">
                      <span>حجم الملف: {download.size}</span>
                      <span>نوع الملف: {download.type}</span>
                    </div>
                  </div>
                  <button className="bg-university-blue text-white p-3 rounded-lg hover:bg-university-blue-dark transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="card-elevated bg-university-blue-light">
              <h3 className="text-card-title text-university-blue mb-4">تحتاج مساعدة؟</h3>
              <p className="text-body mb-6">
                إذا كان لديك أي استفسار حول الدليل أو تحتاج توضيحات إضافية، 
                لا تتردد في التواصل مع قسم شؤون الطلاب
              </p>
              <div className="flex justify-center gap-4">
                <button className="btn-primary">تواصل معنا</button>
                <button className="btn-secondary">الأسئلة الشائعة</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentGuide;