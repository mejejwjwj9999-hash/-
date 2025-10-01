
import React from 'react';
import { Shield, Award, CheckCircle, FileText, Globe, Users, Home, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Accreditation = () => {
  const navigate = useNavigate();
  const certifications = [
    {
      title: 'وزارة التعليم العالي والبحث العلمي',
      description: 'ترخيص رسمي لممارسة التعليم العالي في الجمهورية اليمنية',
      year: '2023',
      status: 'معتمدة',
      icon: Shield,
      color: 'text-university-blue'
    },
    {
      title: 'المجلس الأعلى للجامعات اليمنية',
      description: 'اعتماد البرامج الأكاديمية والشهادات الممنوحة',
      year: '2023',
      status: 'معتمدة',
      icon: Award,
      color: 'text-university-red'
    },
    {
      title: 'هيئة ضمان الجودة والاعتماد الأكاديمي',
      description: 'شهادة ضمان الجودة للبرامج التعليمية',
      year: '2024',
      status: 'قيد التجديد',
      icon: CheckCircle,
      color: 'text-university-gold'
    }
  ];

  const programs = [
    { name: 'بكالوريوس الصيدلة', status: 'معتمد', year: '2023' },
    { name: 'بكالوريوس التمريض', status: 'معتمد', year: '2023' },
    { name: 'بكالوريوس القبالة', status: 'معتمد', year: '2023' },
    { name: 'بكالوريوس تكنولوجيا المعلومات', status: 'معتمد', year: '2023' },
    { name: 'بكالوريوس إدارة الأعمال', status: 'معتمد', year: '2023' }
  ];

  return (
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
                <Shield size={16} />
                الاعتماد الأكاديمي
              </span>
            </nav>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                  <Shield size={48} className="text-university-gold" />
                </div>
              </div>
              <h1 className="text-page-title text-white mb-4">الاعتماد الأكاديمي</h1>
              <p className="text-subtitle text-white/90 max-w-2xl mx-auto">
                كلية أيلول الجامعية حاصلة على كافة التراخيص والاعتمادات الأكاديمية المطلوبة من الجهات الرسمية المختصة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certification Cards */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">التراخيص والاعتمادات</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            <p className="text-subtitle max-w-3xl mx-auto">
              نفخر بحصولنا على جميع التراخيص والاعتمادات الأكاديمية من الجهات الرسمية المختصة
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {certifications.map((cert, index) => (
              <div key={index} className="card-elevated text-center hover:shadow-university transition-all duration-300">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  cert.color === 'text-university-blue' ? 'bg-university-blue' :
                  cert.color === 'text-university-red' ? 'bg-university-red' : 'bg-university-gold'
                }`}>
                  <cert.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-card-title mb-4">{cert.title}</h3>
                <p className="text-body mb-4">{cert.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-academic-gray">السنة: {cert.year}</span>
                  <span className={`px-3 py-1 rounded-full text-white font-medium ${
                    cert.status === 'معتمدة' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}>
                    {cert.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accredited Programs */}
      <section className="section-padding bg-academic-gray-light">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">البرامج الأكاديمية المعتمدة</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            <p className="text-subtitle max-w-3xl mx-auto">
              جميع برامجنا الأكاديمية معتمدة رسمياً ومعترف بها محلياً وإقليمياً
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="card-elevated">
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead className="bg-university-blue text-white">
                    <tr>
                      <th className="px-6 py-4 text-right font-cairo">البرنامج الأكاديمي</th>
                      <th className="px-6 py-4 text-center font-cairo">حالة الاعتماد</th>
                      <th className="px-6 py-4 text-center font-cairo">سنة الاعتماد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {programs.map((program, index) => (
                      <tr key={index} className="hover:bg-academic-gray-light transition-colors">
                        <td className="px-6 py-4 text-right font-tajawal">{program.name}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-4 h-4 ml-1" />
                            {program.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-tajawal text-academic-gray">{program.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">معايير الجودة</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            <p className="text-subtitle max-w-3xl mx-auto">
              نلتزم بأعلى معايير الجودة الأكاديمية في جميع برامجنا وخدماتنا التعليمية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FileText,
                title: 'المناهج المتطورة',
                description: 'مناهج حديثة ومحدثة باستمرار وفقاً للمعايير العالمية'
              },
              {
                icon: Users,
                title: 'هيئة تدريس مؤهلة',
                description: 'أعضاء هيئة تدريس حاصلون على أعلى الدرجات العلمية'
              },
              {
                icon: Globe,
                title: 'شراكات دولية',
                description: 'اتفاقيات تعاون مع جامعات ومؤسسات تعليمية عالمية'
              },
              {
                icon: Award,
                title: 'تقييم مستمر',
                description: 'نظام تقييم شامل لضمان جودة العملية التعليمية'
              }
            ].map((standard, index) => (
              <div key={index} className="card-elevated text-center hover:shadow-university transition-all duration-300">
                <standard.icon className="w-16 h-16 text-university-blue mx-auto mb-6" />
                <h3 className="text-card-title mb-4">{standard.title}</h3>
                <p className="text-body">{standard.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition */}
      <section className="section-padding bg-academic-gray-light">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-section-title mb-8">الاعتراف الدولي</h2>
            <div className="card-elevated">
              <div className="text-body space-y-6 text-right">
                <p>
                  تحرص كلية أيلول الجامعية على الحصول على الاعتراف الدولي لشهاداتها وبرامجها الأكاديمية. 
                  نعمل حالياً على تطوير علاقات مع منظمات الاعتماد الدولية لضمان أن خريجينا يحصلون على 
                  شهادات معترف بها عالمياً.
                </p>
                <p>
                  كما نسعى للحصول على عضوية في الاتحادات والجمعيات الأكاديمية الإقليمية والدولية 
                  التي تعزز من مكانة الكلية ومستوى التعليم المقدم.
                </p>
                <div className="mt-8 p-6 bg-university-blue rounded-lg text-white">
                  <h3 className="text-xl font-bold mb-4 font-cairo">شهادة معادلة</h3>
                  <p className="font-tajawal">
                    جميع الشهادات الصادرة من كلية أيلول الجامعية معتمدة ومعادلة من وزارة التعليم العالي 
                    والبحث العلمي في الجمهورية اليمنية، ومعترف بها في دول الخليج العربي والمنطقة العربية.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accreditation;
