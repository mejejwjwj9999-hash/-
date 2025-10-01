import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  BookOpen, 
  Users, 
  GraduationCap, 
  ArrowLeft, 
  Target, 
  Award,
  TrendingUp,
  Star,
  Globe,
  Zap,
  Home,
  ChevronLeft,
  DollarSign,
  BarChart,
  Handshake,
  Brain,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import UnifiedHeroSection from '@/components/ui/unified-hero-section';
import UnifiedBackButton from '@/components/ui/unified-back-button';

const AdminHumanitiesDepartment = () => {
  const navigate = useNavigate();
  
  const programs = [
    {
      id: 'business',
      title: 'إدارة الأعمال',
      titleEn: 'Business Administration',
      duration: '4 سنوات',
      creditHours: '132 ساعة معتمدة',
      degree: 'بكالوريوس',
      href: '/programs/business-administration',
      description: 'برنامج شامل يغطي جميع جوانب إدارة الأعمال الحديثة من القيادة إلى التخطيط الاستراتيجي مع التركيز على التطبيقات العملية والمشاريع الحقيقية',
      features: [
        { title: 'إدارة الموارد البشرية والقيادة', icon: Users },
        { title: 'التسويق الرقمي والمبيعات', icon: TrendingUp },
        { title: 'المحاسبة والتمويل المؤسسي', icon: DollarSign },
        { title: 'إدارة العمليات والمشاريع', icon: BarChart }
      ],
      stats: [
        { label: 'معدل التوظيف', value: '92%', icon: TrendingUp },
        { label: 'متوسط الراتب', value: '2200$', icon: Star },
        { label: 'الشراكات', value: '12+', icon: Handshake }
      ]
    }
  ];

  const departmentInfo = {
    vision: 'الريادة والتميز في مجال العلوم الإدارية والإنسانية، بما يحقق الجودة والتميز والتفوق في التعليم والبحث العلمي وريادة الأعمال.',
    mission: 'تقديم تعليم متميز وجودة عالية، يسهم في تطوير الطلاب وتأهيلهم لمواجهة تحديات سوق العمل، وذلك من خلال الاستثمار في الكفاءات الأكاديمية والتكنولوجية وتوفير بيئة تعليمية محفزة وبرامج متطورة، مع الالتزام بالشفافية والأخلاق المهنية وتوسيع الشراكات المحلية والإقليمية.',
    objectives: [
      'تنمية المعرفة والمهارات اللازمة في مجال العلوم الإدارية والإنسانية عبر مناهج حديثة وأساليب تدريس مبتكرة.',
      'تطوير برامج بحثية لإنتاج المعرفة الجديدة والمساهمة في تطوير النظريات والممارسات الحالية.',
      'تطوير مهارات الخريجين وتشجيعهم على تحويل الأفكار الابتكارية إلى مشاريع ناجحة.',
      'تعزيز توجهات الخريجين وتوسيع آفاقهم من وجهات نظر مختلفة.',
      'تمكين الخريجين من خدمة المجتمع وتحقيق التأثير الإيجابي، وحل المشكلات الاجتماعية والاقتصادية بفعالية.'
    ]
  };

  const programMessage = 'تطوير وتمكين الخريجين في مجال إدارة الأعمال من خلال توفير تعليم متميز، وتعزيز البحث العلمي، والتوسع في الشراكات، والالتزام بأعلى معايير البحث والتطوير. وتمكينهم من اكتساب المعارف والمهارات اللازمة للعمل في بيئة الأعمال المختلفة، وتلبية احتياجات سوق العمل بخريجين قادرين على التعامل مع التحديات والفرص.';

  const programGoals = [
    'تنمية المعرفة والمهارات اللازمة للخريج عبر مناهج تقنية حديثة وأساليب تدريس مبتكرة وتفاعلية.',
    'تطوير برامج بحثية في إدارة الأعمال بما يسهم في إنتاج المعرفة الجديدة.',
    'تشجيع الخريجين على إجراء أبحاث مستقلة والمشاركة في مشاريع بحثية لحل تحديات الأعمال.',
    'تطوير مهارات رواد الأعمال وتحويل الأفكار الابتكارية إلى مشاريع ناجحة.',
    'تعزيز توجهات الخريجين وتوسيع آفاقهم ومعارفهم.',
    'تمكين الخريجين من خدمة المجتمع وتحقيق التأثير الإيجابي عبر المسؤولية الاجتماعية والقيم الأخلاقية والتطوع.'
  ];

  const graduateSpecs = [
    'ينبغي على خريج برنامج إدارة الأعمال أن يتميز بالعديد من الصفات التخصصية.',
    'واسع المعرفة: لديه معرفة كافية بأساسيات ومفاهيم ونظريات إدارة الأعمال والمجالات ذات العلاقة.',
    'ذو قدرة عالية على صناعة القرارات: قادر على تحليل المتغيرات البيئية وتقييم البدائل واتخاذ القرارات المناسبة.',
    'قائد إداري ناجح: يمتلك تأثيراً وابتكاراً في التخطيط والتنظيم والتحفيز والرقابة، ويتكيف مع مختلف الظروف.',
    'رائد أعمال: قادر على ابتكار وإنشاء أو إدارة مشروع تجاري ناجح ذي قيمة مضافة عبر المخاطرة والابتكار.',
    'ملتزم بأخلاقيات العمل: يتحلى بالمسؤولية والالتزام بالمعايير القانونية والأخلاقية وتعاليم الدين والهوية الوطنية.',
    'متعاون ومفاوض جيد: يمتلك مهارات العمل الجماعي والتواصل الشفوي والكتابي والتفاوض.'
  ];

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
        icon={Briefcase}
        title="قسم العلوم الإدارية والإنسانية"
        subtitle="نحو مستقبل إداري متطور مع برامج أكاديمية متخصصة في الإدارة والقيادة والعلوم الإنسانية"
        badges={[
          { icon: Users, text: "1 برنامج أكاديمي" },
          { icon: GraduationCap, text: "درجة البكالوريوس" },
          { icon: Brain, text: "علوم إدارية متقدمة" }
        ]}
        primaryCta={{ text: "استكشف البرامج", href: "#programs" }}
        secondaryCta={{ text: "تواصل معنا", href: "/contact" }}
        breadcrumb={
          <UnifiedBackButton 
            breadcrumbs={[
              { label: "الرئيسية", href: "/", icon: Home },
              { label: "الأقسام الأكاديمية", href: "/departments" },
              { label: "العلوم الإدارية والإنسانية", icon: Briefcase }
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
              قسم العلوم الإدارية والإنسانية
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
              نعمل على تحقيق مجموعة من الأهداف الاستراتيجية التي تضمن تطوير القسم وتميزه
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

        {/* Program Message & Goals */}
        <motion.section 
          className="mb-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <h3 className="text-2xl font-bold mb-4">رسالة برنامج إدارة الأعمال</h3>
            <p className="text-muted-foreground max-w-3xl mx-auto">{programMessage}</p>
          </motion.div>

          <Card className="bg-gradient-to-br from-muted/20 to-muted/5 border-muted/50">
            <CardContent className="p-8">
              <h4 className="text-xl font-semibold mb-6 text-foreground">أهداف البرنامج</h4>
              <div className="space-y-3">
                {programGoals.map((goal, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-university-green mt-0.5 flex-shrink-0" />
                    <span className="text-lg leading-relaxed">{goal}</span>
                  </div>
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
              برامج معتمدة ومصممة لإعداد خريجين مؤهلين ومبدعين في مجال الإدارة والأعمال
            </p>
          </motion.div>

          <div className="space-y-8">
            {programs.map((program) => (
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
                                  <motion.div 
                                    key={index} 
                                    className="flex items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-300 group/feature"
                                    whileHover={{ scale: 1.02 }}
                                  >
                                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center ml-3 group-hover/feature:bg-primary/20 transition-colors duration-300">
                                    <IconComponent className="w-4 h-4 text-primary" />
                                  </div>
                                  <span className="text-foreground font-medium">{feature.title}</span>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>

                        {/* مواصفات خريج البرنامج */}
                        <div className="space-y-4 mb-8">
                          <h4 className="font-semibold text-foreground text-lg">مواصفات خريج البرنامج:</h4>
                          <div className="space-y-2">
                            {graduateSpecs.map((spec, i) => (
                              <div key={i} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-university-green mt-0.5 flex-shrink-0" />
                                <span className="text-lg leading-relaxed font-medium">{spec}</span>
                              </div>
                            ))}
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
                    انضم إلى مجتمعنا الإداري
                  </h3>
                  
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    تواصل معنا للحصول على معلومات تفصيلية عن برامج القسم، متطلبات القبول، والفرص المهنية المتاحة. 
                    فريقنا الأكاديمي جاهز لمساعدتك في اتخاذ القرار الأمثل لمستقبلك المهني.
                  </p>
                  
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

export default AdminHumanitiesDepartment;