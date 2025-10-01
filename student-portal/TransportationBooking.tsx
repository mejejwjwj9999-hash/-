
import React, { useState } from 'react';
import { Car, X, MapPin, Clock, Users, Calendar, CreditCard, Navigation } from 'lucide-react';
import { useToast } from '../ui/use-toast';

interface TransportationBookingProps {
  serviceType: string;
  onClose: () => void;
}

const TransportationBooking = ({ serviceType, onClose }: TransportationBookingProps) => {
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    phone: '',
    pickupLocation: '',
    destination: '',
    date: '',
    time: '',
    passengerCount: '1',
    tripType: 'ذهاب فقط',
    returnTime: '',
    specialNeeds: ''
  });
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
      title: "تم حجز الرحلة",
      description: `حجز ${serviceType} تم بنجاح. سيتم إرسال تفاصيل السائق قريباً.`,
    });

    setIsSubmitting(false);
    onClose();
  };

  const availableRoutes = [
    { from: 'الجامعة', to: 'وسط المدينة', price: '500 ريال' },
    { from: 'الجامعة', to: 'المطار', price: '1200 ريال' },
    { from: 'الجامعة', to: 'السكن الجامعي', price: '300 ريال' },
    { from: 'الجامعة', to: 'المستشفى الجامعي', price: '400 ريال' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-university-blue flex items-center gap-2">
            <Car className="w-6 h-6" />
            حجز {serviceType}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 grid lg:grid-cols-3 gap-6">
          {/* نموذج الحجز */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* معلومات الطالب */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-university-blue mb-4">معلومات الراكب</h3>
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
                    <label className="block text-sm font-medium mb-2">عدد الركاب</label>
                    <select
                      name="passengerCount"
                      value={formData.passengerCount}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                    >
                      <option value="1">1 راكب</option>
                      <option value="2">2 راكب</option>
                      <option value="3">3 راكب</option>
                      <option value="4">4 راكب</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* تفاصيل الرحلة */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-university-blue mb-4">تفاصيل الرحلة</h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">نقطة الانطلاق *</label>
                      <input
                        type="text"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                        placeholder="مثال: البوابة الرئيسية للجامعة"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">الوجهة *</label>
                      <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                        placeholder="مثال: وسط المدينة"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">التاريخ *</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">وقت الانطلاق *</label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">نوع الرحلة</label>
                      <select
                        name="tripType"
                        value={formData.tripType}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                      >
                        <option value="ذهاب فقط">ذهاب فقط</option>
                        <option value="ذهاب وإياب">ذهاب وإياب</option>
                      </select>
                    </div>
                  </div>

                  {formData.tripType === 'ذهاب وإياب' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">وقت العودة</label>
                      <input
                        type="time"
                        name="returnTime"
                        value={formData.returnTime}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* احتياجات خاصة */}
              <div>
                <label className="block text-sm font-medium mb-2">احتياجات خاصة</label>
                <textarea
                  name="specialNeeds"
                  value={formData.specialNeeds}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                  placeholder="مثال: أحتاج مساعدة لذوي الاحتياجات الخاصة، أو أحمل أمتعة كثيرة"
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
                  disabled={isSubmitting}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      جاري الحجز...
                    </>
                  ) : (
                    <>
                      <Car className="w-4 h-4" />
                      تأكيد الحجز
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* معلومات إضافية */}
          <div className="space-y-6">
            {/* الطرق الشائعة */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-university-blue mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5" />
                الطرق الشائعة
              </h4>
              <div className="space-y-3">
                {availableRoutes.map((route, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div className="text-sm">
                      <p className="font-medium">{route.from} ← {route.to}</p>
                    </div>
                    <span className="text-sm text-university-blue font-semibold">{route.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* معلومات مهمة */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-3">معلومات مهمة</h4>
              <ul className="text-sm text-yellow-700 space-y-2">
                <li>• يجب الحجز قبل ساعة على الأقل</li>
                <li>• الدفع نقداً للسائق</li>
                <li>• إمكانية الإلغاء حتى 30 دقيقة قبل الموعد</li>
                <li>• خدمة 24/7 للطوارئ</li>
              </ul>
            </div>

            {/* تقييم الخدمة */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-3">تقييم العملاء</h4>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⭐⭐⭐⭐⭐</span>
                <span className="text-sm text-green-700">4.8/5</span>
              </div>
              <p className="text-sm text-green-700">
                خدمة ممتازة وسائقون محترفون
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportationBooking;
