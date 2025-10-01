
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText,
  CreditCard,
  Calendar,
  UserCheck,
  GraduationCap,
  BookOpen,
  Phone,
  HelpCircle,
  Clock,
  Mail,
  Download,
  Upload,
  Users,
  Building,
  Award
} from 'lucide-react';
import ServiceRequestModal from './ServiceRequestModal';
import AbsenceRequestForm from './AbsenceRequestForm';

const StudentServicesGrid = () => {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showAbsenceForm, setShowAbsenceForm] = useState(false);

  const services = [
    {
      id: 'transcript',
      title: 'كشف الدرجات',
      description: 'طلب كشف درجات أكاديمي رسمي',
      icon: FileText,
      category: 'documents',
      isActive: true,
    },
    {
      id: 'certificate',
      title: 'شهادة التخرج',
      description: 'طلب شهادة تخرج أو وثيقة رسمية',
      icon: GraduationCap,
      category: 'documents',
      isActive: true,
    },
    {
      id: 'enrollment',
      title: 'إفادة قيد',
      description: 'إفادة بالقيد والانتساب للجامعة',
      icon: UserCheck,
      category: 'documents',
      isActive: true,
    },
    {
      id: 'payment_receipt',
      title: 'إيصال دفع',
      description: 'طلب إيصال دفع أو كشف حساب مالي',
      icon: CreditCard,
      category: 'financial',
      isActive: true,
    },
    {
      id: 'schedule_change',
      title: 'تعديل الجدول',
      description: 'طلب تعديل في الجدول الدراسي',
      icon: Calendar,
      category: 'academic',
      isActive: true,
    },
    {
      id: 'absence_request',
      title: 'طلب غياب',
      description: 'تقديم طلب غياب مبرر',
      icon: Clock,
      category: 'academic',
      isActive: true,
      special: 'absence'
    },
    {
      id: 'recommendation_letter',
      title: 'خطاب توصية',
      description: 'طلب خطاب توصية من عضو هيئة التدريس',
      icon: Mail,
      category: 'documents',
      isActive: true,
    },
    {
      id: 'course_registration',
      title: 'تسجيل المقررات',
      description: 'طلب مساعدة في تسجيل المقررات',
      icon: BookOpen,
      category: 'academic',
      isActive: true,
    },
    {
      id: 'technical_support',
      title: 'الدعم التقني',
      description: 'طلب مساعدة تقنية أو حل مشاكل النظام',
      icon: HelpCircle,
      category: 'support',
      isActive: true,
    },
    {
      id: 'contact_admin',
      title: 'التواصل مع الإدارة',
      description: 'إرسال رسالة أو استفسار للإدارة',
      icon: Phone,
      category: 'support',
      isActive: true,
    },
    {
      id: 'document_verification',
      title: 'توثيق الوثائق',
      description: 'طلب توثيق أو تصديق للوثائق',
      icon: Award,
      category: 'documents',
      isActive: true,
    },
    {
      id: 'library_services',
      title: 'خدمات المكتبة',
      description: 'طلب خدمات مكتبية أو استعارة كتب',
      icon: Building,
      category: 'support',
      isActive: true,
    }
  ];

  const categoryColors = {
    academic: 'bg-blue-50 text-blue-700 border-blue-200',
    financial: 'bg-green-50 text-green-700 border-green-200',
    documents: 'bg-purple-50 text-purple-700 border-purple-200',
    support: 'bg-orange-50 text-orange-700 border-orange-200',
  };

  const handleServiceClick = (service: any) => {
    if (service.special === 'absence') {
      setShowAbsenceForm(true);
    } else {
      setSelectedService(service);
      setShowRequestModal(true);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">الخدمات الطلابية</h2>
        <p className="text-gray-600">اختر الخدمة التي تريد طلبها</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Card 
              key={service.id} 
              className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-gray-50/50 cursor-pointer"
              onClick={() => handleServiceClick(service)}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="flex justify-between items-start mb-4">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${categoryColors[service.category as keyof typeof categoryColors]}`}
                  >
                    {service.category === 'academic' && 'أكاديمي'}
                    {service.category === 'financial' && 'مالي'}
                    {service.category === 'documents' && 'وثائق'}
                    {service.category === 'support' && 'دعم'}
                  </Badge>
                  {!service.isActive && (
                    <Badge variant="secondary" className="text-xs">
                      قريباً
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-gray-800">{service.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Service Request Modal */}
      {showRequestModal && selectedService && (
        <ServiceRequestModal
          isOpen={showRequestModal}
          onClose={() => {
            setShowRequestModal(false);
            setSelectedService(null);
          }}
          serviceData={selectedService}
        />
      )}

      {/* Absence Request Form */}
      <AbsenceRequestForm
        isOpen={showAbsenceForm}
        onClose={() => setShowAbsenceForm(false)}
      />
    </div>
  );
};

export default StudentServicesGrid;
