import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { BackgroundElement } from '@/types/heroSection';
import { Check, X, Palette, Image, Grid } from 'lucide-react';

interface BackgroundInlineEditorProps {
  element: BackgroundElement;
  onUpdate: (updates: Partial<BackgroundElement>) => void;
  onCancel: () => void;
  onSave: () => void;
}

export const BackgroundInlineEditor: React.FC<BackgroundInlineEditorProps> = ({
  element,
  onUpdate,
  onCancel,
  onSave
}) => {
  const handleTypeChange = (type: BackgroundElement['backgroundType']) => {
    onUpdate({ backgroundType: type });
  };

  const handleGradientUpdate = (field: keyof NonNullable<BackgroundElement['gradient']>, value: string) => {
    onUpdate({
      gradient: {
        ...element.gradient,
        [field]: value
      }
    });
  };

  const handleImageUpdate = (field: keyof NonNullable<BackgroundElement['image']>, value: string) => {
    onUpdate({
      image: {
        ...element.image,
        [field]: value
      }
    });
  };

  const handlePatternUpdate = (field: keyof NonNullable<BackgroundElement['pattern']>, value: string) => {
    onUpdate({
      pattern: {
        ...element.pattern,
        [field]: value
      }
    });
  };

  const handleSolidUpdate = (color: string) => {
    onUpdate({
      solid: { color }
    });
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">تحرير الخلفية</h3>
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

      {/* Background Type */}
      <div className="space-y-2">
        <Label>نوع الخلفية</Label>
        <Select value={element.backgroundType} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="اختر نوع الخلفية" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gradient">تدرج لوني</SelectItem>
            <SelectItem value="image">صورة</SelectItem>
            <SelectItem value="pattern">نمط</SelectItem>
            <SelectItem value="solid">لون صلب</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Gradient Options */}
      {element.backgroundType === 'gradient' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>اللون الأول</Label>
              <Select 
                value={element.gradient?.from} 
                onValueChange={(value) => handleGradientUpdate('from', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر اللون الأول" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hsl(var(--primary))">أساسي</SelectItem>
                  <SelectItem value="hsl(var(--secondary))">ثانوي</SelectItem>
                  <SelectItem value="hsl(var(--accent))">مميز</SelectItem>
                  <SelectItem value="#3b82f6">أزرق</SelectItem>
                  <SelectItem value="#ef4444">أحمر</SelectItem>
                  <SelectItem value="#10b981">أخضر</SelectItem>
                  <SelectItem value="#f59e0b">أصفر</SelectItem>
                  <SelectItem value="#8b5cf6">بنفسجي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>اللون الثاني</Label>
              <Select 
                value={element.gradient?.to} 
                onValueChange={(value) => handleGradientUpdate('to', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر اللون الثاني" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hsl(var(--primary))">أساسي</SelectItem>
                  <SelectItem value="hsl(var(--secondary))">ثانوي</SelectItem>
                  <SelectItem value="hsl(var(--accent))">مميز</SelectItem>
                  <SelectItem value="#3b82f6">أزرق</SelectItem>
                  <SelectItem value="#ef4444">أحمر</SelectItem>
                  <SelectItem value="#10b981">أخضر</SelectItem>
                  <SelectItem value="#f59e0b">أصفر</SelectItem>
                  <SelectItem value="#8b5cf6">بنفسجي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>اتجاه التدرج</Label>
            <Select 
              value={element.gradient?.direction} 
              onValueChange={(value) => handleGradientUpdate('direction', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الاتجاه" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="to right">من اليسار لليمين</SelectItem>
                <SelectItem value="to left">من اليمين لليسار</SelectItem>
                <SelectItem value="to bottom">من الأعلى للأسفل</SelectItem>
                <SelectItem value="to top">من الأسفل للأعلى</SelectItem>
                <SelectItem value="to bottom right">قطري (أسفل يمين)</SelectItem>
                <SelectItem value="to bottom left">قطري (أسفل يسار)</SelectItem>
                <SelectItem value="to top right">قطري (أعلى يمين)</SelectItem>
                <SelectItem value="to top left">قطري (أعلى يسار)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Image Options */}
      {element.backgroundType === 'image' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>رابط الصورة</Label>
            <Input
              value={element.image?.src || ''}
              onChange={(e) => handleImageUpdate('src', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label>الشفافية</Label>
            <Slider
              value={[parseFloat(element.image?.opacity || '1') * 100]}
              onValueChange={([value]) => handleImageUpdate('opacity', (value / 100).toString())}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              {Math.round(parseFloat(element.image?.opacity || '1') * 100)}%
            </p>
          </div>

          <div className="space-y-2">
            <Label>طبقة الألوان</Label>
            <Select 
              value={element.image?.overlay} 
              onValueChange={(value) => handleImageUpdate('overlay', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر لون الطبقة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">بدون طبقة</SelectItem>
                <SelectItem value="rgba(0,0,0,0.3)">أسود فاتح</SelectItem>
                <SelectItem value="rgba(0,0,0,0.5)">أسود متوسط</SelectItem>
                <SelectItem value="rgba(0,0,0,0.7)">أسود قوي</SelectItem>
                <SelectItem value="rgba(255,255,255,0.3)">أبيض فاتح</SelectItem>
                <SelectItem value="rgba(255,255,255,0.5)">أبيض متوسط</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Pattern Options */}
      {element.backgroundType === 'pattern' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>نوع النمط</Label>
            <Select 
              value={element.pattern?.type} 
              onValueChange={(value) => handlePatternUpdate('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر النمط" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dots">نقاط</SelectItem>
                <SelectItem value="grid">شبكة</SelectItem>
                <SelectItem value="diagonal">خطوط قطرية</SelectItem>
                <SelectItem value="waves">موجات</SelectItem>
                <SelectItem value="hexagon">سداسيات</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>لون النمط</Label>
            <Select 
              value={element.pattern?.color} 
              onValueChange={(value) => handlePatternUpdate('color', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر اللون" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hsl(var(--primary))">أساسي</SelectItem>
                <SelectItem value="hsl(var(--secondary))">ثانوي</SelectItem>
                <SelectItem value="hsl(var(--muted))">مكتوم</SelectItem>
                <SelectItem value="white">أبيض</SelectItem>
                <SelectItem value="black">أسود</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>شفافية النمط</Label>
            <Slider
              value={[parseFloat(element.pattern?.opacity || '0.1') * 100]}
              onValueChange={([value]) => handlePatternUpdate('opacity', (value / 100).toString())}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              {Math.round(parseFloat(element.pattern?.opacity || '0.1') * 100)}%
            </p>
          </div>
        </div>
      )}

      {/* Solid Color Options */}
      {element.backgroundType === 'solid' && (
        <div className="space-y-2">
          <Label>اللون</Label>
          <Select 
            value={element.solid?.color} 
            onValueChange={handleSolidUpdate}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر اللون" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hsl(var(--background))">خلفية افتراضية</SelectItem>
              <SelectItem value="hsl(var(--primary))">أساسي</SelectItem>
              <SelectItem value="hsl(var(--secondary))">ثانوي</SelectItem>
              <SelectItem value="hsl(var(--accent))">مميز</SelectItem>
              <SelectItem value="hsl(var(--muted))">مكتوم</SelectItem>
              <SelectItem value="white">أبيض</SelectItem>
              <SelectItem value="black">أسود</SelectItem>
              <SelectItem value="transparent">شفاف</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Preview */}
      <div className="space-y-2">
        <Label>المعاينة:</Label>
        <div 
          className="h-24 rounded-lg border flex items-center justify-center text-white font-bold"
          style={{
            background: element.backgroundType === 'gradient' 
              ? `linear-gradient(${element.gradient?.direction}, ${element.gradient?.from}, ${element.gradient?.to})`
              : element.backgroundType === 'solid'
              ? element.solid?.color
              : element.backgroundType === 'image'
              ? `url(${element.image?.src})`
              : '#f3f4f6'
          }}
        >
          معاينة الخلفية
        </div>
      </div>
    </div>
  );
};