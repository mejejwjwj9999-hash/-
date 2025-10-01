import React from 'react';
import { BookOpen, Users, Award, Clock, FileText, ChevronLeft, Home, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDynamicPrograms } from '@/hooks/useDynamicPrograms';
import { AllProgramsDataLoader } from '@/components/dynamic/AllProgramsDataLoader';

const Academics = () => {
  const navigate = useNavigate();
  const { data: programs, isLoading, error } = useDynamicPrograms();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !programs) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive mb-2">حدث خطأ في تحميل البرامج الأكاديمية</div>
          <button onClick={() => window.location.reload()} className="btn-primary">
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <AllProgramsDataLoader>
      <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="hero-section text-white py-16">
        <div className="hero-content">
          <div className="container-custom">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-8 opacity-90">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 hover:text-university-gold transition-colors"
              >
                <Home size={16} />
                الرئيسية
              </button>
              <ChevronLeft size={16} className="rtl-flip" />
              <span className="flex items-center gap-2">
                <GraduationCap size={16} />
                الأقسام الأكاديمية
              </span>
            </nav>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                  <GraduationCap size={48} className="text-university-gold" />
                </div>
              </div>
              <h1 className="text-page-title text-white mb-4">الأقسام الأكاديمية</h1>
              <p className="text-subtitle text-white/90 max-w-2xl mx-auto">
                تقدم كلية أيلول الجامعية برامج أكاديمية متنوعة ومتطورة تواكب احتياجات سوق العمل
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title mb-4">برامجنا الأكاديمية</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <div key={program.id} className="card-program">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                       style={{ backgroundColor: program.background_color }}>
                    <GraduationCap className="w-8 h-8" style={{ color: program.icon_color }} />
                  </div>
                  <h3 className="text-card-title mb-3">{program.title_ar}</h3>
                  <p className="text-body mb-4">{program.summary_ar || program.description_ar?.substring(0, 100) + '...'}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-academic-gray">المدة:</span>
                      <span className="font-semibold text-university-blue">{program.duration_years} سنوات</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-academic-gray">الساعات:</span>
                      <span className="font-semibold text-university-blue">{program.credit_hours} ساعة</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-academic-gray">القسم:</span>
                      <span className="font-semibold text-university-blue">{program.department_ar}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/programs/${program.program_key}`)}
                    className="btn-primary w-full"
                  >
                    تفاصيل البرنامج
                    <ChevronLeft className="w-4 h-4 mr-2 rtl-flip" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Program Details - Dynamic */}
      {programs.length > 0 && programs.find(p => p.is_featured) && (
        <section className="section-padding bg-academic-gray-light">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              {(() => {
                const featuredProgram = programs.find(p => p.is_featured) || programs[0];
                return (
                  <div className="card-elevated">
                    <h2 className="text-section-title mb-6 text-center">{featuredProgram.title_ar}</h2>
                    
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                      <div>
                        <h3 className="text-card-title mb-4">نظرة عامة</h3>
                        <div className="text-body mb-4" dangerouslySetInnerHTML={{ 
                          __html: featuredProgram.program_overview_ar || featuredProgram.description_ar || ''
                        }} />
                        
                        <h4 className="font-semibold text-university-blue mb-2">شروط القبول:</h4>
                        <ul className="text-body space-y-1">
                          {featuredProgram.academic_requirements?.map((req: any, index: number) => (
                            <li key={index}>• {req.requirement_ar}</li>
                          ))}
                          {featuredProgram.general_requirements?.map((req: any, index: number) => (
                            <li key={index}>• {req.requirement_ar}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-card-title mb-4">الخطة الدراسية</h3>
                        <div className="space-y-3">
                          {featuredProgram.yearly_curriculum?.map((year: any, index: number) => (
                            <div key={index} className="bg-white p-4 rounded-lg border">
                              <h5 className="font-semibold text-university-blue">{year.year_name_ar}</h5>
                              <p className="text-sm text-academic-gray">
                                {year.total_credit_hours} ساعة معتمدة - {year.subjects?.length || 0} مواد
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Faculty Members */}
                    {featuredProgram.faculty_members && featuredProgram.faculty_members.length > 0 && (
                      <div>
                        <h3 className="text-card-title mb-6">أعضاء هيئة التدريس</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                          {featuredProgram.faculty_members.slice(0, 3).map((faculty: any, index: number) => (
                            <div key={index} className="bg-white p-4 rounded-lg border text-center">
                              <div className="w-16 h-16 bg-university-blue-light rounded-full mx-auto mb-3 flex items-center justify-center">
                                <Users className="w-8 h-8 text-white" />
                              </div>
                              <h4 className="font-semibold text-university-blue">{faculty.name_ar}</h4>
                              <p className="text-sm text-academic-gray">{faculty.position_ar}</p>
                              <p className="text-xs text-academic-gray mt-1">{faculty.qualification_ar}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </section>
      )}

      {/* Academic Features */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title mb-4">مميزات التعليم الأكاديمي</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, title: 'مناهج حديثة', desc: 'مناهج محدثة وفقاً لأحدث المعايير العالمية' },
              { icon: Users, title: 'أساتذة متخصصون', desc: 'نخبة من أعضاء هيئة التدريس المؤهلين' },
              { icon: Award, title: 'جودة التعليم', desc: 'معايير عالية للجودة والاعتماد الأكاديمي' },
              { icon: Clock, title: 'مرونة الدراسة', desc: 'برامج مرنة تناسب احتياجات الطلاب' }
            ].map((feature, index) => (
              <div key={index} className="card-elevated text-center">
                <feature.icon className="w-12 h-12 text-university-blue mx-auto mb-4" />
                <h3 className="text-card-title mb-2">{feature.title}</h3>
                <p className="text-body">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </div>
    </AllProgramsDataLoader>
  );
};

export default Academics;