import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Home, User, Settings, Mail, Phone, MapPin, Calendar, Clock,
  Search, Filter, Edit, Trash2, Plus, Minus, ArrowLeft, ArrowRight,
  ChevronDown, ChevronUp, Star, Heart, Bookmark, Share2, Download,
  Upload, File, Folder, Image, Video, Music, Book, Newspaper,
  ShoppingCart, CreditCard, DollarSign, TrendingUp, BarChart3,
  Users, Award, Trophy, Target, Flag, Shield, Lock, Unlock,
  Eye, EyeOff, Camera, Mic, Speaker, Volume2, VolumeX,
  Wifi, Bluetooth, Battery, Signal, Globe, Link, ExternalLink,
  Check, X, AlertTriangle, Info, HelpCircle, MessageCircle,
  Bell, BellOff, Sun, Moon, Zap, Activity, Coffee, Briefcase,
  GraduationCap, Building, Car, Plane, Train, Ship, Bike
} from 'lucide-react';

interface IconInlineEditorNewProps {
  contentAr: string;
  contentEn: string;
  metadata: any;
  onContentArChange: (content: string) => void;
  onContentEnChange: (content: string) => void;
  onMetadataChange: (metadata: any) => void;
  activeTab: string;
}

const ICON_CATEGORIES = {
  general: {
    name: 'عام',
    icons: [
      { name: 'Home', icon: Home, label: 'الرئيسية' },
      { name: 'User', icon: User, label: 'مستخدم' },
      { name: 'Settings', icon: Settings, label: 'إعدادات' },
      { name: 'Search', icon: Search, label: 'بحث' },
      { name: 'Filter', icon: Filter, label: 'فيلتر' },
      { name: 'Edit', icon: Edit, label: 'تعديل' },
      { name: 'Trash2', icon: Trash2, label: 'حذف' },
      { name: 'Plus', icon: Plus, label: 'إضافة' },
      { name: 'Minus', icon: Minus, label: 'طرح' }
    ]
  },
  communication: {
    name: 'التواصل',
    icons: [
      { name: 'Mail', icon: Mail, label: 'بريد' },
      { name: 'Phone', icon: Phone, label: 'هاتف' },
      { name: 'MessageCircle', icon: MessageCircle, label: 'رسالة' },
      { name: 'Bell', icon: Bell, label: 'إشعار' },
      { name: 'BellOff', icon: BellOff, label: 'إيقاف الإشعارات' },
      { name: 'Share2', icon: Share2, label: 'مشاركة' }
    ]
  },
  navigation: {
    name: 'التنقل',
    icons: [
      { name: 'ArrowLeft', icon: ArrowLeft, label: 'سهم يسار' },
      { name: 'ArrowRight', icon: ArrowRight, label: 'سهم يمين' },
      { name: 'ChevronDown', icon: ChevronDown, label: 'سهم أسفل' },
      { name: 'ChevronUp', icon: ChevronUp, label: 'سهم أعلى' },
      { name: 'MapPin', icon: MapPin, label: 'موقع' },
      { name: 'Globe', icon: Globe, label: 'عالم' }
    ]
  },
  media: {
    name: 'الوسائط',
    icons: [
      { name: 'Camera', icon: Camera, label: 'كاميرا' },
      { name: 'Image', icon: Image, label: 'صورة' },
      { name: 'Video', icon: Video, label: 'فيديو' },
      { name: 'Music', icon: Music, label: 'موسيقى' },
      { name: 'Mic', icon: Mic, label: 'ميكروفون' },
      { name: 'Speaker', icon: Speaker, label: 'مكبر صوت' },
      { name: 'Volume2', icon: Volume2, label: 'صوت عالي' },
      { name: 'VolumeX', icon: VolumeX, label: 'صامت' }
    ]
  },
  business: {
    name: 'الأعمال',
    icons: [
      { name: 'Briefcase', icon: Briefcase, label: 'حقيبة' },
      { name: 'DollarSign', icon: DollarSign, label: 'دولار' },
      { name: 'TrendingUp', icon: TrendingUp, label: 'نمو' },
      { name: 'BarChart3', icon: BarChart3, label: 'رسم بياني' },
      { name: 'Target', icon: Target, label: 'هدف' },
      { name: 'Award', icon: Award, label: 'جائزة' },
      { name: 'Trophy', icon: Trophy, label: 'كأس' }
    ]
  },
  education: {
    name: 'التعليم',
    icons: [
      { name: 'GraduationCap', icon: GraduationCap, label: 'تخرج' },
      { name: 'Book', icon: Book, label: 'كتاب' },
      { name: 'Building', icon: Building, label: 'مبنى' },
      { name: 'Users', icon: Users, label: 'مستخدمين' }
    ]
  }
};

export const IconInlineEditorNew: React.FC<IconInlineEditorNewProps> = ({
  contentAr,
  contentEn,
  metadata,
  onContentArChange,
  onContentEnChange,
  onMetadataChange,
  activeTab
}) => {
  const [iconConfig, setIconConfig] = useState({
    iconName: metadata?.iconName || 'Home',
    size: metadata?.size || 'w-6 h-6',
    color: metadata?.color || 'text-primary',
    backgroundColor: metadata?.backgroundColor || 'bg-transparent',
    borderColor: metadata?.borderColor || 'border-transparent',
    borderWidth: metadata?.borderWidth || 'border-0',
    borderRadius: metadata?.borderRadius || 'rounded-none',
    padding: metadata?.padding || 'p-0',
    animation: metadata?.animation || '',
    animationDelay: metadata?.animationDelay || '0s',
    hoverEffect: metadata?.hoverEffect || '',
    ariaLabel: activeTab === 'ar' ? contentAr : contentEn || 'أيقونة'
  });

  const [selectedCategory, setSelectedCategory] = useState('general');

  const updateConfig = (updates: Partial<typeof iconConfig>) => {
    const newConfig = { ...iconConfig, ...updates };
    setIconConfig(newConfig);
    
    // Update content based on active tab (aria label)
    if (activeTab === 'ar') {
      onContentArChange(newConfig.ariaLabel);
    } else {
      onContentEnChange(newConfig.ariaLabel);
    }
    
    // Update metadata
    onMetadataChange({
      iconName: newConfig.iconName,
      size: newConfig.size,
      color: newConfig.color,
      backgroundColor: newConfig.backgroundColor,
      borderColor: newConfig.borderColor,
      borderWidth: newConfig.borderWidth,
      borderRadius: newConfig.borderRadius,
      padding: newConfig.padding,
      animation: newConfig.animation,
      animationDelay: newConfig.animationDelay,
      hoverEffect: newConfig.hoverEffect
    });
  };

  const handleAriaLabelChange = (value: string) => {
    updateConfig({ ariaLabel: value });
  };

  // Get the selected icon component
  const getSelectedIcon = () => {
    for (const category of Object.values(ICON_CATEGORIES)) {
      const iconItem = category.icons.find(icon => icon.name === iconConfig.iconName);
      if (iconItem) return iconItem;
    }
    return ICON_CATEGORIES.general.icons[0];
  };

  const selectedIcon = getSelectedIcon();
  const IconComponent = selectedIcon.icon;

  return (
    <div className="space-y-6">
      {/* Icon Selection */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="font-medium text-foreground">اختيار الأيقونة</h3>
          
          {/* Category Selection */}
          <div className="space-y-2">
            <Label>الفئة</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ICON_CATEGORIES).map(([key, category]) => (
                  <SelectItem key={key} value={key}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Icon Grid */}
          <div className="space-y-2">
            <Label>الأيقونات المتاحة</Label>
            <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto border rounded-lg p-2">
              {ICON_CATEGORIES[selectedCategory].icons.map((iconItem) => {
                const Icon = iconItem.icon;
                return (
                  <Button
                    key={iconItem.name}
                    variant={iconConfig.iconName === iconItem.name ? "default" : "outline"}
                    size="sm"
                    className="h-12 w-12 p-0 flex flex-col items-center justify-center"
                    onClick={() => updateConfig({ iconName: iconItem.name })}
                    title={iconItem.label}
                  >
                    <Icon size={20} />
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aria Label */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="font-medium text-foreground">إعدادات إمكانية الوصول</h3>
          
          <div className="space-y-2">
            <Label>تسمية الأيقونة ({activeTab === 'ar' ? 'العربية' : 'الإنجليزية'})</Label>
            <Input
              value={iconConfig.ariaLabel}
              onChange={(e) => handleAriaLabelChange(e.target.value)}
              placeholder={activeTab === 'ar' ? "وصف الأيقونة" : "Icon description"}
              className={activeTab === 'ar' ? 'text-right' : 'text-left'}
            />
          </div>
        </CardContent>
      </Card>

      {/* Styling Options */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="font-medium text-foreground">إعدادات المظهر</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>الحجم</Label>
              <Select value={iconConfig.size} onValueChange={(value) => updateConfig({ size: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="w-4 h-4">صغير جداً (16px)</SelectItem>
                  <SelectItem value="w-5 h-5">صغير (20px)</SelectItem>
                  <SelectItem value="w-6 h-6">متوسط (24px)</SelectItem>
                  <SelectItem value="w-8 h-8">كبير (32px)</SelectItem>
                  <SelectItem value="w-10 h-10">كبير جداً (40px)</SelectItem>
                  <SelectItem value="w-12 h-12">عملاق (48px)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>اللون</Label>
              <Select value={iconConfig.color} onValueChange={(value) => updateConfig({ color: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text-primary">أساسي</SelectItem>
                  <SelectItem value="text-secondary">ثانوي</SelectItem>
                  <SelectItem value="text-accent">مميز</SelectItem>
                  <SelectItem value="text-muted-foreground">مكتوم</SelectItem>
                  <SelectItem value="text-white">أبيض</SelectItem>
                  <SelectItem value="text-black">أسود</SelectItem>
                  <SelectItem value="text-blue-500">أزرق</SelectItem>
                  <SelectItem value="text-green-500">أخضر</SelectItem>
                  <SelectItem value="text-red-500">أحمر</SelectItem>
                  <SelectItem value="text-yellow-500">أصفر</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>خلفية</Label>
              <Select value={iconConfig.backgroundColor} onValueChange={(value) => updateConfig({ backgroundColor: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bg-transparent">شفاف</SelectItem>
                  <SelectItem value="bg-primary">أساسي</SelectItem>
                  <SelectItem value="bg-secondary">ثانوي</SelectItem>
                  <SelectItem value="bg-accent">مميز</SelectItem>
                  <SelectItem value="bg-muted">مكتوم</SelectItem>
                  <SelectItem value="bg-white">أبيض</SelectItem>
                  <SelectItem value="bg-black">أسود</SelectItem>
                  <SelectItem value="bg-blue-100">أزرق فاتح</SelectItem>
                  <SelectItem value="bg-green-100">أخضر فاتح</SelectItem>
                  <SelectItem value="bg-red-100">أحمر فاتح</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الحشو الداخلي</Label>
              <Select value={iconConfig.padding} onValueChange={(value) => updateConfig({ padding: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="p-0">بدون</SelectItem>
                  <SelectItem value="p-1">صغير</SelectItem>
                  <SelectItem value="p-2">متوسط</SelectItem>
                  <SelectItem value="p-3">كبير</SelectItem>
                  <SelectItem value="p-4">كبير جداً</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>الحدود</Label>
              <Select value={iconConfig.borderWidth} onValueChange={(value) => updateConfig({ borderWidth: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="border-0">بدون حدود</SelectItem>
                  <SelectItem value="border">رفيع</SelectItem>
                  <SelectItem value="border-2">متوسط</SelectItem>
                  <SelectItem value="border-4">سميك</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>لون الحدود</Label>
              <Select value={iconConfig.borderColor} onValueChange={(value) => updateConfig({ borderColor: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="border-transparent">شفاف</SelectItem>
                  <SelectItem value="border-primary">أساسي</SelectItem>
                  <SelectItem value="border-secondary">ثانوي</SelectItem>
                  <SelectItem value="border-accent">مميز</SelectItem>
                  <SelectItem value="border-muted">مكتوم</SelectItem>
                  <SelectItem value="border-gray-300">رمادي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>شكل الحواف</Label>
              <Select value={iconConfig.borderRadius} onValueChange={(value) => updateConfig({ borderRadius: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rounded-none">مربع</SelectItem>
                  <SelectItem value="rounded-sm">مدور قليلاً</SelectItem>
                  <SelectItem value="rounded">مدور</SelectItem>
                  <SelectItem value="rounded-lg">مدور كثيراً</SelectItem>
                  <SelectItem value="rounded-full">دائري</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Animation & Effects */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="font-medium text-foreground">الحركة والتأثيرات</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>الحركة</Label>
              <Select value={iconConfig.animation} onValueChange={(value) => updateConfig({ animation: value === 'none' ? '' : value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحركة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون حركة</SelectItem>
                  <SelectItem value="animate-spin">دوران</SelectItem>
                  <SelectItem value="animate-pulse">نبضة</SelectItem>
                  <SelectItem value="animate-bounce">نطة</SelectItem>
                  <SelectItem value="animate-ping">موجة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>تأثير التمرير</Label>
              <Select value={iconConfig.hoverEffect} onValueChange={(value) => updateConfig({ hoverEffect: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر التأثير" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">بدون تأثير</SelectItem>
                  <SelectItem value="hover:scale-110">تكبير</SelectItem>
                  <SelectItem value="hover:rotate-12">دوران</SelectItem>
                  <SelectItem value="hover:opacity-70">شفافية</SelectItem>
                  <SelectItem value="hover:text-primary">تغيير اللون</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <Label>المعاينة:</Label>
            <div className="flex items-center justify-center p-8 border-2 border-dashed border-muted rounded-lg bg-muted/20">
              <div 
                className={`
                  ${iconConfig.size} 
                  ${iconConfig.color} 
                  ${iconConfig.backgroundColor} 
                  ${iconConfig.borderWidth} 
                  ${iconConfig.borderColor} 
                  ${iconConfig.borderRadius} 
                  ${iconConfig.padding}
                  ${iconConfig.animation}
                  ${iconConfig.hoverEffect}
                  transition-all duration-200 cursor-pointer
                `}
                style={{ animationDelay: iconConfig.animationDelay }}
                title={iconConfig.ariaLabel}
              >
                <IconComponent className="w-full h-full" />
              </div>
            </div>
            
            <div className="text-center text-sm text-muted-foreground mt-2">
              <strong>تسمية الأيقونة:</strong> {iconConfig.ariaLabel}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};