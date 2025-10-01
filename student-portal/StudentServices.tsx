
import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Clock, 
  CreditCard, 
  DollarSign, 
  Award, 
  GraduationCap, 
  BookOpen, 
  MessageSquare, 
  Home, 
  Bus, 
  Package, 
  HelpCircle, 
  Users, 
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  ArrowLeftRight,
  UserCheck,
  CopyCheck,
  Percent,
  Receipt,
  Calculator,
  IdCard,
  FileCheck,
  Mail,
  UserCircle,
  Workflow,
  Book,
  Headphones,
  Brain,
  Ticket,
  Building,
  Activity,
  MessageCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ServiceModal from './ServiceModal';
import YemenPaymentSystem from './YemenPaymentSystem';

interface StudentServicesProps {
  onTabChange?: (tab: string) => void;
}

const StudentServices = ({ onTabChange }: StudentServicesProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showPaymentSystem, setShowPaymentSystem] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const services = [
    // خدمات أكاديمية
    {
      id: 'grades',
      title: 'كشف الدرجات',
      description: 'عرض وطباعة كشف الدرجات الأكاديمي',
      icon: FileText,
      category: 'academic',
      action: 'grades',
      isActive: true
    },
    {
      id: 'transcript_request',
      title: 'طلب كشف درجات رسمي',
      description: 'نسخة مختومة من كشف الدرجات (PDF/ورقي)',
      icon: CopyCheck,
      category: 'academic',
      action: 'form',
      isActive: true
    },
    {
      id: 'subject_equivalency',
      title: 'طلب معادلة مواد',
      description: 'معادلة مواد بين تخصصات أو جامعات',
      icon: ArrowLeftRight,
      category: 'academic',
      action: 'form',
      isActive: true
    },
    {
      id: 'major_transfer',
      title: 'تحويل تخصص',
      description: 'طلب تحويل إلى تخصص آخر داخل أو خارج الكلية',
      icon: RefreshCw,
      category: 'academic',
      action: 'form',
      isActive: true
    },
    {
      id: 'alternative_course',
      title: 'تسجيل مقرر بديل',
      description: 'تسجيل مقرر بديل في حال تعارض أو رسوب',
      icon: Calendar,
      category: 'academic',
      action: 'form',
      isActive: true
    },
    {
      id: 'semester_deferral',
      title: 'اعتذار/تأجيل فصل',
      description: 'تقديم طلب اعتذار أو تأجيل فصل دراسي',
      icon: Clock,
      category: 'academic',
      action: 'form',
      isActive: true
    },
    {
      id: 'library',
      title: 'المكتبة الرقمية',
      description: 'الوصول إلى الكتب والمراجع الإلكترونية',
      icon: BookOpen,
      category: 'academic',
      action: 'library',
      isActive: true
    },
    {
      id: 'ai_recommendations',
      title: 'التوصيات الذكية',
      description: 'اقتراحات ذكية للمقررات بناءً على أدائك',
      icon: Brain,
      category: 'academic',
      action: 'form',
      isActive: false
    },

    // خدمات مالية
    {
      id: 'payment',
      title: 'الدفع الإلكتروني',
      description: 'دفع الرسوم عبر بوابات دفع محلية ودولية',
      icon: CreditCard,
      category: 'financial',
      action: 'payment',
      isActive: true
    },
    {
      id: 'installment_request',
      title: 'طلب تقسيط الرسوم',
      description: 'تقديم طلب تقسيط أو منحة جزئية',
      icon: Percent,
      category: 'financial',
      action: 'form',
      isActive: true
    },
    {
      id: 'payment_receipt',
      title: 'إيصال دفع إلكتروني',
      description: 'إصدار وطباعة إيصال دفع',
      icon: Receipt,
      category: 'financial',
      action: 'form',
      isActive: true
    },
    {
      id: 'financial_statement',
      title: 'الاستعلام المالي',
      description: 'عرض الرصيد والغرامات والمستحقات',
      icon: Calculator,
      category: 'financial',
      action: 'financial',
      isActive: true
    },

    // خدمات إدارية
    {
      id: 'university_card',
      title: 'طلب بطاقة جامعية',
      description: 'إصدار بطاقة جديدة أو بدل فاقد/تالف',
      icon: IdCard,
      category: 'administrative',
      action: 'form',
      isActive: true
    },
    {
      id: 'introduction_letter',
      title: 'خطاب تعريف',
      description: 'خطاب تعريف للبنوك أو السفارات',
      icon: Mail,
      category: 'administrative',
      action: 'form',
      isActive: true
    },
    {
      id: 'certificate_request',
      title: 'طلب شهادات',
      description: 'إفادة انتظام أو إفادة خريج',
      icon: Award,
      category: 'administrative',
      action: 'form',
      isActive: true
    },
    {
      id: 'study_certificate',
      title: 'شهادة دراسة',
      description: 'طلب شهادة إثبات الدراسة',
      icon: GraduationCap,
      category: 'administrative',
      action: 'form',
      isActive: true
    },
    {
      id: 'appointment_booking',
      title: 'حجز موعد',
      description: 'حجز موعد مع مرشد أكاديمي أو شؤون الطلاب',
      icon: UserCircle,
      category: 'administrative',
      action: 'form',
      isActive: true
    },
    {
      id: 'workflow_tracking',
      title: 'متابعة المعاملات',
      description: 'تتبع حالة معاملاتك والطلبات المقدمة',
      icon: Workflow,
      category: 'administrative',
      action: 'form',
      isActive: true
    },

    // خدمات دعم الطالب
    {
      id: 'academic_support',
      title: 'الدعم الأكاديمي',
      description: 'دروس تقوية ومركز تطوير المهارات',
      icon: Users,
      category: 'support',
      action: 'form',
      isActive: true
    },
    {
      id: 'library_services',
      title: 'خدمات المكتبة',
      description: 'حجز كتاب أو استعارة إلكترونية',
      icon: Book,
      category: 'support',
      action: 'form',
      isActive: true
    },
    {
      id: 'technical_support',
      title: 'الدعم التقني',
      description: 'حل مشاكل النظام والبريد الجامعي',
      icon: Headphones,
      category: 'support',
      action: 'form',
      isActive: true
    },
    {
      id: 'academic_advising',
      title: 'الإرشاد الأكاديمي',
      description: 'التواصل مع المرشد الأكاديمي أو الأساتذة',
      icon: MessageCircle,
      category: 'support',
      action: 'form',
      isActive: true
    },
    {
      id: 'helpdesk',
      title: 'تذاكر الدعم الفني',
      description: 'نظام تذاكر للدعم التقني المتخصص',
      icon: Ticket,
      category: 'support',
      action: 'form',
      isActive: true
    },

    // خدمات إضافية
    {
      id: 'accommodation',
      title: 'طلب سكن جامعي',
      description: 'التقديم على السكن الجامعي',
      icon: Building,
      category: 'additional',
      action: 'form',
      isActive: true
    },
    {
      id: 'activities',
      title: 'الأنشطة الطلابية',
      description: 'التقديم على الأنشطة والأندية الطلابية',
      icon: Activity,
      category: 'additional',
      action: 'form',
      isActive: true
    },
    {
      id: 'transportation',
      title: 'خدمات النقل',
      description: 'حجز المواصلات الجامعية',
      icon: Bus,
      category: 'additional',
      action: 'form',
      isActive: true
    },
    {
      id: 'surveys',
      title: 'الاستبيانات',
      description: 'استطلاعات رضا الطلاب والتقييمات',
      icon: FileCheck,
      category: 'additional',
      action: 'form',
      isActive: true
    },
    {
      id: 'complaint',
      title: 'تقديم شكوى',
      description: 'تقديم شكوى أو اقتراح للإدارة',
      icon: AlertTriangle,
      category: 'additional',
      action: 'form',
      isActive: true
    }
  ];

  const categories = [
    { id: 'all', name: 'جميع الخدمات', icon: FileText },
    { id: 'academic', name: 'أكاديمية', icon: GraduationCap },
    { id: 'financial', name: 'مالية', icon: DollarSign },
    { id: 'administrative', name: 'إدارية', icon: UserCheck },
    { id: 'support', name: 'دعم الطالب', icon: HelpCircle },
    { id: 'additional', name: 'خدمات إضافية', icon: Package }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getServicesByCategory = (categoryId: string) => {
    return services.filter(service => service.category === categoryId);
  };

  const handleServiceClick = (service: any) => {
    if (service.id === 'payment' || service.action === 'payment') {
      setShowPaymentSystem(true);
      return;
    }
    
    setSelectedService(service);
    setShowModal(true);
  };

  const handleBack = () => {
    setShowPaymentSystem(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container-custom py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">الخدمات الطلابية</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            احصل على جميع الخدمات الجامعية بسهولة ويسر من مكان واحد
          </p>
        </div>

        {showPaymentSystem ? (
          <YemenPaymentSystem onBack={handleBack} />
        ) : (
          <>
            {/* Search and Filter */}
            <div className="space-y-4">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="البحث في الخدمات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 rounded-xl border-muted-foreground/20 focus:border-primary"
                />
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="rounded-full gap-2"
                  >
                    <category.icon className="w-4 h-4" />
                    {category.name}
                    <Badge variant="secondary" className="text-xs">
                      {category.id === 'all' ? services.length : getServicesByCategory(category.id).length}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServices.map((service) => (
                <Card 
                  key={service.id} 
                  className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-card to-card/80 cursor-pointer"
                  onClick={() => handleServiceClick(service)}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="flex justify-between items-start mb-4">
                      <Badge 
                        variant="outline" 
                        className="text-xs border-primary/20 bg-primary/5 text-primary"
                      >
                        {categories.find(c => c.id === service.category)?.name}
                      </Badge>
                      {!service.isActive && (
                        <Badge variant="secondary" className="text-xs bg-muted">
                          قريباً
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <service.icon className="w-8 h-8 text-primary" />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-bold text-lg text-foreground">{service.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                      </div>
                    </div>
                    
                    <Button 
                      variant={service.isActive ? "default" : "secondary"}
                      disabled={!service.isActive}
                      className="w-full rounded-xl py-3 font-semibold transition-all duration-300"
                    >
                      {service.isActive ? 'الوصول للخدمة' : 'قريباً'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <Card className="border-dashed border-2 border-muted-foreground/20">
                <CardContent className="p-12 text-center">
                  <Search className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="font-medium text-foreground mb-2">لا توجد خدمات</h3>
                  <p className="text-muted-foreground">
                    لم يتم العثور على خدمات تطابق البحث أو الفئة المحددة
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        <ServiceModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          service={selectedService}
        />
      </div>
    </div>
  );
};

export default StudentServices;
