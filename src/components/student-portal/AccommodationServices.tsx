
import React, { useState } from 'react';
import { Bed, X, Home, Calendar, CreditCard, Users, Wifi, Car, Utensils, Shield } from 'lucide-react';
import { useToast } from '../ui/use-toast';

interface AccommodationServicesProps {
  serviceType: string;
  onClose: () => void;
}

const AccommodationServices = ({ serviceType, onClose }: AccommodationServicesProps) => {
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    phone: '',
    email: '',
    roomType: 'فردية',
    duration: 'فصل دراسي',
    startDate: '',
    endDate: '',
    meal_plan: 'بدون وجبات',
    specialRequests: ''
  });
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "تم تسجيل الطلب",
      description: `طلب ${serviceType} تم إرساله بنجاح. سيتم مراجعته والرد خلال 24 ساعة.`,
    });

    setIsSubmitting(false);
    onClose();
  };

  const roomTypes = [
    {
      type: 'فردية',
      price: '15000 ريال/شهر',
      features: ['سرير مفرد', 'مكتب دراسة', 'خزانة ملابس', 'حمام خاص'],
      available: 5,
      image: '🏠'
    },
    {
      type: 'مزدوجة',
      price: '12000 ريال/شهر',
      features: ['سريرين منفصلين', 'مكتبين دراسة', 'خزانتين', 'حمام مشترك'],
      available: 8,
      image: '🏡'
    },
    {
      type: 'جناح',
      price: '20000 ريال/شهر',
      features: ['غرفة معيشة', 'غرفة نوم منفصلة', 'مطبخ صغير', 'حمام خاص'],
      available: 2,
      image: '🏘️'
    },
    {
      type: 'استوديو',
      price: '18000 ريال/شهر',
      features: ['مساحة مفتوحة', 'مطبخ مجهز', 'حمام خاص', 'شرفة'],
      available: 3,
      image: '🏢'
    }
  ];

  const facilities = [
    { name: 'واي فاي عالي السرعة', icon: Wifi, included: true },
    { name: 'موقف سيارات', icon: Car, included: true },
    { name: 'كافتيريا', icon: Utensils, included: true },
    { name: 'أمن 24/7', icon: Shield, included: true },
    { name: 'غرفة دراسة جماعية', icon: Users, included: true },
    { name: 'صالة رياضية', icon: Home, included: false }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-university-blue flex items-center gap-2">
            <Bed className="w-6 h-6" />
            {serviceType}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 grid lg:grid-cols-2 gap-8">
          {/* نموذج الطلب */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* معلومات الطالب */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-university-blue mb-4">معلومات الطالب</h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">رقم الطالب *</label>
                      <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">الاسم الكامل *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">رقم الهاتف *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">البريد الإلكتروني *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* تفاصيل الإقامة */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-university-blue mb-4">تفاصيل الإقامة</h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">مدة الإقامة</label>
                      <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                      >
                        <option value="فصل دراسي">فصل دراسي واحد</option>
                        <option value="سنة دراسية">سنة دراسية كاملة</option>
                        <option value="صيفي">فصل صيفي</option>
                        <option value="مخصص">مدة مخصصة</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">خطة الوجبات</label>
                      <select
                        name="meal_plan"
                        value={formData.meal_plan}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                      >
                        <option value="بدون وجبات">بدون وجبات</option>
                        <option value="وجبتين">وجبتين يومياً</option>
                        <option value="ثلاث وجبات">ثلاث وجبات يومياً</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">تاريخ البداية</label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">تاريخ النهاية</label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* طلبات خاصة */}
              <div>
                <label className="block text-sm font-medium mb-2">طلبات خاصة</label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                  placeholder="أي طلبات أو احتياجات خاصة"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedRoom}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Bed className="w-4 h-4" />
                      تأكيد الطلب
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* أنواع الغرف والمرافق */}
          <div className="space-y-6">
            {/* أنواع الغرف */}
            <div>
              <h3 className="font-semibold text-university-blue mb-4">أنواع الغرف المتاحة</h3>
              <div className="space-y-4">
                {roomTypes.map((room, index) => (
                  <div 
                    key={index}
                    onClick={() => setSelectedRoom(room.type)}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedRoom === room.type 
                        ? 'border-university-blue bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{room.image}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-university-blue">{room.type}</h4>
                          <div className="text-right">
                            <p className="font-semibold text-university-blue">{room.price}</p>
                            <p className="text-sm text-green-600">{room.available} متاح</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-academic-gray">
                          {room.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-1">
                              <span className="text-green-500">✓</span>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* المرافق */}
            <div>
              <h3 className="font-semibold text-university-blue mb-4">المرافق المتاحة</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-3">
                  {facilities.map((facility, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <facility.icon className={`w-4 h-4 ${facility.included ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className={`text-sm ${facility.included ? 'text-gray-700' : 'text-gray-400'}`}>
                        {facility.name}
                      </span>
                      {facility.included && <span className="text-green-500 text-xs">✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* معلومات مهمة */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-3">شروط وأحكام السكن</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• يجب دفع مقدم شهرين عند التسجيل</li>
                <li>• مدة الحد الأدنى للإقامة شهر واحد</li>
                <li>• يمنع التدخين داخل المباني</li>
                <li>• ساعات الزيارة من 9 صباحاً حتى 9 مساءً</li>
                <li>• تأمين قابل للاسترداد 2000 ريال</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationServices;
