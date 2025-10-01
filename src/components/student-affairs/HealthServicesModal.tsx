
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { X, Heart, Clock, Calendar, MapPin, Phone, User, Stethoscope, Shield, AlertCircle } from 'lucide-react';
import { useToast } from '../ui/use-toast';

interface HealthServicesModalProps {
  onClose: () => void;
}

const HealthServicesModal = ({ onClose }: HealthServicesModalProps) => {
  const [activeTab, setActiveTab] = useState('services');
  const { toast } = useToast();

  const healthServices = [
    {
      name: 'الفحص الطبي العام',
      description: 'فحص شامل للطلاب الجدد والمراجعات الدورية',
      duration: '30 دقيقة',
      cost: 'مجاني',
      available: 'يومياً'
    },
    {
      name: 'الإسعافات الأولية',
      description: 'خدمة طوارئ متاحة على مدار الساعة',
      duration: 'فوري',
      cost: 'مجاني',
      available: '24/7'
    },
    {
      name: 'استشارات طبية متخصصة',
      description: 'استشارة مع أطباء متخصصين',
      duration: '45 دقيقة',
      cost: '2000 ريال',
      available: 'بموعد مسبق'
    },
    {
      name: 'فحوصات مخبرية أساسية',
      description: 'تحاليل دم ومؤشرات حيوية',
      duration: '15 دقيقة',
      cost: '1500 ريال',
      available: 'الأحد-الخميس'
    },
    {
      name: 'التطعيمات الأساسية',
      description: 'التطعيمات المطلوبة والموسمية',
      duration: '10 دقائق',
      cost: 'حسب النوع',
      available: 'بموعد مسبق'
    },
    {
      name: 'برامج التثقيف الصحي',
      description: 'محاضرات وورش توعية صحية',
      duration: '60 دقيقة',
      cost: 'مجاني',
      available: 'أسبوعياً'
    }
  ];

  const medicalStaff = [
    {
      name: 'د. فاطمة أحمد الزهراني',
      specialty: 'طب عام',
      experience: '12 سنة',
      schedule: 'الأحد - الخميس: 8:00 ص - 4:00 م'
    },
    {
      name: 'د. محمد علي الحداد',
      specialty: 'طب الطوارئ',
      experience: '8 سنوات',
      schedule: 'المناوبات الليلية وعطل نهاية الأسبوع'
    },
    {
      name: 'أ. مريم سالم المطري',
      specialty: 'تمريض',
      experience: '6 سنوات',
      schedule: 'متاحة على مدار الساعة'
    }
  ];

  const handleBookAppointment = () => {
    toast({
      title: "حجز موعد",
      description: "سيتم التواصل معك لتأكيد الموعد خلال ساعة واحدة",
    });
  };

  const handleEmergencyCall = () => {
    window.location.href = 'tel:+967779553944';
    toast({
      title: "مكالمة طوارئ",
      description: "جاري الاتصال بخدمة الطوارئ الطبية",
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right flex items-center justify-between">
            <span className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-red-500" />
              الخدمات الصحية
            </span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6">
          {/* Emergency Contact */}
          <div className="bg-red-50 border-r-4 border-red-500 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-red-800 mb-1">خط الطوارئ الطبية</h3>
                <p className="text-sm text-red-700">متاح 24/7 لجميع الحالات الطارئة</p>
              </div>
              <button 
                onClick={handleEmergencyCall}
                className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                اتصل الآن
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 bg-gray-100 p-2 rounded-lg">
            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'services' ? 'bg-university-blue text-white' : 'text-university-blue hover:bg-white'
              }`}
            >
              الخدمات المتاحة
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'staff' ? 'bg-university-blue text-white' : 'text-university-blue hover:bg-white'
              }`}
            >
              الكادر الطبي
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'schedule' ? 'bg-university-blue text-white' : 'text-university-blue hover:bg-white'
              }`}
            >
              جدول المواعيد
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'contact' ? 'bg-university-blue text-white' : 'text-university-blue hover:bg-white'
              }`}
            >
              معلومات الاتصال
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'services' && (
            <div className="grid md:grid-cols-2 gap-4">
              {healthServices.map((service, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <Stethoscope className="w-8 h-8 text-university-blue flex-shrink-0" />
                    <div className="flex-1 text-right mr-3">
                      <h3 className="font-semibold text-university-blue mb-1">{service.name}</h3>
                      <p className="text-sm text-body">{service.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-academic-gray">المدة:</span>
                      <span className="font-medium">{service.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-academic-gray">التكلفة:</span>
                      <span className="font-medium text-green-600">{service.cost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-academic-gray">التوفر:</span>
                      <span className="font-medium">{service.available}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="space-y-4">
              {medicalStaff.map((doctor, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-university-blue rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 text-right">
                      <h3 className="font-bold text-university-blue text-lg mb-1">{doctor.name}</h3>
                      <p className="text-university-blue-light font-medium mb-2">{doctor.specialty}</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-academic-gray">سنوات الخبرة:</span>
                          <span className="font-medium">{doctor.experience}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-academic-gray">أوقات العمل:</span>
                          <span className="font-medium">{doctor.schedule}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-bold text-green-800 mb-4 text-center">ساعات العمل الرسمية</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-green-700 mb-2">أيام الأسبوع</div>
                    <div className="space-y-1">
                      <div>الأحد - الخميس</div>
                      <div className="font-bold">8:00 صباحاً - 4:00 مساءً</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-700 mb-2">عطلة نهاية الأسبوع</div>
                    <div className="space-y-1">
                      <div>الجمعة والسبت</div>
                      <div className="font-bold">طوارئ فقط</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-800 mb-4 text-center">خدمات الطوارئ</h3>
                <div className="text-center text-sm">
                  <div className="mb-2">متاحة على مدار الساعة</div>
                  <div className="font-bold text-blue-700">24/7 جميع أيام السنة</div>
                  <div className="mt-3 text-blue-600">للحالات الطارئة والإسعافات الأولية</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-university-blue text-white p-6 rounded-lg">
                  <h3 className="font-bold mb-4 text-center">معلومات الاتصال</h3>
                  <div className="space-y-3 text-sm" dir="rtl">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">+967779553944</span>
                      <div className="flex items-center gap-2">
                        <span>الهاتف الرئيسي</span>
                        <Phone className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-yellow-300">191</span>
                      <div className="flex items-center gap-2">
                        <span>خط الطوارئ</span>
                        <Phone className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>الطابق الأول - مبنى الإدارة</span>
                      <div className="flex items-center gap-2">
                        <span>الموقع</span>
                        <MapPin className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold mb-4 text-center text-university-blue">كيفية حجز موعد</h3>
                  <ol className="space-y-2 text-sm" dir="rtl">
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-university-blue text-white rounded-full text-xs flex items-center justify-center flex-shrink-0">1</span>
                      <span className="text-right">اتصل على الرقم الرئيسي للعيادة</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-university-blue text-white rounded-full text-xs flex items-center justify-center flex-shrink-0">2</span>
                      <span className="text-right">حدد نوع الخدمة المطلوبة</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-university-blue text-white rounded-full text-xs flex items-center justify-center flex-shrink-0">3</span>
                      <span className="text-right">اختر الموعد المناسب</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-university-blue text-white rounded-full text-xs flex items-center justify-center flex-shrink-0">4</span>
                      <span className="text-right">احضر في الموعد المحدد مع الهوية</span>
                    </li>
                  </ol>
                </div>
              </div>

              <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-2">ملاحظات مهمة</h4>
                    <ul className="text-sm text-yellow-700 space-y-1" dir="rtl">
                      <li className="text-right">• احضر الهوية الطلابية أو بطاقة الهوية الشخصية</li>
                      <li className="text-right">• في حالة الطوارئ اتصل مباشرة على خط الطوارئ</li>
                      <li className="text-right">• للحصول على أفضل خدمة، احجز موعداً مسبقاً</li>
                      <li className="text-right">• جميع الخدمات الوقائية مجانية للطلاب المسجلين</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center pt-6 border-t">
            <button 
              onClick={handleBookAppointment}
              className="btn-primary flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              احجز موعد
            </button>
            <button 
              onClick={handleEmergencyCall}
              className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              اتصال طوارئ
            </button>
            <button onClick={onClose} className="btn-ghost">
              إغلاق
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HealthServicesModal;
