import React from 'react';
import { Award, CheckCircle, Target, TrendingUp, Users, BookOpen, Home } from 'lucide-react';
import UnifiedHeroSection from '@/components/ui/unified-hero-section';
import UnifiedBackButton from '@/components/ui/unified-back-button';

const QualityAssurance = () => {
  const services = [
    {
      title: 'تطوير البرامج الأكاديمية',
      description: 'مراجعة وتطوير المناهج والبرامج الدراسية لضمان جودتها',
      icon: BookOpen
    },
    {
      title: 'التقييم المستمر',
      description: 'تقييم أداء أعضاء هيئة التدريس والطلاب والعمليات التعليمية',
      icon: TrendingUp
    },
    {
      title: 'ضمان الجودة',
      description: 'تطبيق معايير الجودة المحلية والدولية في جميع العمليات',
      icon: Award
    },
    {
      title: 'التدريب والتطوير',
      description: 'تنظيم برامج تدريبية لتطوير قدرات الكادر التدريسي والإداري',
      icon: Users
    }
  ];

  const achievements = [
    { title: 'اعتماد البرامج الأكاديمية', percentage: '100%', color: 'university-blue' },
    { title: 'رضا الطلاب', percentage: '95%', color: 'university-green' },
    { title: 'معدل نجاح الخريجين', percentage: '92%', color: 'university-gold' },
    { title: 'تطبيق معايير الجودة', percentage: '98%', color: 'university-red' }
  ];

  const qualityStandards = [
    {
      category: 'المعايير الأكاديمية',
      standards: [
        'تطوير المناهج وفقاً للمعايير الدولية',
        'تقييم مخرجات التعلم بشكل دوري',
        'تحديث طرق التدريس والتقييم',
        'ضمان كفاءة أعضاء هيئة التدريس'
      ]
    },
    {
      category: 'معايير الخدمات الطلابية',
      standards: [
        'توفير بيئة تعليمية محفزة',
        'دعم الطلاب أكاديمياً ونفسياً',
        'تطوير المهارات العملية والبحثية',
        'متابعة الخريجين في سوق العمل'
      ]
    },
    {
      category: 'معايير الإدارة والحوكمة',
      standards: [
        'شفافية في العمليات الإدارية',
        'مشاركة جميع الأطراف في اتخاذ القرارات',
        'تطبيق أنظمة إدارة الجودة',
        'المراجعة والتحسين المستمر'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeroSection
        icon={Award}
        title="وحدة التطوير وضمان الجودة"
        subtitle="نعمل على ضمان جودة التعليم والتطوير المستمر للعمليات الأكاديمية"
        breadcrumb={
          <UnifiedBackButton 
            breadcrumbs={[{ label: 'الرئيسية', href: '/', icon: Home }, { label: 'وحدة التطوير وضمان الجودة', icon: Award }]}
          />
        }
      />

      {/* Services */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">خدماتنا</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            <p className="text-subtitle max-w-3xl mx-auto">
              تقدم وحدة التطوير وضمان الجودة مجموعة شاملة من الخدمات
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {services.map((service, index) => (
              <div key={index} className="card-elevated text-center hover:shadow-university transition-all duration-300">
                <service.icon className="w-16 h-16 text-university-blue mx-auto mb-4" />
                <h3 className="text-card-title mb-3">{service.title}</h3>
                <p className="text-body">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="section-padding bg-academic-gray-light">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">إنجازاتنا في الجودة</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="card-elevated text-center">
                <div className={`text-5xl font-bold text-${achievement.color} mb-3`}>
                  {achievement.percentage}
                </div>
                <h3 className="text-card-title">{achievement.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">معايير الجودة المطبقة</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            <p className="text-subtitle max-w-3xl mx-auto">
              نطبق معايير شاملة لضمان جودة التعليم في جميع جوانب العمل الأكاديمي
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {qualityStandards.map((category, index) => (
              <div key={index} className="card-elevated">
                <h3 className="text-card-title text-university-blue mb-6">{category.category}</h3>
                <ul className="space-y-3">
                  {category.standards.map((standard, standardIndex) => (
                    <li key={standardIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-university-green mt-0.5 flex-shrink-0" />
                      <span className="text-body">{standard}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Process */}
      <section className="section-padding bg-university-blue text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title text-white mb-6">عملية ضمان الجودة</h2>
            <p className="text-subtitle text-gray-200 max-w-3xl mx-auto">
              نتبع منهجية علمية مدروسة لضمان التطوير والتحسين المستمر
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-university-gold" />
              </div>
              <h3 className="text-lg font-bold mb-2">التخطيط</h3>
              <p className="text-gray-200">وضع الأهداف والمعايير</p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-university-gold" />
              </div>
              <h3 className="text-lg font-bold mb-2">التنفيذ</h3>
              <p className="text-gray-200">تطبيق المعايير والإجراءات</p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-university-gold" />
              </div>
              <h3 className="text-lg font-bold mb-2">التقييم</h3>
              <p className="text-gray-200">مراجعة النتائج والأداء</p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-university-gold" />
              </div>
              <h3 className="text-lg font-bold mb-2">التحسين</h3>
              <p className="text-gray-200">تطوير وتحسين العمليات</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QualityAssurance;