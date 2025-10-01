import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Palette, Zap, Settings, Heart, Star, Home, 
  User, Mail, Phone, Calendar, Clock, Globe, Camera,
  Edit, Trash2, Plus, Minus, Check, X, ArrowRight,
  ArrowLeft, ArrowUp, ArrowDown, Download, Upload,
  Save, Share2, Copy, Eye, EyeOff, Lock,
  Unlock, Shield, AlertCircle, CheckCircle, Info,
  BookOpen, FileText, Folder, Image, Video, Music,
  Code, Database, Server, Wifi, Bluetooth, Battery,
  Volume2, Mic, MicOff, Play, Pause, Repeat,
  Shuffle, Map, MapPin, Navigation, Compass, Car,
  Plane, Train, Ship, Bike, ShoppingCart,
  CreditCard, DollarSign, TrendingUp, TrendingDown,
  BarChart3, PieChart, Activity, Award, Target,
  Flag, Gift, Coffee, Pizza, Gamepad2, Palette as PaletteIcon
} from 'lucide-react';

interface IconPickerProps {
  onIconSelect: (iconName: string, iconData: { size: number; color: string; strokeWidth: number }) => void;
  trigger?: React.ReactNode;
  title?: string;
}

const IconPicker: React.FC<IconPickerProps> = ({
  onIconSelect,
  trigger,
  title = "اختيار أيقونة"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [iconSize, setIconSize] = useState(24);
  const [iconColor, setIconColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);

  const iconCategories = {
    all: 'الكل',
    general: 'عام',
    navigation: 'تنقل',
    communication: 'تواصل',
    media: 'وسائط',
    tech: 'تقنية',
    business: 'أعمال',
    transport: 'مواصلات',
    lifestyle: 'أسلوب حياة'
  };

  const iconGroups = {
    general: [
      { name: 'home', icon: Home, label: 'البيت' },
      { name: 'user', icon: User, label: 'المستخدم' },
      { name: 'star', icon: Star, label: 'نجمة' },
      { name: 'heart', icon: Heart, label: 'قلب' },
      { name: 'settings', icon: Settings, label: 'إعدادات' },
      { name: 'search', icon: Search, label: 'بحث' },
      { name: 'plus', icon: Plus, label: 'إضافة' },
      { name: 'minus', icon: Minus, label: 'طرح' },
      { name: 'check', icon: Check, label: 'صح' },
      { name: 'x', icon: X, label: 'خطأ' },
    ],
    navigation: [
      { name: 'arrow-right', icon: ArrowRight, label: 'سهم يمين' },
      { name: 'arrow-left', icon: ArrowLeft, label: 'سهم يسار' },
      { name: 'arrow-up', icon: ArrowUp, label: 'سهم أعلى' },
      { name: 'arrow-down', icon: ArrowDown, label: 'سهم أسفل' },
      { name: 'map', icon: Map, label: 'خريطة' },
      { name: 'map-pin', icon: MapPin, label: 'دبوس الخريطة' },
      { name: 'navigation', icon: Navigation, label: 'ملاحة' },
      { name: 'compass', icon: Compass, label: 'بوصلة' },
    ],
    communication: [
      { name: 'mail', icon: Mail, label: 'بريد' },
      { name: 'phone', icon: Phone, label: 'هاتف' },
      { name: 'calendar', icon: Calendar, label: 'تقويم' },
      { name: 'clock', icon: Clock, label: 'ساعة' },
      { name: 'globe', icon: Globe, label: 'الكرة الأرضية' },
      { name: 'share-2', icon: Share2, label: 'مشاركة' },
    ],
    media: [
      { name: 'camera', icon: Camera, label: 'كاميرا' },
      { name: 'image', icon: Image, label: 'صورة' },
      { name: 'video', icon: Video, label: 'فيديو' },
      { name: 'music', icon: Music, label: 'موسيقى' },
      { name: 'volume-2', icon: Volume2, label: 'صوت' },
      { name: 'mic', icon: Mic, label: 'ميكروفون' },
      { name: 'mic-off', icon: MicOff, label: 'إيقاف الميكروفون' },
      { name: 'play', icon: Play, label: 'تشغيل' },
      { name: 'pause', icon: Pause, label: 'إيقاف مؤقت' },
    ],
    tech: [
      { name: 'code', icon: Code, label: 'كود' },
      { name: 'database', icon: Database, label: 'قاعدة بيانات' },
      { name: 'server', icon: Server, label: 'خادم' },
      { name: 'wifi', icon: Wifi, label: 'واي فاي' },
      { name: 'bluetooth', icon: Bluetooth, label: 'بلوتوث' },
      { name: 'battery', icon: Battery, label: 'بطارية' },
    ],
    business: [
      { name: 'trending-up', icon: TrendingUp, label: 'اتجاه صاعد' },
      { name: 'trending-down', icon: TrendingDown, label: 'اتجاه هابط' },
      { name: 'bar-chart-3', icon: BarChart3, label: 'رسم بياني' },
      { name: 'pie-chart', icon: PieChart, label: 'رسم دائري' },
      { name: 'activity', icon: Activity, label: 'نشاط' },
      { name: 'award', icon: Award, label: 'جائزة' },
      { name: 'target', icon: Target, label: 'هدف' },
      { name: 'dollar-sign', icon: DollarSign, label: 'دولار' },
      { name: 'credit-card', icon: CreditCard, label: 'بطاقة ائتمان' },
    ],
    transport: [
      { name: 'car', icon: Car, label: 'سيارة' },
      { name: 'plane', icon: Plane, label: 'طائرة' },
      { name: 'train', icon: Train, label: 'قطار' },
      { name: 'ship', icon: Ship, label: 'سفينة' },
      { name: 'bike', icon: Bike, label: 'دراجة' },
    ],
    lifestyle: [
      { name: 'coffee', icon: Coffee, label: 'قهوة' },
      { name: 'pizza', icon: Pizza, label: 'بيتزا' },
      { name: 'gamepad-2', icon: Gamepad2, label: 'ألعاب' },
      { name: 'gift', icon: Gift, label: 'هدية' },
      { name: 'shopping-cart', icon: ShoppingCart, label: 'سلة التسوق' },
      { name: 'palette', icon: PaletteIcon, label: 'لوحة ألوان' },
    ]
  };

  const allIcons = selectedCategory === 'all' 
    ? Object.values(iconGroups).flat()
    : iconGroups[selectedCategory as keyof typeof iconGroups] || [];

  const filteredIcons = allIcons.filter(icon =>
    icon.label.includes(searchTerm) || 
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIconSelect = (iconName: string) => {
    onIconSelect(iconName, {
      size: iconSize,
      color: iconColor,
      strokeWidth: strokeWidth
    });
    setIsOpen(false);
  };

  const presetColors = [
    '#000000', '#ffffff', '#ef4444', '#f97316', '#eab308', 
    '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
    '#64748b', '#78716c', '#dc2626', '#ea580c', '#ca8a04',
    '#16a34a', '#0891b2', '#2563eb', '#7c3aed', '#db2777'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Zap className="h-4 w-4" />
            {title}
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-full gap-4">
          {/* شريط جانبي للإعدادات */}
          <div className="w-64 space-y-4">
            {/* البحث */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث عن أيقونة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* الفئات */}
            <div>
              <Label className="text-sm font-medium">الفئات</Label>
              <div className="grid grid-cols-2 gap-1 mt-2">
                {Object.entries(iconCategories).map(([key, label]) => (
                  <Button
                    key={key}
                    variant={selectedCategory === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(key)}
                    className="text-xs"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* حجم الأيقونة */}
            <div>
              <Label className="text-sm font-medium">الحجم: {iconSize}px</Label>
              <Slider
                value={[iconSize]}
                onValueChange={([value]) => setIconSize(value)}
                min={16}
                max={48}
                step={2}
                className="mt-2"
              />
            </div>

            {/* لون الأيقونة */}
            <div>
              <Label className="text-sm font-medium">اللون</Label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {presetColors.map(color => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded border-2 ${
                      iconColor === color ? 'border-primary' : 'border-border'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setIconColor(color)}
                  />
                ))}
              </div>
              <Input
                type="color"
                value={iconColor}
                onChange={(e) => setIconColor(e.target.value)}
                className="w-full mt-2"
              />
            </div>

            {/* سمك الخط */}
            <div>
              <Label className="text-sm font-medium">سمك الخط: {strokeWidth}px</Label>
              <Slider
                value={[strokeWidth]}
                onValueChange={([value]) => setStrokeWidth(value)}
                min={1}
                max={4}
                step={0.5}
                className="mt-2"
              />
            </div>

            {/* معاينة */}
            <Card>
              <CardContent className="p-4 text-center">
                <Label className="text-sm font-medium">معاينة</Label>
                <div className="mt-2 flex justify-center">
                  <div
                    style={{
                      width: `${iconSize}px`,
                      height: `${iconSize}px`,
                      color: iconColor,
                      strokeWidth: strokeWidth
                    }}
                  >
                    <Star className="w-full h-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* منطقة الأيقونات */}
          <div className="flex-1">
            <ScrollArea className="h-full">
              <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 p-2">
                {filteredIcons.map((iconItem) => {
                  const IconComponent = iconItem.icon;
                  return (
                    <Card
                      key={iconItem.name}
                      className="cursor-pointer transition-all hover:shadow-md hover:scale-105"
                      onClick={() => handleIconSelect(iconItem.name)}
                    >
                      <CardContent className="p-3 text-center">
                        <div className="flex justify-center mb-2">
                          <IconComponent 
                            className="w-6 h-6"
                            style={{ 
                              color: iconColor,
                              strokeWidth: strokeWidth
                            }}
                          />
                        </div>
                        <p className="text-xs truncate">{iconItem.label}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredIcons.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">لا توجد أيقونات تطابق البحث</p>
                  {searchTerm && (
                    <p className="text-sm text-muted-foreground mt-2">
                      جرب البحث بكلمة أخرى
                    </p>
                  )}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IconPicker;