import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Home, ChevronLeft, FileText, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UnifiedPageHeader from '@/components/ui/unified-page-header';

const TermsOfUse = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <UnifiedPageHeader
        icon={FileText}
        title="شروط الاستخدام"
        subtitle="شروط وأحكام استخدام موقع وخدمات كلية أيلول الجامعة"
        breadcrumbs={[
          { label: "الرئيسية", href: "/", icon: Home },
          { label: "شروط الاستخدام", icon: Scale }
        ]}
      />

      {/* Content Section */}
      <section className="section-padding bg-academic-gray-light">
        <div className="container-custom">
          <div className="card-elevated max-w-4xl mx-auto">
            <div className="space-y-8 text-right" dir="rtl">
            
              <section>
                <h2 className="text-card-title">1. القبول بالشروط</h2>
                <p className="text-body">
                  باستخدامك لموقع كلية أيلول الجامعة وخدماتها الإلكترونية، فإنك توافق على الالتزام بهذه الشروط والأحكام. 
                  إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام الموقع أو الخدمات.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-card-title">2. استخدام الموقع</h2>
                <div className="space-y-3">
                  <p className="text-body">
                    <strong className="text-university-blue">الاستخدام المسموح:</strong> يُسمح لك باستخدام الموقع للأغراض التعليمية والأكاديمية المشروعة فقط.
                  </p>
                  <p className="text-body">
                    <strong className="text-university-blue">الاستخدام الممنوع:</strong> يُحظر استخدام الموقع لأي أغراض غير قانونية أو ضارة أو مخالفة للآداب العامة.
                  </p>
                  <p className="text-body">
                    <strong className="text-university-blue">المحتوى:</strong> جميع المحتويات الموجودة على الموقع محمية بحقوق الطبع والنشر الخاصة بكلية أيلول الجامعة.
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-card-title">3. حسابات المستخدمين</h2>
                <div className="space-y-3">
                  <p className="text-body">
                    <strong className="text-university-blue">المسؤولية:</strong> أنت مسؤول عن الحفاظ على سرية معلومات حسابك وكلمة المرور.
                  </p>
                  <p className="text-body">
                    <strong className="text-university-blue">الأمان:</strong> يجب إبلاغ الكلية فوراً عن أي استخدام غير مصرح به لحسابك.
                  </p>
                  <p className="text-body">
                    <strong className="text-university-blue">المعلومات الصحيحة:</strong> يجب تقديم معلومات صحيحة ومحدثة عند إنشاء الحساب.
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-card-title">4. الخدمات الأكاديمية</h2>
                <div className="space-y-3">
                  <p className="text-body">
                    <strong className="text-university-blue">بوابة الطالب:</strong> توفر الوصول إلى الدرجات والجداول والمواد التعليمية.
                  </p>
                  <p className="text-body">
                    <strong className="text-university-blue">المكتبة الرقمية:</strong> تحتوي على موارد تعليمية لاستخدام الطلاب والأكاديميين.
                  </p>
                  <p className="text-body">
                    <strong className="text-university-blue">التوفر:</strong> قد تكون الخدمات غير متاحة أحياناً لأغراض الصيانة أو التحديث.
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-card-title">5. حقوق الملكية الفكرية</h2>
                <p className="text-body">
                  جميع المحتويات والمواد التعليمية والتصاميم والعلامات التجارية الموجودة على الموقع هي ملكية خاصة 
                  بكلية أيلول الجامعة ومحمية بموجب قوانين حقوق الطبع والنشر والملكية الفكرية.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-card-title">6. المسؤولية وإخلاء المسؤولية</h2>
                <div className="space-y-3">
                  <p className="text-body">
                    <strong className="text-university-blue">دقة المعلومات:</strong> نسعى لضمان دقة المعلومات ولكن لا نضمن خلوها من الأخطاء.
                  </p>
                  <p className="text-body">
                    <strong className="text-university-blue">الأضرار:</strong> الكلية غير مسؤولة عن أي أضرار مباشرة أو غير مباشرة قد تنتج عن استخدام الموقع.
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-card-title">7. التعديلات على الشروط</h2>
                <p className="text-body">
                  تحتفظ كلية أيلول الجامعة بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعار المستخدمين 
                  بأي تغييرات جوهرية عبر الموقع أو البريد الإلكتروني.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-card-title">8. القانون المطبق</h2>
                <p className="text-body">
                  تخضع هذه الشروط والأحكام لقوانين الجمهورية اليمنية، وتختص المحاكم اليمنية بالنظر في أي نزاعات قد تنشأ.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-card-title">9. معلومات التواصل</h2>
                <p className="text-body mb-6">
                  لأي استفسارات حول هذه الشروط، يرجى التواصل معنا عبر:
                </p>
                <div className="bg-university-blue/5 p-6 rounded-lg space-y-3">
                  <p className="text-body">
                    <strong className="text-university-blue">البريد الإلكتروني:</strong> aylolcollege@gmail.com
                  </p>
                  <p className="text-body">
                    <strong className="text-university-blue">الهاتف:</strong> +967779553944
                  </p>
                  <p className="text-body">
                    <strong className="text-university-blue">العنوان:</strong> شارع الزبيري، دار سلم، صنعاء، الجمهورية اليمنية
                  </p>
                </div>
              </section>

              <div className="text-center pt-8 border-t border-university-blue/20">
                <div className="bg-university-gold/10 p-4 rounded-lg mb-4">
                  <p className="text-small text-university-blue font-medium">
                    التزامنا بالشفافية والوضوح في جميع التعاملات
                  </p>
                </div>
                <p className="text-small text-academic-gray">
                  آخر تحديث: {new Date().toLocaleDateString('ar-EG', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfUse;