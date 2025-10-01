import React from 'react';
import { Users, Target, Heart, Award, Home } from 'lucide-react';
import UnifiedHeroSection from '@/components/ui/unified-hero-section';
import UnifiedBackButton from '@/components/ui/unified-back-button';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Unified Hero Section */}
      <UnifiedHeroSection
        icon={Users}
        title="من نحن"
        subtitle="تعرف على كلية إيلول الجامعية ومسيرتها في التعليم العالي"
        breadcrumb={
          <UnifiedBackButton 
            breadcrumbs={[
              { label: 'الرئيسية', href: '/', icon: Home },
              { label: 'عن الكلية', icon: Users }
            ]}
          />
        }
      />

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="card-elevated mb-12">
              <h2 className="text-section-title mb-6">نبذة عن الكلية</h2>
              <div className="text-body space-y-4">
                <p>
                  كلية إيلول الجامعية هي مؤسسة تعليمية رائدة تأسست بهدف تقديم تعليم عالي الجودة 
                  في مختلف التخصصات العلمية والطبية. تقع الكلية في مدينة يريم بمحافظة إب، 
                  وتسعى لتكون منارة علمية تخدم المجتمع المحلي والإقليمي.
                </p>
                <p>
                  تتميز كلية إيلول بكادرها التدريسي المؤهل وبرامجها الأكاديمية المعتمدة 
                  ومرافقها الحديثة المجهزة بأحدث التقنيات التعليمية. نحرص على إعداد 
                  خريجين متميزين قادرين على المساهمة الفعالة في التنمية والتطوير.
                </p>
              </div>
            </div>

            {/* Values */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="card-elevated text-center">
                <Target className="w-12 h-12 text-university-blue mx-auto mb-4" />
                <h3 className="text-card-title mb-3">التميز الأكاديمي</h3>
                <p className="text-body">نسعى للتميز في جميع برامجنا التعليمية</p>
              </div>
              
              <div className="card-elevated text-center">
                <Heart className="w-12 h-12 text-university-red mx-auto mb-4" />
                <h3 className="text-card-title mb-3">خدمة المجتمع</h3>
                <p className="text-body">نركز على خدمة المجتمع وتلبية احتياجاته</p>
              </div>
              
              <div className="card-elevated text-center">
                <Users className="w-12 h-12 text-university-gold mx-auto mb-4" />
                <h3 className="text-card-title mb-3">التعاون والشراكة</h3>
                <p className="text-body">نؤمن بأهمية التعاون والشراكة المجتمعية</p>
              </div>
              
              <div className="card-elevated text-center">
                <Award className="w-12 h-12 text-university-blue mx-auto mb-4" />
                <h3 className="text-card-title mb-3">الجودة والاعتماد</h3>
                <p className="text-body">نلتزم بمعايير الجودة والاعتماد الأكاديمي</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="card-elevated">
              <h2 className="text-section-title mb-6">ما يميزنا</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-card-title mb-4">البرامج الأكاديمية</h3>
                  <ul className="text-body space-y-2">
                    <li>• برامج معتمدة من وزارة التعليم العالي</li>
                    <li>• مناهج محدثة تواكب التطورات العلمية</li>
                    <li>• تدريب عملي متخصص</li>
                    <li>• فرص تدريب في مؤسسات مرموقة</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-card-title mb-4">المرافق والخدمات</h3>
                  <ul className="text-body space-y-2">
                    <li>• مختبرات علمية مجهزة</li>
                    <li>• مكتبة رقمية شاملة</li>
                    <li>• قاعات محاضرات حديثة</li>
                    <li>• خدمات دعم الطلاب</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;