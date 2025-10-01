
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  category: string;
  isActive: boolean;
  onClick: () => void;
}

const ServiceCard = ({ icon: Icon, title, description, category, isActive, onClick }: ServiceCardProps) => {
  const categoryColors = {
    academic: 'bg-primary/5 text-primary border-primary/20',
    financial: 'bg-green-500/5 text-green-700 border-green-500/20',
    administrative: 'bg-blue-500/5 text-blue-700 border-blue-500/20',
    support: 'bg-orange-500/5 text-orange-700 border-orange-500/20',
    additional: 'bg-purple-500/5 text-purple-700 border-purple-500/20',
    general: 'bg-muted text-muted-foreground border-muted-foreground/20',
  };

  const categoryLabels = {
    academic: 'أكاديمي',
    financial: 'مالي',
    administrative: 'إداري',
    support: 'دعم',
    additional: 'إضافي',
    general: 'عام'
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-card to-card/80 cursor-pointer">
      <CardContent className="p-6 text-center space-y-4" onClick={onClick}>
        <div className="flex justify-between items-start">
          <Badge 
            variant="outline" 
            className={`text-xs ${categoryColors[category as keyof typeof categoryColors] || categoryColors.general}`}
          >
            {categoryLabels[category as keyof typeof categoryLabels] || 'عام'}
          </Badge>
          {!isActive && (
            <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
              قريباً
            </Badge>
          )}
        </div>
        
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </div>
        
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          variant={isActive ? "default" : "secondary"}
          disabled={!isActive}
          className="w-full rounded-xl py-3 font-semibold transition-all duration-300"
        >
          {isActive ? 'الوصول للخدمة' : 'قريباً'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
