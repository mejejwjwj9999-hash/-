
import React from 'react';
import { Calendar, Clock, BookOpen, Users, AlertCircle, CheckCircle, Home } from 'lucide-react';
import UnifiedHeroSection from '@/components/ui/unified-hero-section';
import UnifiedBackButton from '@/components/ui/unified-back-button';

const AcademicCalendar = () => {
  const currentSemester = {
    name: 'الفصل الدراسي الأول 2024/2025',
    startDate: '15 سبتمبر 2024',
    endDate: '15 يناير 2025'
  };

  const upcomingEvents = [
    { date: '1 أكتوبر 2024', event: 'آخر موعد للتسجيل المتأخر', type: 'deadline' },
    { date: '15 أكتوبر 2024', event: 'امتحانات منتصف الفصل', type: 'exam' },
    { date: '20 نوفمبر 2024', event: 'أسبوع الأنشطة الطلابية', type: 'activity' },
    { date: '1 ديسمبر 2024', event: 'بداية التسجيل للفصل الثاني', type: 'registration' }
  ];

  const semesterEvents = [
    {
      phase: 'بداية الفصل الدراسي',
      events: [
        { date: '15 سبتمبر 2024', event: 'بداية الدراسة' },
        { date: '22 سبتمبر 2024', event: 'آخر موعد للإضافة والحذف' },
        { date: '1 أكتوبر 2024', event: 'آخر موعد للتسجيل المتأخر' }
      ]
    },
    {
      phase: 'منتصف الفصل',
      events: [
        { date: '15-19 أكتوبر 2024', event: 'امتحانات منتصف الفصل' },
        { date: '25 أكتوبر 2024', event: 'إعلان نتائج منتصف الفصل' },
        { date: '1 نوفمبر 2024', event: 'آخر موعد للانسحاب من المقررات' }
      ]
    },
    {
      phase: 'نهاية الفصل',
      events: [
        { date: '1-12 يناير 2025', event: 'الامتحانات النهائية' },
        { date: '15 يناير 2025', event: 'انتهاء الفصل الدراسي' },
        { date: '20 يناير 2025', event: 'إعلان النتائج النهائية' }
      ]
    }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return AlertCircle;
      case 'exam':
        return BookOpen;
      case 'activity':
        return Users;
      case 'registration':
        return CheckCircle;
      default:
        return Calendar;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'deadline':
        return 'text-red-600';
      case 'exam':
        return 'text-blue-600';
      case 'activity':
        return 'text-green-600';
      case 'registration':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeroSection
        icon={Calendar}
        title="التقويم الأكاديمي"
        subtitle="جدولة شاملة للفصول الدراسية والأنشطة الأكاديمية للعام الجامعي"
        breadcrumb={
          <UnifiedBackButton 
            breadcrumbs={[
              { label: 'الرئيسية', href: '/', icon: Home },
              { label: 'التقويم الأكاديمي', icon: Calendar }
            ]}
          />
        }
      />

      {/* Current Semester */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="card-elevated mb-12">
              <div className="text-center">
                <Clock className="w-12 h-12 text-university-blue mx-auto mb-4" />
                <h2 className="text-section-title mb-4">{currentSemester.name}</h2>
                <div className="flex justify-center items-center space-x-8 space-x-reverse">
                  <div>
                    <span className="text-body text-academic-gray">تاريخ البداية:</span>
                    <p className="text-card-title text-university-blue">{currentSemester.startDate}</p>
                  </div>
                  <div className="h-12 w-px bg-gray-300"></div>
                  <div>
                    <span className="text-body text-academic-gray">تاريخ النهاية:</span>
                    <p className="text-card-title text-university-blue">{currentSemester.endDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section-padding bg-academic-gray-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title mb-4">الأحداث القادمة</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingEvents.map((item, index) => {
                const IconComponent = getEventIcon(item.type);
                return (
                  <div key={index} className="card-elevated">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 ml-4">
                        <IconComponent className={`w-8 h-8 ${getEventColor(item.type)}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-small text-academic-gray mb-1">{item.date}</p>
                        <h3 className="text-card-title">{item.event}</h3>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Calendar */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title mb-4">التقويم المفصل</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto"></div>
          </div>
          
          <div className="max-w-6xl mx-auto space-y-8">
            {semesterEvents.map((phase, phaseIndex) => (
              <div key={phaseIndex} className="card-elevated">
                <h3 className="text-card-title text-university-blue mb-6">{phase.phase}</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {phase.events.map((event, eventIndex) => (
                    <div key={eventIndex} className="bg-academic-gray-light rounded-lg p-4">
                      <p className="text-small text-university-blue font-semibold mb-2">{event.date}</p>
                      <p className="text-body">{event.event}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="section-padding bg-university-blue text-white">
        <div className="container-custom text-center">
          <h2 className="text-section-title text-white mb-6">احصل على التقويم الكامل</h2>
          <p className="text-subtitle text-gray-200 mb-8 max-w-3xl mx-auto">
            حمل نسخة PDF من التقويم الأكاديمي الكامل ليكون معك دائماً
          </p>
          <div className="flex justify-center space-x-4 space-x-reverse">
            <button className="btn-secondary">
              تحميل التقويم الأكاديمي
            </button>
            <button className="btn-ghost border-white text-white hover:bg-white hover:text-university-blue">
              اشتراك في التنبيهات
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AcademicCalendar;
