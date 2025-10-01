import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { IconElement } from '@/types/heroSection';
import * as LucideIcons from 'lucide-react';
import { Search, X, Check } from 'lucide-react';

interface IconInlineEditorProps {
  element: IconElement;
  onUpdate: (updates: Partial<IconElement>) => void;
  onCancel: () => void;
  onSave: () => void;
}

// List of popular Lucide icons for quick selection
const POPULAR_ICONS = [
  'Star', 'Heart', 'User', 'Users', 'Mail', 'Phone', 'MapPin', 'Calendar', 
  'Clock', 'Award', 'Trophy', 'Shield', 'Home', 'Building', 'Briefcase',
  'GraduationCap', 'BookOpen', 'Globe', 'Camera', 'Image', 'Play',
  'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Plus', 'Minus',
  'Check', 'X', 'Settings', 'Menu', 'Search', 'Filter'
];

export const IconInlineEditor: React.FC<IconInlineEditorProps> = ({
  element,
  onUpdate,
  onCancel,
  onSave
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(element.iconName);

  // Filter icons based on search term
  const filteredIcons = POPULAR_ICONS.filter(iconName =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
    onUpdate({ iconName });
  };

  const handleStyleUpdate = (styleKey: keyof IconElement['styling'], value: string) => {
    onUpdate({
      styling: {
        ...element.styling,
        [styleKey]: value
      }
    });
  };

  const renderIcon = (iconName: string, size = 24) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (!IconComponent) return null;
    return <IconComponent size={size} />;
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">تحرير الأيقونة</h3>
        <div className="flex gap-2">
          <Button onClick={onSave} size="sm" className="bg-green-600 hover:bg-green-700">
            <Check className="w-4 h-4 mr-2" />
            حفظ
          </Button>
          <Button onClick={onCancel} variant="outline" size="sm">
            <X className="w-4 h-4 mr-2" />
            إلغاء
          </Button>
        </div>
      </div>

      {/* Icon Selection */}
      <div className="space-y-2">
        <Label>اختيار الأيقونة</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="البحث عن أيقونة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto border rounded p-2">
          {filteredIcons.map((iconName) => (
            <Button
              key={iconName}
              variant={selectedIcon === iconName ? "default" : "outline"}
              size="sm"
              className="h-10 w-10 p-0"
              onClick={() => handleIconSelect(iconName)}
              title={iconName}
            >
              {renderIcon(iconName)}
            </Button>
          ))}
        </div>
      </div>

      {/* Icon Preview */}
      <div className="flex items-center gap-4">
        <Label>المعاينة:</Label>
        <div 
          className="flex items-center justify-center rounded"
          style={{
            width: element.styling.size || '32px',
            height: element.styling.size || '32px',
            backgroundColor: element.styling.backgroundColor || 'transparent',
            color: element.styling.color || 'currentColor',
            borderRadius: element.styling.borderRadius || '0',
            padding: element.styling.padding || '0'
          }}
        >
          {renderIcon(selectedIcon, parseInt(element.styling.size) || 32)}
        </div>
      </div>

      {/* Styling Options */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>الحجم</Label>
          <Select 
            value={element.styling.size} 
            onValueChange={(value) => handleStyleUpdate('size', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر الحجم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="16">صغير (16px)</SelectItem>
              <SelectItem value="24">متوسط (24px)</SelectItem>
              <SelectItem value="32">كبير (32px)</SelectItem>
              <SelectItem value="48">كبير جداً (48px)</SelectItem>
              <SelectItem value="64">عملاق (64px)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>اللون</Label>
          <Select 
            value={element.styling.color} 
            onValueChange={(value) => handleStyleUpdate('color', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر اللون" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hsl(var(--primary))">أساسي</SelectItem>
              <SelectItem value="hsl(var(--secondary))">ثانوي</SelectItem>
              <SelectItem value="hsl(var(--accent))">مميز</SelectItem>
              <SelectItem value="hsl(var(--muted-foreground))">مكتوم</SelectItem>
              <SelectItem value="white">أبيض</SelectItem>
              <SelectItem value="black">أسود</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>لون الخلفية</Label>
          <Select 
            value={element.styling.backgroundColor} 
            onValueChange={(value) => handleStyleUpdate('backgroundColor', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر لون الخلفية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="transparent">شفاف</SelectItem>
              <SelectItem value="hsl(var(--primary))">أساسي</SelectItem>
              <SelectItem value="hsl(var(--secondary))">ثانوي</SelectItem>
              <SelectItem value="hsl(var(--accent))">مميز</SelectItem>
              <SelectItem value="hsl(var(--muted))">مكتوم</SelectItem>
              <SelectItem value="white">أبيض</SelectItem>
              <SelectItem value="black">أسود</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>التدوير</Label>
          <Select 
            value={element.styling.borderRadius} 
            onValueChange={(value) => handleStyleUpdate('borderRadius', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر التدوير" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">بدون تدوير</SelectItem>
              <SelectItem value="4px">صغير</SelectItem>
              <SelectItem value="8px">متوسط</SelectItem>
              <SelectItem value="12px">كبير</SelectItem>
              <SelectItem value="50%">دائري</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Animation Options */}
      <div className="space-y-2">
        <Label>الحركة</Label>
        <Select 
          value={element.styling.animation} 
          onValueChange={(value) => handleStyleUpdate('animation', value === 'none' ? '' : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر نوع الحركة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">بدون حركة</SelectItem>
            <SelectItem value="animate-fade-in">ظهور تدريجي</SelectItem>
            <SelectItem value="animate-scale-in">تكبير</SelectItem>
            <SelectItem value="animate-bounce">نطة</SelectItem>
            <SelectItem value="animate-pulse">نبضة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {element.styling.animation && (
        <div className="space-y-2">
          <Label>تأخير الحركة (ثانية)</Label>
          <Input
            type="number"
            step="0.1"
            min="0"
            max="3"
            value={parseFloat(element.styling.animationDelay) || 0}
            onChange={(e) => handleStyleUpdate('animationDelay', `${e.target.value}s`)}
          />
        </div>
      )}
    </div>
  );
};