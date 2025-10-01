import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { TextElement, ImageElement, ButtonElement, IconElement, StatElement } from '@/types/heroSection';
import { Check, X, Play, Pause, RotateCcw } from 'lucide-react';

type ElementWithStyling = TextElement | ImageElement | ButtonElement | IconElement | StatElement;

interface AnimationInlineEditorProps {
  element: ElementWithStyling;
  onUpdate: (updates: Partial<ElementWithStyling>) => void;
  onCancel: () => void;
  onSave: () => void;
}

const ANIMATION_PRESETS = [
  { value: 'none', label: 'بدون حركة' },
  { value: 'animate-fade-in', label: 'ظهور تدريجي' },
  { value: 'animate-scale-in', label: 'تكبير' },
  { value: 'animate-slide-in-right', label: 'انزلاق من اليمين' },
  { value: 'animate-slide-in-left', label: 'انزلاق من اليسار' },
  { value: 'animate-slide-in-up', label: 'انزلاق من الأسفل' },
  { value: 'animate-slide-in-down', label: 'انزلاق من الأعلى' },
  { value: 'animate-bounce', label: 'نطة' },
  { value: 'animate-pulse', label: 'نبضة' },
  { value: 'animate-spin', label: 'دوران' },
  { value: 'animate-ping', label: 'رنين' },
  { value: 'hover:scale-105', label: 'تكبير عند التمرير' },
  { value: 'hover:rotate-3', label: 'دوران عند التمرير' },
  { value: 'hover:translate-x-1', label: 'حركة أفقية عند التمرير' }
];

const TIMING_FUNCTIONS = [
  { value: 'ease', label: 'سهل' },
  { value: 'ease-in', label: 'بطء في البداية' },
  { value: 'ease-out', label: 'بطء في النهاية' },
  { value: 'ease-in-out', label: 'بطء في البداية والنهاية' },
  { value: 'linear', label: 'خطي' },
  { value: 'cubic-bezier(0.4, 0, 0.2, 1)', label: 'متقدم' }
];

export const AnimationInlineEditor: React.FC<AnimationInlineEditorProps> = ({
  element,
  onUpdate,
  onCancel,
  onSave
}) => {
  const [isPreviewPlaying, setIsPreviewPlaying] = React.useState(false);

  const handleAnimationUpdate = (field: string, value: string) => {
    const styling = { ...element.styling };
    (styling as any)[field] = value;
    onUpdate({ styling } as any);
  };

  const getAnimationValue = (field: string): string => {
    return (element.styling as any)?.[field] || '';
  };

  const getAnimationDelay = () => {
    return parseFloat(getAnimationValue('animationDelay').replace('s', '')) || 0;
  };

  const getAnimationDuration = () => {
    return parseFloat(getAnimationValue('animationDuration').replace('s', '')) || 0.3;
  };

  const playPreview = () => {
    setIsPreviewPlaying(true);
    setTimeout(() => setIsPreviewPlaying(false), 2000);
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">تحرير الحركات والتأثيرات</h3>
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

      {/* Animation Type */}
      <div className="space-y-2">
        <Label>نوع الحركة</Label>
        <Select 
          value={getAnimationValue('animation')} 
          onValueChange={(value) => handleAnimationUpdate('animation', value === 'none' ? '' : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر نوع الحركة" />
          </SelectTrigger>
          <SelectContent>
            {ANIMATION_PRESETS.map((preset) => (
              <SelectItem key={preset.value} value={preset.value}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Animation Settings */}
      {getAnimationValue('animation') && (
        <div className="space-y-4">
          {/* Duration */}
          <div className="space-y-2">
            <Label>مدة الحركة (ثانية)</Label>
            <Slider
              value={[getAnimationDuration()]}
              onValueChange={([value]) => handleAnimationUpdate('animationDuration', `${value}s`)}
              max={5}
              min={0.1}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              {getAnimationDuration()} ثانية
            </p>
          </div>

          {/* Delay */}
          <div className="space-y-2">
            <Label>تأخير الحركة (ثانية)</Label>
            <Slider
              value={[getAnimationDelay()]}
              onValueChange={([value]) => handleAnimationUpdate('animationDelay', `${value}s`)}
              max={3}
              min={0}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              {getAnimationDelay()} ثانية
            </p>
          </div>

          {/* Timing Function */}
          <div className="space-y-2">
            <Label>نمط التوقيت</Label>
            <Select 
              value={('styling' in element && element.styling?.animationTimingFunction) || 'ease'} 
              onValueChange={(value) => handleAnimationUpdate('animationTimingFunction', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر نمط التوقيت" />
              </SelectTrigger>
              <SelectContent>
                {TIMING_FUNCTIONS.map((timing) => (
                  <SelectItem key={timing.value} value={timing.value}>
                    {timing.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Iteration Count */}
          <div className="space-y-2">
            <Label>عدد التكرارات</Label>
            <Select 
              value={('styling' in element && element.styling?.animationIterationCount) || '1'} 
              onValueChange={(value) => handleAnimationUpdate('animationIterationCount', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر عدد التكرارات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">مرة واحدة</SelectItem>
                <SelectItem value="2">مرتان</SelectItem>
                <SelectItem value="3">ثلاث مرات</SelectItem>
                <SelectItem value="infinite">بلا نهاية</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Direction */}
          <div className="space-y-2">
            <Label>اتجاه الحركة</Label>
            <Select 
              value={('styling' in element && element.styling?.animationDirection) || 'normal'} 
              onValueChange={(value) => handleAnimationUpdate('animationDirection', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الاتجاه" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">عادي</SelectItem>
                <SelectItem value="reverse">معكوس</SelectItem>
                <SelectItem value="alternate">متناوب</SelectItem>
                <SelectItem value="alternate-reverse">متناوب معكوس</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Preview */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <Label>معاينة الحركة</Label>
            <Button onClick={playPreview} size="sm" variant="outline">
              <Play className="w-4 h-4 mr-2" />
              تشغيل المعاينة
            </Button>
          </div>
          
          <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
            <div 
              className={`
                w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-white font-bold
                ${isPreviewPlaying && ('styling' in element && element.styling?.animation) ? element.styling.animation : ''}
              `}
              style={{
                animationDuration: ('styling' in element && element.styling?.animationDuration) || '0.3s',
                animationDelay: isPreviewPlaying ? (('styling' in element && element.styling?.animationDelay) || '0s') : '0s',
                animationTimingFunction: ('styling' in element && element.styling?.animationTimingFunction) || 'ease',
                animationIterationCount: isPreviewPlaying ? (('styling' in element && element.styling?.animationIterationCount) || '1') : '1',
                animationDirection: ('styling' in element && element.styling?.animationDirection) || 'normal'
              }}
            >
              {element.type === 'text' ? 'نص' : 
               element.type === 'image' ? '🖼️' :
               element.type === 'button' ? 'زر' :
               element.type === 'icon' ? '⭐' :
               element.type === 'stat' ? '123' : '📦'}
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-2">
            اضغط "تشغيل المعاينة" لرؤية الحركة
          </p>
        </CardContent>
      </Card>

      {/* Performance Tips */}
      <Card>
        <CardContent className="p-3">
          <h4 className="font-medium text-sm mb-2">نصائح الأداء:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• استخدم الحركات البسيطة للحصول على أداء أفضل</li>
            <li>• تجنب الحركات المستمرة (infinite) للعناصر الكثيرة</li>
            <li>• استخدم التأخير لتنسيق ظهور العناصر</li>
            <li>• اختبر الحركات على الأجهزة المختلفة</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};