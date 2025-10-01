import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { StatElement } from '@/types/heroSection';
import * as LucideIcons from 'lucide-react';
import { Check, X, TrendingUp, Users, Award, Star, Calendar, Globe } from 'lucide-react';

interface StatInlineEditorProps {
  element: StatElement;
  onUpdate: (updates: Partial<StatElement>) => void;
  onCancel: () => void;
  onSave: () => void;
}

const STAT_ICONS = [
  'TrendingUp', 'Users', 'Award', 'Star', 'Calendar', 'Globe', 
  'GraduationCap', 'Building', 'Trophy', 'Target', 'BookOpen', 
  'Shield', 'CheckCircle', 'Heart', 'Zap', 'Briefcase'
];

export const StatInlineEditor: React.FC<StatInlineEditorProps> = ({
  element,
  onUpdate,
  onCancel,
  onSave
}) => {
  const handleContentUpdate = (field: 'value' | 'labelAr' | 'labelEn', value: string) => {
    if (field === 'value') {
      onUpdate({ value });
    } else if (field === 'labelAr') {
      onUpdate({
        label: { ...element.label, ar: value }
      });
    } else if (field === 'labelEn') {
      onUpdate({
        label: { ...element.label, en: value }
      });
    }
  };

  const handleStyleUpdate = (styleKey: keyof StatElement['styling'], value: string) => {
    onUpdate({
      styling: {
        ...element.styling,
        [styleKey]: value
      }
    });
  };

  const handleIconUpdate = (iconName: string) => {
    onUpdate({ icon: iconName });
  };

  const renderIcon = (iconName: string, size = 24) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (!IconComponent) return null;
    return <IconComponent size={size} />;
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">تحرير الإحصائية</h3>
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

      {/* Content */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>القيمة/الرقم</Label>
          <Input
            value={element.value}
            onChange={(e) => handleContentUpdate('value', e.target.value)}
            placeholder="مثال: 250+"
          />
        </div>

        <div className="space-y-2">
          <Label>التسمية (العربية)</Label>
          <Input
            value={element.label.ar}
            onChange={(e) => handleContentUpdate('labelAr', e.target.value)}
            placeholder="مثال: طالب وطالبة"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>التسمية (الإنجليزية)</Label>
        <Input
          value={element.label.en}
          onChange={(e) => handleContentUpdate('labelEn', e.target.value)}
          placeholder="مثال: Students"
        />
      </div>

      {/* Icon Selection */}
      <div className="space-y-2">
        <Label>اختيار الأيقونة</Label>
        <div className="grid grid-cols-8 gap-2">
          {STAT_ICONS.map((iconName) => (
            <Button
              key={iconName}
              variant={element.icon === iconName ? "default" : "outline"}
              size="sm"
              className="h-10 w-10 p-0"
              onClick={() => handleIconUpdate(iconName)}
              title={iconName}
            >
              {renderIcon(iconName, 20)}
            </Button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <Label>المعاينة:</Label>
        <div className="flex flex-col items-center p-4 border rounded-lg bg-gray-50">
          <div 
            className="flex items-center justify-center rounded-full mb-2"
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: element.styling.backgroundColor || 'hsl(var(--primary))',
              color: element.styling.iconColor || 'white'
            }}
          >
            {element.icon && renderIcon(element.icon, 24)}
          </div>
          <div 
            className="font-bold mb-1"
            style={{
              fontSize: element.styling.valueSize || '24px',
              color: element.styling.color || 'hsl(var(--foreground))'
            }}
          >
            {element.value}
          </div>
          <div 
            className="text-center"
            style={{
              fontSize: element.styling.labelSize || '14px',
              color: element.styling.color || 'hsl(var(--muted-foreground))'
            }}
          >
            {element.label.ar}
          </div>
        </div>
      </div>

      {/* Styling Options */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>حجم القيمة</Label>
          <Select 
            value={element.styling.valueSize} 
            onValueChange={(value) => handleStyleUpdate('valueSize', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر الحجم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="18px">صغير</SelectItem>
              <SelectItem value="24px">متوسط</SelectItem>
              <SelectItem value="32px">كبير</SelectItem>
              <SelectItem value="40px">كبير جداً</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>حجم التسمية</Label>
          <Select 
            value={element.styling.labelSize} 
            onValueChange={(value) => handleStyleUpdate('labelSize', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر الحجم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12px">صغير</SelectItem>
              <SelectItem value="14px">متوسط</SelectItem>
              <SelectItem value="16px">كبير</SelectItem>
              <SelectItem value="18px">كبير جداً</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>لون النص</Label>
          <Select 
            value={element.styling.color} 
            onValueChange={(value) => handleStyleUpdate('color', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر اللون" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hsl(var(--foreground))">افتراضي</SelectItem>
              <SelectItem value="hsl(var(--primary))">أساسي</SelectItem>
              <SelectItem value="hsl(var(--secondary))">ثانوي</SelectItem>
              <SelectItem value="hsl(var(--muted-foreground))">مكتوم</SelectItem>
              <SelectItem value="white">أبيض</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>لون الأيقونة</Label>
          <Select 
            value={element.styling.iconColor} 
            onValueChange={(value) => handleStyleUpdate('iconColor', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر اللون" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="white">أبيض</SelectItem>
              <SelectItem value="hsl(var(--primary))">أساسي</SelectItem>
              <SelectItem value="hsl(var(--secondary))">ثانوي</SelectItem>
              <SelectItem value="hsl(var(--accent))">مميز</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Background Color */}
      <div className="space-y-2">
        <Label>لون خلفية الأيقونة</Label>
        <Select 
          value={element.styling.backgroundColor} 
          onValueChange={(value) => handleStyleUpdate('backgroundColor', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر لون الخلفية" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hsl(var(--primary))">أساسي</SelectItem>
            <SelectItem value="hsl(var(--secondary))">ثانوي</SelectItem>
            <SelectItem value="hsl(var(--accent))">مميز</SelectItem>
            <SelectItem value="hsl(var(--muted))">مكتوم</SelectItem>
            <SelectItem value="transparent">شفاف</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Animation */}
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