import React from 'react';
import { DynamicAcademicPrograms } from '@/components/dynamic/DynamicAcademicPrograms';
import { EditableContent } from '@/components/inline-editor/EditableContent';
import { AllProgramsDataLoader } from '@/components/dynamic/AllProgramsDataLoader';
import { motion } from 'framer-motion';
import { GraduationCap, Home, ChevronLeft, BookOpen, Users, Award, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProgramsIndex: React.FC = () => {
  const navigate = useNavigate();
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AllProgramsDataLoader>
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section 
        className="hero-section text-white py-16"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
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
                البرامج الأكاديمية
              </span>
            </nav>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                  <GraduationCap size={48} className="text-university-gold" />
                </div>
              </div>
              <h1 className="text-page-title text-white mb-4">
                <EditableContent 
                  pageKey="programs" 
                  elementKey="hero_title" 
                  elementType="text"
                  fallback="البرامج الأكاديمية"
                />
              </h1>
              <p className="text-subtitle text-white/90 max-w-2xl mx-auto">
                <EditableContent 
                  pageKey="programs" 
                  elementKey="hero_description" 
                  elementType="text"
                  fallback="تقدم كلية أيلول الجامعية برامج أكاديمية متنوعة ومتطورة تواكب احتياجات سوق العمل"
                />
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Programs Section */}
      <motion.section 
        className="section-padding"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.2 }}
      >
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title mb-4">برامجنا الأكاديمية</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto"></div>
          </div>
          
          <DynamicAcademicPrograms 
            showViewAll={false}
            className="max-w-6xl mx-auto"
          />
        </div>
      </motion.section>

      {/* Academic Features */}
      <motion.section 
        className="section-padding"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.4 }}
      >
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title mb-4">
              <EditableContent 
                pageKey="programs" 
                elementKey="info_title" 
                elementType="text"
                fallback="مميزات التعليم الأكاديمي"
              />
            </h2>
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
      </motion.section>

      {/* Additional Info Section */}
      <motion.section 
        className="section-padding bg-academic-gray-light"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.6 }}
      >
        <div className="container-custom text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-section-title mb-6">
              <EditableContent 
                pageKey="programs" 
                elementKey="why_choose_title" 
                elementType="text"
                fallback="لماذا تختار برامجنا الأكاديمية؟"
              />
            </h2>
            <div className="prose prose-lg max-w-none text-body">
              <EditableContent 
                pageKey="programs" 
                elementKey="info_content" 
                elementType="rich_text"
                fallback={`
                  <p>نقدم برامج أكاديمية متميزة ومعتمدة تجمع بين الأسس النظرية القوية والتطبيق العملي المتقدم. برامجنا مصممة بعناية لتواكب أحدث التطورات في مختلف المجالات وتلبي احتياجات سوق العمل المحلي والإقليمي والعالمي.</p>
                  
                  <p>نحرص على توفير بيئة تعليمية محفزة تساعد الطلاب على تطوير مهاراتهم الأكاديمية والمهنية، مع التركيز على:</p>
                  
                  <ul>
                    <li>جودة التعليم والاعتماد الأكاديمي</li>
                    <li>الخبرة العملية والتدريب الميداني</li>
                    <li>الابتكار والبحث العلمي</li>
                    <li>التطوير المهني المستمر</li>
                    <li>الاستعداد لسوق العمل</li>
                  </ul>
                `}
              />
            </div>
          </div>
        </div>
      </motion.section>
      </div>
    </AllProgramsDataLoader>
  );
};

export default ProgramsIndex;