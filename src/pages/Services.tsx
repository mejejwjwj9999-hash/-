
import React, { useState } from 'react';
import { Users, BookOpen, Globe, Phone, Mail, MapPin, Clock, FileText, CreditCard, Calendar, Award, GraduationCap, Building2, Laptop, Home, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/use-toast';
import DigitalLibraryModal from '../components/student-services/DigitalLibraryModal';
import UnifiedHeroSection from '@/components/ui/unified-hero-section';
import UnifiedBackButton from '@/components/ui/unified-back-button';

const Services = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDigitalLibrary, setShowDigitalLibrary] = useState(false);

  const services = [
    {
      icon: Users,
      title: 'بوابة الطالب الموحدة',
      description: 'منصة إلكترونية شاملة ومتطورة لإدارة جميع الشؤون الأكاديمية والإدارية للطلاب',
      features: [
        'عرض الجدول الدراسي والمحاضرات', 
        'النتائج والدرجات الفصلية والتراكمية', 
        'التسجيل للمقررات الدراسية', 
        'إدارة المدفوعات المالية والرسوم',
        'طلب الوثائق والشهادات الرسمية',
        'التواصل مع المدرسين والإدارة'
      ],
      action: () => {
        navigate('/student-portal');
        toast({ title: "بوابة الطالب", description: "تم توجيهك إلى بوابة الطالب الموحدة" });
      }
    },
    {
      icon: BookOpen,
      title: 'المكتبة الرقمية المتقدمة',
      description: 'مجموعة واسعة ومتنوعة من المصادر العلمية والبحثية المتاحة إلكترونياً على مدار الساعة',
      features: [
        'أكثر من 15,000 كتاب إلكتروني', 
        'قواعد البيانات العلمية المتخصصة', 
        'الدوريات والمجلات العلمية المحكمة', 
        'الرسائل الجامعية والأطروحات',
        'محرك بحث متقدم ومفهرس',
        'خدمة التحميل والقراءة أوف لاين'
      ],
      action: () => {
        setShowDigitalLibrary(true);
        toast({ title: "المكتبة الرقمية", description: "تم فتح المكتبة الرقمية المتقدمة" });
      }
    },
    {
      icon: Calendar,
      title: 'التقويم الأكاديمي التفاعلي',
      description: 'جدولة شاملة ومفصلة للفصول الدراسية والأنشطة الأكاديمية مع التنبيهات الذكية',
      features: [
        'مواعيد بداية ونهاية الفصول الدراسية', 
        'جدولة فترات الامتحانات النهائية والنصفية', 
        'تقويم الأنشطة والفعاليات الجامعية', 
        'العطل الرسمية والإجازات الأكاديمية',
        'تنبيهات ذكية للمواعيد المهمة',
        'تصدير التقويم للهاتف والبريد الإلكتروني'
      ],
      action: () => {
        navigate('/academic-calendar');
        toast({ title: "التقويم الأكاديمي", description: "تم توجيهك إلى التقويم الأكاديمي التفاعلي" });
      }
    },
    {
      icon: Phone,
      title: 'مركز خدمة الطلاب المتطور',
      description: 'دعم فني ومساعدة متخصصة ومستمرة للطلاب وأولياء الأمور على مدار الساعة',
      features: [
        'الدعم الفني المتخصص 24/7', 
        'الاستفسارات الأكاديمية والإدارية', 
        'المساعدة في استخدام الأنظمة الإلكترونية', 
        'حل المشكلات التقنية والإدارية',
        'خدمة الشات المباشر والمكالمات',
        'نظام تتبع الطلبات والاستفسارات'
      ],
      action: () => {
        navigate('/contact');
        toast({ title: "خدمة الطلاب", description: "تم توجيهك إلى مركز خدمة الطلاب" });
      }
    },
    {
      icon: CreditCard,
      title: 'نظام الدفع الإلكتروني الآمن',
      description: 'نظام دفع متطور وآمن يدعم جميع طرق الدفع المحلية والإلكترونية',
      features: [
        'دفع الرسوم الدراسية إلكترونياً', 
        'دعم جميع البنوك اليمنية المحلية', 
        'المحافظ الإلكترونية (فلوس، وان باي)', 
        'تحويلات الصرافات المعتمدة',
        'فواتير إلكترونية وإيصالات رقمية',
        'نظام أمان متقدم لحماية البيانات'
      ],
      action: () => {
        navigate('/student-portal');
        toast({ title: "نظام الدفع", description: "تم توجيهك إلى نظام الدفع الإلكتروني الآمن" });
      }
    },
    {
      icon: FileText,
      title: 'خدمات الوثائق الرقمية',
      description: 'طلب وإصدار جميع الوثائق والشهادات الرسمية إلكترونياً بسرعة وأمان',
      features: [
        'شهادات التخرج المعتمدة رقمياً', 
        'كشوف الدرجات الرسمية', 
        'شهادات إثبات القيد والدراسة', 
        'وثائق التعريف الأكاديمي',
        'ترجمة معتمدة للوثائق',
        'توثيق رقمي بتقنية البلوك تشين'
      ],
      action: () => {
        navigate('/student-portal');
        toast({ title: "الوثائق الرقمية", description: "تم توجيهك إلى خدمات الوثائق الرقمية" });
      }
    },
    {
      icon: GraduationCap,
      title: 'منصة التعلم الإلكتروني',
      description: 'بيئة تعليمية تفاعلية متطورة تدعم التعلم المدمج والتعلم عن بُعد',
      features: [
        'محاضرات مسجلة عالية الجودة', 
        'فصول افتراضية تفاعلية', 
        'واجبات وامتحانات إلكترونية', 
        'منتديات نقاش أكاديمية',
        'مكتبة رقمية مخصصة لكل مقرر',
        'تتبع التقدم الأكاديمي والإنجازات'
      ],
      action: () => {
        window.open('https://lms.aylol.edu.ye', '_blank');
        toast({ title: "منصة التعلم", description: "تم فتح منصة التعلم الإلكتروني في نافذة جديدة" });
      }
    },
    {
      icon: Award,
      title: 'نظام إدارة الأنشطة الطلابية',
      description: 'منصة شاملة لإدارة وتنظيم جميع الأنشطة والفعاليات الطلابية والأكاديمية',
      features: [
        'التسجيل في النوادي والأنشطة', 
        'تقويم الفعاليات والمسابقات', 
        'نظام نقاط الأنشطة والجوائز', 
        'شهادات المشاركة الرقمية',
        'تتبع الإنجازات اللاأكاديمية',
        'منصة تنظيم المؤتمرات والندوات'
      ],
      action: () => {
        navigate('/student-affairs');
        toast({ title: "الأنشطة الطلابية", description: "تم توجيهك إلى نظام إدارة الأنشطة الطلابية" });
      }
    }
  ];

  const contactInfo = [
    { 
      icon: Phone, 
      title: 'الهاتف الرئيسي', 
      info: '+967779553944',
      description: 'خدمة الطلاب والاستفسارات العامة',
      action: () => {
        window.location.href = 'tel:+967779553944';
        toast({ title: "مكالمة", description: "جاري الاتصال بخدمة الطلاب" });
      }
    },
    { 
      icon: Mail, 
      title: 'البريد الإلكتروني الرسمي', 
      info: 'aylolcollege@gmail.com',
      description: 'للاستفسارات والمراسلات الرسمية',
      action: () => {
        window.location.href = 'mailto:aylolcollege@gmail.com';
        toast({ title: "البريد الإلكتروني", description: "تم فتح تطبيق البريد الإلكتروني" });
      }
    },
    { 
      icon: MapPin, 
      title: 'العنوان الجغرافي', 
      info: 'يريم، الدائري الغربي، أمام مستشفى يريم العام',
      description: 'محافظة إب - الجمهورية اليمنية',
      action: () => {
        window.open('https://maps.google.com/?q=Yarim+University+College', '_blank');
        toast({ title: "خريطة الموقع", description: "تم فتح الموقع في خرائط جوجل" });
      }
    },
    { 
      icon: Clock, 
      title: 'ساعات العمل الرسمية', 
      info: 'الأحد - الخميس: 8:00 ص - 4:00 م',
      description: 'الجمعة والسبت: إجازة نهاية الأسبوع',
      action: () => {
        toast({ 
          title: "ساعات العمل", 
          description: "نحن متاحون للخدمة من الأحد إلى الخميس من 8 صباحاً حتى 4 مساءً" 
        });
      }
    }
  ];

  const statistics = [
    { number: '2,500+', label: 'طالب وطالبة مسجلون' },
    { number: '150+', label: 'عضو هيئة تدريس وإدارية' },
    { number: '25+', label: 'خدمة إلكترونية متطورة' },
    { number: '99.9%', label: 'نسبة توفر الخدمات' }
  ];

  return (
    <div className="min-h-screen">
      <UnifiedHeroSection
        icon={Laptop}
        title="الخدمات الإلكترونية المتطورة"
        subtitle="مجموعة شاملة ومتكاملة من الخدمات الرقمية المتطورة لتسهيل وتطوير العملية التعليمية والإدارية بأحدث التقنيات"
        breadcrumb={
          <UnifiedBackButton 
            breadcrumbs={[
              { label: 'الرئيسية', href: '/', icon: Home },
              { label: 'الخدمات الإلكترونية', icon: Laptop }
            ]}
          />
        }
      />

      {/* Statistics Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-6">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-university-blue mb-2">{stat.number}</div>
                <div className="text-academic-gray">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">منظومة الخدمات الرقمية الشاملة</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            <p className="text-academic-gray max-w-3xl mx-auto">
              تجربة رقمية متكاملة تجمع بين الحداثة والسهولة لخدمة الطلاب وأعضاء هيئة التدريس والإدارة
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card-elevated hover:shadow-university transition-all duration-300 group">
                <div className="flex items-start mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-university-blue to-university-blue-light rounded-2xl flex items-center justify-center ml-4 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <service.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-card-title mb-3 group-hover:text-university-blue-light transition-colors">{service.title}</h3>
                    <p className="text-body mb-4">{service.description}</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <h4 className="font-semibold text-university-blue mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-university-gold rounded-full"></div>
                    المميزات والخدمات:
                  </h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-body text-sm p-2 bg-gray-50 rounded-lg hover:bg-university-blue-light hover:bg-opacity-10 transition-colors">
                        <div className="w-1.5 h-1.5 bg-university-gold rounded-full ml-2 flex-shrink-0"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={service.action}
                  className="btn-primary w-full group-hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                  <service.icon className="w-5 h-5" />
                  الوصول للخدمة الآن
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding bg-gradient-to-r from-academic-gray-light to-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">معلومات الاتصال والتواصل</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            <p className="text-academic-gray max-w-2xl mx-auto">
              نحن هنا لخدمتكم ومساعدتكم في أي وقت. تواصلوا معنا عبر القنوات المتاحة
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((contact, index) => (
              <div 
                key={index} 
                className="card-elevated text-center hover:shadow-university transition-all duration-300 cursor-pointer group"
                onClick={contact.action}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-university-blue to-university-blue-light rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <contact.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-card-title mb-3 group-hover:text-university-blue-light transition-colors">{contact.title}</h3>
                <p className="text-body font-semibold mb-2">{contact.info}</p>
                <p className="text-sm text-academic-gray">{contact.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="section-padding bg-gradient-to-r from-university-blue to-university-blue-light">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-section-title mb-6">هل تحتاج إلى مساعدة أو دعم؟</h2>
            <p className="text-xl mb-8 opacity-90">
              فريق الدعم الفني المتخصص متاح لمساعدتك في استخدام جميع الخدمات الإلكترونية وحل أي مشاكل تقنية أو إدارية تواجهها
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                <Phone className="w-8 h-8 mx-auto mb-3" />
                <h4 className="font-bold mb-2">دعم هاتفي فوري</h4>
                <p className="text-sm opacity-90">متاح 24/7 لجميع الاستفسارات</p>
              </div>
              <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                <Mail className="w-8 h-8 mx-auto mb-3" />
                <h4 className="font-bold mb-2">دعم إلكتروني سريع</h4>
                <p className="text-sm opacity-90">رد خلال 24 ساعة كحد أقصى</p>
              </div>
              <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                <Building2 className="w-8 h-8 mx-auto mb-3" />
                <h4 className="font-bold mb-2">دعم مباشر في الكلية</h4>
                <p className="text-sm opacity-90">خدمة شخصية في مكتب الدعم الفني</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => {
                  window.location.href = 'tel:+967779553944';
                  toast({ title: "اتصال فوري", description: "جاري الاتصال بالدعم الفني" });
                }}
                className="bg-white text-university-blue px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                تواصل مع الدعم الفني فوراً
              </button>
              <button 
                onClick={() => {
                  toast({ 
                    title: "دليل المستخدم", 
                    description: "سيتم إرسال دليل المستخدم إلى بريدك الإلكتروني" 
                  });
                }}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-university-blue transition-colors flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                تحميل دليل المستخدم الشامل
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Library Modal */}
      {showDigitalLibrary && (
        <DigitalLibraryModal onClose={() => setShowDigitalLibrary(false)} />
      )}
    </div>
  );
};

export default Services;
