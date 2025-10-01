import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Target, Eye, Heart, Users, Award, BookOpen, Compass, CheckCircle, Star, Home } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { usePublicAboutSection } from '@/hooks/useAboutSections';
import UnifiedHeroSection from '@/components/ui/unified-hero-section';
import UnifiedBackButton from '@/components/ui/unified-back-button';

const VisionMission = () => {
  const { data: section, isLoading, error } = usePublicAboutSection('about-vision-mission');

  const getElementContent = (key: string, fallback = '') => {
    const element = section?.elements?.find(el => el.element_key === key);
    return element?.content_ar || fallback;
  };

  const getCoreValues = () => {
    const element = section?.elements?.find(el => el.element_key === 'core_values');
    return element?.metadata?.values || [
      {
        title_ar: 'التميز الأكاديمي',
        description_ar: 'نسعى للوصول إلى أعلى معايير الجودة في التعليم والبحث العلمي',
        icon: 'Award',
        color: 'text-university-blue'
      },
      {
        title_ar: 'النزاهة والشفافية',
        description_ar: 'نلتزم بأعلى معايير النزاهة والشفافية في جميع أعمالنا وعلاقاتنا',
        icon: 'Heart',
        color: 'text-university-red'
      },
      {
        title_ar: 'خدمة المجتمع',
        description_ar: 'نركز على تلبية احتياجات المجتمع وتقديم الحلول للتحديات المحلية',
        icon: 'Users',
        color: 'text-university-gold'
      },
      {
        title_ar: 'التعلم المستمر',
        description_ar: 'نشجع ثقافة التعلم مدى الحياة والتطوير المستمر للقدرات',
        icon: 'BookOpen',
        color: 'text-university-blue'
      },
      {
        title_ar: 'الابتكار والإبداع',
        description_ar: 'نحفز الابتكار والإبداع في المناهج وطرق التدريس والبحث العلمي',
        icon: 'Target',
        color: 'text-university-red'
      },
      {
        title_ar: 'المسؤولية المجتمعية',
        description_ar: 'نؤمن بدورنا في التنمية المستدامة والمسؤولية تجاه البيئة والمجتمع',
        icon: 'Award',
        color: 'text-university-gold'
      }
    ];
  };

  const getStrategicGoals = () => {
    const element = section?.elements?.find(el => el.element_key === 'strategic_goals');
    return element?.metadata?.goals || [
      {
        title_ar: 'التعليم والتعلم',
        content_ar: '• تطوير برامج أكاديمية متميزة تواكب التطورات العلمية\n• تحسين جودة التعليم وطرق التدريس الحديثة\n• رفع معدلات نجاح الطلاب وتخرجهم في الوقت المحدد\n• تعزيز التعلم الإلكتروني والتكنولوجيا التعليمية',
        color: 'text-university-blue'
      },
      {
        title_ar: 'البحث العلمي',
        content_ar: '• تشجيع أعضاء هيئة التدريس على البحث العلمي\n• إقامة شراكات مع مؤسسات بحثية محلية وإقليمية\n• نشر البحوث في مجلات علمية محكمة\n• تطوير مراكز بحثية متخصصة',
        color: 'text-university-blue'
      },
      {
        title_ar: 'خدمة المجتمع',
        content_ar: '• تقديم برامج التدريب والتطوير المهني\n• إجراء الاستشارات التخصصية للمؤسسات\n• تنظيم فعاليات توعوية وثقافية\n• المساهمة في حل مشكلات المجتمع المحلي',
        color: 'text-university-blue'
      },
      {
        title_ar: 'البنية التحتية',
        content_ar: '• تطوير المرافق والمختبرات العلمية\n• توسيع المكتبة الأكاديمية والرقمية\n• تحديث الأنظمة الإدارية والأكاديمية\n• توفير بيئة تعليمية محفزة ومريحة',
        color: 'text-university-blue'
      }
    ];
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      Award, Heart, Users, BookOpen, Target
    };
    return icons[iconName] || Award;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جاري تحميل الرؤية والرسالة...</p>
        </div>
      </div>
    );
  }

  if (error || !section) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">حدث خطأ في تحميل المحتوى</p>
          <p className="text-muted-foreground">يرجى المحاولة مرة أخرى لاحقاً</p>
        </div>
      </div>
    );
  }

  const coreValues = getCoreValues();
  const strategicGoals = getStrategicGoals();

  return (
    <>
      <Helmet>
        <title>الرؤية والرسالة والأهداف - كلية إيلول الجامعية</title>
        <meta name="description" content="رؤية ورسالة وأهداف كلية إيلول الجامعية في التعليم العالي والبحث العلمي" />
        <meta name="keywords" content="الرؤية، الرسالة، الأهداف، كلية إيلول، التطلعات المستقبلية" />
        <link rel="canonical" href={`${window.location.origin}/vision-mission`} />
        <meta property="og:title" content="الرؤية والرسالة والأهداف - كلية إيلول الجامعية" />
        <meta property="og:description" content="رؤية ورسالة وأهداف كلية إيلول الجامعية في التعليم العالي والبحث العلمي" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/vision-mission`} />
      </Helmet>
      
      <div className="min-h-screen bg-background"  dir="rtl">
        <UnifiedHeroSection
          icon={Compass}
          title={getElementContent('page_title', 'الرؤية والرسالة')}
          subtitle={getElementContent('page_subtitle', 'نحن في كلية إيلول الجامعية نؤمن برؤية واضحة ورسالة نبيلة تقودنا نحو التميز الأكاديمي وخدمة المجتمع')}
          breadcrumb={
            <UnifiedBackButton 
              breadcrumbs={[
                { label: 'الرئيسية', href: '/', icon: Home },
                { label: 'الرؤية والرسالة', icon: Compass }
              ]}
            />
          }
        />

        {/* Vision & Mission Cards */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Vision Card */}
              <div className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-6 text-primary">
                  {getElementContent('vision_title', 'رؤيتنا')}
                </h2>
                <div 
                  className="text-lg leading-relaxed text-right"
                  dangerouslySetInnerHTML={{
                    __html: getElementContent('vision_content', 
                      '<p>أن نكون كلية رائدة ومتميزة في التعليم العالي والبحث العلمي على المستوى المحلي والإقليمي، نساهم في إعداد كوادر مؤهلة قادرة على المنافسة في سوق العمل المحلي والعالمي.</p><p>نسعى لأن نكون المرجع الأول في التعليم التطبيقي والتخصصات النوعية التي تخدم احتياجات المجتمع اليمني والتنمية المستدامة في المنطقة.</p>'
                    )
                  }}
                />
              </div>

              {/* Mission Card */}
              <div className="p-8 bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20 rounded-xl text-center">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-6 text-secondary">
                  {getElementContent('mission_title', 'رسالتنا')}
                </h2>
                <div 
                  className="text-lg leading-relaxed text-right"
                  dangerouslySetInnerHTML={{
                    __html: getElementContent('mission_content', 
                      '<p>تقديم تعليم عالي الجودة في التخصصات الطبية والتقنية والإدارية وفق أحدث المعايير الأكاديمية العالمية، وإجراء البحوث العلمية التطبيقية التي تساهم في حل مشكلات المجتمع.</p><p>خدمة المجتمع من خلال برامج التدريب والتطوير المهني والاستشارات التخصصية، وإعداد خريجين مبدعين وملتزمين بالقيم الأخلاقية والمهنية.</p>'
                    )
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                {getElementContent('values_title', 'قيمنا الأساسية')}
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {getElementContent('values_subtitle', 'تستند كلية أيلول الجامعية في عملها على مجموعة من القيم الراسخة التي تحدد هويتها وتوجه مسيرتها')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreValues.map((value, index) => {
                const IconComponent = getIconComponent(value.icon);
                return (
                  <div key={index} className="p-8 bg-card rounded-xl border shadow-sm text-center hover:shadow-lg transition-all duration-300">
                    <IconComponent className={`w-16 h-16 mx-auto mb-6 ${value.color}`} />
                    <h3 className="text-xl font-bold mb-4">{value.title_ar}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description_ar}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Strategic Goals */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                {getElementContent('goals_title', 'أهدافنا الاستراتيجية')}
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {getElementContent('goals_subtitle', 'نعمل على تحقيق مجموعة من الأهداف الاستراتيجية التي تضمن تطوير الكلية وتميزها')}
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {strategicGoals.map((goal, index) => (
                  <div key={index} className="p-6 bg-card rounded-xl border shadow-sm hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-primary/20 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-primary">{goal.title_ar}</h3>
                    </div>
                    <div className="text-muted-foreground leading-relaxed text-right space-y-2">
                      {goal.content_ar?.split('\n').map((line, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{line.replace('• ', '')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default VisionMission;