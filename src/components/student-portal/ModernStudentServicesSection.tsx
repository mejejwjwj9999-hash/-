import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import AvailableServicesGrid from './AvailableServicesGrid';
import ServiceModal from './ServiceModal';

interface ModernStudentServicesSectionProps {
  onTabChange?: (tab: string) => void;
}

const ModernStudentServicesSection: React.FC<ModernStudentServicesSectionProps> = ({ onTabChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  const categories = [
    { id: 'all', label: 'جميع الخدمات' },
    { id: 'academic', label: 'أكاديمية' },
    { id: 'financial', label: 'مالية' },
    { id: 'administrative', label: 'إدارية' },
    { id: 'technical', label: 'تقنية' },
  ];

  const handleServiceClick = (serviceId: string) => {
    const serviceData = {
      id: serviceId,
      title: 'خدمة طلابية',
      description: 'وصف الخدمة المطلوبة',
      category: 'general',
      icon: FileText,
    };
    
    setSelectedService(serviceData);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-primary mb-2">
                الخدمات الطلابية
              </CardTitle>
              <p className="text-muted-foreground">
                تصفح واستخدم جميع الخدمات المتاحة لك كطالب
              </p>
            </div>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-mobile-auth-button hover:bg-mobile-auth-button-hover text-white"
            >
              <Plus className="h-4 w-4 ml-2" />
              طلب خدمة جديدة
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Search and Filter */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="البحث في الخدمات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="text-sm"
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <AvailableServicesGrid 
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        onServiceClick={handleServiceClick}
      />

      {/* Service Modal */}
      {isModalOpen && (
        <ServiceModal
          isOpen={true}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedService(null);
          }}
          service={selectedService || {
            id: 'general',
            title: 'طلب خدمة عامة',
            description: 'تقديم طلب خدمة جديدة',
            category: 'general',
            icon: FileText,
          }}
        />
      )}
    </div>
  );
};

export default ModernStudentServicesSection;
