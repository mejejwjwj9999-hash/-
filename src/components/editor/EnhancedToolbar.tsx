import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Bold, Italic, Underline, Strikethrough, Code, Link,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Table, Image, Video,
  Palette, Type, Highlighter, Undo, Redo,
  Save, Download, Upload, Settings, Eye,
  CodeXml, Paintbrush
} from 'lucide-react';
import { motion } from 'framer-motion';

interface EnhancedToolbarProps {
  editor: any;
  onSave?: () => void;
  onPreviewToggle?: () => void;
  onExport?: () => void;
  showAdvanced?: boolean;
  language: 'ar' | 'en';
}

export const EnhancedToolbar: React.FC<EnhancedToolbarProps> = ({
  editor,
  onSave,
  onPreviewToggle,
  onExport,
  showAdvanced = true,
  language
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  if (!editor) return null;

  const insertLink = () => {
    if (linkUrl && linkText) {
      editor.chain().focus().setLink({ href: linkUrl }).insertContent(linkText).run();
      setLinkUrl('');
      setLinkText('');
      setShowLinkDialog(false);
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const toolbarGroups = [
    // Basic Formatting
    {
      label: 'التنسيق الأساسي',
      tools: [
        { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), isActive: () => editor.isActive('bold') },
        { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), isActive: () => editor.isActive('italic') },
        { icon: Underline, action: () => editor.chain().focus().toggleUnderline().run(), isActive: () => editor.isActive('underline') },
        { icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(), isActive: () => editor.isActive('strike') },
        { icon: Code, action: () => editor.chain().focus().toggleCode().run(), isActive: () => editor.isActive('code') },
      ]
    },
    // Alignment
    {
      label: 'المحاذاة',
      tools: [
        { icon: AlignRight, action: () => editor.chain().focus().setTextAlign('right').run(), isActive: () => editor.isActive({ textAlign: 'right' }) },
        { icon: AlignCenter, action: () => editor.chain().focus().setTextAlign('center').run(), isActive: () => editor.isActive({ textAlign: 'center' }) },
        { icon: AlignLeft, action: () => editor.chain().focus().setTextAlign('left').run(), isActive: () => editor.isActive({ textAlign: 'left' }) },
        { icon: AlignJustify, action: () => editor.chain().focus().setTextAlign('justify').run(), isActive: () => editor.isActive({ textAlign: 'justify' }) },
      ]
    },
    // Lists and Quotes
    {
      label: 'القوائم والاقتباسات',
      tools: [
        { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), isActive: () => editor.isActive('bulletList') },
        { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), isActive: () => editor.isActive('orderedList') },
        { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), isActive: () => editor.isActive('blockquote') },
      ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10"
    >
      <div className="flex flex-wrap items-center gap-1 p-2">
        {/* History Controls */}
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="h-8 w-8 p-0"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="h-8 w-8 p-0"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Main Toolbar Groups */}
        {toolbarGroups.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            <div className="flex gap-1">
              {group.tools.map((tool, toolIndex) => (
                <Button
                  key={toolIndex}
                  variant={tool.isActive?.() ? "default" : "ghost"}
                  size="sm"
                  onClick={tool.action}
                  className="h-8 w-8 p-0"
                >
                  <tool.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
            {groupIndex < toolbarGroups.length - 1 && (
              <Separator orientation="vertical" className="h-6" />
            )}
          </React.Fragment>
        ))}

        <Separator orientation="vertical" className="h-6" />

        {/* Advanced Tools */}
        {showAdvanced && (
          <>
            {/* Link Tool */}
            <Popover open={showLinkDialog} onOpenChange={setShowLinkDialog}>
              <PopoverTrigger asChild>
                <Button
                  variant={editor.isActive('link') ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Link className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" side="bottom">
                <div className="space-y-3">
                  <h4 className="font-medium">إضافة رابط</h4>
                  <div className="space-y-2">
                    <Label htmlFor="link-text">النص</Label>
                    <Input
                      id="link-text"
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                      placeholder="نص الرابط"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link-url">الرابط</Label>
                    <Input
                      id="link-url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={insertLink}>إدراج</Button>
                    <Button size="sm" variant="outline" onClick={() => setShowLinkDialog(false)}>إلغاء</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Table Tool */}
            <Button
              variant="ghost"
              size="sm"
              onClick={insertTable}
              className="h-8 w-8 p-0"
            >
              <Table className="h-4 w-4" />
            </Button>

            {/* Color Tool */}
            <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Palette className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" side="bottom">
                <div className="space-y-3">
                  <h4 className="font-medium">ألوان النص</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {['#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff',
                      '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
                      '#ff8800', '#88ff00', '#0088ff', '#ff0088', '#8800ff', '#00ff88'].map(color => (
                      <button
                        key={color}
                        className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          editor.chain().focus().setColor(color).run();
                          setShowColorPicker(false);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Separator orientation="vertical" className="h-6" />
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-1 mr-auto">
          {onPreviewToggle && (
            <Button
              variant="outline"
              size="sm"
              onClick={onPreviewToggle}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              معاينة
            </Button>
          )}
          {onSave && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSave}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              حفظ
            </Button>
          )}
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              تصدير
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};