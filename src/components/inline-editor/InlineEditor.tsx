import React, { useState } from 'react';
import { Save, X, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { TextInlineEditor } from './TextInlineEditor';
import { RichTextInlineEditor } from './RichTextInlineEditor';
import { ImageInlineEditor } from './ImageInlineEditor';
import { ButtonInlineEditor } from './ButtonInlineEditor';
import { IconInlineEditor } from './IconInlineEditor';
import { IconInlineEditorNew } from './IconInlineEditorNew';
import { StatInlineEditor } from './StatInlineEditor';
import { StatInlineEditorNew } from './StatInlineEditorNew';
import { LayoutInlineEditor } from './LayoutInlineEditor';
import { BackgroundInlineEditor } from './BackgroundInlineEditor';
import { AnimationInlineEditor } from './AnimationInlineEditor';
import { useUpdateContentElement } from '@/hooks/useContentEditor';
import { useInlineEditor } from '@/contexts/InlineEditorContext';
import { motion } from 'framer-motion';

interface InlineEditorProps {
  pageKey: string;
  elementKey: string;
  elementType: 'text' | 'rich_text' | 'image' | 'button' | 'icon' | 'stat' | 'layout' | 'background' | 'animation';
  initialContentAr?: string;
  initialContentEn?: string;
  initialMetadata?: any;
  onCancel: () => void;
}

export const InlineEditor: React.FC<InlineEditorProps> = ({
  pageKey,
  elementKey,
  elementType,
  initialContentAr = '',
  initialContentEn = '',
  initialMetadata = {},
  onCancel
}) => {
  const [contentAr, setContentAr] = useState(initialContentAr);
  const [contentEn, setContentEn] = useState(initialContentEn);
  const [metadata, setMetadata] = useState(initialMetadata);
  const [isPreview, setIsPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('ar');
  
  const { setEditing, setUnsavedChanges } = useInlineEditor();
  const updateContentMutation = useUpdateContentElement();

  const hasChanges = 
    contentAr !== initialContentAr || 
    contentEn !== initialContentEn || 
    JSON.stringify(metadata) !== JSON.stringify(initialMetadata);

  React.useEffect(() => {
    setUnsavedChanges(hasChanges);
  }, [hasChanges, setUnsavedChanges]);

  const handleSave = async (status: 'draft' | 'published' = 'published') => {
    try {
      console.log('Attempting to save content:', {
        pageKey,
        elementKey,
        elementType,
        contentAr: contentAr.substring(0, 50) + '...',
        contentEn: contentEn.substring(0, 50) + '...',
        metadata,
        status
      });

      await updateContentMutation.mutateAsync({
        pageKey,
        elementKey,
        elementType,
        contentAr,
        contentEn,
        metadata,
        status
      });
      
      setEditing(null, false);
      console.log('Content saved successfully');
    } catch (error) {
      console.error('Error saving content:', error);
      console.error('Error details:', {
        name: error?.name,
        message: error?.message,
        stack: error?.stack
      });
      
      let errorTitle = 'خطأ في الحفظ ❌';
      let errorDescription = 'حدث خطأ أثناء حفظ التغييرات';
      
      if (error instanceof Error) {
        if (error.message.includes('permission') || error.message.includes('unauthorized')) {
          errorTitle = 'خطأ في الصلاحيات 🔒';
          errorDescription = 'ليس لديك صلاحية لحفظ هذا المحتوى';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorTitle = 'خطأ في الاتصال 🌐';
          errorDescription = 'تعذر الاتصال بالخادم، تحقق من اتصال الإنترنت';
        } else if (error.message.includes('validation')) {
          errorTitle = 'خطأ في البيانات ⚠️';
          errorDescription = 'البيانات المدخلة غير صحيحة، يرجى المراجعة';
        } else {
          errorDescription = `خطأ: ${error.message}`;
        }
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: 'destructive',
        duration: 5000
      });
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('هل أنت متأكد؟ سيتم فقدان جميع التغييرات غير المحفوظة.')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  const renderEditor = () => {
    const editorProps = {
      contentAr,
      contentEn,
      metadata,
      onContentArChange: setContentAr,
      onContentEnChange: setContentEn,
      onMetadataChange: setMetadata,
      activeTab
    };

    switch (elementType) {
      case 'text':
        return <TextInlineEditor {...editorProps} />;
      case 'rich_text':
        return <RichTextInlineEditor {...editorProps} pageKey={pageKey} elementKey={elementKey} />;
      case 'image':
        return <ImageInlineEditor {...editorProps} />;
      case 'button':
        return <ButtonInlineEditor {...editorProps} />;
      case 'icon':
        return <IconInlineEditorNew {...editorProps} />;
      case 'stat':
        return <StatInlineEditorNew {...editorProps} />;
      case 'layout':
        return <div className="p-4 text-center text-muted-foreground">محرر التخطيط قيد التطوير</div>;
      case 'background':
        return <div className="p-4 text-center text-muted-foreground">محرر الخلفية قيد التطوير</div>;
      case 'animation':
        return <div className="p-4 text-center text-muted-foreground">محرر الحركات قيد التطوير</div>;
      default:
        return <TextInlineEditor {...editorProps} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-20"
    >
      <Card className="min-w-[400px] max-w-2xl w-full mx-auto border-2 border-primary/20 shadow-xl bg-background/95 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-border/50">
          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold text-foreground">
              تحرير المحتوى
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {elementKey}
              </span>
              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium border border-primary/20">
                {elementType === 'text' && 'نص بسيط'}
                {elementType === 'rich_text' && 'نص منسق'}
                {elementType === 'image' && 'صورة'}
                {elementType === 'button' && 'زر'}
                {elementType === 'icon' && 'أيقونة'}
                {elementType === 'stat' && 'إحصائية'}
                {elementType === 'layout' && 'تخطيط'}
                {elementType === 'background' && 'خلفية'}
                {elementType === 'animation' && 'حركة'}
              </span>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className="shrink-0"
          >
            <Eye className="h-4 w-4 mr-2" />
            {isPreview ? 'تحرير' : 'معاينة'}
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Language Tabs */}
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 h-11">
                <TabsTrigger value="ar" className="text-right text-base">العربية</TabsTrigger>
                <TabsTrigger value="en" className="text-left text-base">English</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Editor Content */}
          <div className="space-y-4">
            {isPreview ? (
              <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-6 bg-muted/30 min-h-[120px]">
                <div className="text-sm font-medium text-muted-foreground mb-3">معاينة المحتوى:</div>
                <div className={`${activeTab === 'ar' ? 'text-right' : 'text-left'} text-base leading-relaxed`}>
                  {activeTab === 'ar' ? contentAr || 'لا يوجد محتوى للعرض' : contentEn || 'No content to display'}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {renderEditor()}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-border/50 p-6 pt-4 bg-muted/20">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => handleSave('published')}
                  disabled={updateContentMutation.isPending || !hasChanges}
                  size="default"
                  className="px-6 py-2.5"
                >
                  {updateContentMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  حفظ ونشر
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleSave('draft')}
                  disabled={updateContentMutation.isPending || !hasChanges}
                  size="default"
                  className="px-6 py-2.5"
                >
                  حفظ كمسودة
                </Button>
              </div>
              
              <Button
                variant="ghost"
                onClick={handleCancel}
                disabled={updateContentMutation.isPending}
                size="default"
                className="px-6 py-2.5"
              >
                <X className="h-4 w-4 mr-2" />
                إلغاء
              </Button>
            </div>
            
            {hasChanges && (
              <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                يوجد تغييرات غير محفوظة
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};