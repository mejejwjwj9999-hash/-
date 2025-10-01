import React from 'react';
import { Pill, Heart, Baby, Laptop, Briefcase, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EditableContent } from './EditableContent';

const EditableAcademicPrograms = () => {
  const programs = [
    {
      id: 1,
      pageKey: 'programs',
      elementKey: 'pharmacy',
      icon: Pill,
      color: 'bg-green-50 text-green-600',
      bgColor: 'bg-green-500',
      link: '/programs/pharmacy',
      fallbackData: {
        name: 'الصيدلة',
        nameEn: 'Pharmacy',
        description: 'برنامج بكالوريوس الصيدلة يعد صيادلة مؤهلين للعمل في المجال الصيدلاني والصحي',
        duration: '5 سنوات',
        degree: 'بكالوريوس'
      }
    },
    {
      id: 2,
      pageKey: 'programs',
      elementKey: 'nursing',
      icon: Heart,
      color: 'bg-red-50 text-red-600',
      bgColor: 'bg-red-500',
      link: '/nursing',
      fallbackData: {
        name: 'التمريض',
        nameEn: 'Nursing',
        description: 'برنامج بكالوريوس التمريض لإعداد ممرضين مهنيين لتقديم الرعاية الصحية',
        duration: '4 سنوات',
        degree: 'بكالوريوس'
      }
    },
    {
      id: 3,
      pageKey: 'programs',
      elementKey: 'midwifery',
      icon: Baby,
      color: 'bg-pink-50 text-pink-600',
      bgColor: 'bg-pink-500',
      link: '/midwifery',
      fallbackData: {
        name: 'القبالة',
        nameEn: 'Midwifery',
        description: 'برنامج بكالوريوس القبالة لإعداد قابلات قانونيات لرعاية الأمهات والأطفال',
        duration: '4 سنوات',
        degree: 'بكالوريوس'
      }
    },
    {
      id: 4,
      pageKey: 'programs',
      elementKey: 'it',
      icon: Laptop,
      color: 'bg-blue-50 text-blue-600',
      bgColor: 'bg-blue-500',
      link: '/information-technology',
      fallbackData: {
        name: 'تكنولوجيا المعلومات',
        nameEn: 'Information Technology',
        description: 'برنامج بكالوريوس تكنولوجيا المعلومات لإعداد متخصصين في مجال التقنية',
        duration: '4 سنوات',
        degree: 'بكالوريوس'
      }
    },
    {
      id: 5,
      pageKey: 'programs',
      elementKey: 'business',
      icon: Briefcase,
      color: 'bg-amber-50 text-amber-600',
      bgColor: 'bg-amber-500',
      link: '/business-administration',
      fallbackData: {
        name: 'إدارة الأعمال',
        nameEn: 'Business Administration',
        description: 'برنامج بكالوريوس إدارة الأعمال لإعداد قادة وإداريين في مختلف المؤسسات',
        duration: '4 سنوات',
        degree: 'بكالوريوس'
      }
    }
  ];

  return (
    <section id="academics" className="section-padding bg-academic-gray-light overflow-hidden">
      <div className="container-custom max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-section-title mb-4">
            <EditableContent 
              pageKey="programs" 
              elementKey="section_title" 
              elementType="text"
              fallback="برامجنا الأكاديمية"
              as="span"
            />
          </h2>
          <p className="text-body max-w-3xl mx-auto">
            <EditableContent 
              pageKey="programs" 
              elementKey="section_description" 
              elementType="rich_text"
              fallback="نقدم برامج أكاديمية متنوعة ومعتمدة تلبي احتياجات سوق العمل المحلي والإقليمي، مع التركيز على الجودة والتميز في التعليم العالي"
              as="span"
            />
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {programs.map((program, index) => {
            const IconComponent = program.icon;
            return (
              <div
                key={program.id}
                className={`card-program animate-fadeInUp group relative overflow-hidden`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Program Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-xl ${program.color}`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div className="text-right">
                    <span className="text-small text-academic-gray">
                      <EditableContent 
                        pageKey={program.pageKey} 
                        elementKey={`${program.elementKey}_degree`} 
                        elementType="text"
                        fallback={program.fallbackData.degree}
                        as="span"
                      />
                    </span>
                    <div className="text-small text-academic-gray">
                      <EditableContent 
                        pageKey={program.pageKey} 
                        elementKey={`${program.elementKey}_duration`} 
                        elementType="text"
                        fallback={program.fallbackData.duration}
                        as="span"
                      />
                    </div>
                  </div>
                </div>

                {/* Program Info */}
                <h3 className="text-card-title mb-2 text-right">
                  <EditableContent 
                    pageKey={program.pageKey} 
                    elementKey={`${program.elementKey}_name`} 
                    elementType="text"
                    fallback={program.fallbackData.name}
                    as="span"
                  />
                </h3>
                <p className="text-small text-academic-gray mb-1 text-right">
                  <EditableContent 
                    pageKey={program.pageKey} 
                    elementKey={`${program.elementKey}_name_en`} 
                    elementType="text"
                    fallback={program.fallbackData.nameEn}
                    as="span"
                  />
                </p>
                <p className="text-body mb-6 text-right leading-relaxed">
                  <EditableContent 
                    pageKey={program.pageKey} 
                    elementKey={`${program.elementKey}_description`} 
                    elementType="rich_text"
                    fallback={program.fallbackData.description}
                    as="span"
                  />
                </p>

                {/* CTA Button */}
                <div className="flex justify-end">
                  <Link 
                    to={program.link}
                    className="btn-ghost group/btn inline-flex items-center hover:text-university-blue transition-colors"
                  >
                    <EditableContent 
                      pageKey={program.pageKey} 
                      elementKey={`${program.elementKey}_cta_text`} 
                      elementType="text"
                      fallback="اعرف المزيد"
                      as="span"
                    />
                    <ArrowLeft className="w-4 h-4 mr-2 rtl-flip group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Hover Effect Gradient */}
                <div className={`absolute inset-0 ${program.bgColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl pointer-events-none`}></div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="card-elevated inline-block p-8 max-w-2xl">
            <h3 className="text-card-title mb-4">
              <EditableContent 
                pageKey="programs" 
                elementKey="cta_title" 
                elementType="text"
                fallback="هل تريد معرفة المزيد عن برامجنا؟"
                as="span"
              />
            </h3>
            <p className="text-body mb-6">
              <EditableContent 
                pageKey="programs" 
                elementKey="cta_description" 
                elementType="rich_text"
                fallback="احصل على معلومات مفصلة عن متطلبات القبول والمناهج الدراسية"
                as="span"
              />
            </p>
            <Link to="/academics" className="btn-primary">
              <EditableContent 
                pageKey="programs" 
                elementKey="cta_button" 
                elementType="text"
                fallback="تحميل دليل البرامج الأكاديمية"
                as="span"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditableAcademicPrograms;