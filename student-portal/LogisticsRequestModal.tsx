
import React, { useState } from 'react';
import { Package, X, MapPin, Clock, CreditCard, Upload, Check, Calendar, Phone } from 'lucide-react';
import { useToast } from '../ui/use-toast';

interface LogisticsRequestModalProps {
  serviceType: string;
  onClose: () => void;
}

const LogisticsRequestModal = ({ serviceType, onClose }: LogisticsRequestModalProps) => {
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    phone: '',
    email: '',
    deliveryAddress: '',
    deliveryTime: '',
    urgencyLevel: 'عادي',
    specialInstructions: '',
    paymentMethod: 'نقدي'
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
      title: "تم تأكيد الطلب",
      description: `طلب ${serviceType} تم إرساله بنجاح. سيتم التواصل معك خلال 30 دقيقة.`,
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-university-blue flex items-center gap-2">
            <Package className="w-6 h-6" />
            طلب {serviceType}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* معلومات الطالب */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-university-blue mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              معلومات الطالب
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">رقم الطالب *</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                  placeholder="أدخل رقم الطالب"
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
                  placeholder="الاسم الكامل"
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
                  placeholder="رقم الهاتف"
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
                  placeholder="البريد الإلكتروني"
                  required
                />
              </div>
            </div>
          </div>

          {/* تفاصيل التوصيل */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-university-blue mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              تفاصيل التوصيل
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">عنوان التوصيل *</label>
                <textarea
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                  placeholder="أدخل العنوان الكامل مع رقم المنزل واسم الحي"
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الوقت المفضل للتوصيل</label>
                  <select
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                  >
                    <option value="">اختر الوقت المناسب</option>
                    <option value="8:00-12:00">صباحاً (8:00-12:00)</option>
                    <option value="12:00-16:00">ظهراً (12:00-16:00)</option>
                    <option value="16:00-20:00">مساءً (16:00-20:00)</option>
                    <option value="أي وقت">أي وقت</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">مستوى الأولوية</label>
                  <select
                    name="urgencyLevel"
                    value={formData.urgencyLevel}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                  >
                    <option value="عادي">عادي (2-3 أيام)</option>
                    <option value="سريع">سريع (24 ساعة)</option>
                    <option value="عاجل">عاجل (6 ساعات)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* طريقة الدفع */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-university-blue mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              طريقة الدفع
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="نقدي"
                  checked={formData.paymentMethod === 'نقدي'}
                  onChange={handleInputChange}
                  className="text-university-blue"
                />
                <span className="text-sm">نقدي عند التسليم</span>
              </label>
              <label className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="بطاقة"
                  checked={formData.paymentMethod === 'بطاقة'}
                  onChange={handleInputChange}
                  className="text-university-blue"
                />
                <span className="text-sm">بطاقة ائتمان</span>
              </label>
              <label className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="تحويل"
                  checked={formData.paymentMethod === 'تحويل'}
                  onChange={handleInputChange}
                  className="text-university-blue"
                />
                <span className="text-sm">تحويل بنكي</span>
              </label>
              <label className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="محفظة"
                  checked={formData.paymentMethod === 'محفظة'}
                  onChange={handleInputChange}
                  className="text-university-blue"
                />
                <span className="text-sm">محفظة إلكترونية</span>
              </label>
            </div>
          </div>

          {/* تعليمات خاصة */}
          <div>
            <label className="block text-sm font-medium mb-2">تعليمات خاصة</label>
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
              placeholder="أي تعليمات إضافية أو ملاحظات خاصة للتوصيل"
            />
          </div>

          {/* معلومات التكلفة */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-university-blue mb-3">تفاصيل التكلفة</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>تكلفة الخدمة:</span>
                <span className="font-semibold">حسب النوع</span>
              </div>
              <div className="flex justify-between">
                <span>رسوم التوصيل:</span>
                <span className="font-semibold">500 ريال</span>
              </div>
              <div className="flex justify-between">
                <span>رسوم إضافية (عاجل):</span>
                <span className="font-semibold">{formData.urgencyLevel === 'عاجل' ? '1000 ريال' : '0 ريال'}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-university-blue">
                <span>المجموع المتوقع:</span>
                <span>سيتم التأكيد عند الطلب</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
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
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  تأكيد الطلب
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogisticsRequestModal;
