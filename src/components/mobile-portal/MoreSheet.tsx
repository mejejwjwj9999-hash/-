import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MoreItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<any>;
}

interface MoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  items: MoreItem[];
  onItemSelect: (itemId: string) => void;
  selectedItem: string | null;
}

const MoreSheet: React.FC<MoreSheetProps> = ({
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
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-2xl shadow-large max-h-[70vh] overflow-hidden animate-fadeInUp">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-university-blue/5">
          <h2 className="text-lg font-semibold text-university-blue">المزيد من الخدمات</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-university-blue/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(70vh-80px)]">
          <div className="grid grid-cols-2 gap-3">
            {items.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedItem === item.id;
              
              return (
                <Card 
                  key={item.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-soft ${
                    isSelected 
                      ? 'ring-2 ring-university-blue bg-university-blue/5' 
                      : 'hover:bg-university-blue/5'
                  }`}
                  onClick={() => onItemSelect(item.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="mb-3">
                      <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center ${
                        isSelected 
                          ? 'bg-university-blue text-white' 
                          : 'bg-university-blue/10 text-university-blue'
                      } transition-colors duration-200`}>
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                    <h3 className={`text-sm font-medium ${
                      isSelected ? 'text-university-blue' : 'text-foreground'
                    } transition-colors duration-200`}>
                      {item.label}
                    </h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {items.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">لا توجد خدمات إضافية متاحة</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MoreSheet;