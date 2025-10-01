import React from 'react';
import { Label } from '@/components/ui/label';
import { EnhancedWysiwygEditor } from '@/components/admin/EnhancedWysiwygEditor';
import { useUpdateContentElement } from '@/hooks/useContentEditor';
import { useAutoSaveManager } from '@/hooks/useAutoSaveManager';

interface RichTextInlineEditorProps {
  contentAr: string;
  contentEn: string;
  metadata: any;
  onContentArChange: (content: string) => void;
  onContentEnChange: (content: string) => void;
  onMetadataChange: (metadata: any) => void;
  activeTab: string;
  pageKey?: string;
  elementKey?: string;
}

export const RichTextInlineEditor: React.FC<RichTextInlineEditorProps> = ({
  contentAr,
  contentEn,
  onContentArChange,
  onContentEnChange,
  activeTab,
  pageKey,
  elementKey
}) => {
  const updateContentMutation = useUpdateContentElement();

  // تكامل AutoSaveManager المحسّن
  const autoSaveManager = useAutoSaveManager({
    config: {
      enabled: true,
      interval: 30000, // 30 ثانية
      debounceTime: 2000, // ثانيتان
      maxRetries: 3,
      showNotifications: true,
      onlyOnUserAction: true
    },
    onSave: async (content: string, metadata?: any) => {
      if (pageKey && elementKey) {
        await updateContentMutation.mutateAsync({
          pageKey,
          elementKey,
          elementType: 'rich_text',
          contentAr: activeTab === 'ar' ? content : contentAr,
          contentEn: activeTab === 'en' ? content : contentEn,
          status: 'draft',
          metadata
        });
      }
    },
    onError: (error) => {
      console.error('Auto-save error:', error);
    }
  });

  const handleAutoSave = async (content: string) => {
    const currentContent = activeTab === 'ar' ? contentAr : contentEn;
    autoSaveManager.updateContent(content, { activeTab, lastModified: new Date() }, true);
  };
  return (
    <div className="space-y-4">
      {activeTab === 'ar' ? (
        <div className="space-y-2">
          <Label className="text-right block">المحتوى بالعربية</Label>
          <EnhancedWysiwygEditor
            value={contentAr}
            onChange={onContentArChange}
            onAutoSave={handleAutoSave}
            placeholder="اكتب المحتوى المنسق هنا..."
            height="300px"
            language="ar"
            autoSave={true}
            showAdvancedFeatures={true}
            pageKey={pageKey}
            elementKey={elementKey}
            enableAI={true}
            enableVersionHistory={true}
            enableImageEditing={true}
          />
        </div>
      ) : (
        <div className="space-y-2">
          <Label className="text-left block">English Content</Label>
          <EnhancedWysiwygEditor
            value={contentEn}
            onChange={onContentEnChange}
            onAutoSave={handleAutoSave}
            placeholder="Enter formatted content here..."
            height="300px"
            language="en"
            autoSave={true}
            showAdvancedFeatures={true}
            pageKey={pageKey}
            elementKey={elementKey}
            enableAI={true}
            enableVersionHistory={true}
            enableImageEditing={true}
          />
        </div>
      )}
    </div>
  );
};