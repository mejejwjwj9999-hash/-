import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HeroSectionManager } from '@/components/hero-section-manager/HeroSectionManager';
import { Layout, Eye, Settings, Palette, Plus, Download, Upload, Save } from 'lucide-react';
import { useHeroSectionManager } from '@/hooks/useHeroSectionManager';
import { useTemplates } from '@/hooks/useTemplates';
import { useAutoSave } from '@/hooks/useAutoSave';
import { toast } from '@/hooks/use-toast';

const HeroSectionAdmin: React.FC = () => {
  const [showFullManager, setShowFullManager] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const {
    config,
    elements,
    hasUnsavedChanges,
    saveConfig,
    exportConfig,
    importConfig,
    resetToDefault
  } = useHeroSectionManager();

  const { templates, saveTemplate, applyTemplate } = useTemplates();

  // Auto-save every 30 seconds
  const { saveNow, hasUnsavedChanges: autoSaveHasChanges } = useAutoSave({
    data: config,
    onSave: saveConfig,
    delay: 30000,
    enabled: true
  });

  const handleExport = async () => {
    try {
      await exportConfig();
      toast({
        title: 'تم التصدير بنجاح',
        description: 'تم تصدير إعدادات القسم الرئيسي'
      });
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importConfig(file);
    }
  };

  const handleApplyTemplate = (templateId: string) => {
    const newConfig = applyTemplate(templateId);
    if (newConfig) {
      toast({
        title: 'تم تطبيق القالب',
        description: 'تم تطبيق القالب على القسم الرئيسي'
      });
    }
  };

  if (showFullManager) {
    return <HeroSectionManager onClose={() => setShowFullManager(false)} />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة القسم الرئيسي</h1>
          <p className="text-gray-600 mt-2">تحكم شامل في تصميم ومحتوى القسم الرئيسي للموقع</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={hasUnsavedChanges ? "destructive" : "secondary"}>
            {hasUnsavedChanges ? "تغييرات غير محفوظة" : "محفوظ"}
          </Badge>
          
          <Button 
            onClick={() => setShowFullManager(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Settings className="w-4 h-4 mr-2" />
            فتح لوحة التحكم الكاملة
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Layout className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">إجمالي العناصر</p>
              <p className="text-2xl font-bold">{elements.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Eye className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">العناصر المرئية</p>
              <p className="text-2xl font-bold">{elements.filter(e => e.visible).length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Palette className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">القوالب المتاحة</p>
              <p className="text-2xl font-bold">{templates.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Save className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">آخر حفظ</p>
              <p className="text-sm font-medium">
                {config?.updatedAt ? new Date(config.updatedAt).toLocaleDateString('ar-SA') : 'غير محدد'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              القوالب الجاهزة
            </CardTitle>
            <CardDescription>
              قوالب محددة مسبقاً لتصميم سريع وجميل
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {templates.slice(0, 3).map((template) => (
              <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleApplyTemplate(template.id)}
                >
                  تطبيق
                </Button>
              </div>
            ))}
            
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => setShowFullManager(true)}
            >
              عرض جميع القوالب
            </Button>
          </CardContent>
        </Card>

        {/* Quick Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              أدوات سريعة
            </CardTitle>
            <CardDescription>
              إجراءات سريعة لإدارة القسم الرئيسي
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => saveNow()}
              disabled={!hasUnsavedChanges}
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              حفظ التغييرات الآن
            </Button>
            
            <Button 
              onClick={handleExport}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              تصدير الإعدادات
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                استيراد إعدادات
              </Button>
            </div>
            
            <Button 
              onClick={() => setShowPreview(!showPreview)}
              variant="secondary"
              className="w-full"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'إخفاء المعاينة' : 'معاينة القسم'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Changes */}
      <Card>
        <CardHeader>
          <CardTitle>التغييرات الأخيرة</CardTitle>
          <CardDescription>
            آخر التعديلات المحفوظة على القسم الرئيسي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {elements.slice(0, 5).map((element) => (
              <div key={element.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">{element.elementKey}</p>
                    <p className="text-sm text-gray-600">
                      نوع العنصر: {
                        element.type === 'text' ? 'نص' :
                        element.type === 'image' ? 'صورة' :
                        element.type === 'button' ? 'زر' :
                        element.type === 'icon' ? 'أيقونة' :
                        element.type === 'stat' ? 'إحصائية' : element.type
                      }
                    </p>
                  </div>
                </div>
                <Badge variant={element.visible ? "secondary" : "outline"}>
                  {element.visible ? "مرئي" : "مخفي"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle>معاينة القسم الرئيسي</CardTitle>
            <CardDescription>
              معاينة حية للقسم الرئيسي كما سيظهر للزوار
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="text-gray-500">
                <Layout className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">معاينة القسم الرئيسي</h3>
                <p className="text-sm">
                  ستظهر هنا معاينة حية للقسم الرئيسي مع جميع التحديثات
                </p>
                <Button 
                  className="mt-4"
                  onClick={() => setShowFullManager(true)}
                >
                  فتح المعاينة التفاعلية
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HeroSectionAdmin;