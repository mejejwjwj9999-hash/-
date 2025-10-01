import React from 'react';
import { X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MoreItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<any>;
}

interface AdminMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  items: MoreItem[];
  onItemSelect: (itemId: string) => void;
  selectedItem: string | null;
}

const AdminMoreSheet: React.FC<AdminMoreSheetProps> = ({
  isOpen,
  onClose,
  items,
  onItemSelect,
  selectedItem
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity animate-fade-in"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-large max-h-[75vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-university-blue/10 bg-gradient-to-r from-university-blue/5 to-university-blue/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-university-blue/10 rounded-xl">
              <Shield className="h-5 w-5 text-university-blue" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-university-blue">المزيد من الأدوات الإدارية</h2>
              <p className="text-sm text-academic-gray">أدوات متقدمة لإدارة النظام</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-10 w-10 p-0 hover:bg-university-blue/10 rounded-xl"
          >
            <X className="h-5 w-5 text-university-blue" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(75vh-100px)]">
          <div className="grid grid-cols-2 gap-4">
            {items.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedItem === item.id;
              
              return (
                <Card 
                  key={item.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-elegant border-2 ${
                    isSelected 
                      ? 'ring-2 ring-university-blue bg-gradient-to-br from-university-blue/5 to-university-blue/10 border-university-blue/30' 
                      : 'border-university-blue/10 hover:border-university-blue/30 hover:bg-university-blue/5'
                  }`}
                  onClick={() => onItemSelect(item.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="mb-4">
                      <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isSelected 
                          ? 'bg-university-blue text-white shadow-elegant' 
                          : 'bg-university-blue/10 text-university-blue group-hover:bg-university-blue/20'
                      }`}>
                        <Icon className="h-7 w-7" />
                      </div>
                    </div>
                    <h3 className={`text-sm font-semibold mb-1 transition-colors duration-300 ${
                      isSelected ? 'text-university-blue' : 'text-foreground'
                    }`}>
                      {item.label}
                    </h3>
                    {isSelected && (
                      <Badge variant="outline" className="text-xs bg-university-blue/10 text-university-blue border-university-blue/30">
                        نشط
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {items.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-university-blue/10 rounded-2xl flex items-center justify-center">
                <Shield className="h-8 w-8 text-university-blue/40" />
              </div>
              <p className="text-academic-gray font-medium">لا توجد أدوات إضافية متاحة</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminMoreSheet;