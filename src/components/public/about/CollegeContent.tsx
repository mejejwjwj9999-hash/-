import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AboutSection } from '@/types/aboutSections';
import { Calendar, Users, MapPin, Award, BookOpen, Home, ArrowLeft, Target, Globe } from 'lucide-react';
import UnifiedPageHeader from '@/components/ui/unified-page-header';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface CollegeContentProps {
  section: AboutSection;
}

export const CollegeContent: React.FC<CollegeContentProps> = ({ section }) => {
  const getElementContent = (key: string, fallback = '') => {
    const element = section.elements?.find(el => el.element_key === key);
    return element?.content_ar || fallback;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  // تعريف أقسام عن الكلية بنفس أسلوب الأقسام الأكاديمية
  const aboutSections = [
    {
      id: 'about-college',
      title: 'عن الكلية',
      titleEn: 'About College',
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-600',
      bgGradient: 'from-blue-500 to-blue-600',
      href: '/about/college',
      description: getElementContent('history-section', 'تأسست كلية إيلول الجامعية بهدف تقديم تعليم عالي الجودة في مختلف التخصصات العلمية والإنسانية.'),
      features: ['تأسست عام 2010', 'معتمدة أكاديمياً']
    },
    {
      id: 'vision-mission',
      title: 'الرؤية والرسالة',
      titleEn: 'Vision & Mission',
      icon: Target,
      color: 'bg-amber-50 text-amber-600',
      bgGradient: 'from-amber-500 to-orange-500',
      href: '/about/vision-mission',
      description: 'رؤية ورسالة الكلية في تقديم تعليم عالي الجودة وإعداد كوادر مؤهلة',
      features: ['رؤية مستقبلية', 'رسالة هادفة']
    },
    {
      id: 'dean-message',
      title: 'كلمة العميد',
      titleEn: 'Dean\'s Message',
      icon: Users,
      color: 'bg-red-50 text-red-600',
      bgGradient: 'from-red-500 to-pink-500',
      href: '/about/dean-message',
      description: 'كلمة عميد الكلية حول رؤية الكلية وأهدافها المستقبلية',
      features: ['قيادة متميزة', 'خبرة أكاديمية']
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Unified Header */}
      <UnifiedPageHeader
        icon={BookOpen}
        title={getElementContent('hero-title', 'عن كلية إيلول الجامعية')}
        subtitle={getElementContent('hero-description', 'تميز أكاديمي وريادة في التعليم العالي')}
        breadcrumbs={[
          { label: 'الرئيسية', href: '/', icon: Home },
          { label: 'عن الكلية' }
        ]}
      />

      {/* Main Content - بنفس أسلوب DepartmentsSection */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              أقسام عن الكلية
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              تعرف على كلية إيلول الجامعية، تاريخها، رؤيتها، ورسالتها في تقديم تعليم عالي الجودة
            </p>
          </div>

          {/* About Sections Grid - بنفس أسلوب بطاقات الأقسام */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {aboutSections.map((section, index) => (
              <motion.div key={section.id} variants={itemVariants}>
                <Card className="group relative overflow-hidden bg-card border-border/60 hover:border-primary/20 transition-all duration-500 hover:shadow-university">
                  {/* خلفية متدرجة للتأثير */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${section.bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  {/* نمط هندسي للخلفية */}
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                    <div className="w-full h-full border-2 border-primary/20 rounded-full transform translate-x-8 -translate-y-8"></div>
                  </div>
                  
                  <CardHeader className="relative z-10 pb-4">
                    {/* أيقونة القسم */}
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 ${section.color} group-hover:scale-110 transition-all duration-300 shadow-soft`}>
                      <section.icon className="w-8 h-8" />
                    </div>

                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300 mb-2">
                      {section.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground font-medium">
                      {section.titleEn}
                    </p>
                  </CardHeader>

                  <CardContent className="relative z-10 space-y-6">
                    {/* وصف القسم */}
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {section.description}
                    </p>

                    {/* مميزات القسم */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">
                        معلومات عن القسم:
                      </h4>
                      <div className="space-y-2">
                        {section.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full ml-3 flex-shrink-0"></div>
                            <span className="line-clamp-1">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* زر الاستكشاف */}
                    <Button
                      asChild
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mt-6"
                      variant="outline"
                    >
                      <Link to={section.href}>
                        <span>استكشف المزيد</span>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Statistics Cards */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-8 text-center">إحصائيات الكلية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-xl">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary">14+</h3>
                    <p className="text-muted-foreground">سنة من التميز</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/20 rounded-xl">
                    <Users className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-secondary">1000+</h3>
                    <p className="text-muted-foreground">خريج متميز</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-blue-600/10 border border-blue-500/20 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-blue-600">5+</h3>
                    <p className="text-muted-foreground">برامج أكاديمية</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-500/5 to-green-600/10 border border-green-500/20 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <Globe className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-600">100%</h3>
                    <p className="text-muted-foreground">اعتماد أكاديمي</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};