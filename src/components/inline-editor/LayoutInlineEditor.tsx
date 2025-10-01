import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { LayoutElement } from '@/types/heroSection';
import { Check, X, Layout, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface LayoutInlineEditorProps {
  element: LayoutElement;
  onUpdate: (updates: Partial<LayoutElement>) => void;
  onCancel: () => void;
  onSave: () => void;
}

export const LayoutInlineEditor: React.FC<LayoutInlineEditorProps> = ({
  element,
  onUpdate,
  onCancel,
  onSave
}) => {
  const handleUpdate = (field: keyof LayoutElement, value: any) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">تحرير التخطيط</h3>
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

      {/* Container Type */}
      <div className="space-y-2">
        <Label>نوع الحاوية</Label>
        <Select 
          value={element.containerType} 
          onValueChange={(value: LayoutElement['containerType']) => handleUpdate('containerType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر نوع الحاوية" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full">شاشة كاملة</SelectItem>
            <SelectItem value="container">حاوية عادية</SelectItem>
            <SelectItem value="narrow">حاوية ضيقة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Direction */}
      <div className="space-y-2">
        <Label>اتجاه العناصر</Label>
        <Select 
          value={element.direction} 
          onValueChange={(value: LayoutElement['direction']) => handleUpdate('direction', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر الاتجاه" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="row">أفقي (من اليمين لليسار)</SelectItem>
            <SelectItem value="row-reverse">أفقي معكوس</SelectItem>
            <SelectItem value="column">عمودي (من الأعلى للأسفل)</SelectItem>
            <SelectItem value="column-reverse">عمودي معكوس</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alignment */}
      <div className="space-y-2">
        <Label>المحاذاة</Label>
        <Select 
          value={element.alignment} 
          onValueChange={(value: LayoutElement['alignment']) => handleUpdate('alignment', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر المحاذاة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="start">البداية</SelectItem>
            <SelectItem value="center">الوسط</SelectItem>
            <SelectItem value="end">النهاية</SelectItem>
            <SelectItem value="between">مساحة بين العناصر</SelectItem>
            <SelectItem value="around">مساحة حول العناصر</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Spacing */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>المسافة بين العناصر</Label>
          <Select 
            value={element.spacing} 
            onValueChange={(value) => handleUpdate('spacing', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر المسافة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gap-1">صغيرة جداً (4px)</SelectItem>
              <SelectItem value="gap-2">صغيرة (8px)</SelectItem>
              <SelectItem value="gap-4">متوسطة (16px)</SelectItem>
              <SelectItem value="gap-6">كبيرة (24px)</SelectItem>
              <SelectItem value="gap-8">كبيرة جداً (32px)</SelectItem>
              <SelectItem value="gap-12">عملاقة (48px)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>الحشو الداخلي</Label>
          <Select 
            value={element.padding} 
            onValueChange={(value) => handleUpdate('padding', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر الحشو" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="p-0">بدون حشو</SelectItem>
              <SelectItem value="p-2">صغير (8px)</SelectItem>
              <SelectItem value="p-4">متوسط (16px)</SelectItem>
              <SelectItem value="p-6">كبير (24px)</SelectItem>
              <SelectItem value="p-8">كبير جداً (32px)</SelectItem>
              <SelectItem value="p-12">عملاق (48px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Margin */}
      <div className="space-y-2">
        <Label>الهامش الخارجي</Label>
        <Select 
          value={element.margin} 
          onValueChange={(value) => handleUpdate('margin', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر الهامش" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="m-0">بدون هامش</SelectItem>
            <SelectItem value="m-2">صغير (8px)</SelectItem>
            <SelectItem value="m-4">متوسط (16px)</SelectItem>
            <SelectItem value="m-6">كبير (24px)</SelectItem>
            <SelectItem value="m-8">كبير جداً (32px)</SelectItem>
            <SelectItem value="my-4">عمودي فقط (16px)</SelectItem>
            <SelectItem value="mx-4">أفقي فقط (16px)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <Label>المعاينة:</Label>
        <div className="border rounded-lg p-4 bg-gray-50">
          <div 
            className={`
              ${element.containerType === 'full' ? 'w-full' : 
                element.containerType === 'narrow' ? 'max-w-md mx-auto' : 'max-w-4xl mx-auto'}
              ${element.direction === 'row' ? 'flex flex-row' :
                element.direction === 'row-reverse' ? 'flex flex-row-reverse' :
                element.direction === 'column' ? 'flex flex-col' : 'flex flex-col-reverse'}
              ${element.alignment === 'start' ? 'justify-start items-start' :
                element.alignment === 'center' ? 'justify-center items-center' :
                element.alignment === 'end' ? 'justify-end items-end' :
                element.alignment === 'between' ? 'justify-between items-center' : 'justify-around items-center'}
              ${element.spacing}
              ${element.padding}
              ${element.margin}
            `}
          >
            <div className="w-12 h-12 bg-blue-200 rounded flex items-center justify-center text-xs">1</div>
            <div className="w-12 h-12 bg-green-200 rounded flex items-center justify-center text-xs">2</div>
            <div className="w-12 h-12 bg-red-200 rounded flex items-center justify-center text-xs">3</div>
          </div>
        </div>
      </div>

      {/* CSS Classes Override */}
      <div className="space-y-2">
        <Label>فئات CSS إضافية</Label>
        <Input
          value={element.className || ''}
          onChange={(e) => handleUpdate('className', e.target.value)}
          placeholder="مثال: rounded-xl shadow-lg"
        />
        <p className="text-xs text-muted-foreground">
          يمكنك إضافة فئات Tailwind CSS إضافية هنا
        </p>
      </div>
    </div>
  );
};