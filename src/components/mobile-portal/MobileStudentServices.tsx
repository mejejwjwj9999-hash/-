import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  FileText, 
  Users, 
  MapPin, 
  Calendar,
  CreditCard,
  Phone,
  Mail,
  Globe,
  Heart,
  Briefcase,
  GraduationCap,
  Clock,
  Search,
  Star,
  ChevronLeft,
  Plus,
  MessageCircle
} from 'lucide-react';
import DocumentRequestModal from './modals/DocumentRequestModal';
import HealthServiceModal from './modals/HealthServiceModal';
import GeneralServiceModal from './modals/GeneralServiceModal';

const MobileStudentServices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showGeneralModal, setShowGeneralModal] = useState(false);

  const serviceCategories = [
    { id: 'all', name: 'جميع الخدمات', count: 15 },
    { id: 'academic', name: 'أكاديمية', count: 5 },
    { id: 'administrative', name: 'إدارية', count: 4 },
    { id: 'support', name: 'دعم الطلاب', count: 3 },
    { id: 'health', name: 'الصحة', count: 2 },
    { id: 'career', name: 'التوظيف', count: 1 }
  ];

  const services = [
    {
      id: 'digital_library',
      title: 'المكتبة الرقمية',
      description: 'الوصول للكتب والمراجع الإلكترونية والبحث العلمي',
      icon: BookOpen,
      category: 'academic',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      popular: true,
      availability: 'متاح 24/7'
    },
    {
      id: 'document_requests',
      title: 'طلب الوثائق الرسمية',
      description: 'كشف درجات، شهادات قيد، وثائق التخرج',
      icon: FileText,
      category: 'administrative',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      popular: true,
      availability: '3-5 أيام عمل'
    },
    {
      id: 'student_clubs',
      title: 'الأندية الطلابية',
      description: 'انضم للأنشطة الطلابية والفعاليات الاجتماعية',
      icon: Users,
      category: 'support',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      popular: false,
      availability: 'حسب الفعالية'
    },
    {
      id: 'campus_map',
      title: 'خريطة الحرم الجامعي',
      description: 'دليل للمباني والمرافق والخدمات في الحرم',
      icon: MapPin,
      category: 'support',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      popular: false,
      availability: 'فوري'
    },
    {
      id: 'academic_calendar',
      title: 'التقويم الأكاديمي',
      description: 'مواعيد الامتحانات والعطل والفعاليات الأكاديمية',
      icon: Calendar,
      category: 'academic',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      popular: true,
      availability: 'محدث أسبوعياً'
    },
    {
      id: 'payment_services',
      title: 'خدمات الدفع',
      description: 'دفع الرسوم وإدارة المعاملات المالية',
      icon: CreditCard,
      category: 'administrative',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      popular: true,
      availability: 'متاح 24/7'
    },
    {
      id: 'contact_services',
      title: 'التواصل مع الأقسام',
      description: 'أرقام الهاتف والبريد الإلكتروني لجميع الأقسام',
      icon: Phone,
      category: 'support',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      popular: false,
      availability: 'أوقات العمل'
    },
    {
      id: 'health_services',
      title: 'الخدمات الصحية',
      description: 'العيادة الطبية والإسعافات الأولية',
      icon: Heart,
      category: 'health',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      popular: false,
      availability: '8 ص - 4 م'
    },
    {
      id: 'career_guidance',
      title: 'التوجيه المهني',
      description: 'استشارات مهنية وفرص عمل للخريجين',
      icon: Briefcase,
      category: 'career',
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-600',
      popular: false,
      availability: 'بموعد مسبق'
    }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = !searchTerm || 
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const popularServices = services.filter(service => service.popular);

  return (
    <div className="px-4 py-6 space-y-6 bg-gray-50 min-h-screen" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-gray-800">خدمات الطلاب</h1>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Star className="h-3 w-3" />
          {services.length} خدمة
        </Badge>
      </div>

      {/* البحث */}
      <div className="relative">
        <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="ابحث في الخدمات..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* الخدمات الشائعة */}
      {selectedCategory === 'all' && !searchTerm && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">الخدمات الشائعة</h3>
            <Badge variant="outline" className="text-xs">
              {popularServices.length} خدمات
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {popularServices.map((service) => {
              const Icon = service.icon;
              return (
                <Card 
                  key={service.id} 
                  className="border-0 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => {
                    setSelectedService(service);
                    if (service.id === 'document_requests') {
                      setShowDocumentModal(true);
                    } else if (service.id === 'health_services') {
                      setShowHealthModal(true);
                    } else {
                      setShowGeneralModal(true);
                    }
                  }}
                >
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className={`w-10 h-10 ${service.bgColor} rounded-lg flex items-center justify-center mx-auto`}>
                        <Icon className={`h-5 w-5 ${service.textColor}`} />
                      </div>
                      <h4 className="font-semibold text-sm text-center">{service.title}</h4>
                      <div className="flex items-center justify-center">
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {service.availability}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* فئات الخدمات */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-800">الفئات</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {serviceCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap flex items-center gap-1"
            >
              {category.name}
              <Badge variant="secondary" className="text-xs ml-1">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* قائمة جميع الخدمات */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">
            {selectedCategory === 'all' ? 'جميع الخدمات' : 
             serviceCategories.find(c => c.id === selectedCategory)?.name}
          </h3>
          <Badge variant="outline" className="text-xs">
            {filteredServices.length} خدمة
          </Badge>
        </div>

        {filteredServices.length === 0 ? (
          <Card className="text-center py-12 border-dashed border-2">
            <CardContent>
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">لم يتم العثور على خدمات</h3>
              <p className="text-gray-500">جرب البحث بكلمات أخرى أو اختر فئة مختلفة</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredServices.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.id} className="border-0 shadow-md cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 ${service.bgColor} rounded-xl flex items-center justify-center shadow-sm`}>
                        <Icon className={`h-6 w-6 ${service.textColor}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-800 truncate">
                            {service.title}
                          </h4>
                          {service.popular && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              شائع
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">
                          {service.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{service.availability}</span>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => {
                              setSelectedService(service);
                              if (service.id === 'document_requests') {
                                setShowDocumentModal(true);
                              } else if (service.id === 'health_services') {
                                setShowHealthModal(true);
                              } else {
                                setShowGeneralModal(true);
                              }
                            }}
                          >
                            اطلب الخدمة
                            <ChevronLeft className="h-3 w-3 mr-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* مساعدة سريعة */}
      <Card className="border-0 shadow-md bg-gradient-to-l from-primary/5 to-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">تحتاج مساعدة؟</h4>
                <p className="text-sm text-gray-600">تواصل مع خدمة الطلاب</p>
              </div>
            </div>
            <Button size="sm">
              <Phone className="h-4 w-4 mr-2" />
              اتصل بنا
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* نماذج طلب الخدمات */}
      <DocumentRequestModal
        open={showDocumentModal}
        onClose={() => {
          setShowDocumentModal(false);
          setSelectedService(null);
        }}
      />
      
      <HealthServiceModal
        open={showHealthModal}
        onClose={() => {
          setShowHealthModal(false);
          setSelectedService(null);
        }}
      />
      
      <GeneralServiceModal
        open={showGeneralModal}
        onClose={() => {
          setShowGeneralModal(false);
          setSelectedService(null);
        }}
        service={selectedService}
      />
    </div>
  );
};

export default MobileStudentServices;