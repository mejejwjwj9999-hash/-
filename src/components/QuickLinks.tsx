
import React, { useState } from 'react';
import { User, CalendarDays, Map, FileText, Phone, Mail, ExternalLink, MessageCircle, BookOpen, Users, HelpCircle, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/use-toast';
import DigitalLibraryModal from './student-services/DigitalLibraryModal';
import { DynamicContent } from './DynamicContent';

const QuickLinks = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDigitalLibrary, setShowDigitalLibrary] = useState(false);

  const quickLinks = [
    {
      id: 1,
      title: 'بوابة الطالب',
      description: 'الدخول إلى النظام الأكاديمي',
      icon: User,
      color: 'bg-blue-500',
      action: () => {
        navigate('/student-portal');
        toast({
          title: "بوابة الطالب",
          description: "تم توجيهك إلى بوابة الطالب",
        });
      }
    },
    {
      id: 2,
      title: 'التقويم الأكاديمي',
      description: 'مواعيد الفصول والامتحانات',
      icon: CalendarDays,
      color: 'bg-green-500',
      action: () => {
        navigate('/academic-calendar');
        toast({
          title: "التقويم الأكاديمي",
          description: "تم توجيهك إلى التقويم الأكاديمي",
        });
      }
    },
    {
      id: 3,
      title: 'خريطة الحرم الجامعي',
      description: 'تعرف على مواقع المباني',
      icon: Map,
      color: 'bg-purple-500',
      action: () => {
        toast({
          title: "خريطة الحرم الجامعي",
          description: "العنوان: يريم، الدائري الغربي، أمام مستشفى يريم العام",
        });
        window.open('https://maps.google.com/?q=Yarim+University+College', '_blank');
      }
    },
    {
      id: 4,
      title: 'المكتبة الرقمية',
      description: 'الوصول للكتب والمراجع',
      icon: FileText,
      color: 'bg-orange-500',
      action: () => {
        setShowDigitalLibrary(true);
        toast({
          title: "المكتبة الرقمية",
          description: "تم فتح المكتبة الرقمية",
        });
      }
    },
    {
      id: 5,
      title: 'خدمة الطلاب',
      description: 'تواصل معنا مباشرة',
      icon: Phone,
      color: 'bg-red-500',
      action: () => {
        navigate('/contact');
        toast({
          title: "خدمة الطلاب",
          description: "تم توجيهك إلى صفحة التواصل معنا",
        });
      }
    },
    {
      id: 6,
      title: 'البريد الإلكتروني',
      description: 'بريد الطلاب والموظفين',
      icon: Mail,
      color: 'bg-indigo-500',
      action: () => {
        window.location.href = 'mailto:aylolcollege@gmail.com';
        toast({
          title: "البريد الإلكتروني",
          description: "تم فتح تطبيق البريد الإلكتروني",
        });
      }
    }
  ];

  const additionalServices = [
    {
      title: 'منتدى الطلاب',
      description: 'التفاعل مع زملاء الدراسة',
      icon: MessageCircle,
      color: 'bg-teal-500',
      action: () => {
        navigate('/student-portal');
        toast({
          title: "منتدى الطلاب",
          description: "تم توجيهك إلى منتدى الطلاب في بوابة الطالب",
        });
      }
    },
    {
      title: 'نظام التعلم الإلكتروني',
      description: 'منصة التعلم عن بعد',
      icon: BookOpen,
      color: 'bg-cyan-500',
      action: () => {
        window.open('https://lms.aylol.edu.ye', '_blank');
        toast({
          title: "نظام التعلم الإلكتروني",
          description: "تم فتح منصة التعلم الإلكتروني",
        });
      }
    },
    {
      title: 'المجموعات الدراسية',
      description: 'انضم للمجموعات الأكاديمية',
      icon: Users,
      color: 'bg-pink-500',
      action: () => {
        navigate('/student-portal');
        toast({
          title: "المجموعات الدراسية",
          description: "تم توجيهك إلى المجموعات الدراسية",
        });
      }
    }
  ];

  const handleContactUs = () => {
    navigate('/contact');
    toast({
      title: "صفحة التواصل",
      description: "تم توجيهك إلى صفحة التواصل معنا",
    });
  };

  const handlePhoneCall = () => {
    window.location.href = 'tel:+967779553944';
    toast({
      title: "إجراء مكالمة",
      description: "تم فتح تطبيق الهاتف",
    });
  };

  const handleEmail = () => {
    window.location.href = 'mailto:aylolcollege@gmail.com';
    toast({
      title: "إرسال بريد إلكتروني",
      description: "تم فتح تطبيق البريد الإلكتروني",
    });
  };

  const handleServicesPage = () => {
    navigate('/services');
    toast({
      title: "صفحة الخدمات",
      description: "تم توجيهك إلى صفحة الخدمات الشاملة",
    });
  };

  return (
    <>
      <section className="section-padding bg-academic-gray-light">
        <div className="container-custom">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4 animate-fadeInUp">
              <DynamicContent 
                pageKey="homepage" 
                elementKey="quick_services_title" 
                fallback="الخدمات السريعة"
                as="span"
              />
            </h2>
            <p className="text-body max-w-2xl mx-auto animate-fadeInUp animate-delay-100">
              <DynamicContent 
                pageKey="homepage" 
                elementKey="quick_services_subtitle" 
                fallback="الوصول السريع للخدمات الأكاديمية والإدارية المختلفة"
                as="span"
              />
            </p>
          </div>

          {/* Quick Links Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {quickLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <div
                  key={link.id}
                  className={`quick-link animate-fadeInUp hover:shadow-university cursor-pointer transform hover:scale-105 transition-all duration-300 group`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={link.action}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 ${link.color} rounded-full flex items-center justify-center mx-auto mb-4 quick-link-icon group-hover:animate-pulse`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-card-title mb-2 flex items-center justify-center gap-2">
                      {link.title}
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-body">{link.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Services */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-university-blue mb-6 text-center">
              <DynamicContent 
                pageKey="homepage" 
                elementKey="additional_services_title" 
                fallback="خدمات إضافية"
                as="span"
              />
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalServices.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <div
                    key={index}
                    className="quick-link hover:shadow-university cursor-pointer transform hover:scale-105 transition-all duration-300 group"
                    onClick={service.action}
                  >
                    <div className="text-center">
                      <div className={`w-12 h-12 ${service.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold mb-1">{service.title}</h4>
                      <p className="text-sm text-body">{service.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enhanced Contact Information */}
          <div className="bg-gradient-to-r from-white to-university-blue-light/10 rounded-xl shadow-university p-8 border border-university-blue/20 mb-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-right">
                <h3 className="text-section-title mb-4 animate-fadeInUp">
                  <DynamicContent 
                    pageKey="homepage" 
                    elementKey="help_section_title" 
                    fallback="هل تحتاج مساعدة؟"
                    as="span"
                  />
                </h3>
                <p className="text-body mb-6 animate-fadeInUp animate-delay-100">
                  <DynamicContent 
                    pageKey="homepage" 
                    elementKey="help_section_description" 
                    fallback="فريق خدمة الطلاب متاح للإجابة على استفساراتك وتقديم الدعم اللازم"
                    as="span"
                  />
                </p>
                <div className="flex gap-3 justify-center md:justify-start">
                  <button 
                    onClick={handleContactUs}
                    className="btn-primary hover:scale-105 transition-all duration-300 animate-fadeInUp animate-delay-200"
                  >
                    <DynamicContent 
                      pageKey="homepage" 
                      elementKey="help_contact_button" 
                      fallback="تواصل معنا الآن"
                      as="span"
                    />
                  </button>
                  <button 
                    onClick={handleServicesPage}
                    className="btn-ghost hover:scale-105 transition-all duration-300"
                  >
                    <DynamicContent 
                      pageKey="homepage" 
                      elementKey="help_all_services_button" 
                      fallback="جميع الخدمات"
                      as="span"
                    />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4 animate-fadeInUp animate-delay-300">
                <div 
                  className="flex items-center gap-3 justify-end cursor-pointer hover:bg-university-blue/10 p-3 rounded-lg transition-colors"
                  onClick={handlePhoneCall}
                >
                  <div className="text-right">
                    <p className="font-semibold text-university-blue">
                      <DynamicContent 
                        pageKey="homepage" 
                        elementKey="phone_number" 
                        fallback="+967779553944"
                        as="span"
                      />
                    </p>
                    <p className="text-small text-academic-gray">
                      <DynamicContent 
                        pageKey="homepage" 
                        elementKey="phone_description" 
                        fallback="خدمة الطلاب - اضغط للاتصال"
                        as="span"
                      />
                    </p>
                  </div>
                  <Phone className="w-6 h-6 text-university-gold hover:animate-bounce" />
                </div>
                
                <div 
                  className="flex items-center gap-3 justify-end cursor-pointer hover:bg-university-blue/10 p-3 rounded-lg transition-colors"
                  onClick={handleEmail}
                >
                  <div className="text-right">
                    <p className="font-semibold text-university-blue">
                      <DynamicContent 
                        pageKey="homepage" 
                        elementKey="email_address" 
                        fallback="aylolcollege@gmail.com"
                        as="span"
                      />
                    </p>
                    <p className="text-small text-academic-gray">
                      <DynamicContent 
                        pageKey="homepage" 
                        elementKey="email_description" 
                        fallback="البريد الإلكتروني - اضغط للإرسال"
                        as="span"
                      />
                    </p>
                  </div>
                  <Mail className="w-6 h-6 text-university-gold hover:animate-bounce" />
                </div>
              </div>
            </div>
          </div>

          {/* Services Banner */}
          <div className="grid md:grid-cols-3 gap-6">
            <div 
              className="bg-university-blue text-white p-6 rounded-xl text-center hover:scale-105 transition-transform cursor-pointer"
              onClick={() => {
                setShowDigitalLibrary(true);
                toast({
                  title: "📚 التعلم الإلكتروني",
                  description: "تم فتح منصة التعلم الإلكتروني",
                });
              }}
            >
              <h4 className="font-bold mb-2">📚 التعلم الإلكتروني</h4>
              <p className="text-sm">منصة تعليمية متقدمة</p>
            </div>
            <div 
              className="bg-university-red text-white p-6 rounded-xl text-center hover:scale-105 transition-transform cursor-pointer"
              onClick={() => {
                navigate('/student-portal');
                toast({
                  title: "🏆 الإنجازات",
                  description: "تم توجيهك إلى صفحة الإنجازات الأكاديمية",
                });
              }}
            >
              <h4 className="font-bold mb-2">🏆 الإنجازات</h4>
              <p className="text-sm">تتبع إنجازاتك الأكاديمية</p>
            </div>
            <div 
              className="bg-university-gold text-university-blue p-6 rounded-xl text-center hover:scale-105 transition-transform cursor-pointer"
              onClick={() => {
                navigate('/student-affairs');
                toast({
                  title: "💼 التدريب العملي",
                  description: "تم توجيهك إلى صفحة فرص التدريب",
                });
              }}
            >
              <h4 className="font-bold mb-2">💼 التدريب العملي</h4>
              <p className="text-sm">فرص تدريب في الشركات</p>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Library Modal */}
      {showDigitalLibrary && (
        <DigitalLibraryModal onClose={() => setShowDigitalLibrary(false)} />
      )}
    </>
  );
};

export default QuickLinks;
