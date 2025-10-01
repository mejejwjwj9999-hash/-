import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useDynamicProgram } from '@/hooks/useDynamicPrograms';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  GraduationCap, 
  Clock, 
  BookOpen, 
  Users, 
  Award,
  Building2,
  ArrowRight,
  CheckCircle,
  MapPin,
  Calendar,
  Star,
  Home,
  Pill
} from 'lucide-react';
import { motion } from 'framer-motion';
import UnifiedPageHeader from '@/components/ui/unified-page-header';

interface DynamicProgramPageProps {
  template?: 'standard' | 'detailed' | 'compact';
  language?: 'ar' | 'en';
}

export const DynamicProgramPage: React.FC<DynamicProgramPageProps> = ({
  template = 'standard',
  language = 'ar'
}) => {
  const { programKey } = useParams<{ programKey: string }>();
  const { data: program, isLoading, error } = useDynamicProgram(programKey || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <section className="hero-section py-20">
          <div className="hero-content container-custom text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-white/20 rounded w-64 mx-auto mb-6"></div>
              <div className="h-6 bg-white/20 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </section>
        
        <div className="container-custom py-16">
          <div className="animate-pulse space-y-12">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-4/6"></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <motion.div 
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <GraduationCap className="w-12 h-12 text-muted-foreground" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4">البرنامج غير متوفر حالياً</h1>
            <p className="text-muted-foreground mb-8 text-lg">
              عذراً، لا يمكن العثور على معلومات هذا البرنامج الأكاديمي في الوقت الحالي.
              يرجى المحاولة مرة أخرى أو تصفح البرامج الأخرى المتاحة.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/programs">تصفح جميع البرامج</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">العودة إلى الصفحة الرئيسية</Link>
              </Button>
            </div>
            
            {programKey && (
              <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  البرنامج المطلوب: <span className="font-mono">{programKey}</span>
                </p>
                {error && (
                  <p className="text-sm text-destructive mt-2">
                    خطأ: {error.message}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  const title = language === 'ar' ? program.title_ar : program.title_en || program.title_ar;
  const description = language === 'ar' ? program.description_ar : program.description_en;
  const summary = language === 'ar' ? program.summary_ar : program.summary_en;
  const department = language === 'ar' ? program.department_ar : program.department_en;
  const college = language === 'ar' ? program.college_ar : program.college_en;
  const admissionReqs = language === 'ar' ? program.admission_requirements_ar : program.admission_requirements_en;
  const careerOpps = language === 'ar' ? program.career_opportunities_ar : program.career_opportunities_en;

  // Get program icon based on program key
  const getProgramIcon = () => {
    if (programKey?.includes('pharmacy')) return Pill;
    if (programKey?.includes('business')) return Building2;
    if (programKey?.includes('it') || programKey?.includes('technology')) return BookOpen;
    return GraduationCap;
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Unified Header */}
      <UnifiedPageHeader
        icon={getProgramIcon()}
        title={title}
        subtitle={summary || description || ''}
        breadcrumbs={[
          { label: 'الرئيسية', href: '/', icon: Home },
          { label: 'البرامج الأكاديمية', href: '/departments', icon: GraduationCap },
          { label: title }
        ]}
      />

      {/* Program Overview */}
      <motion.section 
        className="section-padding"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="container-custom">
          <motion.div className="grid lg:grid-cols-2 gap-12 items-center" variants={fadeInUp}>
            <div>
              <h2 className="text-section-title mb-6">نبذة عن البرنامج</h2>
              <div className="text-body space-y-4 text-right">
                {description ? (
                  <div dangerouslySetInnerHTML={{ __html: description }} />
                ) : (
                  <p>لا توجد معلومات متاحة حالياً</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="card-elevated text-center">
                <Clock className="w-12 h-12 text-university-blue mx-auto mb-4" />
                <h3 className="text-card-title mb-2">مدة الدراسة</h3>
                <p className="text-2xl font-bold text-university-blue">{program.duration_years}</p>
                <p className="text-body">سنوات</p>
              </div>
              <div className="card-elevated text-center">
                <BookOpen className="w-12 h-12 text-university-red mx-auto mb-4" />
                <h3 className="text-card-title mb-2">الساعات المعتمدة</h3>
                <p className="text-2xl font-bold text-university-red">{program.credit_hours}</p>
                <p className="text-body">ساعة معتمدة</p>
              </div>
              <div className="card-elevated text-center">
                <Users className="w-12 h-12 text-university-gold mx-auto mb-4" />
                <h3 className="text-card-title mb-2">عدد الطلاب</h3>
                <p className="text-2xl font-bold text-university-gold">{program.student_count || 'غير محدد'}</p>
                <p className="text-body">طالب وطالبة</p>
              </div>
              <div className="card-elevated text-center">
                <Award className="w-12 h-12 text-university-blue mx-auto mb-4" />
                <h3 className="text-card-title mb-2">الشهادة</h3>
                <p className="text-sm font-bold text-university-blue">{program.degree_type}</p>
                <p className="text-body">{title}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Admission Requirements */}
      {(program.academic_requirements?.length > 0 || program.general_requirements?.length > 0) && (
        <motion.section 
          className="section-padding bg-academic-gray-light"
          variants={fadeInUp}
        >
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-section-title mb-4">شروط القبول</h2>
              <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {program.academic_requirements?.length > 0 && (
                  <div className="card-elevated">
                    <h3 className="text-card-title mb-6 text-university-blue">الشروط الأكاديمية</h3>
                    <ul className="text-body space-y-3 text-right">
                      {program.academic_requirements.map((req, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-university-blue ml-3 flex-shrink-0" />
                          {language === 'ar' ? req.requirement_ar : req.requirement_en || req.requirement_ar}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {program.general_requirements?.length > 0 && (
                  <div className="card-elevated">
                    <h3 className="text-card-title mb-6 text-university-red">الشروط العامة</h3>
                    <ul className="text-body space-y-3 text-right">
                      {program.general_requirements.map((req, index) => (
                        <li key={index} className="flex items-center">
                          <Users className="w-5 h-5 text-university-red ml-3 flex-shrink-0" />
                          {language === 'ar' ? req.requirement_ar : req.requirement_en || req.requirement_ar}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Curriculum */}
      {program.yearly_curriculum?.length > 0 && (
        <motion.section 
          className="section-padding"
          variants={fadeInUp}
        >
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-section-title mb-4">الخطة الدراسية</h2>
              <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
              <p className="text-subtitle max-w-3xl mx-auto">
                خطة دراسية شاملة ومتوازنة تجمع بين العلوم النظرية والتطبيقية
              </p>
            </div>

            <div className="max-w-5xl mx-auto space-y-6">
              {program.yearly_curriculum.map((year, index) => (
                <div key={index} className="card-elevated">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-card-title text-university-blue">
                      {language === 'ar' ? year.year_name_ar : year.year_name_en || year.year_name_ar}
                    </h3>
                    <div className="w-8 h-8 bg-university-blue rounded-full flex items-center justify-center text-white font-bold">
                      {year.year_number}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {year.subjects?.map((subject, subIndex) => (
                      <div key={subIndex} className="bg-academic-gray-light rounded-lg p-3 text-center">
                        <span className="text-body font-medium">
                          {language === 'ar' ? subject.name_ar : subject.name_en || subject.name_ar}
                        </span>
                        <div className="text-xs text-muted-foreground mt-1">
                          {subject.credit_hours} ساعة معتمدة
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Faculty */}
      {program.faculty_members?.length > 0 && (
        <motion.section 
          className="section-padding bg-academic-gray-light"
          variants={fadeInUp}
        >
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-section-title mb-4">أعضاء هيئة التدريس</h2>
              <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
              <p className="text-subtitle max-w-3xl mx-auto">
                نخبة من الأساتذة المتخصصين والخبراء في مجال التخصص
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {program.faculty_members.map((member, index) => (
                <div key={index} className="card-elevated">
                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-university-blue-light rounded-full flex items-center justify-center ml-4 flex-shrink-0">
                      {member.profile_image ? (
                        <img 
                          src={member.profile_image} 
                          alt={member.name_ar}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <Users className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-card-title mb-2">
                        {language === 'ar' ? member.name_ar : member.name_en || member.name_ar}
                      </h3>
                      <p className="text-body font-medium text-university-blue mb-2">
                        {language === 'ar' ? member.position_ar : member.position_en || member.position_ar}
                      </p>
                      <p className="text-small">
                        {language === 'ar' ? member.qualification_ar : member.qualification_en || member.qualification_ar}
                      </p>
                      {member.university_ar && (
                        <p className="text-small text-muted-foreground">
                          {language === 'ar' ? member.university_ar : member.university_en || member.university_ar}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Career Opportunities */}
      {program.career_opportunities_list?.length > 0 && (
        <motion.section 
          className="section-padding"
          variants={fadeInUp}
        >
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-section-title mb-4">الفرص المهنية</h2>
              <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
              <p className="text-subtitle max-w-3xl mx-auto">
                مجالات عمل متنوعة ومتطورة تنتظر خريجي البرنامج
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {program.career_opportunities_list.map((career, index) => (
                  <div key={index} className="card-elevated hover:shadow-university transition-all duration-300">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-university-gold rounded-full flex items-center justify-center ml-4 flex-shrink-0">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-body font-medium">
                        {language === 'ar' ? career.title_ar : career.title_en || career.title_ar}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Application CTA */}
      <motion.section 
        className="section-padding bg-university-blue text-white"
        variants={fadeInUp}
      >
        <div className="container-custom text-center">
          <h2 className="text-section-title text-white mb-6">ابدأ رحلتك المهنية معنا</h2>
          <p className="text-subtitle text-gray-200 mb-8 max-w-3xl mx-auto">
            انضم إلى {title} في أيلول الجامعية واحصل على تعليم متميز يؤهلك لمستقبل مهني ناجح
          </p>
          <Button className="btn-secondary text-lg px-8 py-4">
            قدم طلبك الآن
            <ArrowRight className="w-5 h-5 mr-2 rtl-flip" />
          </Button>
        </div>
      </motion.section>
    </div>
  );
};