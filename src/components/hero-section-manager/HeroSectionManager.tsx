import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useHeroSectionManager } from '@/hooks/useHeroSectionManager';
import { HeroSectionControlPanel } from './HeroSectionControlPanel';
import { ElementManager } from './ElementManager';
import { Settings, Layers, Palette, Eye, EyeOff, Save, Download, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface HeroSectionManagerProps {
  onClose: () => void;
}

export const HeroSectionManager: React.FC<HeroSectionManagerProps> = ({ onClose }) => {
  const [user, setUser] = useState<any>(null);
  const { data: isAdmin } = useIsAdmin(user?.id);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const {
    config,
    elements,
    selectedElement,
    isLoading,
    hasUnsavedChanges,
    setSelectedElement,
    createElement,
    addElement,
    updateElement,
    deleteElement,
    reorderElements,
    duplicateElement,
    saveConfig,
    exportConfig,
    importConfig,
    resetToDefault
  } = useHeroSectionManager();

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  if (!isAdmin) {
    return null;
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importConfig(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex">
      {/* Sidebar Manager */}
      <div className="w-96 bg-white shadow-xl flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">مدير قسم البطل</h2>
              <p className="text-sm text-muted-foreground">تحكم شامل في جميع العناصر</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
          
          {/* Status Bar */}
          <div className="flex items-center gap-2 mt-3">
            <Badge variant={hasUnsavedChanges ? "destructive" : "secondary"}>
              {hasUnsavedChanges ? "تغييرات غير محفوظة" : "محفوظ"}
            </Badge>
            <Badge variant="outline">
              {elements.length} عنصر
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-b bg-muted/30">
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={saveConfig} 
              disabled={isLoading || !hasUnsavedChanges}
              size="sm"
              className="text-xs"
            >
              <Save className="w-4 h-4 mr-1" />
              حفظ
            </Button>
            <Button 
              onClick={() => setIsPreviewMode(!isPreviewMode)} 
              variant="outline"
              size="sm"
              className="text-xs"
            >
              {isPreviewMode ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
              {isPreviewMode ? "إنهاء المعاينة" : "معاينة"}
            </Button>
            <Button 
              onClick={exportConfig} 
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <Download className="w-4 h-4 mr-1" />
              تصدير
            </Button>
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" size="sm" className="w-full text-xs">
                <Upload className="w-4 h-4 mr-1" />
                استيراد
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="elements" className="h-full">
            <TabsList className="grid w-full grid-cols-3 m-2">
              <TabsTrigger value="elements" className="text-xs">
                <Layers className="w-4 h-4 mr-1" />
                العناصر
              </TabsTrigger>
              <TabsTrigger value="design" className="text-xs">
                <Palette className="w-4 h-4 mr-1" />
                التصميم
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs">
                <Settings className="w-4 h-4 mr-1" />
                الإعدادات
              </TabsTrigger>
            </TabsList>

            <TabsContent value="elements" className="m-2 space-y-2">
              <ElementManager
                elements={elements}
                selectedElement={selectedElement}
                onSelectElement={setSelectedElement}
                onAddElement={addElement}
                onUpdateElement={updateElement}
                onDeleteElement={deleteElement}
                onDuplicateElement={duplicateElement}
                onReorderElements={reorderElements}
                createElement={createElement}
              />
            </TabsContent>

            <TabsContent value="design" className="m-2">
              <HeroSectionControlPanel
                config={config}
                elements={elements}
                onUpdateElement={updateElement}
              />
            </TabsContent>

            <TabsContent value="settings" className="m-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">إعدادات عامة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={resetToDefault} 
                    variant="destructive"
                    className="w-full"
                  >
                    إعادة تعيين إلى الافتراضي
                  </Button>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>• إجمالي العناصر: {elements.length}</p>
                    <p>• آخر تعديل: {config?.updatedAt ? new Date(config.updatedAt).toLocaleDateString('ar-SA') : 'غير محدد'}</p>
                    <p>• الحالة: {hasUnsavedChanges ? 'تغييرات غير محفوظة' : 'محفوظ'}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-gray-100 overflow-auto">
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">منطقة المعاينة</h3>
            <p className="text-sm">ستظهر هنا معاينة حية للتغييرات</p>
            <p className="text-xs mt-2">اختر عنصراً من القائمة لبدء التحرير</p>
          </div>
        </div>
      </div>
    </div>
  );
};