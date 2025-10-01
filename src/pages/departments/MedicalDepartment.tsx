import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  BookOpen, 
  Users, 
  GraduationCap, 
  ArrowLeft, 
  Target, 
  Award, 
  Pill, 
  Baby,
  TrendingUp,
  Star,
  Globe,
  Zap,
  Home,
  ChevronLeft,
  Stethoscope,
  Cross,
  Shield,
  Brain
} from 'lucide-react';
import { motion } from 'framer-motion';
import UnifiedHeroSection from '@/components/ui/unified-hero-section';
import UnifiedBackButton from '@/components/ui/unified-back-button';

const MedicalDepartment = () => {
  const navigate = useNavigate();
  
  const programs = [
    {
      id: 'nursing',
      title: 'التمريض',
      titleEn: 'Nursing',
      duration: '4 سنوات',
      creditHours: '132 ساعة معتمدة',
      degree: 'بكالوريوس',
      href: '/programs/nursing',
      icon: Heart,
      description: 'برنامج شامل يغطي جميع جوانب التمريض المتقدم من الرعاية السريرية إلى إدارة المرضى مع التركيز على التطبيقات العملية والتدريب المهني',
      features: [
        { title: 'التمريض السريري المتقدم', icon: Stethoscope },
        { title: 'العناية المركزة والطوارئ', icon: Cross },
        { title: 'تمريض الأطفال والولادة', icon: Baby },
        { title: 'الإدارة التمريضية', icon: Shield }
      ],
      stats: [
        { label: 'معدل التوظيف', value: '98%', icon: TrendingUp },
        { label: 'متوسط الراتب', value: '1800$', icon: Star },
        { label: 'المستشفيات الشريكة', value: '8+', icon: Globe }
      ]
    },
    {
      id: 'pharmacy',
      title: 'الصيدلة',
      titleEn: 'Pharmacy',
      duration: '5 سنوات',
      creditHours: '165 ساعة معتمدة',
      degree: 'بكالوريوس',
      href: '/programs/pharmacy',
      icon: Pill,
      description: 'برنامج متخصص يعد صيادلة مؤهلين للعمل في مختلف مجالات الصيدلة السريرية والمجتمعية مع التركيز على علم الأدوية والصيدلة الحديثة',
      features: [
        { title: 'الصيدلة السريرية والعلاجية', icon: Pill },
        { title: 'علم الأدوية والسموم', icon: Brain },
        { title: 'الصيدلة الصناعية', icon: Shield },
        { title: 'إدارة الصيدليات', icon: TrendingUp }
      ],
      stats: [
        { label: 'معدل التوظيف', value: '94%', icon: TrendingUp },
        { label: 'متوسط الراتب', value: '2000$', icon: Star },
        { label: 'الصيدليات الشريكة', value: '10+', icon: Globe }
      ]
    },
    {
      id: 'midwifery',
      title: 'القبالة',
      titleEn: 'Midwifery',
      duration: '4 سنوات',
      creditHours: '132 ساعة معتمدة',
      degree: 'بكالوريوس',
      href: '/programs/midwifery',
      icon: Baby,
      description: 'برنامج متخصص في إعداد قابلات قانونيات لرعاية الأمهات والأطفال خلال فترات الحمل والولادة مع التركيز على صحة الأم والطفل',
      features: [
        { title: 'رعاية الحمل والولادة', icon: Baby },
        { title: 'صحة الأم والطفل', icon: Heart },
        { title: 'التمريض النسائي', icon: Stethoscope },
        { title: 'طب الأطفال حديثي الولادة', icon: Shield }
      ],
      stats: [
        { label: 'معدل التوظيف', value: '96%', icon: TrendingUp },
        { label: 'متوسط الراتب', value: '1700$', icon: Star },
        { label: 'المراكز الصحية', value: '6+', icon: Globe }
      ]
    }
  ];

  const departmentInfo = {
    vision: 'أن نكون قسماً رائداً في تعليم العلوم الطبية وإعداد كوادر صحية متميزة لخدمة المجتمع',
    mission: 'تقديم تعليم طبي متميز وتدريب عملي متقدم لإعداد كوادر صحية مؤهلة تساهم في تطوير القطاع الصحي',
    objectives: [
      'إعداد كوادر صحية متخصصة ومؤهلة',
      'تطوير المهارات السريرية والعملية للطلاب',
      'تعزيز البحث العلمي في المجال الطبي',
      'خدمة المجتمع من خلال تقديم الرعاية الصحية'
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeroSection
        icon={Heart}
        title="قسم العلوم الطبية"
        subtitle="نحو مستقبل صحي متطور مع برامج أكاديمية متخصصة في الرعاية الصحية وخدمة المجتمع"
        badges={[
          { icon: Users, text: "3 برامج أكاديمية" },
          { icon: GraduationCap, text: "درجة البكالوريوس" },
          { icon: Heart, text: "رعاية صحية متقدمة" }
        ]}
        primaryCta={{ text: "استكشف البرامج", href: "#programs" }}
        secondaryCta={{ text: "تواصل معنا", href: "/contact" }}
        breadcrumb={
          <UnifiedBackButton 
            breadcrumbs={[
              { label: "الرئيسية", href: "/", icon: Home },
              { label: "الأقسام الأكاديمية", href: "/departments" },
              { label: "العلوم الطبية", icon: Heart }
            ]}
          />
        }
      />

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Department Overview */}
        <motion.section 
          className="mb-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              نظرة عامة على القسم
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              تعرف على رؤيتنا ورسالتنا في إعداد جيل مميز من المتخصصين في الرعاية الصحية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div variants={itemVariants}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full group hover:shadow-university transition-all duration-500 bg-gradient-to-br from-card to-card/80 border-border/60">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-primary group-hover:text-primary/80 transition-colors">
                    رؤية القسم
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    {departmentInfo.vision}
                  </p>
                </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-2">
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full group hover:shadow-university transition-all duration-500 bg-gradient-to-br from-card to-card/80 border-border/60">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors duration-300">
                    <Award className="w-8 h-8 text-secondary" />
                  </div>
                  <CardTitle className="text-xl text-secondary group-hover:text-secondary/80 transition-colors">
                    رسالة القسم
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    {departmentInfo.mission}
                  </p>
                </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Department Objectives */}
        <motion.section 
          className="mb-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              أهداف القسم
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نسعى لتحقيق أهداف تعليمية متميزة تواكب التطورات الطبية الحديثة
            </p>
          </motion.div>

          <Card className="overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 border-muted/50">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {departmentInfo.objectives.map((objective, index) => (
                  <motion.div 
                    key={index} 
                    className="group"
                    variants={itemVariants}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="flex items-start space-x-4 space-x-reverse p-4 rounded-xl hover:bg-card/50 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center flex-shrink-0 shadow-soft group-hover:shadow-medium transition-all duration-300">
                        <span className="text-white font-bold text-lg">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground font-medium leading-relaxed group-hover:text-primary transition-colors duration-300">
                          {objective}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Programs Section */}
        <motion.section 
          id="programs"
          className="mb-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">البرامج الأكاديمية</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              برامج طبية معتمدة ومصممة لإعداد كوادر صحية مؤهلة ومبدعة في مجال الرعاية الصحية
            </p>
          </motion.div>

          <div className="space-y-8">
            {programs.map((program) => {
              const IconComponent = program.icon;
              return (
                <motion.div key={program.id} variants={itemVariants}>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden hover:shadow-university transition-all duration-500 group bg-gradient-to-br from-card to-card/90 border-border/60">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                        {/* محتوى البرنامج */}
                        <div className="lg:col-span-2 p-8">
                          <div className="flex items-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center ml-4 shadow-soft group-hover:shadow-medium transition-all duration-300">
                              <IconComponent className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                                {program.title}
                              </h3>
                              <p className="text-muted-foreground text-lg">{program.titleEn}</p>
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                            {program.description}
                          </p>

                          {/* مجالات التخصص */}
                          <div className="space-y-4 mb-8">
                            <h4 className="font-semibold text-foreground text-lg">مجالات التخصص:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {program.features.map((feature, index) => {
                                const FeatureIconComponent = feature.icon;
                                return (
                                    <motion.div 
                                      key={index} 
                                      className="flex items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-300 group/feature"
                                      whileHover={{ scale: 1.02 }}
                                    >
                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center ml-3 group-hover/feature:bg-primary/20 transition-colors duration-300">
                                      <FeatureIconComponent className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-foreground font-medium">{feature.title}</span>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>

                          {/* إحصائيات البرنامج */}
                          <div className="grid grid-cols-3 gap-4">
                            {program.stats.map((stat, index) => {
                              const StatIconComponent = stat.icon;
                              return (
                                <div key={index} className="text-center p-4 rounded-lg bg-gradient-to-br from-muted/20 to-muted/10">
                                  <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <StatIconComponent className="w-4 h-4 text-secondary" />
                                  </div>
                                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* معلومات جانبية */}
                        <div className="lg:col-span-1 bg-gradient-to-br from-muted/30 to-muted/10 p-8 flex flex-col justify-center space-y-6">
                          <div className="space-y-4">
                            <Badge variant="default" className="w-full justify-center py-3 text-base">
                              {program.degree}
                            </Badge>
                            <Badge variant="secondary" className="w-full justify-center py-3 text-base">
                              {program.duration}
                            </Badge>
                            <Badge variant="outline" className="w-full justify-center py-3 text-base border-primary/20">
                              {program.creditHours}
                            </Badge>
                          </div>

                          <div className="space-y-3">
                            <Button asChild className="w-full" size="lg">
                              <Link to={program.href}>
                                تفاصيل البرنامج
                                <ArrowLeft className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="w-full">
                              <Link to="/admissions">
                                شروط القبول
                                <ArrowLeft className="w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/5 border-primary/20">
              {/* خلفية تفاعلية */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary rounded-full -translate-x-24 translate-y-24"></div>
              </div>
              
              <CardContent className="p-12 relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-university"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Heart className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                    انضم إلى مجتمعنا الطبي
                  </h3>
                  
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    تواصل معنا للحصول على معلومات تفصيلية عن برامج القسم، متطلبات القبول، والفرص المهنية المتاحة. 
                    فريقنا الأكاديمي جاهز لمساعدتك في اتخاذ القرار الأمثل لمستقبلك الطبي.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm">
                      <div className="text-2xl font-bold text-primary">96%</div>
                      <div className="text-sm text-muted-foreground">معدل التوظيف</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm">
                      <div className="text-2xl font-bold text-secondary">8+</div>
                      <div className="text-sm text-muted-foreground">مؤسسة صحية شريكة</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm">
                      <div className="text-2xl font-bold text-primary">750+</div>
                      <div className="text-sm text-muted-foreground">خريج مؤهل</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg">
                      <Link to="/contact">
                        تواصل معنا
                        <ArrowLeft className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="border-primary/20 hover:border-primary">
                      <Link to="/admissions">
                        شروط القبول
                        <ArrowLeft className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="lg" className="hover:bg-primary/10">
                      <Link to="/programs">
                        جميع البرامج
                        <ArrowLeft className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
};

export default MedicalDepartment;