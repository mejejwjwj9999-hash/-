import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Laptop, 
  BookOpen, 
  Users, 
  GraduationCap, 
  ArrowLeft, 
  Target, 
  Award,
  Code,
  Database,
  Shield,
  Brain,
  Globe,
  Zap,
  Star,
  TrendingUp,
  Home
} from 'lucide-react';
import { motion } from 'framer-motion';
import UnifiedHeroSection from '@/components/ui/unified-hero-section';
import UnifiedBackButton from '@/components/ui/unified-back-button';

const TechScienceDepartment = () => {
  const programs = [
    {
      id: 'it',
      title: 'تكنولوجيا المعلومات',
      titleEn: 'Information Technology',
      duration: '4 سنوات',
      creditHours: '132 ساعة معتمدة',
      degree: 'بكالوريوس',
      href: '/programs/information-technology',
      description: 'برنامج شامل يغطي جميع جوانب تكنولوجيا المعلومات من البرمجة إلى إدارة الشبكات وأمن المعلومات مع التركيز على التطبيقات العملية والمشاريع الحقيقية',
      features: [
        { title: 'تطوير تطبيقات الويب والجوال', icon: Code },
        { title: 'إدارة قواعد البيانات', icon: Database },
        { title: 'أمن المعلومات والشبكات', icon: Shield },
        { title: 'الذكاء الاصطناعي وعلم البيانات', icon: Brain }
      ],
      stats: [
        { label: 'معدل التوظيف', value: '95%', icon: TrendingUp },
        { label: 'متوسط الراتب', value: '2500$', icon: Star },
        { label: 'الشراكات', value: '15+', icon: Globe }
      ]
    }
  ];

  const departmentInfo = {
    vision: 'أن نكون قسماً رائداً في تعليم علوم الحاسوب والتكنولوجيا على المستوى المحلي والإقليمي',
    mission: 'تقديم تعليم متميز في مجال التكنولوجيا وإعداد خريجين مؤهلين لسوق العمل مع التركيز على الابتكار والبحث العلمي',
    objectives: [
      'إعداد كوادر متخصصة في مجال تكنولوجيا المعلومات',
      'تطوير مهارات الطلاب في البرمجة والتطوير',
      'توفير بيئة تعليمية محفزة للإبداع والابتكار',
      'ربط التعليم بمتطلبات سوق العمل المحلي والعالمي'
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
        icon={Laptop}
        title="قسم العلوم التقنية والحاسوب"
        subtitle="نحو مستقبل رقمي متطور مع برامج أكاديمية متخصصة في التكنولوجيا المتقدمة والابتكار التقني"
        badges={[
          { icon: Users, text: "1 برنامج أكاديمي" },
          { icon: GraduationCap, text: "درجة البكالوريوس" },
          { icon: Zap, text: "تكنولوجيا متقدمة" }
        ]}
        primaryCta={{ text: "استكشف البرامج", href: "#programs" }}
        secondaryCta={{ text: "تواصل معنا", href: "/contact" }}
        breadcrumb={
          <UnifiedBackButton 
            breadcrumbs={[
              { label: "الرئيسية", href: "/", icon: Home },
              { label: "الأقسام الأكاديمية", href: "/departments" },
              { label: "العلوم التقنية والحاسوب", icon: Laptop }
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
              تعرف على رؤيتنا ورسالتنا في إعداد جيل مميز من المتخصصين في التكنولوجيا
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div variants={itemVariants}>
              <Card className="h-full group hover:shadow-university transition-all duration-500 bg-gradient-to-br from-card to-card/80 border-border/60 hover:scale-[1.02] hover:-translate-y-1">
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

            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="h-full group hover:shadow-university transition-all duration-500 bg-gradient-to-br from-card to-card/80 border-border/60 hover:scale-[1.02] hover:-translate-y-1">
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
              نسعى لتحقيق أهداف تعليمية متميزة تواكب التطورات التكنولوجية الحديثة
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
                  >
                    <div className="flex items-start space-x-4 space-x-reverse p-4 rounded-xl hover:bg-card/50 hover:scale-[1.01] transition-all duration-300">
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
              برامج معتمدة ومصممة لإعداد خريجين مؤهلين ومبدعين في مجال التكنولوجيا
            </p>
          </motion.div>

          <div className="space-y-8">
            {programs.map((program) => (
              <motion.div key={program.id} variants={itemVariants}>
                  <Card className="overflow-hidden hover:shadow-university transition-all duration-500 group bg-gradient-to-br from-card to-card/90 border-border/60 hover:scale-[1.01] hover:-translate-y-1">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                      {/* محتوى البرنامج */}
                      <div className="lg:col-span-2 p-8">
                        <div className="flex items-center mb-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center ml-4 shadow-soft group-hover:shadow-medium transition-all duration-300">
                            <BookOpen className="w-8 h-8 text-white" />
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
                              const IconComponent = feature.icon;
                              return (
                                   <div 
                                     key={index} 
                                     className="flex items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-300 group/feature"
                                   >
                                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center ml-3 group-hover/feature:bg-primary/20 transition-colors duration-300">
                                    <IconComponent className="w-4 h-4 text-primary" />
                                  </div>
                                   <span className="text-foreground font-medium">{feature.title}</span>
                                 </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* إحصائيات البرنامج */}
                        <div className="grid grid-cols-3 gap-4">
                          {program.stats.map((stat, index) => {
                            const IconComponent = stat.icon;
                            return (
                              <div key={index} className="text-center p-4 rounded-lg bg-gradient-to-br from-muted/20 to-muted/10">
                                <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                                  <IconComponent className="w-4 h-4 text-secondary" />
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
            ))}
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
                    <Users className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                    انضم إلى مجتمعنا التقني
                  </h3>
                  
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    تواصل معنا للحصول على معلومات تفصيلية عن برامج القسم، متطلبات القبول، والفرص المهنية المتاحة. 
                    فريقنا الأكاديمي جاهز لمساعدتك في اتخاذ القرار الأمثل لمستقبلك التقني.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm">
                      <div className="text-2xl font-bold text-primary">95%</div>
                      <div className="text-sm text-muted-foreground">معدل التوظيف</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm">
                      <div className="text-2xl font-bold text-secondary">15+</div>
                      <div className="text-sm text-muted-foreground">شراكة مؤسسية</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm">
                      <div className="text-2xl font-bold text-primary">500+</div>
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

export default TechScienceDepartment;