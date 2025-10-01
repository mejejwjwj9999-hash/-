
import React from 'react';
import { Pill, Heart, Baby, Laptop, Briefcase, ArrowLeft, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DynamicContent } from './DynamicContent';
import { useDynamicPrograms } from '@/hooks/useDynamicPrograms';
import { AllProgramsDataLoader } from './dynamic/AllProgramsDataLoader';

const AcademicPrograms = () => {
  const { data: programs, isLoading } = useDynamicPrograms();

  // Fallback data in case of loading or empty data
  const fallbackPrograms = [
    {
      id: 1,
      name: 'الصيدلة',
      nameEn: 'Pharmacy',
      description: 'برنامج بكالوريوس الصيدلة يعد صيادلة مؤهلين للعمل في المجال الصيدلاني والصحي',
      icon: Pill,
      duration: '5 سنوات',
      degree: 'بكالوريوس',
      color: 'bg-green-50 text-green-600',
      bgColor: 'bg-green-500',
      link: '/programs/pharmacy'
    },
    {
      id: 2,
      name: 'التمريض',
      nameEn: 'Nursing',
      description: 'برنامج بكالوريوس التمريض لإعداد ممرضين مهنيين لتقديم الرعاية الصحية',
      icon: Heart,
      duration: '4 سنوات',
      degree: 'بكالوريوس',
      color: 'bg-red-50 text-red-600',
      bgColor: 'bg-red-500',
      link: '/programs/nursing'
    },
    {
      id: 3,
      name: 'القبالة',
      nameEn: 'Midwifery',
      description: 'برنامج بكالوريوس القبالة لإعداد قابلات قانونيات لرعاية الأمهات والأطفال',
      icon: Baby,
      duration: '4 سنوات',
      degree: 'بكالوريوس',
      color: 'bg-pink-50 text-pink-600',
      bgColor: 'bg-pink-500',
      link: '/programs/midwifery'
    },
    {
      id: 4,
      name: 'تكنولوجيا المعلومات',
      nameEn: 'Information Technology',
      description: 'برنامج بكالوريوس تكنولوجيا المعلومات لإعداد متخصصين في مجال التقنية',
      icon: Laptop,
      duration: '4 سنوات',
      degree: 'بكالوريوس',
      color: 'bg-blue-50 text-blue-600',
      bgColor: 'bg-blue-500',
      link: '/programs/information-technology'
    },
    {
      id: 5,
      name: 'إدارة الأعمال',
      nameEn: 'Business Administration',
      description: 'برنامج بكالوريوس إدارة الأعمال لإعداد قادة وإداريين في مختلف المؤسسات',
      icon: Briefcase,
      duration: '4 سنوات',
      degree: 'بكالوريوس',
      color: 'bg-amber-50 text-amber-600',
      bgColor: 'bg-amber-500',
      link: '/programs/business-administration'
    }
  ];

  // Use real data if available, otherwise fallback
  const displayPrograms = programs && programs.length > 0 ? programs : null;

  return (
    <AllProgramsDataLoader>
      <section id="academics" className="section-padding bg-academic-gray-light overflow-hidden">
        <div className="container-custom max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">
              <DynamicContent 
                pageKey="programs" 
                elementKey="section_title" 
                fallback="برامجنا الأكاديمية"
                as="span"
              />
            </h2>
            <p className="text-body max-w-3xl mx-auto">
              <DynamicContent 
                pageKey="programs" 
                elementKey="section_description" 
                fallback="نقدم برامج أكاديمية متنوعة ومعتمدة تلبي احتياجات سوق العمل المحلي والإقليمي، مع التركيز على الجودة والتميز في التعليم العالي"
                as="span"
              />
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card-program animate-pulse">
                  <div className="h-12 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          )}

          {/* Programs Grid - Real Data */}
          {displayPrograms && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {displayPrograms.slice(0, 6).map((program, index) => (
                <div
                  key={program.id}
                  className="card-program animate-fadeInUp group relative overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Program Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div 
                      className="p-4 rounded-xl"
                      style={{ backgroundColor: program.background_color }}
                    >
                      <GraduationCap 
                        className="w-8 h-8" 
                        style={{ color: program.icon_color }}
                      />
                    </div>
                    <div className="text-right">
                      <span className="text-small text-academic-gray">بكالوريوس</span>
                      <div className="text-small text-academic-gray">{program.duration_years} سنوات</div>
                    </div>
                  </div>

                  {/* Program Info */}
                  <h3 className="text-card-title mb-2 text-right">{program.title_ar}</h3>
                  <p className="text-small text-academic-gray mb-1 text-right">{program.title_en}</p>
                  <p className="text-body mb-6 text-right leading-relaxed">
                    {program.summary_ar || program.description_ar?.substring(0, 100) + '...'}
                  </p>

                  {/* CTA Button */}
                  <div className="flex justify-end">
                    <Link 
                      to={`/programs/${program.program_key}`}
                      className="btn-ghost group/btn inline-flex items-center hover:text-university-blue transition-colors"
                    >
                      <span>اعرف المزيد</span>
                      <ArrowLeft className="w-4 h-4 mr-2 rtl-flip group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {/* Hover Effect Gradient */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl pointer-events-none"
                    style={{ backgroundColor: program.icon_color }}
                  ></div>
                </div>
              ))}
            </div>
          )}

          {/* Fallback Programs Grid */}
          {!displayPrograms && !isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {fallbackPrograms.map((program, index) => {
                const IconComponent = program.icon;
                return (
                  <div
                    key={program.id}
                    className="card-program animate-fadeInUp group relative overflow-hidden"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Program Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-4 rounded-xl ${program.color}`}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <div className="text-right">
                        <span className="text-small text-academic-gray">{program.degree}</span>
                        <div className="text-small text-academic-gray">{program.duration}</div>
                      </div>
                    </div>

                    {/* Program Info */}
                    <h3 className="text-card-title mb-2 text-right">{program.name}</h3>
                    <p className="text-small text-academic-gray mb-1 text-right">{program.nameEn}</p>
                    <p className="text-body mb-6 text-right leading-relaxed">{program.description}</p>

                    {/* CTA Button */}
                    <div className="flex justify-end">
                      <Link 
                        to={program.link}
                        className="btn-ghost group/btn inline-flex items-center hover:text-university-blue transition-colors"
                      >
                        <span>اعرف المزيد</span>
                        <ArrowLeft className="w-4 h-4 mr-2 rtl-flip group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>

                    {/* Hover Effect Gradient */}
                    <div className={`absolute inset-0 ${program.bgColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl pointer-events-none`}></div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA Section */}
          <div className="text-center mt-16">
            <div className="card-elevated inline-block p-8 max-w-2xl">
              <h3 className="text-card-title mb-4">
                <DynamicContent 
                  pageKey="programs" 
                  elementKey="cta_title" 
                  fallback="هل تريد معرفة المزيد عن برامجنا؟"
                  as="span"
                />
              </h3>
              <p className="text-body mb-6">
                <DynamicContent 
                  pageKey="programs" 
                  elementKey="cta_description" 
                  fallback="احصل على معلومات مفصلة عن متطلبات القبول والمناهج الدراسية"
                  as="span"
                />
              </p>
              <Link to="/programs" className="btn-primary">
                <DynamicContent 
                  pageKey="programs" 
                  elementKey="cta_button" 
                  fallback="عرض جميع البرامج الأكاديمية"
                  as="span"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AllProgramsDataLoader>
  );
};

export default AcademicPrograms;
