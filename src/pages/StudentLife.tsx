import React, { useState } from 'react';
import { Users, Heart, BookOpen, Calendar, Trophy, Camera, Music, Gamepad2, Clock, MapPin, Home } from 'lucide-react';
import UnifiedPageHeader from '@/components/ui/unified-page-header';

const StudentLife = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const events = [
    { id: 1, title: 'ورشة عمل في البرمجة', date: '2024-01-15', time: '10:00 ص', location: 'مختبر الحاسوب' },
    { id: 2, title: 'محاضرة علمية في الصيدلة', date: '2024-01-18', time: '2:00 م', location: 'قاعة المحاضرات الكبرى' },
    { id: 3, title: 'معرض الكتاب السنوي', date: '2024-01-22', time: '9:00 ص', location: 'ساحة الكلية' },
    { id: 4, title: 'حفل التخرج الدفعة الأولى', date: '2024-02-01', time: '6:00 م', location: 'القاعة الرئيسية' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <UnifiedPageHeader
        icon={Users}
        title="الحياة الطلابية"
        subtitle="نوفر بيئة جامعية متكاملة تدعم نمو الطلاب أكاديمياً واجتماعياً وثقافياً"
        breadcrumbs={[
          { label: 'الرئيسية', href: '/', icon: Home },
          { label: 'الحياة الطلابية', icon: Users }
        ]}
      />

      {/* Student Services */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title mb-4">الخدمات الطلابية</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'الإرشاد الأكاديمي',
                description: 'خدمات الإرشاد الأكاديمي والتوجيه المهني للطلاب',
                services: ['توجيه اختيار التخصص', 'متابعة الأداء الأكاديمي', 'حل المشاكل الدراسية']
              },
              {
                icon: Heart,
                title: 'الخدمات الصحية',
                description: 'عيادة طبية مجهزة لخدمة الطلاب والموظفين',
                services: ['فحوصات دورية', 'إسعافات أولية', 'استشارات صحية']
              },
              {
                icon: Users,
                title: 'الدعم النفسي',
                description: 'خدمات الدعم النفسي والاجتماعي للطلاب',
                services: ['استشارات نفسية', 'ورش تطوير الذات', 'حل المشاكل الشخصية']
              },
              {
                icon: Trophy,
                title: 'الأنشطة الرياضية',
                description: 'برامج رياضية متنوعة للحفاظ على اللياقة البدنية',
                services: ['كرة القدم', 'كرة السلة', 'ألعاب القوى']
              },
              {
                icon: BookOpen,
                title: 'المكتبة الرقمية',
                description: 'مكتبة شاملة مع موارد تعليمية متطورة',
                services: ['كتب إلكترونية', 'قواعد بيانات علمية', 'قاعات دراسة هادئة']
              },
              {
                icon: Calendar,
                title: 'تنظيم الفعاليات',
                description: 'تنظيم الفعاليات الثقافية والاجتماعية',
                services: ['ندوات علمية', 'معارض تعليمية', 'احتفالات وطنية']
              }
            ].map((service, index) => (
              <div key={index} className="card-elevated text-center hover:shadow-university transition-all duration-300">
                <service.icon className="w-16 h-16 text-university-blue mx-auto mb-4" />
                <h3 className="text-card-title mb-3">{service.title}</h3>
                <p className="text-body mb-4">{service.description}</p>
                <ul className="text-sm text-academic-gray space-y-1">
                  {service.services.map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Activities & Clubs */}
      <section className="section-padding bg-academic-gray-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title mb-4">الأنشطة والنوادي الطلابية</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: BookOpen,
                name: 'النادي العلمي',
                description: 'ورش ومحاضرات علمية تطبيقية',
                color: 'text-university-blue'
              },
              {
                icon: Camera,
                name: 'نادي التصوير',
                description: 'تطوير مهارات التصوير والتوثيق',
                color: 'text-university-red'
              },
              {
                icon: Music,
                name: 'النادي الثقافي',
                description: 'فعاليات ثقافية وأدبية متنوعة',
                color: 'text-university-gold'
              },
              {
                icon: Gamepad2,
                name: 'نادي التقنية',
                description: 'مسابقات برمجية وتقنية',
                color: 'text-university-blue'
              },
              {
                icon: Heart,
                name: 'نادي التطوع',
                description: 'أنشطة خيرية ومجتمعية',
                color: 'text-university-red'
              },
              {
                icon: Trophy,
                name: 'النادي الرياضي',
                description: 'مسابقات وأنشطة رياضية',
                color: 'text-university-blue'
              },
              {
                icon: Users,
                name: 'نادي القيادة',
                description: 'تطوير المهارات القيادية',
                color: 'text-university-gold'
              },
              {
                icon: BookOpen,
                name: 'النادي الطبي',
                description: 'توعية صحية وأنشطة طبية',
                color: 'text-university-red'
              }
            ].map((club, index) => (
              <div key={index} className="card-elevated text-center hover:scale-105 transition-all duration-300">
                <club.icon className={`w-12 h-12 mx-auto mb-3 ${club.color}`} />
                <h3 className="text-card-title mb-2">{club.name}</h3>
                <p className="text-body text-sm">{club.description}</p>
                <button className="mt-4 text-university-blue hover:text-university-blue-light transition-colors text-sm font-semibold">
                  انضم الآن
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Calendar */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title mb-4">تقويم الفعاليات</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto"></div>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Calendar Component */}
              <div className="card-elevated">
                <h3 className="text-card-title mb-6 text-center">التقويم الشهري</h3>
                <div className="bg-university-blue-light bg-opacity-10 p-6 rounded-lg">
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold text-university-blue">يناير 2024</h4>
                  </div>
                  
                  {/* Simple Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2 text-center text-sm">
                    {['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'].map((day) => (
                      <div key={day} className="font-semibold text-university-blue py-2">
                        {day}
                      </div>
                    ))}
                    
                    {Array.from({ length: 31 }, (_, i) => (
                      <div
                        key={i}
                        className={`py-2 rounded cursor-pointer transition-colors ${
                          [14, 17, 21].includes(i + 1)
                            ? 'bg-university-blue text-white'
                            : 'hover:bg-university-blue-light hover:bg-opacity-20'
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Upcoming Events */}
              <div className="card-elevated">
                <h3 className="text-card-title mb-6 flex items-center">
                  <Calendar className="w-6 h-6 ml-2 text-university-blue" />
                  الفعاليات القادمة
                </h3>
                
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-medium transition-shadow">
                      <h4 className="font-semibold text-university-blue mb-2">{event.title}</h4>
                      <div className="space-y-1 text-sm text-academic-gray">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 ml-2" />
                          {event.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 ml-2" />
                          {event.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 ml-2" />
                          {event.location}
                        </div>
                      </div>
                      <button className="mt-3 text-university-blue hover:text-university-blue-light transition-colors text-sm font-semibold">
                        تفاصيل أكثر
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <button className="btn-secondary">
                    عرض جميع الفعاليات
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Success Stories */}
      <section className="section-padding bg-academic-gray-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title mb-4">قصص نجاح الطلاب</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'أحمد محمد العامري',
                program: 'تكنولوجيا المعلومات',
                achievement: 'حصل على منحة دراسية لإكمال الماجستير في ماليزيا',
                quote: 'كلية أيلول فتحت لي آفاق جديدة في عالم التقنية'
              },
              {
                name: 'فاطمة علي الحداد',
                program: 'الصيدلة',
                achievement: 'تم تعيينها في مستشفى الثورة العام',
                quote: 'التدريب العملي في الكلية أهلني لسوق العمل'
              },
              {
                name: 'محمد عبدالله الزبيري',
                program: 'إدارة الأعمال',
                achievement: 'أسس شركته الخاصة في مجال التجارة الإلكترونية',
                quote: 'تعلمت في الكلية كيف أحول الأفكار إلى مشاريع ناجحة'
              }
            ].map((story, index) => (
              <div key={index} className="card-elevated text-center">
                <div className="w-20 h-20 bg-university-blue-light rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-card-title mb-2">{story.name}</h3>
                <p className="text-university-blue font-semibold mb-3">{story.program}</p>
                <p className="text-body mb-4">{story.achievement}</p>
                <blockquote className="text-academic-gray italic">
                  "{story.quote}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentLife;