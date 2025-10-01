
import React, { useState, useEffect } from 'react';
import { Users, Heart, BookOpen, Calendar, Trophy, Camera, Music, Gamepad2, Clock, MapPin, Phone, Mail, GraduationCap, Award, Shield, Building2, Home, Star } from 'lucide-react';
import * as Icons from 'lucide-react';
import UnifiedHeroSection from '@/components/ui/unified-hero-section';
import UnifiedBackButton from '@/components/ui/unified-back-button';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdminFixed } from '@/hooks/useIsAdminFixed';
import { useAuth } from '@/components/auth/AuthProvider';
import StudentClubModal from '../components/student-affairs/StudentClubModal';
import EventDetailsModal from '../components/student-affairs/EventDetailsModal';
import ServiceRequestModal from '../components/student-affairs/ServiceRequestModal';
import HealthServicesModal from '../components/student-affairs/HealthServicesModal';

const StudentAffairs = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedClub, setSelectedClub] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showHealthServices, setShowHealthServices] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: isAdmin } = useIsAdminFixed(user?.id);

  // Get dynamic icon component
  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || BookOpen; // fallback to BookOpen
  };

  // Fallback data (existing hardcoded data)
  const fallbackServices = [
    {
      icon: BookOpen,
      title: 'الإرشاد الأكاديمي',
      description: 'خدمات الإرشاد الأكاديمي والتوجيه المهني للطلاب في جميع التخصصات',
      services: ['توجيه اختيار التخصص المناسب', 'متابعة الأداء الأكاديمي والدرجات', 'حل المشاكل الدراسية والأكاديمية', 'التخطيط للمسار الوظيفي'],
      contact: 'د. علي محمد الحداد - ext: 201'
    },
    {
      icon: Heart,
      title: 'الخدمات الصحية',
      description: 'عيادة طبية مجهزة بأحدث المعدات لخدمة الطلاب والموظفين',
      services: ['فحوصات دورية شاملة', 'إسعافات أولية على مدار الساعة', 'استشارات صحية متخصصة', 'برامج الوقاية والتثقيف الصحي'],
      contact: 'د. فاطمة أحمد الزهراني - ext: 301'
    },
    {
      icon: Users,
      title: 'الدعم النفسي والاجتماعي',
      description: 'خدمات الدعم النفسي والاستشارات الاجتماعية للطلاب',
      services: ['استشارات نفسية فردية وجماعية', 'ورش تطوير الذات والثقة', 'حل المشاكل الشخصية والاجتماعية', 'برامج التأهيل النفسي'],
      contact: 'د. مريم عبدالله الشامي - ext: 401'
    },
    {
      icon: Trophy,
      title: 'الأنشطة الرياضية',
      description: 'برامج رياضية متنوعة للحفاظ على اللياقة البدنية والصحة',
      services: ['دوري كرة القدم الداخلي', 'بطولة كرة السلة الجامعية', 'مسابقات ألعاب القوى', 'برامج اللياقة البدنية'],
      contact: 'كابتن يحيى المخلافي - ext: 501'
    },
    {
      icon: BookOpen,
      title: 'المكتبة الرقمية المتطورة',
      description: 'مكتبة شاملة مع موارد تعليمية متطورة ومصادر إلكترونية',
      services: ['أكثر من 10,000 كتاب إلكتروني', 'قواعد بيانات علمية متخصصة', '15 قاعة دراسة هادئة ومكيفة', 'خدمة الاستعارة الإلكترونية'],
      contact: 'أ. محمد صالح العبسي - ext: 601'
    },
    {
      icon: Calendar,
      title: 'تنظيم الفعاليات الجامعية',
      description: 'تنظيم الفعاليات الثقافية والاجتماعية والأكاديمية',
      services: ['ندوات علمية متخصصة', 'معارض تعليمية وثقافية', 'احتفالات وطنية ودينية', 'حفلات التخرج والتكريم'],
      contact: 'أ. سارة أحمد المطري - ext: 701'
    }
  ];

  const fallbackClubs = [
    {
      id: 1,
      icon: BookOpen,
      name: 'النادي العلمي',
      description: 'ورش ومحاضرات علمية تطبيقية في جميع التخصصات',
      color: 'text-university-blue',
      bgColor: 'bg-blue-50',
      members: 45,
      activities: ['ورش البرمجة', 'المحاضرات العلمية', 'المعارض التقنية', 'المسابقات العلمية'],
      coordinator: 'د. محمد أحمد الحداد',
      meeting: 'الأحد 3:00 م'
    },
    {
      id: 2,
      icon: Camera,
      name: 'نادي التصوير',
      description: 'تطوير مهارات التصوير والتوثيق البصري للفعاليات',
      color: 'text-university-red',
      bgColor: 'bg-red-50',
      members: 28,
      activities: ['ورش التصوير', 'المعارض الفوتوغرافية', 'توثيق الفعاليات', 'المسابقات'],
      coordinator: 'أ. فاطمة علي المطري',
      meeting: 'الثلاثاء 2:00 م'
    },
    {
      id: 3,
      icon: Music,
      name: 'النادي الثقافي',
      description: 'فعاليات ثقافية وأدبية وشعرية متنوعة',
      color: 'text-university-gold',
      bgColor: 'bg-yellow-50',
      members: 35,
      activities: ['الأمسيات الثقافية', 'المسابقات الأدبية', 'ورش الكتابة', 'المعارض الثقافية'],
      coordinator: 'د. عبدالله صالح الزبيري',
      meeting: 'الخميس 4:00 م'
    },
    {
      id: 4,
      icon: Gamepad2,
      name: 'نادي التقنية',
      description: 'مسابقات برمجية وتقنية وألعاب إلكترونية',
      color: 'text-university-blue',
      bgColor: 'bg-purple-50',
      members: 52,
      activities: ['مسابقات البرمجة', 'هاكاثون', 'ألعاب إلكترونية', 'ورش التقنية'],
      coordinator: 'م. أحمد محمد العامري',
      meeting: 'السبت 1:00 م'
    },
    {
      id: 5,
      icon: Heart,
      name: 'نادي التطوع',
      description: 'أنشطة خيرية ومجتمعية لخدمة المجتمع المحلي',
      color: 'text-university-red',
      bgColor: 'bg-green-50',
      members: 68,
      activities: ['الحملات التوعوية', 'الأعمال الخيرية', 'زيارة الأيتام', 'نظافة البيئة'],
      coordinator: 'أ. مريم عبدالله الحداد',
      meeting: 'الاثنين 5:00 م'
    },
    {
      id: 6,
      icon: Trophy,
      name: 'النادي الرياضي',
      description: 'مسابقات وأنشطة رياضية متنوعة للطلاب',
      color: 'text-university-blue',
      bgColor: 'bg-orange-50',
      members: 42,
      activities: ['كرة القدم', 'كرة السلة', 'تنس الطاولة', 'ألعاب القوى'],
      coordinator: 'كابتن يحيى أحمد المخلافي',
      meeting: 'الأربعاء 4:00 م'
    },
    {
      id: 7,
      icon: Users,
      name: 'نادي القيادة',
      description: 'تطوير المهارات القيادية والإدارية للطلاب',
      color: 'text-university-gold',
      bgColor: 'bg-indigo-50',
      members: 31,
      activities: ['ورش القيادة', 'المحاضرات التحفيزية', 'إدارة المشاريع', 'العمل الجماعي'],
      coordinator: 'د. سارة محمد الشامي',
      meeting: 'الأحد 6:00 م'
    },
    {
      id: 8,
      icon: BookOpen,
      name: 'النادي الطبي',
      description: 'توعية صحية وأنشطة طبية للطلاب والمجتمع',
      color: 'text-university-red',
      bgColor: 'bg-teal-50',
      members: 39,
      activities: ['الحملات الصحية', 'الإسعافات الأولية', 'التوعية الطبية', 'الفحوصات المجانية'],
      coordinator: 'د. عماد فؤاد المحطوري',
      meeting: 'الثلاثاء 5:00 م'
    }
  ];

  const fallbackEvents = [
    { 
      id: 1, 
      title: 'ورشة عمل في البرمجة المتقدمة', 
      date: '2024-12-15', 
      time: '10:00 ص', 
      location: 'مختبر الحاسوب - الطابق الثاني',
      description: 'ورشة متقدمة في البرمجة باستخدام React وNode.js',
      organizer: 'النادي العلمي',
      capacity: 25,
      registered: 18
    },
    { 
      id: 2, 
      title: 'محاضرة علمية في الصيدلة السريرية', 
      date: '2024-12-18', 
      time: '2:00 م', 
      location: 'قاعة المحاضرات الكبرى - الطابق الأول',
      description: 'أحدث التطورات في الصيدلة السريرية والعلاج الدوائي',
      organizer: 'قسم الصيدلة',
      capacity: 100,
      registered: 75
    },
    { 
      id: 3, 
      title: 'معرض الكتاب السنوي', 
      date: '2024-12-22', 
      time: '9:00 ص', 
      location: 'ساحة الكلية الرئيسية',
      description: 'معرض شامل للكتب العلمية والأدبية مع خصومات خاصة',
      organizer: 'المكتبة الجامعية',
      capacity: 500,
      registered: 234
    },
    { 
      id: 4, 
      title: 'حفل تخرج الدفعة الأولى', 
      date: '2025-01-15', 
      time: '6:00 م', 
      location: 'القاعة الرئيسية - مبنى الإدارة',
      description: 'احتفال تخرج الدفعة الأولى من كلية أيلول الجامعية',
      organizer: 'عمادة شؤون الطلاب',
      capacity: 300,
      registered: 150
    }
  ];

  useEffect(() => {
    fetchStudentAffairsData();
  }, []);

  const fetchStudentAffairsData = async () => {
    try {
      setLoading(true);
      
      // Fetch services
      const { data: servicesData } = await supabase
        .from('student_affairs_services')
        .select('*')
        .eq('status', 'active')
        .order('display_order', { ascending: true });

      // Fetch clubs
      const { data: clubsData } = await supabase
        .from('student_clubs')
        .select('*')
        .in('status', ['active', 'recruiting'])
        .order('display_order', { ascending: true });

      // Fetch activities
      const { data: activitiesData } = await supabase
        .from('student_activities')
        .select('*')
        .in('status', ['open', 'ongoing', 'completed'])
        .order('start_date', { ascending: true });

      // Map services data to match the expected format
      if (servicesData && servicesData.length > 0) {
        setServices(servicesData.map(service => ({
          id: service.id,
          icon: getIconComponent(service.icon),
          title: service.title_ar,
          description: service.description_ar,
          services: service.required_documents || [],
          contact: service.processing_time ? `مدة المعالجة: ${service.processing_time}` : '',
          fee: service.fee_amount
        })));
      } else {
        setServices(fallbackServices);
      }

      // Map clubs data
      if (clubsData && clubsData.length > 0) {
        setClubs(clubsData.map(club => ({
          id: club.id,
          icon: BookOpen, // You can add icon mapping logic here
          name: club.name_ar,
          description: club.description_ar,
          color: 'text-university-blue',
          bgColor: 'bg-blue-50',
          members: club.current_members,
          activities: [], // You can fetch club activities separately
          coordinator: club.supervisor_name,
          meeting: club.location
        })));
      } else {
        setClubs(fallbackClubs);
      }

      // Map activities data to events format
      if (activitiesData && activitiesData.length > 0) {
        setActivities(activitiesData.map(activity => ({
          id: activity.id,
          title: activity.title_ar,
          date: activity.start_date ? new Date(activity.start_date).toISOString().split('T')[0] : '',
          time: activity.start_date ? new Date(activity.start_date).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' }) : '',
          location: activity.location,
          description: activity.description_ar,
          organizer: activity.organizer_name,
          capacity: activity.max_participants,
          registered: activity.current_participants
        })));
      } else {
        setActivities(fallbackEvents);
      }

    } catch (error) {
      console.error('Error fetching student affairs data:', error);
      // Use fallback data if there's an error
      setServices(fallbackServices);
      setClubs(fallbackClubs);
      setActivities(fallbackEvents);
    } finally {
      setLoading(false);
    }
  };

  // Use the fetched data or fallback data
  const events = activities;

  const handleJoinClub = (club: any) => {
    setSelectedClub(club);
  };

  const handleEventDetails = (event: any) => {
    setSelectedEvent(event);
  };

  const handleServiceRequest = (service: any) => {
    setSelectedService(service);
  };

  const handleHealthServices = () => {
    setShowHealthServices(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeroSection
        icon={Users}
        title="شؤون الطلاب"
        subtitle="نوفر بيئة جامعية متكاملة تدعم نمو الطلاب أكاديمياً واجتماعياً وثقافياً ونفسياً"
        breadcrumb={
          <UnifiedBackButton 
            breadcrumbs={[
              { label: 'الرئيسية', href: '/', icon: Home },
              { label: 'شؤون الطلاب', icon: Users }
            ]}
          />
        }
      />

      {/* Student Services */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title mb-4">الخدمات الطلابية المتميزة</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-4"></div>
            <p className="text-academic-gray max-w-2xl mx-auto">
              مجموعة شاملة من الخدمات المتخصصة لدعم الطلاب في رحلتهم الأكاديمية والشخصية
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card-elevated text-center hover:shadow-university transition-all duration-300 group">
                <service.icon className="w-16 h-16 text-university-blue mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-card-title mb-3">{service.title}</h3>
                <p className="text-body mb-4">{service.description}</p>
                <ul className="text-sm text-academic-gray space-y-2 mb-6 text-right">
                  {service.services.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2" dir="rtl">
                      <div className="w-2 h-2 bg-university-gold rounded-full flex-shrink-0"></div>
                      <span className="text-right">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-university-blue-light mb-4">
                  {service.contact}
                </div>
                <button 
                  onClick={() => handleServiceRequest(service)}
                  className="btn-primary w-full"
                >
                  طلب الخدمة
                </button>
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
            <div className="w-24 h-1 bg-university-blue mx-auto mb-4"></div>
            <p className="text-academic-gray max-w-2xl mx-auto">
              أكثر من 8 نوادي طلابية متخصصة بعضوية تزيد عن 340 طالب وطالبة
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clubs.map((club, index) => (
              <div key={index} className={`card-elevated text-center hover:scale-105 transition-all duration-300 ${club.bgColor} border-2 border-transparent hover:border-university-blue`}>
                <div className="relative">
                  <club.icon className={`w-12 h-12 mx-auto mb-3 ${club.color}`} />
                  <div className="absolute -top-2 -right-2 bg-university-gold text-white text-xs rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    {club.members}
                  </div>
                </div>
                <h3 className="text-card-title mb-2">{club.name}</h3>
                <p className="text-body text-sm mb-3">{club.description}</p>
                <div className="text-xs text-academic-gray mb-3 text-right" dir="rtl">
                  <div className="mb-1">المنسق: {club.coordinator}</div>
                  <div>الاجتماع: {club.meeting}</div>
                </div>
                <button 
                  onClick={() => handleJoinClub(club)}
                  className="btn-primary w-full text-sm"
                >
                  انضم الآن
                </button>
              </div>
            ))}
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <div className="card-elevated text-center">
            <div className="text-3xl font-bold text-university-blue mb-2">{clubs.reduce((sum, club) => sum + club.members, 0)}+</div>
            <div className="text-academic-gray">عضو نشط</div>
            </div>
            <div className="card-elevated text-center">
              <div className="text-3xl font-bold text-university-red mb-2">25</div>
              <div className="text-academic-gray">فعالية شهرياً</div>
            </div>
            <div className="card-elevated text-center">
            <div className="text-3xl font-bold text-university-gold mb-2">{clubs.length}</div>
            <div className="text-academic-gray">نادي متخصص</div>
            </div>
            <div className="card-elevated text-center">
              <div className="text-3xl font-bold text-university-blue mb-2">15</div>
              <div className="text-academic-gray">مدرب ومنسق</div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Calendar */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title mb-4">تقويم الفعاليات والأنشطة</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-4"></div>
            <p className="text-academic-gray max-w-2xl mx-auto">
              جدول شامل بجميع الفعاليات والأنشطة القادمة مع إمكانية التسجيل المباشر
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Upcoming Events */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-card-title mb-6 flex items-center">
                  <Calendar className="w-6 h-6 ml-2 text-university-blue" />
                  الفعاليات القادمة ({events.length})
                </h3>
                
                {events.map((event) => (
                  <div key={event.id} className="card-elevated hover:shadow-university transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-university-blue mb-2 group-hover:text-university-blue-light transition-colors">
                          {event.title}
                        </h4>
                        <p className="text-body text-sm mb-3">{event.description}</p>
                        <div className="space-y-1 text-sm text-academic-gray" dir="rtl">
                          <div className="flex items-center justify-end gap-2">
                            <span>{new Date(event.date).toLocaleDateString('ar-YE', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</span>
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <span>{event.time}</span>
                            <Clock className="w-4 h-4" />
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <span>{event.location}</span>
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <span>{event.registered}/{event.capacity} مسجل</span>
                            <Users className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="bg-university-blue text-white text-center p-2 rounded-lg mb-3 min-w-[60px]">
                          <div className="text-lg font-bold">{new Date(event.date).getDate()}</div>
                          <div className="text-xs">{new Date(event.date).toLocaleDateString('ar-YE', { month: 'short' })}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleEventDetails(event)}
                        className="btn-primary flex-1"
                      >
                        عرض التفاصيل
                      </button>
                      <button 
                        onClick={() => toast({ 
                          title: "تم التسجيل", 
                          description: `تم تسجيلك في فعالية "${event.title}"` 
                        })}
                        className="btn-secondary"
                        disabled={event.registered >= event.capacity}
                      >
                        {event.registered >= event.capacity ? 'مكتمل' : 'سجل الآن'}
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="text-center pt-6">
                  <button 
                    onClick={() => toast({ title: "جميع الفعاليات", description: "سيتم عرض جميع الفعاليات" })}
                    className="btn-ghost"
                  >
                    عرض جميع الفعاليات →
                  </button>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="space-y-6">
                <div className="card-elevated">
                  <h3 className="text-card-title mb-4">إجراءات سريعة</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => navigate('/student-portal')}
                      className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                      <GraduationCap className="w-5 h-5" />
                      بوابة الطالب
                    </button>
                    <button 
                      onClick={() => navigate('/digital-library')}
                      className="w-full btn-secondary flex items-center justify-center gap-2"
                    >
                      <BookOpen className="w-5 h-5" />
                      المكتبة الرقمية
                    </button>
                    <button 
                      onClick={() => toast({ title: "الدعم الفني", description: "سيتم توجيهك للدعم الفني" })}
                      className="w-full btn-ghost flex items-center justify-center gap-2"
                    >
                      <Phone className="w-5 h-5" />
                      الدعم الفني
                    </button>
                  </div>
                </div>

                <div className="card-elevated">
                  <h3 className="text-card-title mb-4">معلومات الاتصال</h3>
                  <div className="space-y-3 text-sm" dir="rtl">
                    <div className="flex items-center justify-between">
                      <Phone className="w-4 h-4 text-university-blue" />
                      <span>عمادة شؤون الطلاب</span>
                    </div>
                    <div className="text-university-blue font-semibold text-right">+967779553944</div>
                    <div className="flex items-center justify-between">
                      <Mail className="w-4 h-4 text-university-blue" />
                      <span>البريد الإلكتروني</span>
                    </div>
                    <div className="text-university-blue font-semibold text-right">aylolcollege@gmail.com</div>
                    <div className="flex items-center justify-between">
                      <Clock className="w-4 h-4 text-university-blue" />
                      <span>ساعات العمل</span>
                    </div>
                    <div className="text-academic-gray text-right">الأحد - الخميس: 8:00 ص - 4:00 م</div>
                  </div>
                </div>

                <div className="card-elevated bg-gradient-to-r from-university-blue to-university-blue-light text-white">
                  <h3 className="text-lg font-bold mb-3">هل تحتاج مساعدة؟</h3>
                  <p className="text-sm mb-4 opacity-90">
                    فريق شؤون الطلاب متاح لمساعدتك في أي استفسار
                  </p>
                  <button 
                    onClick={() => toast({ 
                      title: "طلب المساعدة", 
                      description: "سيتم التواصل معك خلال 24 ساعة" 
                    })}
                    className="w-full bg-white text-university-blue py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    اطلب المساعدة الآن
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
            <div className="w-24 h-1 bg-university-blue mx-auto mb-4"></div>
            <p className="text-academic-gray max-w-2xl mx-auto">
              شهادات حقيقية من خريجي كلية أيلول الذين حققوا إنجازات مميزة في حياتهم المهنية
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'أحمد محمد العامري',
                program: 'تكنولوجيا المعلومات - دفعة 2023',
                achievement: 'حصل على منحة دراسية لإكمال الماجستير في جامعة مالايا - ماليزيا',
                quote: 'كلية أيلول فتحت لي آفاق جديدة في عالم التقنية وأهلتني للدراسة في الخارج',
                image: '/lovable-uploads/944e3689-0196-4df0-85b6-b5a6dc165b67.png'
              },
              {
                name: 'فاطمة علي الحداد',
                program: 'الصيدلة - دفعة 2023',
                achievement: 'تم تعيينها كصيدلانية أولى في مستشفى الثورة العام - صنعاء',
                quote: 'التدريب العملي المكثف في الكلية أهلني للعمل مباشرة في أكبر المستشفيات',
                image: '/lovable-uploads/b95f00a9-164e-4eb5-8efa-206bdd2fd5f4.png'
              },
              {
                name: 'محمد عبدالله الزبيري',
                program: 'إدارة الأعمال - دفعة 2022',
                achievement: 'أسس شركته الخاصة "تقنيات الزبيري" في مجال التجارة الإلكترونية',
                quote: 'تعلمت في الكلية كيف أحول الأفكار إلى مشاريع ناجحة تخدم المجتمع',
                image: '/lovable-uploads/7f9784b8-daea-4839-9cca-017def32b25e.png'
              }
            ].map((story, index) => (
              <div key={index} className="card-elevated text-center group hover:shadow-university transition-all duration-300">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <img 
                    src={story.image} 
                    alt={story.name}
                    className="w-full h-full rounded-full object-cover border-4 border-university-blue group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-university-gold rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-card-title mb-2">{story.name}</h3>
                <p className="text-university-blue font-semibold mb-3 text-sm">{story.program}</p>
                <div className="bg-university-blue-light bg-opacity-10 p-3 rounded-lg mb-4">
                  <p className="text-body text-sm">{story.achievement}</p>
                </div>
                <blockquote className="text-academic-gray italic text-sm">
                  "{story.quote}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modals */}
      {selectedClub && (
        <StudentClubModal 
          club={selectedClub} 
          onClose={() => setSelectedClub(null)} 
        />
      )}

      {selectedEvent && (
        <EventDetailsModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}

      {selectedService && (
        <ServiceRequestModal 
          service={selectedService} 
          onClose={() => setSelectedService(null)} 
        />
      )}

      {showHealthServices && (
        <HealthServicesModal 
          onClose={() => setShowHealthServices(false)} 
        />
      )}
    </div>
  );
};

export default StudentAffairs;
