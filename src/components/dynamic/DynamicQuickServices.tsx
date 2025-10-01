import React from 'react';
import { 
  User, 
  Calendar, 
  CreditCard, 
  FileText,
  MessageCircle,
  Monitor,
  Users,
  Phone,
  GraduationCap,
  Award,
  Briefcase,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EditableContent } from '@/components/inline-editor/EditableContent';

interface DynamicQuickServicesProps {
  language?: 'ar' | 'en';
  className?: string;
}

export const DynamicQuickServices: React.FC<DynamicQuickServicesProps> = ({
  language = 'ar',
  className = ''
}) => {
  const mainServices = [
    {
      icon: User,
      titleKey: 'student_portal_title',
      descriptionKey: 'student_portal_desc',
      defaultTitle: 'البوابة الطلابية',
      defaultDesc: 'الوصول إلى الخدمات الطلابية',
      color: 'from-blue-500 to-blue-600',
      href: '/student-portal'
    },
    {
      icon: Calendar,
      titleKey: 'academic_calendar_title',
      descriptionKey: 'academic_calendar_desc',
      defaultTitle: 'التقويم الأكاديمي',
      defaultDesc: 'مواعيد العام الدراسي',
      color: 'from-green-500 to-green-600',
      href: '/academic-calendar'
    },
    {
      icon: CreditCard,
      titleKey: 'online_payment_title',
      descriptionKey: 'online_payment_desc',
      defaultTitle: 'الدفع الإلكتروني',
      defaultDesc: 'دفع الرسوم أونلاين',
      color: 'from-purple-500 to-purple-600',
      href: '/payments'
    },
    {
      icon: FileText,
      titleKey: 'digital_library_title',
      descriptionKey: 'digital_library_desc',
      defaultTitle: 'المكتبة الرقمية',
      defaultDesc: 'موارد التعلم الإلكترونية',
      color: 'from-orange-500 to-orange-600',
      href: '/digital-library'
    }
  ];

  const quickLinks = [
    {
      icon: MessageCircle,
      titleKey: 'academic_advising_title',
      defaultTitle: 'الإرشاد الأكاديمي',
      href: '/academic-advising'
    },
    {
      icon: Monitor,
      titleKey: 'elearning_title',
      defaultTitle: 'التعلم الإلكتروني',
      href: '/elearning'
    },
    {
      icon: Users,
      titleKey: 'student_affairs_title',
      defaultTitle: 'شؤون الطلاب',
      href: '/student-affairs'
    },
    {
      icon: Phone,
      titleKey: 'contact_us_title',
      defaultTitle: 'اتصل بنا',
      href: '/contact'
    },
    {
      icon: GraduationCap,
      titleKey: 'admission_title',
      defaultTitle: 'القبول والتسجيل',
      href: '/admissions'
    },
    {
      icon: Award,
      titleKey: 'certificates_title',
      defaultTitle: 'الشهادات والوثائق',
      href: '/certificates'
    },
    {
      icon: Briefcase,
      titleKey: 'career_services_title',
      defaultTitle: 'الخدمات المهنية',
      href: '/career-services'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className={`py-16 bg-muted/30 ${className}`}>
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            <EditableContent 
              pageKey="homepage" 
              elementKey="services_title" 
              elementType="text"
              fallback="الخدمات السريعة"
              language={language}
            />
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <EditableContent 
              pageKey="homepage" 
              elementKey="services_description" 
              elementType="text"
              fallback="الوصول السريع إلى أهم الخدمات والمواد التعليمية التي تحتاجها"
              language={language}
            />
          </p>
        </div>

        {/* Main Services */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {mainServices.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="group h-full hover:shadow-lg transition-all duration-300 border-0 bg-white">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${service.color} p-4 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-full h-full text-white" />
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                    <EditableContent 
                      pageKey="homepage" 
                      elementKey={service.titleKey} 
                      elementType="text"
                      fallback={service.defaultTitle}
                      language={language}
                    />
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4">
                    <EditableContent 
                      pageKey="homepage" 
                      elementKey={service.descriptionKey} 
                      elementType="text"
                      fallback={service.defaultDesc}
                      language={language}
                    />
                  </p>
                  
                  <Button 
                    asChild 
                    variant="ghost" 
                    size="sm"
                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    <Link to={service.href}>
                      الدخول
                      <ArrowLeft className="w-4 h-4 mr-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Links */}
        <motion.div 
          className="bg-white rounded-lg p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-bold mb-6 text-foreground text-center">
            <EditableContent 
              pageKey="homepage" 
              elementKey="quick_links_title" 
              elementType="text"
              fallback="روابط سريعة"
              language={language}
            />
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {quickLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                <Link
                  to={link.href}
                  className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                    <link.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs text-center text-muted-foreground group-hover:text-foreground transition-colors">
                    <EditableContent 
                      pageKey="homepage" 
                      elementKey={link.titleKey} 
                      elementType="text"
                      fallback={link.defaultTitle}
                      language={language}
                    />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button asChild size="lg" className="px-8">
            <Link to="/services">
              <EditableContent 
                pageKey="homepage" 
                elementKey="view_all_services" 
                elementType="text"
                fallback="عرض جميع الخدمات"
                language={language}
              />
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};