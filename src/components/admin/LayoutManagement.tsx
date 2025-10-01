import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Layout, 
  Grid, 
  Sidebar, 
  Save, 
  RotateCcw, 
  Download, 
  Upload,
  Eye,
  Move,
  Layers,
  Settings
} from 'lucide-react';

interface LayoutSettings {
  id?: string;
  header_enabled: boolean;
  header_height: string;
  header_sticky: boolean;
  sidebar_enabled: boolean;
  sidebar_width: string;
  sidebar_position: 'left' | 'right';
  footer_enabled: boolean;
  footer_height: string;
  content_max_width: string;
  content_padding: string;
  grid_columns: number;
  grid_gap: string;
  responsive_breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  animations_enabled: boolean;
  smooth_scrolling: boolean;
  created_at?: string;
  updated_at?: string;
}

const DEFAULT_LAYOUT: LayoutSettings = {
  header_enabled: true,
  header_height: '64px',
  header_sticky: true,
  sidebar_enabled: true,
  sidebar_width: '280px',
  sidebar_position: 'right',
  footer_enabled: true,
  footer_height: 'auto',
  content_max_width: '1200px',
  content_padding: '24px',
  grid_columns: 12,
  grid_gap: '24px',
  responsive_breakpoints: {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px'
  },
  animations_enabled: true,
  smooth_scrolling: true
};

const LayoutManagement: React.FC = () => {
  const [settings, setSettings] = useState<LayoutSettings>(DEFAULT_LAYOUT);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadLayoutSettings();
  }, []);

  const loadLayoutSettings = async () => {
    try {
      setIsLoading(true);
      // Use localStorage as temporary storage
      const saved = localStorage.getItem('layout_settings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading layout settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveLayoutSettings = async () => {
    try {
      setIsLoading(true);
      
      // Save to localStorage as temporary storage
      const updatedSettings = {
        ...settings,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('layout_settings', JSON.stringify(updatedSettings));
      setSettings(updatedSettings);

      setHasUnsavedChanges(false);
      toast({
        title: 'تم الحفظ بنجاح',
        description: 'تم حفظ إعدادات التخطيط'
      });
    } catch (error) {
      console.error('Error saving layout:', error);
      toast({
        title: 'خطأ في الحفظ',
        description: 'حدث خطأ أثناء حفظ إعدادات التخطيط',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (key: keyof LayoutSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const updateBreakpoint = (breakpoint: keyof LayoutSettings['responsive_breakpoints'], value: string) => {
    setSettings(prev => ({
      ...prev,
      responsive_breakpoints: {
        ...prev.responsive_breakpoints,
        [breakpoint]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const resetToDefault = () => {
    setSettings(DEFAULT_LAYOUT);
    setHasUnsavedChanges(true);
  };

  const exportLayout = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `layout-settings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importLayout = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setSettings({ ...DEFAULT_LAYOUT, ...imported });
        setHasUnsavedChanges(true);
        toast({
          title: 'تم الاستيراد بنجاح',
          description: 'تم استيراد إعدادات التخطيط'
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
          <h1 className="text-3xl font-bold">إدارة التخطيط</h1>
          <p className="text-muted-foreground mt-2">تحكم في تخطيط وهيكل الموقع</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={hasUnsavedChanges ? "destructive" : "secondary"}>
            {hasUnsavedChanges ? "تغييرات غير محفوظة" : "محفوظ"}
          </Badge>
          
          <Button 
            onClick={saveLayoutSettings}
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
          <Tabs defaultValue="structure" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="structure">الهيكل</TabsTrigger>
              <TabsTrigger value="grid">الشبكة</TabsTrigger>
              <TabsTrigger value="responsive">الاستجابة</TabsTrigger>
              <TabsTrigger value="advanced">متقدم</TabsTrigger>
            </TabsList>

            <TabsContent value="structure" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="w-5 h-5" />
                    هيكل الصفحة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Header Settings */}
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      رأس الصفحة (Header)
                    </h4>
                    <div className="flex items-center justify-between">
                      <Label>تفعيل رأس الصفحة</Label>
                      <Switch
                        checked={settings.header_enabled}
                        onCheckedChange={(checked) => updateSetting('header_enabled', checked)}
                      />
                    </div>
                    
                    {settings.header_enabled && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>ارتفاع الرأس</Label>
                            <Input
                              value={settings.header_height}
                              onChange={(e) => updateSetting('header_height', e.target.value)}
                              placeholder="64px"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>رأس ثابت</Label>
                            <Switch
                              checked={settings.header_sticky}
                              onCheckedChange={(checked) => updateSetting('header_sticky', checked)}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <Separator />

                  {/* Sidebar Settings */}
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Sidebar className="w-4 h-4" />
                      الشريط الجانبي
                    </h4>
                    <div className="flex items-center justify-between">
                      <Label>تفعيل الشريط الجانبي</Label>
                      <Switch
                        checked={settings.sidebar_enabled}
                        onCheckedChange={(checked) => updateSetting('sidebar_enabled', checked)}
                      />
                    </div>
                    
                    {settings.sidebar_enabled && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>عرض الشريط الجانبي</Label>
                          <Input
                            value={settings.sidebar_width}
                            onChange={(e) => updateSetting('sidebar_width', e.target.value)}
                            placeholder="280px"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>موضع الشريط</Label>
                          <div className="flex gap-2">
                            <Button
                              variant={settings.sidebar_position === 'right' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => updateSetting('sidebar_position', 'right')}
                            >
                              يمين
                            </Button>
                            <Button
                              variant={settings.sidebar_position === 'left' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => updateSetting('sidebar_position', 'left')}
                            >
                              يسار
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Footer Settings */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">تذييل الصفحة (Footer)</h4>
                    <div className="flex items-center justify-between">
                      <Label>تفعيل تذييل الصفحة</Label>
                      <Switch
                        checked={settings.footer_enabled}
                        onCheckedChange={(checked) => updateSetting('footer_enabled', checked)}
                      />
                    </div>
                    
                    {settings.footer_enabled && (
                      <div className="space-y-2">
                        <Label>ارتفاع التذييل</Label>
                        <Input
                          value={settings.footer_height}
                          onChange={(e) => updateSetting('footer_height', e.target.value)}
                          placeholder="auto"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="grid" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Grid className="w-5 h-5" />
                    نظام الشبكة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>عدد الأعمدة</Label>
                      <Input
                        type="number"
                        value={settings.grid_columns}
                        onChange={(e) => updateSetting('grid_columns', parseInt(e.target.value))}
                        min="1"
                        max="24"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>المسافة بين الأعمدة</Label>
                      <Input
                        value={settings.grid_gap}
                        onChange={(e) => updateSetting('grid_gap', e.target.value)}
                        placeholder="24px"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>العرض الأقصى للمحتوى</Label>
                    <Input
                      value={settings.content_max_width}
                      onChange={(e) => updateSetting('content_max_width', e.target.value)}
                      placeholder="1200px"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>حشو المحتوى</Label>
                    <Input
                      value={settings.content_padding}
                      onChange={(e) => updateSetting('content_padding', e.target.value)}
                      placeholder="24px"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="responsive" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>نقاط التكسر المتجاوبة</CardTitle>
                  <CardDescription>
                    تحديد نقاط التكسر للتصميم المتجاوب
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>الهاتف المحمول</Label>
                    <Input
                      value={settings.responsive_breakpoints.mobile}
                      onChange={(e) => updateBreakpoint('mobile', e.target.value)}
                      placeholder="640px"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>الجهاز اللوحي</Label>
                    <Input
                      value={settings.responsive_breakpoints.tablet}
                      onChange={(e) => updateBreakpoint('tablet', e.target.value)}
                      placeholder="768px"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>سطح المكتب</Label>
                    <Input
                      value={settings.responsive_breakpoints.desktop}
                      onChange={(e) => updateBreakpoint('desktop', e.target.value)}
                      placeholder="1024px"
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
                      <Label>التحريك والانتقالات</Label>
                      <p className="text-sm text-muted-foreground">تفعيل الرسوم المتحركة</p>
                    </div>
                    <Switch
                      checked={settings.animations_enabled}
                      onCheckedChange={(checked) => updateSetting('animations_enabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>التمرير السلس</Label>
                      <p className="text-sm text-muted-foreground">تفعيل التمرير السلس</p>
                    </div>
                    <Switch
                      checked={settings.smooth_scrolling}
                      onCheckedChange={(checked) => updateSetting('smooth_scrolling', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={exportLayout}>
                      <Download className="w-4 h-4 mr-2" />
                      تصدير التخطيط
                    </Button>
                    
                    <div className="relative">
                      <input
                        type="file"
                        accept=".json"
                        onChange={importLayout}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        استيراد تخطيط
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
                معاينة التخطيط
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-2">
                {/* Header Preview */}
                {settings.header_enabled && (
                  <div 
                    className="bg-primary/10 border rounded p-2 text-center text-xs"
                    style={{ height: settings.header_height }}
                  >
                    رأس الصفحة {settings.header_sticky && '(ثابت)'}
                  </div>
                )}
                
                {/* Content Area with Sidebar */}
                <div className="flex gap-2 min-h-24">
                  {settings.sidebar_enabled && settings.sidebar_position === 'right' && (
                    <div 
                      className="bg-secondary/20 border rounded p-2 text-center text-xs flex items-center justify-center"
                      style={{ width: settings.sidebar_width }}
                    >
                      شريط جانبي
                    </div>
                  )}
                  
                  <div 
                    className="bg-muted/30 border rounded p-2 text-center text-xs flex-1 flex items-center justify-center"
                    style={{ 
                      maxWidth: settings.content_max_width,
                      padding: settings.content_padding 
                    }}
                  >
                    محتوى الصفحة
                    <br />
                    ({settings.grid_columns} عمود)
                  </div>
                  
                  {settings.sidebar_enabled && settings.sidebar_position === 'left' && (
                    <div 
                      className="bg-secondary/20 border rounded p-2 text-center text-xs flex items-center justify-center"
                      style={{ width: settings.sidebar_width }}
                    >
                      شريط جانبي
                    </div>
                  )}
                </div>
                
                {/* Footer Preview */}
                {settings.footer_enabled && (
                  <div 
                    className="bg-primary/10 border rounded p-2 text-center text-xs"
                    style={{ height: settings.footer_height }}
                  >
                    تذييل الصفحة
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إحصائيات التخطيط</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>عدد الأعمدة:</span>
                <span>{settings.grid_columns}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>العرض الأقصى:</span>
                <span>{settings.content_max_width}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>الرسوم المتحركة:</span>
                <Badge variant={settings.animations_enabled ? "default" : "secondary"}>
                  {settings.animations_enabled ? 'مفعلة' : 'معطلة'}
                </Badge>
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

export default LayoutManagement;