import React from 'react';
import { Link } from 'react-router-dom';
import { EditableContent } from './EditableContent';
import { 
  User, 
  Calendar, 
  Map, 
  BookOpen, 
  Headphones, 
  Mail,
  MessageCircle,
  Monitor,
  Users,
  Phone,
  GraduationCap,
  Award,
  Briefcase
} from 'lucide-react';

const EditableQuickServices = () => {
  const mainServices = [
    {
      icon: User,
      color: 'from-blue-500 to-blue-600',
      href: '/student-portal'
    },
    {
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      href: '/academic-calendar'
    },
    {
      icon: Map,
      color: 'from-purple-500 to-purple-600',
      href: '/campus-map'
    },
    {
      icon: BookOpen,
      color: 'from-amber-500 to-amber-600',
      href: '/digital-library'
    },
    {
      icon: Headphones,
      color: 'from-red-500 to-red-600',
      href: '/customer-service'
    },
    {
      icon: Mail,
      color: 'from-teal-500 to-teal-600',
      href: '/email'
    }
  ];

  const additionalServices = [
    {
      icon: MessageCircle,
      color: 'from-indigo-500 to-indigo-600',
      href: '/student-forum'
    },
    {
      icon: Monitor,
      color: 'from-cyan-500 to-cyan-600',
      href: '/e-learning'
    },
    {
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      href: '/study-groups'
    }
  ];

  const features = [
    {
      icon: GraduationCap,
      color: 'text-blue-600',
      emoji: '📚'
    },
    {
      icon: Award,
      color: 'text-amber-600',
      emoji: '🏆'
    },
    {
      icon: Briefcase,
      color: 'text-green-600',
      emoji: '💼'
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            <EditableContent 
              pageKey="homepage" 
              elementKey="quick_services_title" 
              elementType="text"
              fallback="الخدمات السريعة"
              as="span"
            />
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <EditableContent 
              pageKey="homepage" 
              elementKey="quick_services_subtitle" 
              elementType="rich_text"
              fallback="الوصول السريع للخدمات الأكاديمية والإدارية المختلفة"
              as="span"
            />
          </p>
        </div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {mainServices.map((service, index) => {
            const IconComponent = service.icon;
            const serviceKeys = [
              'student_portal',
              'academic_calendar', 
              'campus_map',
              'digital_library',
              'customer_service',
              'email'
            ];
            const serviceTitles = [
              'بوابة الطالب',
              'التقويم الأكاديمي',
              'خريطة الحرم الجامعي',
              'المكتبة الرقمية',
              'خدمة الطلاب',
              'البريد الإلكتروني'
            ];
            const serviceDescriptions = [
              'الدخول إلى النظام الأكاديمي',
              'مواعيد الفصول والامتحانات',
              'تعرف على مواقع المباني',
              'الوصول للكتب والمراجع',
              'تواصل معنا مباشرة',
              'بريد الطلاب والموظفين'
            ];

            return (
              <Link
                key={index}
                to={service.href}
                className="group bg-card rounded-2xl p-6 border border-border hover:shadow-lg hover:scale-105 transition-all duration-300 text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-sm font-semibold mb-2 text-foreground">
                  <EditableContent 
                    pageKey="homepage" 
                    elementKey={`service_${serviceKeys[index]}_title`} 
                    elementType="text"
                    fallback={serviceTitles[index]}
                    as="span"
                  />
                </h3>
                <p className="text-xs text-muted-foreground">
                  <EditableContent 
                    pageKey="homepage" 
                    elementKey={`service_${serviceKeys[index]}_description`} 
                    elementType="text"
                    fallback={serviceDescriptions[index]}
                    as="span"
                  />
                </p>
              </Link>
            );
          })}
        </div>

        {/* Additional Services */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-8 text-center text-foreground">
            <EditableContent 
              pageKey="homepage" 
              elementKey="additional_services_title" 
              elementType="text"
              fallback="خدمات إضافية"
              as="span"
            />
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => {
              const IconComponent = service.icon;
              const serviceKeys = ['student_forum', 'e_learning', 'study_groups'];
              const serviceTitles = [
                'منتدى الطلاب',
                'نظام التعلم الإلكتروني',
                'المجموعات الدراسية'
              ];
              const serviceDescriptions = [
                'التفاعل مع زملاء الدراسة',
                'منصة التعلم عن بعد',
                'انضم للمجموعات الأكاديمية'
              ];

              return (
                <Link
                  key={index}
                  to={service.href}
                  className="group bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300"
                >
                  <div className={`w-12 h-12 mb-4 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2 text-foreground">
                    <EditableContent 
                      pageKey="homepage" 
                      elementKey={`additional_service_${serviceKeys[index]}_title`} 
                      elementType="text"
                      fallback={serviceTitles[index]}
                      as="span"
                    />
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <EditableContent 
                      pageKey="homepage" 
                      elementKey={`additional_service_${serviceKeys[index]}_description`} 
                      elementType="text"
                      fallback={serviceDescriptions[index]}
                      as="span"
                    />
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Contact & Help Section */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white text-center mb-12">
          <h3 className="text-2xl font-bold mb-4">
            <EditableContent 
              pageKey="homepage" 
              elementKey="help_section_title" 
              elementType="text"
              fallback="هل تحتاج مساعدة؟"
              as="span"
            />
          </h3>
          <p className="text-lg mb-6 opacity-90">
            <EditableContent 
              pageKey="homepage" 
              elementKey="help_section_description" 
              elementType="rich_text"
              fallback="فريق خدمة الطلاب متاح للإجابة على استفساراتك وتقديم الدعم اللازم"
              as="span"
            />
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/contact" 
              className="bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors"
            >
              <EditableContent 
                pageKey="homepage" 
                elementKey="help_contact_button" 
                elementType="text"
                fallback="تواصل معنا الآن"
                as="span"
              />
            </Link>
            <Link 
              to="/services" 
              className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-primary transition-colors"
            >
              <EditableContent 
                pageKey="homepage" 
                elementKey="help_all_services_button" 
                elementType="text"
                fallback="جميع الخدمات"
                as="span"
              />
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <a 
            href="tel:+967779553944" 
            className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-all duration-300 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <div className="text-right flex-1">
              <div className="text-lg font-semibold text-foreground">
                <EditableContent 
                  pageKey="homepage" 
                  elementKey="phone_number" 
                  elementType="text"
                  fallback="967779553944+"
                  as="span"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <EditableContent 
                  pageKey="homepage" 
                  elementKey="phone_description" 
                  elementType="text"
                  fallback="خدمة الطلاب - اضغط للاتصال"
                  as="span"
                />
              </div>
            </div>
          </a>

          <a 
            href="mailto:aylolcollege@gmail.com" 
            className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-all duration-300 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div className="text-right flex-1">
              <div className="text-lg font-semibold text-foreground">
                <EditableContent 
                  pageKey="homepage" 
                  elementKey="email_address" 
                  elementType="text"
                  fallback="aylolcollege@gmail.com"
                  as="span"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <EditableContent 
                  pageKey="homepage" 
                  elementKey="email_description" 
                  elementType="text"
                  fallback="البريد الإلكتروني - اضغط للإرسال"
                  as="span"
                />
              </div>
            </div>
          </a>
        </div>

        {/* Features Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const featureKeys = ['e_learning', 'achievements', 'training'];
            const featureTitles = [
              'التعلم الإلكتروني',
              'الإنجازات',
              'التدريب العملي'
            ];
            const featureDescriptions = [
              'منصة تعليمية متقدمة',
              'تتبع إنجازاتك الأكاديمية',
              'فرص تدريب في الشركات'
            ];
            const featureEmojis = ['📚', '🏆', '💼'];

            return (
              <div
                key={index}
                className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="text-4xl mb-4">{featureEmojis[index]}</div>
                <h4 className="text-lg font-semibold mb-2 text-foreground">
                  <EditableContent 
                    pageKey="homepage" 
                    elementKey={`feature_${featureKeys[index]}_title`} 
                    elementType="text"
                    fallback={featureTitles[index]}
                    as="span"
                  />
                </h4>
                <p className="text-sm text-muted-foreground">
                  <EditableContent 
                    pageKey="homepage" 
                    elementKey={`feature_${featureKeys[index]}_description`} 
                    elementType="text"
                    fallback={featureDescriptions[index]}
                    as="span"
                  />
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EditableQuickServices;