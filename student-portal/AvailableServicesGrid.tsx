
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAvailableServices } from '@/hooks/useAvailableServices';
import { 
  FileText, 
  Calendar, 
  Clock, 
  CreditCard, 
  DollarSign, 
  Award, 
  BookOpen, 
  HelpCircle,
  Loader2,
  AlertCircle,
  User,
  Home,
  Car,
  UserX
} from 'lucide-react';

const iconMap = {
  FileText,
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  Award,
  BookOpen,
  HelpCircle,
  User,
  Home,
  Car,
  UserX,
};

const categoryColors = {
  academic: 'bg-blue-50 border-blue-200 text-blue-800',
  financial: 'bg-green-50 border-green-200 text-green-800',
  documents: 'bg-purple-50 border-purple-200 text-purple-800',
  support: 'bg-orange-50 border-orange-200 text-orange-800',
  services: 'bg-cyan-50 border-cyan-200 text-cyan-800',
  general: 'bg-gray-50 border-gray-200 text-gray-800',
};

const categoryNames = {
  academic: 'أكاديمي',
  financial: 'مالي',
  documents: 'الوثائق',
  support: 'الدعم',
  services: 'الخدمات',
  general: 'عام',
};

interface AvailableServicesGridProps {
  searchTerm?: string;
  selectedCategory?: string;
  onServiceClick?: (serviceId: string) => void;
}

const AvailableServicesGrid = ({ 
  searchTerm = '', 
  selectedCategory = 'all', 
  onServiceClick 
}: AvailableServicesGridProps) => {
  const { data: services, isLoading, error } = useAvailableServices();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2">جاري تحميل الخدمات...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-destructive mb-2">
          خطأ في تحميل الخدمات
        </h3>
        <p className="text-muted-foreground">
          يرجى المحاولة مرة أخرى أو التواصل مع الدعم التقني
        </p>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="text-center p-8">
        <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          لا توجد خدمات متاحة حالياً
        </h3>
        <p className="text-muted-foreground">
          سيتم إضافة الخدمات قريباً
        </p>
      </div>
    );
  }

  const handleServiceClick = (serviceId: string) => {
    console.log(`Service clicked: ${serviceId}`);
    if (onServiceClick) {
      onServiceClick(serviceId);
    }
  };

  // Filter services based on search term and category
  const filteredServices = services?.filter((service) => {
    const matchesSearch = searchTerm === '' || 
      service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.service_description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredServices.map((service) => {
        const IconComponent = iconMap[service.icon_name as keyof typeof iconMap] || HelpCircle;
        const categoryClass = categoryColors[service.category as keyof typeof categoryColors] || categoryColors.general;
        const categoryName = categoryNames[service.category as keyof typeof categoryNames] || 'عام';

        return (
          <Card key={service.id} className="hover:shadow-lg transition-all duration-200 group cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="outline" className={`text-xs ${categoryClass}`}>
                    {categoryName}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-lg text-right">{service.service_name}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground text-right mb-4 leading-relaxed">
                {service.service_description}
              </p>
              <Button 
                className="w-full"
                onClick={() => handleServiceClick(service.service_id)}
              >
                الوصول للخدمة
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AvailableServicesGrid;
