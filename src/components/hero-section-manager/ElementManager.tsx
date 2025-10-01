import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HeroElement } from '@/types/heroSection';
import { Plus, Trash2, Copy, Eye, EyeOff, GripVertical } from 'lucide-react';

interface ElementManagerProps {
  elements: HeroElement[];
  selectedElement: string | null;
  onSelectElement: (id: string | null) => void;
  onAddElement: (element: HeroElement) => void;
  onUpdateElement: (id: string, updates: Partial<HeroElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onReorderElements: (startIndex: number, endIndex: number) => void;
  createElement: <T extends HeroElement>(type: T['type'], baseData: Partial<T>) => T;
}

export const ElementManager: React.FC<ElementManagerProps> = ({
  elements,
  selectedElement,
  onSelectElement,
  onAddElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  createElement
}) => {
  const handleAddElement = (type: HeroElement['type']) => {
    const newElement = createElement(type, {
      visible: true,
      className: ''
    });
    onAddElement(newElement);
  };

  const toggleElementVisibility = (id: string, visible: boolean) => {
    onUpdateElement(id, { visible: !visible });
  };

  return (
    <div className="space-y-2">
      {/* Add Element Buttons */}
      <Card>
        <CardContent className="p-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Button size="sm" onClick={() => handleAddElement('text')} className="text-xs">
              <Plus className="w-3 h-3 mr-1" />
              نص
            </Button>
            <Button size="sm" onClick={() => handleAddElement('image')} className="text-xs">
              <Plus className="w-3 h-3 mr-1" />
              صورة
            </Button>
            <Button size="sm" onClick={() => handleAddElement('button')} className="text-xs">
              <Plus className="w-3 h-3 mr-1" />
              زر
            </Button>
            <Button size="sm" onClick={() => handleAddElement('stat')} className="text-xs">
              <Plus className="w-3 h-3 mr-1" />
              إحصائية
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Elements List */}
      <div className="space-y-1">
        {elements.map((element, index) => (
          <Card 
            key={element.id}
            className={`cursor-pointer transition-colors ${
              selectedElement === element.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelectElement(element.id)}
          >
            <CardContent className="p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">{element.elementKey}</div>
                    <Badge variant="outline" className="text-xs">
                      {element.type}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleElementVisibility(element.id, element.visible);
                    }}
                    className="h-6 w-6 p-0"
                  >
                    {element.visible ? (
                      <Eye className="w-3 h-3" />
                    ) : (
                      <EyeOff className="w-3 h-3" />
                    )}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateElement(element.id);
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteElement(element.id);
                    }}
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {elements.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Plus className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">لا توجد عناصر بعد</p>
            <p className="text-xs">اضغط على الأزرار أعلاه لإضافة عناصر</p>
          </div>
        )}
      </div>
    </div>
  );
};