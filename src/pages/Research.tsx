import React from 'react';
import { Search, BookOpen, Users, Award, TrendingUp, Download, Home } from 'lucide-react';
import UnifiedHeroSection from '@/components/ui/unified-hero-section';
import UnifiedBackButton from '@/components/ui/unified-back-button';

const Research = () => {
  const researchAreas = [
    {
      title: 'البحوث الطبية',
      description: 'بحوث في مجال الطب والعلوم الصحية',
      projects: 15,
      icon: Award
    },
    {
      title: 'البحوث الصيدلانية',
      description: 'دراسات في علوم الصيدلة والأدوية',
      projects: 12,
      icon: BookOpen
    },
    {
      title: 'بحوث التمريض',
      description: 'أبحاث في مجال التمريض والرعاية الصحية',
      projects: 8,
      icon: Users
    },
    {
      title: 'تكنولوجيا المعلومات',
      description: 'بحوث في التقنيات الحديثة والذكاء الاصطناعي',
      projects: 10,
      icon: TrendingUp
    }
  ];

  const recentPublications = [
    {
      title: 'تأثير العلاج الطبيعي على مرضى السكري',
      authors: 'د. أحمد محمد، د. فاطمة علي',
      journal: 'مجلة الطب اليمنية',
      year: '2024',
      category: 'طبي'
    },
    {
      title: 'تطوير أنظمة إدارة المعلومات الصحية',
      authors: 'د. محمد الحداد، د. سارة أحمد',
      journal: 'مجلة تكنولوجيا المعلومات',
      year: '2024',
      category: 'تقني'
    },
    {
      title: 'دراسة فعالية الأدوية التقليدية اليمنية',
      authors: 'د. علي الزبيري، د. منى عبدالله',
      journal: 'مجلة الصيدلة العربية',
      year: '2023',
      category: 'صيدلة'
    },
    {
      title: 'تحسين جودة الرعاية التمريضية',
      authors: 'د. زينب محمد، د. أمل يحيى',
      journal: 'مجلة التمريض الحديث',
      year: '2023',
      category: 'تمريض'
    }
  ];

  const researchFacilities = [
    {
      name: 'مختبر البحوث الطبية',
      description: 'مجهز بأحدث الأجهزة للبحوث الطبية والسريرية',
      equipment: ['جهاز الطرد المركزي', 'المجهر الإلكتروني', 'أجهزة التحليل الكيميائي']
    },
    {
      name: 'مختبر الصيدلة',
      description: 'متخصص في تطوير وتحليل الأدوية والمركبات الصيدلانية',
      equipment: ['جهاز الكروماتوغرافيا', 'أجهزة القياس الطيفي', 'أجهزة تحليل الجودة']
    },
    {
      name: 'مختبر تكنولوجيا المعلومات',
      description: 'يركز على بحوث الذكاء الاصطناعي وتطوير البرمجيات',
      equipment: ['خوادم عالية الأداء', 'أجهزة محاكاة', 'معدات الشبكات المتقدمة']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeroSection
        icon={Search}
        title="البحث العلمي"
        subtitle="نعزز ثقافة البحث العلمي والابتكار لخدمة المجتمع وتطوير المعرفة"
        breadcrumb={
          <UnifiedBackButton 
            breadcrumbs={[{ label: 'الرئيسية', href: '/', icon: Home }, { label: 'البحث العلمي', icon: Search }]}
          />
        }
      />

      {/* Research Areas */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">مجالات البحث</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            <p className="text-subtitle max-w-3xl mx-auto">
              نركز على مجالات بحثية متنوعة تخدم التخصصات المختلفة في الكلية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {researchAreas.map((area, index) => (
              <div key={index} className="card-elevated text-center hover:shadow-university transition-all duration-300">
                <area.icon className="w-16 h-16 text-university-blue mx-auto mb-4" />
                <h3 className="text-card-title mb-3">{area.title}</h3>
                <p className="text-body mb-4">{area.description}</p>
                <div className="bg-university-blue-light p-3 rounded-lg">
                  <span className="text-university-blue font-bold text-lg">{area.projects}</span>
                  <p className="text-small text-university-blue">مشروع بحثي</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Publications */}
      <section className="section-padding bg-academic-gray-light">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">أحدث المنشورات العلمية</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            <p className="text-subtitle max-w-3xl mx-auto">
              تعرف على آخر إصدارات أعضاء هيئة التدريس من البحوث والدراسات
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {recentPublications.map((publication, index) => (
              <div key={index} className="card-elevated">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-university-blue text-white px-3 py-1 rounded-full text-small">
                    {publication.category}
                  </span>
                  <span className="text-academic-gray text-small">{publication.year}</span>
                </div>
                
                <h3 className="text-card-title mb-3">{publication.title}</h3>
                <p className="text-body text-university-blue mb-2">{publication.authors}</p>
                <p className="text-small text-academic-gray mb-4">{publication.journal}</p>
                
                <button className="flex items-center gap-2 text-university-blue hover:text-university-blue-dark transition-colors">
                  <Download className="w-4 h-4" />
                  تحميل البحث
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="btn-secondary">
              عرض جميع المنشورات
            </button>
          </div>
        </div>
      </section>

      {/* Research Facilities */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">مرافق البحث العلمي</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            <p className="text-subtitle max-w-3xl mx-auto">
              مختبرات ومرافق حديثة مجهزة بأفضل الإمكانيات لدعم البحث العلمي
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {researchFacilities.map((facility, index) => (
              <div key={index} className="card-elevated">
                <h3 className="text-card-title text-university-blue mb-4">{facility.name}</h3>
                <p className="text-body mb-6">{facility.description}</p>
                
                <h4 className="text-lg font-bold mb-3">الأجهزة المتوفرة:</h4>
                <ul className="space-y-2">
                  {facility.equipment.map((equipment, equipIndex) => (
                    <li key={equipIndex} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-university-blue rounded-full"></div>
                      <span className="text-body">{equipment}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Support */}
      <section className="section-padding bg-university-blue text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title text-white mb-6">دعم الباحثين</h2>
            <p className="text-subtitle text-gray-200 max-w-3xl mx-auto">
              نقدم الدعم الكامل للباحثين في جميع مراحل العملية البحثية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-university-gold" />
              </div>
              <h3 className="text-lg font-bold mb-2">التمويل</h3>
              <p className="text-gray-200">دعم مالي للمشاريع البحثية</p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-university-gold" />
              </div>
              <h3 className="text-lg font-bold mb-2">الإشراف</h3>
              <p className="text-gray-200">إشراف أكاديمي متخصص</p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-university-gold" />
              </div>
              <h3 className="text-lg font-bold mb-2">النشر</h3>
              <p className="text-gray-200">دعم نشر البحوث في المجلات</p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-university-gold" />
              </div>
              <h3 className="text-lg font-bold mb-2">التدريب</h3>
              <p className="text-gray-200">ورش تدريبية في منهجية البحث</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Research;