import React, { useState } from 'react';
import { CheckCircle, FileText, CreditCard, Send, User, Mail, Phone, GraduationCap, Loader2, Home } from 'lucide-react';
import { useCreateRegistrationRequest } from '@/hooks/useRegistrationRequests';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UnifiedHeroSection from '@/components/ui/unified-hero-section';
import UnifiedBackButton from '@/components/ui/unified-back-button';

const Admissions = () => {
  const { toast } = useToast();
  const createRegistrationRequest = useCreateRegistrationRequest();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    student_id: '',
    college: 'كلية أيلول الجامعية',
    department: '',
    specialization: '',
    program_id: '',
    department_id: '',
    academic_year: 1,
    semester: 1,
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-set department based on program selection
    if (name === 'program_id') {
      let dept = '';
      let deptId = '';
      let specialization = '';
      
      switch (value) {
        case 'pharmacy':
          dept = 'الصيدلة';
          deptId = 'medical';
          specialization = 'بكالوريوس الصيدلة';
          break;
        case 'nursing':
          dept = 'التمريض';
          deptId = 'medical';
          specialization = 'بكالوريوس التمريض';
          break;
        case 'midwifery':
          dept = 'القبالة';
          deptId = 'medical';
          specialization = 'بكالوريوس القبالة';
          break;
        case 'it':
          dept = 'تكنولوجيا المعلومات';
          deptId = 'tech_science';
          specialization = 'بكالوريوس تكنولوجيا المعلومات';
          break;
        case 'business':
          dept = 'إدارة الأعمال';
          deptId = 'admin_humanities';
          specialization = 'بكالوريوس إدارة الأعمال';
          break;
      }
      
      setFormData(prev => ({
        ...prev,
        department: dept,
        department_id: deptId,
        specialization: specialization
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.first_name || !formData.last_name || !formData.email || 
        !formData.phone || !formData.program_id || !formData.password) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى تعبئة جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    // Generate student ID if not provided
    if (!formData.student_id) {
      const year = new Date().getFullYear().toString().slice(-2);
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      formData.student_id = `STD${year}${random}`;
    }

    try {
      await createRegistrationRequest.mutateAsync(formData);
      
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        student_id: '',
        college: 'كلية أيلول الجامعية',
        department: '',
        specialization: '',
        program_id: '',
        department_id: '',
        academic_year: 1,
        semester: 1,
        password: ''
      });

    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <UnifiedHeroSection
        icon={GraduationCap}
        title="القبول والتسجيل"
        subtitle="ابدأ رحلتك التعليمية معنا - عملية قبول مبسطة وشفافة لضمان حصولك على أفضل تعليم"
        breadcrumb={
          <UnifiedBackButton 
            breadcrumbs={[
              { label: 'الرئيسية', href: '/', icon: Home },
              { label: 'القبول والتسجيل', icon: GraduationCap }
            ]}
          />
        }
      />

      {/* Admission Requirements */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title mb-4">شروط القبول والتسجيل</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto"></div>
          </div>
          
          <div className="max-w-6xl mx-auto space-y-8">
            {/* أ- شروط القبول والتسجيل */}
            <div className="card-elevated">
              <h3 className="text-card-title mb-6 flex items-center">
                <CheckCircle className="w-6 h-6 text-university-blue ml-2" />
                أ- شروط القبول والتسجيل
              </h3>
              
              <div className="space-y-4 text-body" dir="rtl">
                <div className="border-r-4 border-university-blue pr-4">
                  <p><strong>1-</strong> يقبل في الجامعة حملة الثانوية العامة في الجمهورية اليمنية، أو ما يعادلها بالمعدل الذي يتم تحديده سنوياً.</p>
                </div>
                
                <div className="border-r-4 border-university-blue pr-4">
                  <p><strong>2-</strong> الطلبة الحاصلين على الثانوية من المحافظات الجنوبية المحافظات المحتلة يتم مصادقتها من الكنترول التابع لوزارة التربية والتعليم صنعاء.</p>
                </div>
                
                <div className="border-r-4 border-university-blue pr-4">
                  <p><strong>3-</strong> تقديم كافة الوثائق المطلوبة معمدة، مع طلب الالتحاق بالجامعة لإدارة القبول والتسجيل.</p>
                </div>
                
                <div className="border-r-4 border-university-blue pr-4">
                  <p><strong>4-</strong> يتم القبول بحسب الطاقة الاستيعابية المحددة من قبل الجامعة والمعتمدة من وزارة التعليم العالي والبحث العلمي.</p>
                </div>
                
                <div className="border-r-4 border-university-blue pr-4">
                  <p><strong>5-</strong> يتعهد الطالب بالالتزام بأنظمة وتعليمات ولوائح الجامعة السارية أثناء الدراسة.</p>
                </div>
                
                <div className="border-r-4 border-university-blue pr-4">
                  <p><strong>6-</strong> الشهادة الصادرة من خارج اليمن يلزم التصديق عليها من السلطات المختصة في بلد الإصدار، واخضاعها للمعادلة من الجهات المختصة في الجمهورية اليمنية.</p>
                </div>
                
                <div className="border-r-4 border-university-blue pr-4">
                  <p><strong>7-</strong> تسجيل الطلبة المستجدين والمحولين من كليات أو جامعات أخرى (طلبة المقاصة) لا يتجاوز الأسبوع الثاني من بدء الفصل الدراسي الأول ويحق لعميد الكلية التمديد لأسبوع ثالث.</p>
                </div>
                
                <div className="border-r-4 border-university-blue pr-4">
                  <p><strong>8-</strong> لا يجوز قبول الطالب المتقدم للتسجيل في الجامعة إذ اسبق فصله من جامعة أخرى لأسباب أخلاقية.</p>
                </div>
                
                <div className="border-r-4 border-university-blue pr-4">
                  <p><strong>9-</strong> يلغى تسجيل الطالب المحول من جامعة أخرى إذا ثبت أن فصله من تلك الجامعة كان لأسباب أخلاقية.</p>
                </div>
                
                <div className="border-r-4 border-university-blue pr-4">
                  <p><strong>10-</strong> الطالب الذي حصل على مؤهل من أحد برامج الكلية ثم تقدم بعدها للدراسة في برنامج آخر في نفس الكلية، تجرى له مقاصة ولا تعتمد له أكثر من 50% من المقررات، حتى وإن كان قد درسها في الكلية.</p>
                </div>
                
                <div className="border-r-4 border-university-blue pr-4">
                  <p><strong>11-</strong> لا يحق للطالب الدراسة في أكثر من برنامج انتظام في أقسام وكليات الجامعة في الوقت ذاته.</p>
                </div>
              </div>
            </div>

            {/* ب- الوثائق المطلوبة للتسجيل */}
            <div className="card-elevated">
              <h3 className="text-card-title mb-6 flex items-center">
                <FileText className="w-6 h-6 text-university-blue ml-2" />
                ب- الوثائق المطلوبة للتسجيل
              </h3>
              
              <div className="space-y-4 text-body" dir="rtl">
                <p className="mb-4">على الطلبة الراغبين الالتحاق بالجامعة تقديم كافة الوثائق المطلوبة منهم مصدقة من الجهات المعنية وهي على النحو التالي:</p>
                
                <div className="grid gap-4">
                  <div className="flex items-start gap-3 p-4 bg-university-blue/5 rounded-lg">
                    <span className="bg-university-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</span>
                    <p>استمارة طلب الالتحاق (القبول) مع استيفاء كافة المعلومات الواردة فيها، وفقاً لشروط الجامعة.</p>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-university-blue/5 rounded-lg">
                    <span className="bg-university-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</span>
                    <p>أصل شهادة الثانوية العامة، أو ما يعادلها، مرفقاً معها صورة طبق الأصل معمدة، وترجمة الشهادة وتعميدها في حال إذا كانت غير عربية من الجهات المختصة في اليمن.</p>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-university-blue/5 rounded-lg">
                    <span className="bg-university-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</span>
                    <p>سند قبض للرسوم المقررة (رسوم التسجيل).</p>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-university-blue/5 rounded-lg">
                    <span className="bg-university-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">4</span>
                    <p>صورة من البطاقة الشخصية أو العائلية.</p>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-university-blue/5 rounded-lg">
                    <span className="bg-university-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">5</span>
                    <p>عدد عشر صور شخصية قياس (6×4) خلفيتها بيضاء أماميه.</p>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-university-blue/5 rounded-lg">
                    <span className="bg-university-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">6</span>
                    <p>صور الصفحات الثمان الأولى من جواز السفر لغير اليمنيين على أن يكون جوازاً صالحاً لأكثر من سنة.</p>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-university-blue/5 rounded-lg">
                    <span className="bg-university-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">7</span>
                    <p>إرفاق صورة شهادة اللياقة الصحية بالنسبة للطلبة الوافدين.</p>
                  </div>
                </div>

                {/* الوثائق المطلوبة للطلاب المحولين */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-university-blue mb-4">الوثائق المطلوبة للطلاب المحولين من جامعات أخرى:</h4>
                  
                  <div className="space-y-4">
                    <div className="bg-university-gold/10 p-6 rounded-lg">
                      <h5 className="font-semibold text-university-blue mb-3">1- الطلاب المحولون من جامعات يمنية:</h5>
                      <p>المطلوب منهم بالإضافة إلى ما ذكر أعلاه إحضار استمارة التحويل معمدة من الجامعة المحول منها ومن الوزارة ويرفق بها كشف درجات بالمواد التي درسها الطالب في تلك الجامعة معمدة من وزارة التعليم العالي والبحث العلمي، مع صورتين طبق الأصل من كشف الدرجات بالإضافة إلى صورة معمدة من الجامعة للمحتوى العلمي للمواد الدراسية الموجودة في كشف الدرجات وتجرى المقاصة للطالب المحول من جامعة أخرى ويشترط أن يدرس 50% على الأقل من إجمالي المقررات في الجامعة ويوضح في المقاصة المستوى الذي سيسكن الطالب به في الجامعة.</p>
                    </div>
                    
                    <div className="bg-university-gold/10 p-6 rounded-lg">
                      <h5 className="font-semibold text-university-blue mb-3">2- الطلاب المحولون من جامعات خارج اليمن:</h5>
                      <p>المطلوب بالإضافة إلى ما ذكر أعلاه تعميد كشف الدرجات من التعليم العالي والخارجية بذلك البلد والسفارة اليمنية هناك والخارجية اليمنية بصنعاء، شريطة أن تكون تلك الجهة معترفاً بها في التعليم العالي بالإضافة إلى صورة معمدة من الجامعة التي درس بها للمحتوى العلمي الموجودة بكشف الدرجات. وفي حال كون كشف الدرجات باللغة غير العربية كأن تكون الجامعة أجنبية، يتم ترجمتها وتعميدها كما ذكر آنفاً.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ج- آلية التسجيل */}
            <div className="card-elevated">
              <h3 className="text-card-title mb-6 flex items-center">
                <GraduationCap className="w-6 h-6 text-university-blue ml-2" />
                ج- آلية التسجيل
              </h3>
              
              <div className="space-y-4 text-body" dir="rtl">
                <div className="flex items-start gap-3 p-4 bg-green-50 border-r-4 border-green-500">
                  <span className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</span>
                  <p>التسجيل عن طريق البوابة الإلكترونية للتنسيق الموحد من خلال اختيار كلية أيلول الجامعية وتقديم طلب التسجيل ومتابعة الجامعة بشأن تأكيد تسجيله بعد توفير الوثائق المطلوبة منه لإدارة القبول والتسجيل.</p>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-blue-50 border-r-4 border-blue-500">
                  <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</span>
                  <p>يتقدم الطالب بطلب التسجيل والقبول إلى الجامعة بعد التأكد من استيفاءه لشروط ومعايير القبول والتسجيل بالجامعة، وتعبئته طلب الالتحاق بالجامعة بعد التأكد من معرفة نظام الدراسة وتعليماتها، وفهم شروط القبول والموافقة عليها وتقديم كافة الوثائق المطلوبة منه لإدارة القبول والتسجيل في الجامعة (مسجلي الكليات) وتقوم إدارة القبول والتسجيل بإدخال بيانات الطالب المسجل في البوابة الإلكترونية.</p>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-yellow-50 border-r-4 border-yellow-500">
                  <span className="bg-yellow-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</span>
                  <p>يقوم الطالب المسجل بسداد رسوم التسجيل المقررة ويأخذ ايصالاً بذلك من الشؤون المالية.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="section-padding bg-academic-gray-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title mb-4">خطوات التقديم</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto"></div>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'املأ الطلب', desc: 'قم بملء استمارة التقديم الإلكترونية', icon: FileText },
                { step: '2', title: 'أرفق الوثائق', desc: 'أرفق جميع الوثائق المطلوبة', icon: CheckCircle },
                { step: '3', title: 'ادفع الرسوم', desc: 'ادفع رسوم التسجيل والدراسة', icon: CreditCard },
                { step: '4', title: 'التأكيد', desc: 'انتظر تأكيد القبول والبدء', icon: GraduationCap }
              ].map((step, index) => (
                <div key={index} className="card-elevated text-center relative">
                  <div className="w-12 h-12 bg-university-blue text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                    {step.step}
                  </div>
                  <step.icon className="w-8 h-8 text-university-blue mx-auto mb-3" />
                  <h3 className="text-card-title mb-2">{step.title}</h3>
                  <p className="text-body">{step.desc}</p>
                  
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 left-0 transform -translate-y-1/2 translate-x-full">
                      <div className="w-8 h-0.5 bg-university-blue"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tuition Fees */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title mb-4">الرسوم الدراسية</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="card-elevated">
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="border-b-2 border-university-blue">
                      <th className="py-4 px-6 text-university-blue font-semibold">التخصص</th>
                      <th className="py-4 px-6 text-university-blue font-semibold">رسوم التسجيل</th>
                      <th className="py-4 px-6 text-university-blue font-semibold">الرسوم السنوية</th>
                      <th className="py-4 px-6 text-university-blue font-semibold">المجموع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { program: 'بكالوريوس الصيدلة', registration: '50,000', annual: '400,000', total: '450,000' },
                      { program: 'بكالوريوس التمريض', registration: '40,000', annual: '300,000', total: '340,000' },
                      { program: 'بكالوريوس القبالة', registration: '40,000', annual: '300,000', total: '340,000' },
                      { program: 'بكالوريوس تكنولوجيا المعلومات', registration: '35,000', annual: '280,000', total: '315,000' },
                      { program: 'بكالوريوس إدارة الأعمال', registration: '35,000', annual: '250,000', total: '285,000' }
                    ].map((fee, index) => (
                      <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        <td className="py-4 px-6 font-medium">{fee.program}</td>
                        <td className="py-4 px-6 text-academic-gray">{fee.registration} ريال</td>
                        <td className="py-4 px-6 text-academic-gray">{fee.annual} ريال</td>
                        <td className="py-4 px-6 font-semibold text-university-blue">{fee.total} ريال</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-4 bg-university-blue-light bg-opacity-10 rounded-lg">
                <p className="text-academic-gray-dark text-center font-medium">
                  <strong className="text-university-blue">ملاحظة:</strong> يمكن دفع الرسوم على أقساط حسب الاتفاق مع إدارة الكلية
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Online Application Form */}
      <section className="section-padding bg-academic-gray-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title mb-4">استمارة التقديم الإلكترونية</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto"></div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="card-elevated">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-university-blue font-semibold mb-2">
                      <User className="w-4 h-4 inline ml-1" />
                      الاسم الأول *
                    </label>
                    <Input
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      placeholder="أدخل الاسم الأول"
                      className="h-12 border-university-blue/20 focus:border-university-blue"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-university-blue font-semibold mb-2">
                      <User className="w-4 h-4 inline ml-1" />
                      الاسم الأخير *
                    </label>
                    <Input
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      placeholder="أدخل الاسم الأخير"
                      className="h-12 border-university-blue/20 focus:border-university-blue"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-university-blue font-semibold mb-2">
                      <Mail className="w-4 h-4 inline ml-1" />
                      البريد الإلكتروني *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@email.com"
                      className="h-12 border-university-blue/20 focus:border-university-blue"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-university-blue font-semibold mb-2">
                      <Phone className="w-4 h-4 inline ml-1" />
                      رقم الهاتف *
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="967xxxxxxxxx"
                      className="h-12 border-university-blue/20 focus:border-university-blue"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-university-blue font-semibold mb-2">
                    <GraduationCap className="w-4 h-4 inline ml-1" />
                    التخصص المرغوب *
                  </label>
                  <Select value={formData.program_id} onValueChange={(value) => handleSelectChange('program_id', value)}>
                    <SelectTrigger className="h-12 border-university-blue/20 text-right">
                      <SelectValue placeholder="اختر التخصص" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pharmacy">بكالوريوس الصيدلة</SelectItem>
                      <SelectItem value="nursing">بكالوريوس التمريض</SelectItem>
                      <SelectItem value="midwifery">بكالوريوس القبالة</SelectItem>
                      <SelectItem value="it">بكالوريوس تكنولوجيا المعلومات</SelectItem>
                      <SelectItem value="business">بكالوريوس إدارة الأعمال</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-university-blue font-semibold mb-2">
                    العنوان الكامل *
                  </label>
                  <Textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="أدخل عنوانك الكامل..."
                    rows={3}
                    className="border-university-blue/20 focus:border-university-blue"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-university-blue font-semibold mb-2">
                      السنة الأكاديمية
                    </label>
                    <Select value={formData.academic_year.toString()} onValueChange={(value) => handleSelectChange('academic_year', value)}>
                      <SelectTrigger className="h-12 border-university-blue/20 text-right">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">السنة الأولى</SelectItem>
                        <SelectItem value="2">السنة الثانية</SelectItem>
                        <SelectItem value="3">السنة الثالثة</SelectItem>
                        <SelectItem value="4">السنة الرابعة</SelectItem>
                        <SelectItem value="5">السنة الخامسة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-university-blue font-semibold mb-2">
                      الفصل الدراسي
                    </label>
                    <Select value={formData.semester.toString()} onValueChange={(value) => handleSelectChange('semester', value)}>
                      <SelectTrigger className="h-12 border-university-blue/20 text-right">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">الفصل الأول</SelectItem>
                        <SelectItem value="2">الفصل الثاني</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-university-blue font-semibold mb-2">
                    كلمة المرور للحساب *
                  </label>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="أدخل كلمة مرور قوية"
                    className="h-12 border-university-blue/20 focus:border-university-blue"
                    required
                  />
                  <p className="text-sm text-academic-gray mt-1">
                    ستستخدم هذه الكلمة للدخول إلى حسابك بعد قبول طلبك
                  </p>
                </div>
                
                <div className="text-center">
                  <Button 
                    type="submit" 
                    className="bg-university-blue hover:bg-university-blue/90 text-white text-lg px-8 py-4 h-auto transition-colors"
                    disabled={createRegistrationRequest.isPending}
                  >
                    {createRegistrationRequest.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 ml-2" />
                        إرسال طلب التسجيل
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admissions;