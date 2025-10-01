import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Bold, Italic, Underline, Strikethrough, Code, Superscript, Subscript,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Link2, Unlink,
  Table, Image as ImageIcon, Video, FileText, Hash,
  Palette, Type, Brush, Ruler, Layout, Eye,
  Undo, Redo, Copy, Search, Replace,
  Settings, History, Save, Download, Upload,
  BookOpen, Globe, Zap, RefreshCw, Plus, Minus
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AdvancedToolbarProps {
  editor: any;
  onImageInsert: () => void;
  onVideoInsert: () => void;
  onTableInsert: () => void;
  onLinkInsert: () => void;
  onSettingsOpen: () => void;
  onHistoryOpen: () => void;
  onSave: () => void;
  language: 'ar' | 'en';
}

const AdvancedToolbar: React.FC<AdvancedToolbarProps> = ({
  editor,
  onImageInsert,
  onVideoInsert,
  onTableInsert,
  onLinkInsert,
  onSettingsOpen,
  onHistoryOpen,
  onSave,
  language
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const predefinedColors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080',
    '#008000', '#ffc0cb', '#a52a2a', '#808080', '#000080'
  ];

  const fontFamilies = [
    { value: 'Arial', label: 'Arial' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Tahoma', label: 'Tahoma' },
    { value: 'Impact', label: 'Impact' },
    { value: 'Comic Sans MS', label: 'Comic Sans MS' }
  ];

  const fontSizes = [
    '8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px',
    '20px', '22px', '24px', '26px', '28px', '32px', '36px', '48px', '72px'
  ];

  const headingStyles = [
    { value: 'p', label: 'فقرة عادية' },
    { value: 'h1', label: 'عنوان رئيسي' },
    { value: 'h2', label: 'عنوان ثانوي' },
    { value: 'h3', label: 'عنوان فرعي' },
    { value: 'h4', label: 'عنوان صغير' },
    { value: 'h5', label: 'عنوان أصغر' },
    { value: 'h6', label: 'عنوان الأصغر' }
  ];

  const executeCommand = (command: string, value?: string) => {
    if (editor) {
      editor.focus();
      document.execCommand(command, false, value);
    }
  };

  const insertHTML = (html: string) => {
    if (editor) {
      editor.focus();
      document.execCommand('insertHTML', false, html);
    }
  };

  const insertLink = () => {
    if (linkUrl && linkText) {
      const linkHTML = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      insertHTML(linkHTML);
      setLinkUrl('');
      setLinkText('');
    }
  };

  const insertMathFormula = () => {
    const formula = prompt('أدخل المعادلة الرياضية (LaTeX):');
    if (formula) {
      const mathHTML = `<div class="math-formula" data-formula="${formula}">${formula}</div>`;
      insertHTML(mathHTML);
    }
  };

  const insertSpecialChar = (char: string) => {
    insertHTML(char);
  };

  const specialChars = ['©', '®', '™', '§', '¶', '†', '‡', '•', '…', '‰', '‹', '›', '«', '»', '–', '—'];

  const ToolbarButton: React.FC<{
    icon: React.ReactNode;
    tooltip: string;
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
  }> = ({ icon, tooltip, onClick, active, disabled }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={active ? "default" : "ghost"}
            size="sm"
            onClick={onClick}
            disabled={disabled}
            className="p-2"
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="border-b bg-background p-2 space-y-2">
      {/* الصف الأول: تنسيق النص الأساسي */}
      <div className="flex items-center gap-1 flex-wrap">
        <ToolbarButton
          icon={<Undo className="h-4 w-4" />}
          tooltip="تراجع"
          onClick={() => executeCommand('undo')}
        />
        <ToolbarButton
          icon={<Redo className="h-4 w-4" />}
          tooltip="إعادة"
          onClick={() => executeCommand('redo')}
        />
        
        <Separator orientation="vertical" className="h-6 mx-1" />

        <Select onValueChange={(value) => executeCommand('formatBlock', value)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="النمط" />
          </SelectTrigger>
          <SelectContent>
            {headingStyles.map(style => (
              <SelectItem key={style.value} value={style.value}>
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => executeCommand('fontName', value)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="الخط" />
          </SelectTrigger>
          <SelectContent>
            {fontFamilies.map(font => (
              <SelectItem key={font.value} value={font.value}>
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => executeCommand('fontSize', value)}>
          <SelectTrigger className="w-20">
            <SelectValue placeholder="الحجم" />
          </SelectTrigger>
          <SelectContent>
            {fontSizes.map(size => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <ToolbarButton
          icon={<Bold className="h-4 w-4" />}
          tooltip="عريض"
          onClick={() => executeCommand('bold')}
        />
        <ToolbarButton
          icon={<Italic className="h-4 w-4" />}
          tooltip="مائل"
          onClick={() => executeCommand('italic')}
        />
        <ToolbarButton
          icon={<Underline className="h-4 w-4" />}
          tooltip="تحته خط"
          onClick={() => executeCommand('underline')}
        />
        <ToolbarButton
          icon={<Strikethrough className="h-4 w-4" />}
          tooltip="يتوسطه خط"
          onClick={() => executeCommand('strikeThrough')}
        />
        <ToolbarButton
          icon={<Superscript className="h-4 w-4" />}
          tooltip="مرتفع"
          onClick={() => executeCommand('superscript')}
        />
        <ToolbarButton
          icon={<Subscript className="h-4 w-4" />}
          tooltip="منخفض"
          onClick={() => executeCommand('subscript')}
        />

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* منتقي الألوان */}
        <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <Type className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              <Label>لون النص</Label>
              <div className="grid grid-cols-5 gap-1">
                {predefinedColors.map(color => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      executeCommand('foreColor', color);
                      setShowColorPicker(false);
                    }}
                  />
                ))}
              </div>
              <Input
                type="color"
                onChange={(e) => executeCommand('foreColor', e.target.value)}
                className="w-full h-8"
              />
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={showBgColorPicker} onOpenChange={setShowBgColorPicker}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <Brush className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              <Label>لون الخلفية</Label>
              <div className="grid grid-cols-5 gap-1">
                {predefinedColors.map(color => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      executeCommand('backColor', color);
                      setShowBgColorPicker(false);
                    }}
                  />
                ))}
              </div>
              <Input
                type="color"
                onChange={(e) => executeCommand('backColor', e.target.value)}
                className="w-full h-8"
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* الصف الثاني: محاذاة وقوائم */}
      <div className="flex items-center gap-1 flex-wrap">
        <ToolbarButton
          icon={<AlignLeft className="h-4 w-4" />}
          tooltip="محاذاة يسار"
          onClick={() => executeCommand('justifyLeft')}
        />
        <ToolbarButton
          icon={<AlignCenter className="h-4 w-4" />}
          tooltip="محاذاة وسط"
          onClick={() => executeCommand('justifyCenter')}
        />
        <ToolbarButton
          icon={<AlignRight className="h-4 w-4" />}
          tooltip="محاذاة يمين"
          onClick={() => executeCommand('justifyRight')}
        />
        <ToolbarButton
          icon={<AlignJustify className="h-4 w-4" />}
          tooltip="ضبط"
          onClick={() => executeCommand('justifyFull')}
        />

        <Separator orientation="vertical" className="h-6 mx-1" />

        <ToolbarButton
          icon={<List className="h-4 w-4" />}
          tooltip="قائمة نقطية"
          onClick={() => executeCommand('insertUnorderedList')}
        />
        <ToolbarButton
          icon={<ListOrdered className="h-4 w-4" />}
          tooltip="قائمة مرقمة"
          onClick={() => executeCommand('insertOrderedList')}
        />
        <ToolbarButton
          icon={<Quote className="h-4 w-4" />}
          tooltip="اقتباس"
          onClick={() => executeCommand('formatBlock', 'blockquote')}
        />

        <Separator orientation="vertical" className="h-6 mx-1" />

        <ToolbarButton
          icon={<Plus className="h-4 w-4" />}
          tooltip="زيادة المسافة البادئة"
          onClick={() => executeCommand('indent')}
        />
        <ToolbarButton
          icon={<Minus className="h-4 w-4" />}
          tooltip="تقليل المسافة البادئة"
          onClick={() => executeCommand('outdent')}
        />

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* رابط */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <Link2 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <Label>إدراج رابط</Label>
              <Input
                placeholder="النص المعروض"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
              />
              <Input
                placeholder="الرابط (https://...)"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <Button onClick={insertLink} className="w-full">
                إدراج الرابط
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <ToolbarButton
          icon={<Unlink className="h-4 w-4" />}
          tooltip="إزالة الرابط"
          onClick={() => executeCommand('unlink')}
        />
      </div>

      {/* الصف الثالث: إدراج المحتوى */}
      <div className="flex items-center gap-1 flex-wrap">
        <ToolbarButton
          icon={<ImageIcon className="h-4 w-4" />}
          tooltip="إدراج صورة"
          onClick={onImageInsert}
        />
        <ToolbarButton
          icon={<Video className="h-4 w-4" />}
          tooltip="إدراج فيديو"
          onClick={onVideoInsert}
        />
        <ToolbarButton
          icon={<Table className="h-4 w-4" />}
          tooltip="إدراج جدول"
          onClick={onTableInsert}
        />
        <ToolbarButton
          icon={<Hash className="h-4 w-4" />}
          tooltip="معادلة رياضية"
          onClick={insertMathFormula}
        />
        <ToolbarButton
          icon={<Code className="h-4 w-4" />}
          tooltip="كود"
          onClick={() => executeCommand('formatBlock', 'pre')}
        />

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* أحرف خاصة */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <Globe className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="space-y-2">
              <Label>أحرف خاصة</Label>
              <div className="grid grid-cols-8 gap-1">
                {specialChars.map(char => (
                  <Button
                    key={char}
                    variant="outline"
                    size="sm"
                    onClick={() => insertSpecialChar(char)}
                    className="p-1 text-xs"
                  >
                    {char}
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <ToolbarButton
          icon={<Copy className="h-4 w-4" />}
          tooltip="نسخ"
          onClick={() => executeCommand('copy')}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('paste')}
          className="p-2"
        >
          لصق
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <ToolbarButton
          icon={<History className="h-4 w-4" />}
          tooltip="سجل النسخ"
          onClick={onHistoryOpen}
        />
        <ToolbarButton
          icon={<Settings className="h-4 w-4" />}
          tooltip="الإعدادات"
          onClick={onSettingsOpen}
        />
        <ToolbarButton
          icon={<Save className="h-4 w-4" />}
          tooltip="حفظ"
          onClick={onSave}
        />
      </div>
    </div>
  );
};

export default AdvancedToolbar;