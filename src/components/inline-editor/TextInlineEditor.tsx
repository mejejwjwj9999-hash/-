import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TabsContent } from '@/components/ui/tabs';

interface TextInlineEditorProps {
  contentAr: string;
  contentEn: string;
  metadata: any;
  onContentArChange: (content: string) => void;
  onContentEnChange: (content: string) => void;
  onMetadataChange: (metadata: any) => void;
  activeTab: string;
}

export const TextInlineEditor: React.FC<TextInlineEditorProps> = ({
  contentAr,
  contentEn,
  onContentArChange,
  onContentEnChange,
  activeTab
}) => {
  const isMultiline = (contentAr && contentAr.length > 100) || (contentEn && contentEn.length > 100);

  return (
    <div className="space-y-4">
      {activeTab === 'ar' ? (
        <div className="space-y-2">
          <Label htmlFor="content-ar" className="text-right block">المحتوى بالعربية</Label>
          {isMultiline ? (
            <Textarea
              id="content-ar"
              value={contentAr}
              onChange={(e) => onContentArChange(e.target.value)}
              placeholder="اكتب النص هنا..."
              className="text-right min-h-[100px] resize-y"
              dir="rtl"
            />
          ) : (
            <Input
              id="content-ar"
              value={contentAr}
              onChange={(e) => onContentArChange(e.target.value)}
              placeholder="اكتب النص هنا..."
              className="text-right"
              dir="rtl"
            />
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="content-en" className="text-left block">English Content</Label>
          {isMultiline ? (
            <Textarea
              id="content-en"
              value={contentEn}
              onChange={(e) => onContentEnChange(e.target.value)}
              placeholder="Enter text here..."
              className="text-left min-h-[100px] resize-y"
              dir="ltr"
            />
          ) : (
            <Input
              id="content-en"
              value={contentEn}
              onChange={(e) => onContentEnChange(e.target.value)}
              placeholder="Enter text here..."
              className="text-left"
              dir="ltr"
            />
          )}
        </div>
      )}
    </div>
  );
};