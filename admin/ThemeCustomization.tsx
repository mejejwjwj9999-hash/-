import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Palette, 
  Eye, 
  Save, 
  RotateCcw, 
  Download, 
  Upload,
  Sun,
  Moon,
  Sparkles,
  Brush
} from 'lucide-react';

interface ThemeSettings {
  id?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  border_color: string;
  success_color: string;
  warning_color: string;
  error_color: string;
  font_family: string;
  font_size_base: string;
  border_radius: string;
  dark_mode_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

const DEFAULT_THEME: ThemeSettings = {
  primary_color: '#3b82f6',
  secondary_color: '#64748b',
  accent_color: '#f59e0b',
  background_color: '#ffffff',
  text_color: '#1f2937',
  border_color: '#e5e7eb',
  success_color: '#10b981',
  warning_color: '#f59e0b',
  error_color: '#ef4444',
  font_family: 'Inter, sans-serif',
  font_size_base: '16px',
  border_radius: '8px',
  dark_mode_enabled: false
};

const ThemeCustomization: React.FC = () => {
  const [settings, setSettings] = useState<ThemeSettings>(DEFAULT_THEME);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadThemeSettings();
  }, []);

  const loadThemeSettings = async () => {
    try {
      setIsLoading(true);
      // Use localStorage as temporary storage
      const saved = localStorage.getItem('theme_settings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveThemeSettings = async () => {
    try {
      setIsLoading(true);
      
      // Save to localStorage as temporary storage
      const updatedSettings = {
        ...settings,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('theme_settings', JSON.stringify(updatedSettings));
      setSettings(updatedSettings);

      setHasUnsavedChanges(false);
      toast({
        title: 'تم الحفظ بنجاح',
        description: 'تم حفظ إعدادات المظهر'
      });
    } catch (error) {
      console.error('Error saving theme:', error);
      toast({
        title: 'خطأ في الحفظ',
        description: 'حدث خطأ أثناء حفظ إعدادات المظهر',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (key: keyof ThemeSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const resetToDefault = () => {
    setSettings(DEFAULT_THEME);
    setHasUnsavedChanges(true);
  };

  const exportTheme = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `theme-settings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setSettings({ ...DEFAULT_THEME, ...imported });
        setHasUnsavedChanges(true);
        toast({
          title: 'تم الاستيراد بنجاح',
          description: 'تم استيراد إعدادات المظهر'
        });
      } catch (error) {
        toast({
          title: 'خطأ في الاستيراد',
          description: 'ملف غير صالح',
          variant: 'destructive'
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">تخصيص المظهر</h1>
          <p className="text-muted-foreground mt-2">تحكم في ألوان ومظهر الموقع</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={hasUnsavedChanges ? "destructive" : "secondary"}>
            {hasUnsavedChanges ? "تغييرات غير محفوظة" : "محفوظ"}
          </Badge>
          
          <Button 
            onClick={saveThemeSettings}
            disabled={!hasUnsavedChanges || isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            حفظ التغييرات
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="colors" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="colors">الألوان</TabsTrigger>
              <TabsTrigger value="typography">الخطوط</TabsTrigger>
              <TabsTrigger value="spacing">التباعد</TabsTrigger>
              <TabsTrigger value="advanced">متقدم</TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    ألوان النظام الأساسية
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary">اللون الأساسي</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary"
                        type="color"
                        value={settings.primary_color}
                        onChange={(e) => updateSetting('primary_color', e.target.value)}
                        className="w-16"
                      />
                      <Input
                        value={settings.primary_color}
                        onChange={(e) => updateSetting('primary_color', e.target.value)}
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondary">اللون الثانوي</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondary"
                        type="color"
                        value={settings.secondary_color}
                        onChange={(e) => updateSetting('secondary_color', e.target.value)}
                        className="w-16"
                      />
                      <Input
                        value={settings.secondary_color}
                        onChange={(e) => updateSetting('secondary_color', e.target.value)}
                        placeholder="#64748b"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accent">لون التمييز</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accent"
                        type="color"
                        value={settings.accent_color}
                        onChange={(e) => updateSetting('accent_color', e.target.value)}
                        className="w-16"
                      />
                      <Input
                        value={settings.accent_color}
                        onChange={(e) => updateSetting('accent_color', e.target.value)}
                        placeholder="#f59e0b"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="background">لون الخلفية</Label>
                    <div className="flex gap-2">
                      <Input
                        id="background"
                        type="color"
                        value={settings.background_color}
                        onChange={(e) => updateSetting('background_color', e.target.value)}
                        className="w-16"
                      />
                      <Input
                        value={settings.background_color}
                        onChange={(e) => updateSetting('background_color', e.target.value)}
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>الألوان التفاعلية</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="success">لون النجاح</Label>
                    <div className="flex gap-2">
                      <Input
                        id="success"
                        type="color"
                        value={settings.success_color}
                        onChange={(e) => updateSetting('success_color', e.target.value)}
                        className="w-16"
                      />
                      <Input
                        value={settings.success_color}
                        onChange={(e) => updateSetting('success_color', e.target.value)}
                        placeholder="#10b981"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="warning">لون التحذير</Label>
                    <div className="flex gap-2">
                      <Input
                        id="warning"
                        type="color"
                        value={settings.warning_color}
                        onChange={(e) => updateSetting('warning_color', e.target.value)}
                        className="w-16"
                      />
                      <Input
                        value={settings.warning_color}
                        onChange={(e) => updateSetting('warning_color', e.target.value)}
                        placeholder="#f59e0b"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="error">لون الخطأ</Label>
                    <div className="flex gap-2">
                      <Input
                        id="error"
                        type="color"
                        value={settings.error_color}
                        onChange={(e) => updateSetting('error_color', e.target.value)}
                        className="w-16"
                      />
                      <Input
                        value={settings.error_color}
                        onChange={(e) => updateSetting('error_color', e.target.value)}
                        placeholder="#ef4444"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="typography" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الخطوط</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fontFamily">عائلة الخط</Label>
                    <Input
                      id="fontFamily"
                      value={settings.font_family}
                      onChange={(e) => updateSetting('font_family', e.target.value)}
                      placeholder="Inter, sans-serif"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fontSize">حجم الخط الأساسي</Label>
                    <Input
                      id="fontSize"
                      value={settings.font_size_base}
                      onChange={(e) => updateSetting('font_size_base', e.target.value)}
                      placeholder="16px"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="spacing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات التباعد</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="borderRadius">نصف قطر الحواف</Label>
                    <Input
                      id="borderRadius"
                      value={settings.border_radius}
                      onChange={(e) => updateSetting('border_radius', e.target.value)}
                      placeholder="8px"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات متقدمة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>الوضع المظلم</Label>
                      <p className="text-sm text-muted-foreground">تفعيل الوضع المظلم للموقع</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSetting('dark_mode_enabled', !settings.dark_mode_enabled)}
                    >
                      {settings.dark_mode_enabled ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                      {settings.dark_mode_enabled ? 'مظلم' : 'فاتح'}
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={exportTheme}>
                      <Download className="w-4 h-4 mr-2" />
                      تصدير المظهر
                    </Button>
                    
                    <div className="relative">
                      <input
                        type="file"
                        accept=".json"
                        onChange={importTheme}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        استيراد مظهر
                      </Button>
                    </div>
                    
                    <Button variant="destructive" onClick={resetToDefault}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      استعادة الافتراضي
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                معاينة المظهر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="p-4 rounded-lg border-2 border-dashed space-y-4"
                style={{
                  backgroundColor: settings.background_color,
                  color: settings.text_color,
                  fontFamily: settings.font_family,
                  fontSize: settings.font_size_base,
                  borderRadius: settings.border_radius
                }}
              >
                <h3 className="font-bold text-lg">عنوان تجريبي</h3>
                <p className="text-sm">هذا نص تجريبي لمعاينة المظهر</p>
                
                <div className="flex gap-2 flex-wrap">
                  <div 
                    className="px-3 py-1 rounded text-white text-sm"
                    style={{ backgroundColor: settings.primary_color }}
                  >
                    أساسي
                  </div>
                  <div 
                    className="px-3 py-1 rounded text-white text-sm"
                    style={{ backgroundColor: settings.secondary_color }}
                  >
                    ثانوي
                  </div>
                  <div 
                    className="px-3 py-1 rounded text-white text-sm"
                    style={{ backgroundColor: settings.accent_color }}
                  >
                    مميز
                  </div>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <div 
                    className="px-2 py-1 rounded text-white text-xs"
                    style={{ backgroundColor: settings.success_color }}
                  >
                    نجح
                  </div>
                  <div 
                    className="px-2 py-1 rounded text-white text-xs"
                    style={{ backgroundColor: settings.warning_color }}
                  >
                    تحذير
                  </div>
                  <div 
                    className="px-2 py-1 rounded text-white text-xs"
                    style={{ backgroundColor: settings.error_color }}
                  >
                    خطأ
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إحصائيات المظهر</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>الوضع الحالي:</span>
                <Badge variant="outline">
                  {settings.dark_mode_enabled ? 'مظلم' : 'فاتح'}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>عدد الألوان المخصصة:</span>
                <span>9</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>آخر تحديث:</span>
                <span>{settings.updated_at ? new Date(settings.updated_at).toLocaleDateString('ar-SA') : 'غير محدد'}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomization;