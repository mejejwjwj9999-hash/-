import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, Users, Award, Star, Calendar, Globe, 
  GraduationCap, Building, Trophy, Target, BookOpen, 
  Shield, CheckCircle, Heart, Zap, Briefcase, Activity,
  BarChart3, PieChart, LineChart, DollarSign
} from 'lucide-react';

interface StatInlineEditorNewProps {
  contentAr: string;
  contentEn: string;
  metadata: any;
  onContentArChange: (content: string) => void;
  onContentEnChange: (content: string) => void;
  onMetadataChange: (metadata: any) => void;
  activeTab: string;
}

const STAT_ICONS = [
  { name: 'TrendingUp', icon: TrendingUp, label: 'نمو' },
  { name: 'Users', icon: Users, label: 'مستخدمين' },
  { name: 'Award', icon: Award, label: 'جائزة' },
  { name: 'Star', icon: Star, label: 'نجمة' },
  { name: 'Calendar', icon: Calendar, label: 'تقويم' },
  { name: 'Globe', icon: Globe, label: 'عالم' },
  { name: 'GraduationCap', icon: GraduationCap, label: 'تخرج' },
  { name: 'Building', icon: Building, label: 'مبنى' },
  { name: 'Trophy', icon: Trophy, label: 'كأس' },
  { name: 'Target', icon: Target, label: 'هدف' },
  { name: 'BookOpen', icon: BookOpen, label: 'كتاب' },
  { name: 'Shield', icon: Shield, label: 'درع' },
  { name: 'CheckCircle', icon: CheckCircle, label: 'تأكيد' },
  { name: 'Heart', icon: Heart, label: 'قلب' },
  { name: 'Zap', icon: Zap, label: 'برق' },
  { name: 'Briefcase', icon: Briefcase, label: 'حقيبة' },
  { name: 'Activity', icon: Activity, label: 'نشاط' },
  { name: 'BarChart3', icon: BarChart3, label: 'رسم بياني' },
  { name: 'PieChart', icon: PieChart, label: 'دائرة بيانية' },
  { name: 'LineChart', icon: LineChart, label: 'خط بياني' },
  { name: 'DollarSign', icon: DollarSign, label: 'دولار' }
];

export const StatInlineEditorNew: React.FC<StatInlineEditorNewProps> = ({
  contentAr,
  contentEn,
  metadata,
  onContentArChange,
  onContentEnChange,
  onMetadataChange,
  activeTab
}) => {
  const [statConfig, setStatConfig] = useState({
    value: metadata?.value || '0',
    labelAr: contentAr || '',
    labelEn: contentEn || '',
    icon: metadata?.icon || 'TrendingUp',
    valueSize: metadata?.valueSize || 'text-3xl',
    labelSize: metadata?.labelSize || 'text-sm',
    iconColor: metadata?.iconColor || 'text-primary',
    backgroundColor: metadata?.backgroundColor || 'bg-primary/10',
    animation: metadata?.animation || '',
    animationDelay: metadata?.animationDelay || '0s',
    prefix: metadata?.prefix || '',
    suffix: metadata?.suffix || '',
    showIcon: metadata?.showIcon !== false
  });

  const updateConfig = (updates: Partial<typeof statConfig>) => {
    const newConfig = { ...statConfig, ...updates };
    setStatConfig(newConfig);
    
    // Update content based on active tab
    if (activeTab === 'ar') {
      onContentArChange(newConfig.labelAr);
    } else {
      onContentEnChange(newConfig.labelEn);
    }
    
    // Update metadata
    onMetadataChange({
      value: newConfig.value,
      icon: newConfig.icon,
      valueSize: newConfig.valueSize,
      labelSize: newConfig.labelSize,
      iconColor: newConfig.iconColor,
      backgroundColor: newConfig.backgroundColor,
      animation: newConfig.animation,
      animationDelay: newConfig.animationDelay,
      prefix: newConfig.prefix,
      suffix: newConfig.suffix,
      showIcon: newConfig.showIcon
    });
  };

  const handleLabelChange = (value: string) => {
    if (activeTab === 'ar') {
      updateConfig({ labelAr: value });
    } else {
      updateConfig({ labelEn: value });
    }
  };

  const selectedIcon = STAT_ICONS.find(icon => icon.name === statConfig.icon);
  const IconComponent = selectedIcon?.icon || TrendingUp;

  return (
    <div className="space-y-6">
      {/* Basic Configuration */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="font-medium text-foreground">إعدادات الإحصائية</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>القيمة/الرقم</Label>
              <Input
                value={statConfig.value}
                onChange={(e) => updateConfig({ value: e.target.value })}
                placeholder="مثال: 1500"
                className="text-right"
              />
            </div>

            <div className="space-y-2">
              <Label>البادئة (اختياري)</Label>
              <Input
                value={statConfig.prefix}
                onChange={(e) => updateConfig({ prefix: e.target.value })}
                placeholder="مثال: +"
                className="text-right"
              />
            </div>

            <div className="space-y-2">
              <Label>اللاحقة (اختياري)</Label>
              <Input
                value={statConfig.suffix}
                onChange={(e) => updateConfig({ suffix: e.target.value })}
                placeholder="مثال: %"
                className="text-right"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>التسمية ({activeTab === 'ar' ? 'العربية' : 'الإنجليزية'})</Label>
            <Input
              value={activeTab === 'ar' ? statConfig.labelAr : statConfig.labelEn}
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder={activeTab === 'ar' ? "مثال: طالب وطالبة" : "Example: Students"}
              className={activeTab === 'ar' ? 'text-right' : 'text-left'}
            />
          </div>
        </CardContent>
      </Card>

      {/* Icon Selection */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">إعدادات الأيقونة</h3>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showIcon"
                checked={statConfig.showIcon}
                onChange={(e) => updateConfig({ showIcon: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="showIcon">إظهار الأيقونة</Label>
            </div>
          </div>
          
          {statConfig.showIcon && (
            <>
              <div className="space-y-2">
                <Label>اختيار الأيقونة</Label>
                <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                  {STAT_ICONS.map((iconItem) => {
                    const Icon = iconItem.icon;
                    return (
                      <Button
                        key={iconItem.name}
                        variant={statConfig.icon === iconItem.name ? "default" : "outline"}
                        size="sm"
                        className="h-12 w-12 p-0 flex flex-col items-center gap-1"
                        onClick={() => updateConfig({ icon: iconItem.name })}
                        title={iconItem.label}
                      >
                        <Icon size={16} />
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>لون الأيقونة</Label>
                  <Select value={statConfig.iconColor} onValueChange={(value) => updateConfig({ iconColor: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text-primary">أساسي</SelectItem>
                      <SelectItem value="text-secondary">ثانوي</SelectItem>
                      <SelectItem value="text-accent">مميز</SelectItem>
                      <SelectItem value="text-white">أبيض</SelectItem>
                      <SelectItem value="text-blue-500">أزرق</SelectItem>
                      <SelectItem value="text-green-500">أخضر</SelectItem>
                      <SelectItem value="text-red-500">أحمر</SelectItem>
                      <SelectItem value="text-yellow-500">أصفر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>خلفية الأيقونة</Label>
                  <Select value={statConfig.backgroundColor} onValueChange={(value) => updateConfig({ backgroundColor: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bg-primary/10">أساسي فاتح</SelectItem>
                      <SelectItem value="bg-secondary/10">ثانوي فاتح</SelectItem>
                      <SelectItem value="bg-accent/10">مميز فاتح</SelectItem>
                      <SelectItem value="bg-blue-100">أزرق فاتح</SelectItem>
                      <SelectItem value="bg-green-100">أخضر فاتح</SelectItem>
                      <SelectItem value="bg-red-100">أحمر فاتح</SelectItem>
                      <SelectItem value="bg-yellow-100">أصفر فاتح</SelectItem>
                      <SelectItem value="bg-primary">أساسي</SelectItem>
                      <SelectItem value="bg-transparent">شفاف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Styling Options */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="font-medium text-foreground">إعدادات المظهر</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>حجم القيمة</Label>
              <Select value={statConfig.valueSize} onValueChange={(value) => updateConfig({ valueSize: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text-lg">صغير</SelectItem>
                  <SelectItem value="text-xl">متوسط</SelectItem>
                  <SelectItem value="text-2xl">كبير</SelectItem>
                  <SelectItem value="text-3xl">كبير جداً</SelectItem>
                  <SelectItem value="text-4xl">عملاق</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>حجم التسمية</Label>
              <Select value={statConfig.labelSize} onValueChange={(value) => updateConfig({ labelSize: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text-xs">صغير جداً</SelectItem>
                  <SelectItem value="text-sm">صغير</SelectItem>
                  <SelectItem value="text-base">متوسط</SelectItem>
                  <SelectItem value="text-lg">كبير</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Animation Options */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="font-medium text-foreground">إعدادات الحركة</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>نوع الحركة</Label>
              <Select value={statConfig.animation} onValueChange={(value) => updateConfig({ animation: value === 'none' ? '' : value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الحركة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون حركة</SelectItem>
                  <SelectItem value="animate-fade-in">ظهور تدريجي</SelectItem>
                  <SelectItem value="animate-scale-in">تكبير</SelectItem>
                  <SelectItem value="animate-bounce">نطة</SelectItem>
                  <SelectItem value="animate-pulse">نبضة</SelectItem>
                  <SelectItem value="animate-spin">دوران</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {statConfig.animation && (
              <div className="space-y-2">
                <Label>تأخير الحركة (ثانية)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="3"
                  value={parseFloat(statConfig.animationDelay) || 0}
                  onChange={(e) => updateConfig({ animationDelay: `${e.target.value}s` })}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <Label>المعاينة:</Label>
            <div className="flex flex-col items-center p-8 border-2 border-dashed border-muted rounded-lg bg-muted/20">
              <div className="flex flex-col items-center space-y-3">
                {statConfig.showIcon && (
                  <div 
                    className={`flex items-center justify-center rounded-full w-16 h-16 ${statConfig.backgroundColor} ${statConfig.iconColor} ${statConfig.animation}`}
                    style={{ animationDelay: statConfig.animationDelay }}
                  >
                    <IconComponent size={28} />
                  </div>
                )}
                
                <div 
                  className={`font-bold text-foreground ${statConfig.valueSize} ${statConfig.animation}`}
                  style={{ animationDelay: statConfig.animation ? `calc(${statConfig.animationDelay} + 0.2s)` : '0s' }}
                >
                  {statConfig.prefix}{statConfig.value}{statConfig.suffix}
                </div>
                
                <div 
                  className={`text-center text-muted-foreground ${statConfig.labelSize} ${statConfig.animation}`}
                  style={{ animationDelay: statConfig.animation ? `calc(${statConfig.animationDelay} + 0.4s)` : '0s' }}
                >
                  {activeTab === 'ar' ? statConfig.labelAr : statConfig.labelEn}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};