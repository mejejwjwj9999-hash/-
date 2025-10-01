import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface ButtonInlineEditorProps {
  contentAr: string;
  contentEn: string;
  metadata: any;
  onContentArChange: (content: string) => void;
  onContentEnChange: (content: string) => void;
  onMetadataChange: (metadata: any) => void;
  activeTab: string;
}

export const ButtonInlineEditor: React.FC<ButtonInlineEditorProps> = ({
  contentAr,
  contentEn,
  metadata = {},
  onContentArChange,
  onContentEnChange,
  onMetadataChange,
  activeTab
}) => {
  const buttonText = activeTab === 'ar' ? contentAr : contentEn;
  const href = metadata?.href || '';
  const variant = metadata?.variant || 'primary';
  const target = metadata?.target || '_self';

  return (
    <div className="space-y-4">
      {/* Button Text */}
      <div className="space-y-2">
        <Label htmlFor="button-text">
          {activeTab === 'ar' ? 'نص الزر بالعربية:' : 'Button Text in English:'}
        </Label>
        <Input
          id="button-text"
          value={buttonText}
          onChange={(e) => {
            if (activeTab === 'ar') {
              onContentArChange(e.target.value);
            } else {
              onContentEnChange(e.target.value);
            }
          }}
          placeholder={activeTab === 'ar' ? 'اكتب نص الزر...' : 'Enter button text...'}
          className={activeTab === 'ar' ? 'text-right' : 'text-left'}
          dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Button URL */}
      <div className="space-y-2">
        <Label htmlFor="button-href">رابط الزر:</Label>
        <Input
          id="button-href"
          value={href}
          onChange={(e) => onMetadataChange({ ...metadata, href: e.target.value })}
          placeholder="https://example.com أو /internal-page"
          className="text-left"
          dir="ltr"
        />
      </div>

      {/* Button Variant */}
      <div className="space-y-2">
        <Label>نمط الزر:</Label>
        <Select value={variant} onValueChange={(value) => onMetadataChange({ ...metadata, variant: value })}>
          <SelectTrigger>
            <SelectValue placeholder="اختر نمط الزر" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">أساسي (Primary)</SelectItem>
            <SelectItem value="secondary">ثانوي (Secondary)</SelectItem>
            <SelectItem value="outline">محدد (Outline)</SelectItem>
            <SelectItem value="ghost">شفاف (Ghost)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Target */}
      <div className="flex items-center justify-between">
        <Label htmlFor="open-new-tab">فتح في نافذة جديدة:</Label>
        <Switch
          id="open-new-tab"
          checked={target === '_blank'}
          onCheckedChange={(checked) => 
            onMetadataChange({ 
              ...metadata, 
              target: checked ? '_blank' : '_self' 
            })
          }
        />
      </div>

      {/* Button Preview */}
      <div className="space-y-2">
        <Label>معاينة الزر:</Label>
        <div className="border rounded-lg p-4 bg-muted/20">
          <button 
            className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              variant === 'primary' ? 'bg-primary text-primary-foreground hover:bg-primary/90' :
              variant === 'secondary' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' :
              variant === 'outline' ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' :
              'hover:bg-accent hover:text-accent-foreground'
            }`}
            disabled
          >
            {buttonText || (activeTab === 'ar' ? 'نص الزر' : 'Button Text')}
          </button>
        </div>
      </div>
    </div>
  );
};