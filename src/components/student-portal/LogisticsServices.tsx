
import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CreditCard, 
  ShoppingCart, 
  FileText, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Home, 
  Car, 
  Utensils, 
  Bed, 
  Book, 
  Shirt, 
  Heart, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Navigation,
  QrCode,
  Bell
} from 'lucide-react';
import { useToast } from '../ui/use-toast';
import LogisticsRequestModal from './LogisticsRequestModal';
import TransportationBooking from './TransportationBooking';
import AccommodationServices from './AccommodationServices';

interface LogisticsServicesProps {
  onTabChange: (tab: string) => void;
}

const LogisticsServices = ({ onTabChange }: LogisticsServicesProps) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState('');
  const { toast } = useToast();

  const handleServiceRequest = (serviceName: string, modalType: string = 'general') => {
    setSelectedService(serviceName);
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedService('');
  };

  // خدمات التوصيل والشحن
  const deliveryServices = [
    {
      title: 'توصيل الوثائق الأكاديمية',
      description: 'توصيل الشهادات وكشوف الدرجات إلى منزلك',
      icon: Package,
      price: '1500 ريال',
      time: '24-48 ساعة',
      action: () => handleServiceRequest('توصيل الوثائق الأكاديمية'),
      badge: 'سريع'
    },
    {
      title: 'توصيل الكتب والمراجع',
      description: 'طلب وتوصيل الكتب الدراسية والمراجع',
      icon: Book,
      price: '2000 ريال',
      time: '2-3 أيام',
      action: () => handleServiceRequest('توصيل الكتب والمراجع'),
      badge: 'مفيد'
    },
    {
      title: 'توصيل الزي الجامعي',
      description: 'طلب وتوصيل الزي الرسمي والمعاطف',
      icon: Shirt,
      price: '3000 ريال',
      time: '3-5 أيام',
      action: () => handleServiceRequest('توصيل الزي الجامعي'),
      badge: 'شائع'
    },
    {
      title: 'خدمة الشحن السريع',
      description: 'شحن عاجل للمستندات المهمة',
      icon: Truck,
      price: '2500 ريال',
      time: '6-12 ساعة',
      action: () => handleServiceRequest('الشحن السريع'),
      badge: 'عاجل'
    }
  ];

  // خدمات النقل والمواصلات
  const transportServices = [
    {
      title: 'حجز باص الجامعة',
      description: 'حجز مقعد في باص الجامعة اليومي',
      icon: Car,
      price: '500 ريال/يوم',
      time: 'فوري',
      action: () => handleServiceRequest('حجز باص الجامعة', 'transportation'),
      badge: 'يومي'
    },
    {
      title: 'نقل للفعاليات الخاصة',
      description: 'نقل مخصص للمؤتمرات والفعاليات',
      icon: Navigation,
      price: '1000 ريال',
      time: 'بالحجز المسبق',
      action: () => handleServiceRequest('نقل للفعاليات', 'transportation'),
      badge: 'خاص'
    },
    {
      title: 'خدمة التاكسي الجامعي',
      description: 'تاكسي مخصص للطوارئ والحالات العاجلة',
      icon: Car,
      price: '1200 ريال',
      time: '15-30 دقيقة',
      action: () => handleServiceRequest('التاكسي الجامعي', 'transportation'),
      badge: 'طوارئ'
    },
    {
      title: 'رحلات جماعية',
      description: 'رحلات علمية وترفيهية منظمة',
      icon: Truck,
      price: '3000 ريال',
      time: 'حسب الجدولة',
      action: () => handleServiceRequest('رحلات جماعية', 'transportation'),
      badge: 'جماعي'
    }
  ];

  // خدمات الإقامة والسكن
  const accommodationServices = [
    {
      title: 'حجز السكن الجامعي',
      description: 'حجز غرفة في السكن الداخلي',
      icon: Bed,
      price: '15000 ريال/شهر',
      time: 'فوري',
      action: () => handleServiceRequest('حجز السكن الجامعي', 'accommodation'),
      badge: 'شهري'
    },
    {
      title: 'صيانة السكن',
      description: 'طلب صيانة للمرافق في السكن',
      icon: Home,
      price: 'مجاني',
      time: '24-48 ساعة',
      action: () => handleServiceRequest('صيانة السكن', 'accommodation'),
      badge: 'مجاني'
    },
    {
      title: 'خدمة التنظيف',
      description: 'تنظيف الغرف والمرافق العامة',
      icon: Shield,
      price: '800 ريال/أسبوع',
      time: 'مجدولة',
      action: () => handleServiceRequest('خدمة التنظيف', 'accommodation'),
      badge: 'أسبوعي'
    },
    {
      title: 'خدمة الغسيل',
      description: 'غسيل وكي الملابس',
      icon: Shirt,
      price: '500 ريال/حمولة',
      time: '24 ساعة',
      action: () => handleServiceRequest('خدمة الغسيل', 'accommodation'),
      badge: 'يومي'
    }
  ];

  // خدمات الطعام والتموين
  const foodServices = [
    {
      title: 'اشتراك الكافتيريا',
      description: 'اشتراك شهري في كافتيريا الجامعة',
      icon: Utensils,
      price: '8000 ريال/شهر',
      time: 'فوري',
      action: () => handleServiceRequest('اشتراك الكافتيريا'),
      badge: 'شهري'
    },
    {
      title: 'طلب وجبات خاصة',
      description: 'وجبات مخصصة للحميات الغذائية',
      icon: Heart,
      price: '300 ريال/وجبة',
      time: '2-4 ساعات',
      action: () => handleServiceRequest('وجبات خاصة'),
      badge: 'صحي'
    },
    {
      title: 'خدمة التوصيل للسكن',
      description: 'توصيل الوجبات للسكن الجامعي',
      icon: Package,
      price: '150 ريال رسوم توصيل',
      time: '30-45 دقيقة',
      action: () => handleServiceRequest('توصيل للسكن'),
      badge: 'سريع'
    },
    {
      title: 'حفلات التخرج',
      description: 'تنظيم وجبات حفلات التخرج',
      icon: Calendar,
      price: 'حسب العدد',
      time: 'بالحجز المسبق',
      action: () => handleServiceRequest('حفلات التخرج'),
      badge: 'خاص'
    }
  ];

  const ServiceSection = ({ 
    title, 
    services, 
    icon: SectionIcon,
    bgColor = 'bg-gray-50' 
  }: { 
    title: string; 
    services: any[]; 
    icon: any;
    bgColor?: string;
  }) => (
    <div className={`p-6 rounded-lg ${bgColor} border border-gray-200`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-university-blue rounded-full flex items-center justify-center">
          <SectionIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-university-blue">{title}</h3>
          <p className="text-sm text-academic-gray">{services.length} خدمة متاحة</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {services.map((service, index) => (
          <button
            key={index}
            onClick={service.action}
            className="card-elevated hover:shadow-lg transition-all duration-200 text-right p-4 group relative overflow-hidden"
          >
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                service.badge === 'سريع' || service.badge === 'عاجل' ? 'bg-red-100 text-red-700' :
                service.badge === 'مجاني' ? 'bg-green-100 text-green-700' :
                service.badge === 'شائع' || service.badge === 'مفيد' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {service.badge}
              </span>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-university-blue-light rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <service.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-university-blue mb-2 text-right">{service.title}</h4>
                <p className="text-sm text-academic-gray mb-3 text-right">{service.description}</p>
                <div className="flex flex-wrap gap-2 text-xs justify-end">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {service.time}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                    <CreditCard className="w-3 h-3" />
                    {service.price}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-section-title mb-4">الخدمات اللوجستية</h2>
          <p className="text-academic-gray max-w-2xl mx-auto">
            خدمات متكاملة لتسهيل حياتك الجامعية من النقل والإقامة والتوصيل والطعام
          </p>
        </div>

        {/* إحصائيات الخدمات */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card-elevated text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-university-blue">16</h3>
            <p className="text-academic-gray">خدمة لوجستية</p>
          </div>
          <div className="card-elevated text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-university-blue">89</h3>
            <p className="text-academic-gray">طلب مكتمل اليوم</p>
          </div>
          <div className="card-elevated text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-university-blue">12</h3>
            <p className="text-academic-gray">طلب قيد التنفيذ</p>
          </div>
          <div className="card-elevated text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-university-blue">2.3</h3>
            <p className="text-academic-gray">ساعة متوسط التسليم</p>
          </div>
        </div>

        <ServiceSection 
          title="خدمات التوصيل والشحن" 
          services={deliveryServices}
          icon={Package}
          bgColor="bg-blue-50"
        />

        <ServiceSection 
          title="خدمات النقل والمواصلات" 
          services={transportServices}
          icon={Car}
          bgColor="bg-green-50"
        />

        <ServiceSection 
          title="خدمات الإقامة والسكن" 
          services={accommodationServices}
          icon={Bed}
          bgColor="bg-purple-50"
        />

        <ServiceSection 
          title="خدمات الطعام والتموين" 
          services={foodServices}
          icon={Utensils}
          bgColor="bg-orange-50"
        />

        {/* خدمات إضافية مميزة */}
        <div className="card-elevated">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-university-blue mb-2">خدمات إضافية مميزة</h3>
            <p className="text-academic-gray">خدمات حصرية لتحسين تجربتك الجامعية</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
              <div className="flex items-center gap-3 mb-3">
                <QrCode className="w-8 h-8 text-university-blue" />
                <h4 className="font-semibold text-university-blue">نظام QR للخدمات</h4>
              </div>
              <p className="text-sm text-academic-gray mb-3">
                طلب الخدمات بسهولة عبر مسح الباركود
              </p>
              <button 
                onClick={() => toast({ title: "قريباً", description: "هذه الخدمة ستكون متاحة قريباً" })}
                className="text-sm text-university-blue hover:underline"
              >
                تعرف أكثر ←
              </button>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
              <div className="flex items-center gap-3 mb-3">
                <Bell className="w-8 h-8 text-green-600" />
                <h4 className="font-semibold text-green-600">إشعارات فورية</h4>
              </div>
              <p className="text-sm text-academic-gray mb-3">
                تنبيهات فورية لحالة طلباتك
              </p>
              <button 
                onClick={() => toast({ title: "تم التفعيل", description: "سيتم إرسال الإشعارات لهاتفك" })}
                className="text-sm text-green-600 hover:underline"
              >
                فعّل الإشعارات ←
              </button>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-8 h-8 text-orange-600" />
                <h4 className="font-semibold text-orange-600">تتبع مباشر</h4>
              </div>
              <p className="text-sm text-academic-gray mb-3">
                تتبع موقع طلبك في الوقت الفعلي
              </p>
              <button 
                onClick={() => toast({ title: "التتبع المباشر", description: "يمكنك تتبع جميع طلباتك الآن" })}
                className="text-sm text-orange-600 hover:underline"
              >
                ابدأ التتبع ←
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* النوافذ المنبثقة */}
      {activeModal === 'general' && (
        <LogisticsRequestModal
          serviceType={selectedService}
          onClose={closeModal}
        />
      )}

      {activeModal === 'transportation' && (
        <TransportationBooking
          serviceType={selectedService}
          onClose={closeModal}
        />
      )}

      {activeModal === 'accommodation' && (
        <AccommodationServices
          serviceType={selectedService}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default LogisticsServices;
