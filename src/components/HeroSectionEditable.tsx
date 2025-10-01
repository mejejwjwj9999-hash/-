import React, { useState } from 'react';
import { ArrowLeft, Users, Award, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EditableContent } from './inline-editor/EditableContent';
import { HeroSectionManager } from './hero-section-manager/HeroSectionManager';
import { Button } from './ui/button';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { supabase } from '@/integrations/supabase/client';

const HeroSectionEditable = () => {
  const [user, setUser] = useState<any>(null);
  const [showManager, setShowManager] = useState(false);
  const { data: isAdmin } = useIsAdmin(user?.id);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center bg-hero-gradient text-white overflow-hidden pt-20 md:pt-16">
        {/* Admin Control Button */}
        {isAdmin && (
          <div className="fixed top-20 left-4 z-50">
            <Button
              onClick={() => setShowManager(true)}
              className="bg-primary/90 hover:bg-primary text-white shadow-lg"
              size="sm"
            >
              <Settings className="w-4 h-4 mr-2" />
              إدارة القسم
            </Button>
          </div>
        )}

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>

        <div className="container-custom relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-right animate-fadeInUp order-2 lg:order-1">
              <div className="mb-4 lg:mb-6">
                <span className="inline-block px-3 py-2 sm:px-4 bg-university-gold text-university-blue rounded-full text-xs sm:text-sm font-medium mb-4 animate-fadeInUp" style={{
                  animationDelay: '0.2s'
                }}>
                  <EditableContent 
                    pageKey="homepage" 
                    elementKey="hero_badge" 
                    elementType="text"
                    fallback="مرحباً بكم في كلية أيلول الجامعية"
                    as="span"
                  />
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 lg:mb-6 leading-tight animate-fadeInUp" style={{
                animationDelay: '0.4s'
              }}>
                <EditableContent 
                  pageKey="homepage" 
                  elementKey="hero_title" 
                  elementType="text"
                  fallback="صرحك العلمي نحو المستقبل"
                  as="span"
                />
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl mb-6 lg:mb-8 text-gray-100 leading-relaxed px-2 sm:px-0 animate-fadeInUp" style={{
                animationDelay: '0.6s'
              }}>
                <EditableContent 
                  pageKey="homepage" 
                  elementKey="hero_subtitle" 
                  elementType="rich_text"
                  fallback="نقدم تعليماً عالي الجودة في مختلف التخصصات الأكاديمية والمهنية، مع التركيز على إعداد جيل من الخريجين المؤهلين لسوق العمل المحلي والإقليمي."
                  as="span"
                />
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8 lg:mb-12 px-2 sm:px-0 animate-fadeInUp" style={{
                animationDelay: '0.8s'
              }}>
                <Link to="/admissions" className="btn-primary btn-lg group text-sm sm:text-base">
                  <EditableContent 
                    pageKey="homepage" 
                    elementKey="hero_cta" 
                    elementType="text"
                    fallback="ابدأ رحلتك معنا"
                    as="span"
                  />
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 rtl-flip group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/academics" className="btn-secondary btn-lg text-sm sm:text-base">
                  <EditableContent 
                    pageKey="homepage" 
                    elementKey="hero_secondary_cta" 
                    elementType="text"
                    fallback="تصفح البرامج الأكاديمية"
                    as="span"
                  />
                </Link>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 animate-fadeInUp px-2 sm:px-0" style={{
                animationDelay: '1s'
              }}>
                <div className="text-center">
                  <EditableContent 
                    pageKey="homepage" 
                    elementKey="hero_stat_1" 
                    elementType="stat"
                    fallback="5"
                    as="div"
                  />
                </div>
                <div className="text-center">
                  <EditableContent 
                    pageKey="homepage" 
                    elementKey="hero_stat_2" 
                    elementType="stat"
                    fallback="250+"
                    as="div"
                  />
                </div>
                <div className="text-center">
                  <EditableContent 
                    pageKey="homepage" 
                    elementKey="hero_stat_3" 
                    elementType="stat"
                    fallback="2023"
                    as="div"
                  />
                </div>
              </div>
            </div>
            
            {/* Image */}
            <div className="relative animate-fadeInUp order-1 lg:order-2 px-4 sm:px-0" style={{
              animationDelay: '0.3s'
            }}>
              <div className="relative">
                <EditableContent 
                  pageKey="homepage" 
                  elementKey="hero_main_image" 
                  elementType="image"
                  fallback={<img src="/lovable-uploads/b95f00a9-164e-4eb5-8efa-206bdd2fd5f4.png" alt="مبنى كلية أيلول الجامعية" className="w-full h-auto rounded-2xl shadow-university" />}
                  as="div"
                  className="w-full"
                />
                
                {/* Floating Elements */}
                <div className="absolute -top-3 -right-3 sm:-top-6 sm:-right-6 w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center shadow-large">
                  <EditableContent 
                    pageKey="homepage" 
                    elementKey="hero_logo" 
                    elementType="image"
                    fallback={
                      <img 
                        src="/lovable-uploads/df0602ed-e16f-4975-b253-0d7de1e70e42.png" 
                        alt="شعار كلية أيلول الجامعية" 
                        className="w-10 h-10 sm:w-16 sm:h-16 object-contain"
                      />
                    }
                    as="div"
                  />
                </div>
                
                <div className="absolute -bottom-3 -left-3 sm:-bottom-6 sm:-left-6 w-24 h-12 sm:w-32 sm:h-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-center p-2 sm:p-3">
                  <div>
                    <div className="text-sm sm:text-lg font-bold">
                      <EditableContent 
                        pageKey="homepage" 
                        elementKey="hero_accreditation_title" 
                        elementType="text"
                        fallback="معتمدة رسمياً"
                        as="span"
                      />
                    </div>
                    <div className="text-xs text-gray-300">
                      <EditableContent 
                        pageKey="homepage" 
                        elementKey="hero_accreditation_subtitle" 
                        elementType="text"
                        fallback="من وزارة التعليم العالي"
                        as="span"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-2 sm:h-3 bg-white rounded-full mt-1 sm:mt-2"></div>
          </div>
        </div>
      </section>

      {/* Hero Section Manager */}
      {showManager && isAdmin && (
        <HeroSectionManager onClose={() => setShowManager(false)} />
      )}
    </>
  );
};

export default HeroSectionEditable;