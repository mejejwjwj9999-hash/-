import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Shield, Lock, Eye, Database, Mail, Settings, Home, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UnifiedPageHeader from '@/components/ui/unified-page-header';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const iconProps = { className: "w-6 h-6 text-university-blue ml-3" };

  return (
    <div className="min-h-screen">
      <UnifiedPageHeader
        icon={Shield}
        title="سياسة الخصوصية"
        subtitle="نلتزم بحماية خصوصيتك وأمان بياناتك الشخصية"
        breadcrumbs={[
          { label: "الرئيسية", href: "/", icon: Home },
          { label: "سياسة الخصوصية", icon: Shield }
        ]}
      />

      {/* Content Section */}
      <section className="section-padding bg-academic-gray-light">
        <div className="container-custom">
          <div className="card-elevated max-w-4xl mx-auto">
            <div className="space-y-8 text-right" dir="rtl">
            
              <section>
                <div className="flex items-center gap-3 mb-4 justify-start" dir="rtl">
                  <Shield {...iconProps} />
                  <h2 className="text-card-title">1. المقدمة</h2>
                </div>
                <p className="text-body">
                  تحترم كلية أيلول الجامعة خصوصيتك وتلتزم بحماية معلوماتك الشخصية. توضح هذه السياسة كيفية جمع 
                  واستخدام وحماية البيانات التي تقدمها لنا عند استخدام موقعنا الإلكتروني وخدماتنا الرقمية.
                </p>
              </section>

              <Separator />

              <section>
                <div className="flex items-center gap-3 mb-4 justify-start" dir="rtl">
                  <Database {...iconProps} />
                  <h2 className="text-card-title">2. البيانات التي نجمعها</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-university-blue mb-2">البيانات الشخصية:</h3>
                    <ul className="list-disc list-inside space-y-1 text-body mr-4">
                      <li>الاسم الكامل ومعلومات الهوية</li>
                      <li>عنوان البريد الإلكتروني</li>
                      <li>رقم الهاتف</li>
                      <li>العنوان السكني</li>
                      <li>المعلومات الأكاديمية (للطلاب والأكاديميين)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-university-blue mb-2">البيانات التقنية:</h3>
                    <ul className="list-disc list-inside space-y-1 text-body mr-4">
                      <li>عنوان IP ومعلومات الجهاز</li>
                      <li>نوع المتصفح ونظام التشغيل</li>
                      <li>ملفات تعريف الارتباط (Cookies)</li>
                      <li>سجلات الاستخدام والتنقل</li>
                    </ul>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <div className="flex items-center gap-3 mb-4 justify-start" dir="rtl">
                  <Settings {...iconProps} />
                  <h2 className="text-card-title">3. كيفية استخدام البيانات</h2>
                </div>
                <div className="space-y-3">
                  <p className="text-body">
                    <strong className="text-university-blue">الخدمات التعليمية:</strong> تقديم الخدمات الأكاديمية والتعليمية للطلاب وأعضاء هيئة التدريس.
                  </p>
                  <p className="text-body">
                    <strong className="text-university-blue">التواصل:</strong> إرسال الإشعارات والتحديثات المتعلقة بالدراسة والأنشطة الجامعية.
                  </p>
                  <p className="text-body">
                    <strong className="text-university-blue">تحسين الخدمات:</strong> تطوير وتحسين موقعنا الإلكتروني وخدماتنا الرقمية.
                  </p>
                  <p className="text-body">
                    <strong className="text-university-blue">الأمان:</strong> حماية الموقع والمستخدمين من الأنشطة الضارة أو غير المصرح بها.
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <div className="flex items-center gap-3 mb-4 justify-start" dir="rtl">
                  <Eye {...iconProps} />
                  <h2 className="text-card-title">4. مشاركة البيانات</h2>
                </div>
                <div className="space-y-3">
                  <p className="text-body">
                    <strong className="text-university-blue">عدم البيع:</strong> لا نبيع أو نتاجر ببياناتك الشخصية مع أطراف ثالثة.
                  </p>
                  <p className="text-body">
                    <strong className="text-university-blue">المشاركة المحدودة:</strong> قد نشارك البيانات مع:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-body mr-4">
                    <li>الجهات الحكومية المختصة (عند الضرورة القانونية)</li>
                    <li>مقدمي الخدمات التقنية (بموجب اتفاقيات حماية البيانات)</li>
                    <li>المؤسسات التعليمية الشريكة (للأغراض الأكاديمية فقط)</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section>
                <div className="flex items-center gap-3 mb-4 justify-start" dir="rtl">
                  <Lock {...iconProps} />
                  <h2 className="text-card-title">5. أمان البيانات</h2>
                </div>
                <div className="space-y-3">
                  <p className="text-body">
                    <strong className="text-university-blue">التشفير:</strong> نستخدم تقنيات التشفير المتقدمة لحماية بياناتك أثناء النقل والتخزين.
                  </p>
                  <p className="text-body">
                    <strong className="text-university-blue">الوصول المحدود:</strong> يقتصر الوصول إلى البيانات على الموظفين المصرح لهم فقط.
                  </p>
                  <p className="text-body">
                    <strong className="text-university-blue">المراقبة المستمرة:</strong> نراقب أنظمتنا بانتظام للتأكد من عدم وجود تهديدات أمنية.
                  </p>
                  <p className="text-body">
                    <strong className="text-university-blue">النسخ الاحتياطية:</strong> نحتفظ بنسخ احتياطية آمنة من البيانات لضمان استمرارية الخدمة.
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <div className="flex items-center gap-3 mb-4 justify-start" dir="rtl">
                  <Shield {...iconProps} />
                  <h2 className="text-card-title">6. حقوقك</h2>
                </div>
                <div className="space-y-3">
                  <p className="text-body">
                    <strong className="text-university-blue">الوصول:</strong> يحق لك طلب نسخة من بياناتك الشخصية المحفوظة لدينا.
                  </p>
                  <p className="text-body">
                    <strong className="text-university-blue">التصحيح:</strong> يمكنك طلب تصحيح أي معلومات غير دقيقة أو غير مكتملة.
                  </p>
                  <p className="text-body">
                    <strong className="text-university-blue">الحذف:</strong> يحق لك طلب حذف بياناتك في حالات معينة (مع مراعاة المتطلبات القانونية).
                  </p>
                  <p className="text-body">
                    <strong className="text-university-blue">النقل:</strong> يمكنك طلب نقل بياناتك إلى مؤسسة تعليمية أخرى بصيغة قابلة للقراءة.
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-card-title">7. ملفات تعريف الارتباط (Cookies)</h2>
                <div className="space-y-3">
                  <p className="text-body">
                    نستخدم ملفات تعريف الارتباط لتحسين تجربة المستخدم وتخصيص المحتوى. يمكنك التحكم في إعدادات 
                    الكوكيز من خلال متصفحك، ولكن قد يؤثر ذلك على بعض وظائف الموقع.
                  </p>
                  <div className="bg-university-blue/5 p-4 rounded-lg">
                    <h4 className="font-medium text-university-blue mb-2">أنواع الكوكيز المستخدمة:</h4>
                    <ul className="list-disc list-inside space-y-1 text-body text-sm mr-4">
                      <li>كوكيز الجلسة (Session Cookies) - ضرورية للتشغيل</li>
                      <li>كوكيز التخصيص - لحفظ تفضيلاتك</li>
                      <li>كوكيز التحليل - لفهم استخدام الموقع</li>
                    </ul>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-card-title">8. الاحتفاظ بالبيانات</h2>
                <p className="text-body">
                  نحتفظ ببياناتك طالما كان ذلك ضرورياً لتقديم خدماتنا أو كما تتطلب القوانين واللوائح المعمول بها. 
                  بعد انتهاء الحاجة إلى البيانات، يتم حذفها بشكل آمن وفقاً لسياساتنا الداخلية.
                </p>
              </section>

              <Separator />

              <section>
                <div className="flex items-center gap-3 mb-4 justify-start" dir="rtl">
                  <Mail {...iconProps} />
                  <h2 className="text-card-title">9. التواصل والشكاوى</h2>
                </div>
                <p className="text-body mb-4">
                  إذا كان لديك أي أسئلة أو مخاوف بشأن سياسة الخصوصية أو معالجة بياناتك، يرجى التواصل معنا:
                </p>
                <div className="bg-university-blue/5 p-6 rounded-lg space-y-3">
                  <p className="text-body">
                    <strong className="text-university-blue">مسؤول حماية البيانات:</strong> قسم تقنية المعلومات
                  </p>
                  <p className="text-body">
                    <strong className="text-university-blue">البريد الإلكتروني:</strong> aylolcollege@gmail.com
                  </p>
                  <p className="text-body">
                    <strong className="text-university-blue">الهاتف:</strong> +967779553944
                  </p>
                  <p className="text-body">
                    <strong className="text-university-blue">العنوان:</strong> كلية أيلول الجامعة، شارع الزبيري، دار سلم، صنعاء، الجمهورية اليمنية
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-card-title">10. التحديثات على السياسة</h2>
                <p className="text-body">
                  قد نقوم بتحديث هذه السياسة من وقت لآخر لتعكس التغييرات في خدماتنا أو القوانين المعمول بها. 
                  سنقوم بإشعارك بأي تغييرات جوهرية عبر الموقع أو البريد الإلكتروني قبل 30 يوماً من سريانها.
                </p>
              </section>

              <div className="text-center pt-8 border-t border-university-blue/20">
                <div className="bg-university-gold/10 p-4 rounded-lg mb-4">
                  <p className="text-small text-university-blue font-medium">
                    التزامنا بخصوصيتك مستمر ومتطور
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

export default PrivacyPolicy;