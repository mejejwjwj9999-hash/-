import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HeroElement, HeroSectionConfig } from '@/types/heroSection';
import { Palette, Type, Image, MousePointer, BarChart3, Layout, Layers } from 'lucide-react';

interface HeroSectionControlPanelProps {
  config: HeroSectionConfig | null;
  elements: HeroElement[];
  onUpdateElement: (id: string, updates: Partial<HeroElement>) => void;
}

export const HeroSectionControlPanel: React.FC<HeroSectionControlPanelProps> = ({
  config,
  elements,
  onUpdateElement
}) => {
  const getElementsByType = (type: HeroElement['type']) => {
    return elements.filter(el => el.type === type);
  };

  const getTypeIcon = (type: HeroElement['type']) => {
    switch (type) {
      case 'text':
      case 'rich_text':
        return <Type className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'button':
        return <MousePointer className="w-4 h-4" />;
      case 'stat':
        return <BarChart3 className="w-4 h-4" />;
      case 'layout':
        return <Layout className="w-4 h-4" />;
      case 'background':
        return <Layers className="w-4 h-4" />;
      default:
        return <Palette className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: HeroElement['type']) => {
    switch (type) {
      case 'text':
        return 'نص عادي';
      case 'rich_text':
        return 'نص منسق';
      case 'image':
        return 'صورة';
      case 'button':
        return 'زر';
      case 'icon':
        return 'أيقونة';
      case 'stat':
        return 'إحصائية';
      case 'layout':
        return 'تخطيط';
      case 'background':
        return 'خلفية';
      default:
        return type;
    }
  };

  const elementTypes: HeroElement['type'][] = [
    'text', 'rich_text', 'image', 'button', 'icon', 'stat', 'background', 'layout'
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="w-5 h-5" />
            لوحة التحكم في التصميم
          </CardTitle>
        </CardHeader>
        <CardContent>
          {config ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">اسم القسم:</span>
                  <p className="text-muted-foreground">{config.name}</p>
                </div>
                <div>
                  <span className="font-medium">المظهر:</span>
                  <p className="text-muted-foreground">{config.settings.theme}</p>
                </div>
                <div>
                  <span className="font-medium">اللغة:</span>
                  <p className="text-muted-foreground">{config.settings.language}</p>
                </div>
                <div>
                  <span className="font-medium">استجابة:</span>
                  <p className="text-muted-foreground">{config.settings.responsive ? 'مفعل' : 'معطل'}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">لا توجد إعدادات متاحة</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ملخص العناصر</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {elementTypes.map(type => {
              const typeElements = getElementsByType(type);
              if (typeElements.length === 0) return null;
              
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(type)}
                    <span className="font-medium">{getTypeLabel(type)}</span>
                  </div>
                  <Badge variant="secondary">
                    {typeElements.length}
                  </Badge>
                </div>
              );
            })}
            
            {elements.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                لا توجد عناصر بعد. ابدأ بإضافة عناصر جديدة.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">إحصائيات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{elements.length}</div>
              <div className="text-sm text-muted-foreground">إجمالي العناصر</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {elements.filter(el => el.visible).length}
              </div>
              <div className="text-sm text-muted-foreground">عناصر مرئية</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {getElementsByType('button').length}
              </div>
              <div className="text-sm text-muted-foreground">أزرار</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">
                {getElementsByType('image').length}
              </div>
              <div className="text-sm text-muted-foreground">صور</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};