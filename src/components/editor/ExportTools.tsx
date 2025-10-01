import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, FileText, Code, Printer, Copy, 
  Share2, Mail, Image as ImageIcon, File
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

interface ExportToolsProps {
  content: string;
  language: 'ar' | 'en';
  isVisible: boolean;
  title?: string;
  metadata?: any;
}

export const ExportTools: React.FC<ExportToolsProps> = ({
  content,
  language,
  isVisible,
  title = 'المحتوى',
  metadata = {}
}) => {
  const [isExporting, setIsExporting] = useState(false);

  if (!isVisible) return null;

  const exportAsHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html dir="${language === 'ar' ? 'rtl' : 'ltr'}" lang="${language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: ${language === 'ar' ? 'Arial, sans-serif' : 'Georgia, serif'};
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 { color: #2c3e50; margin-top: 1.5em; }
        p { margin-bottom: 1em; }
        blockquote { 
            border-left: 4px solid #e74c3c; 
            padding-left: 20px; 
            margin: 1em 0; 
            font-style: italic; 
        }
        table { border-collapse: collapse; width: 100%; margin: 1em 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: ${language === 'ar' ? 'right' : 'left'}; }
        th { background-color: #f8f9fa; }
        img { max-width: 100%; height: auto; }
        .metadata { 
            background: #f8f9fa; 
            padding: 15px; 
            border-radius: 5px; 
            margin-bottom: 20px; 
            font-size: 0.9em; 
        }
    </style>
</head>
<body>
    <div class="metadata">
        <strong>العنوان:</strong> ${title}<br>
        <strong>اللغة:</strong> ${language === 'ar' ? 'العربية' : 'English'}<br>
        <strong>تاريخ التصدير:</strong> ${new Date().toLocaleDateString('ar-EG')}
    </div>
    
    ${content}
    
    <footer style="margin-top: 2em; padding-top: 1em; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 0.8em;">
        تم إنشاء هذا المستند بواسطة كلية أيلول الجامعية
    </footer>
</body>
</html>`;

    downloadFile(htmlContent, `${title}.html`, 'text/html');
  };

  const exportAsText = () => {
    const textContent = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    const formattedText = `
${title}
${'='.repeat(title.length)}

${textContent}

---
تم إنشاء هذا المستند بواسطة كلية أيلول الجامعية
تاريخ التصدير: ${new Date().toLocaleDateString('ar-EG')}
`;
    downloadFile(formattedText, `${title}.txt`, 'text/plain');
  };

  const exportAsMarkdown = () => {
    // Convert HTML to basic Markdown
    let markdownContent = content
      .replace(/<h1[^>]*>(.*?)<\/h1>/g, '# $1\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/g, '## $1\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/g, '### $1\n')
      .replace(/<h4[^>]*>(.*?)<\/h4>/g, '#### $1\n')
      .replace(/<h5[^>]*>(.*?)<\/h5>/g, '##### $1\n')
      .replace(/<h6[^>]*>(.*?)<\/h6>/g, '###### $1\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/g, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/g, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/g, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/g, '*$1*')
      .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/g, '> $1')
      .replace(/<p[^>]*>(.*?)<\/p>/g, '$1\n\n')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<[^>]*>/g, ''); // Remove remaining HTML tags

    const finalMarkdown = `# ${title}

${markdownContent}

---
*تم إنشاء هذا المستند بواسطة كلية أيلول الجامعية*  
*تاريخ التصدير: ${new Date().toLocaleDateString('ar-EG')}*
`;

    downloadFile(finalMarkdown, `${title}.md`, 'text/markdown');
  };

  const copyToClipboard = () => {
    const textContent = content.replace(/<[^>]*>/g, '');
    navigator.clipboard.writeText(textContent);
    toast({
      title: 'تم النسخ',
      description: 'تم نسخ المحتوى إلى الحافظة'
    });
  };

  const printContent = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html dir="${language === 'ar' ? 'rtl' : 'ltr'}">
        <head>
          <title>${title}</title>
          <style>
            body { 
              font-family: ${language === 'ar' ? 'Arial, sans-serif' : 'Georgia, serif'}; 
              line-height: 1.6; 
              color: #333; 
              max-width: 210mm; 
              margin: 0 auto; 
              padding: 20mm;
            }
            h1, h2, h3 { color: #2c3e50; page-break-after: avoid; }
            p { orphans: 3; widows: 3; }
            img { max-width: 100%; page-break-inside: avoid; }
            table { page-break-inside: avoid; }
            @media print {
              body { margin: 0; padding: 15mm; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          ${content}
          <div style="margin-top: 20px; font-size: 12px; color: #666;">
            كلية أيلول الجامعية - ${new Date().toLocaleDateString('ar-EG')}
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const shareContent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: content.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
          url: window.location.href
        });
      } catch (error) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    setIsExporting(true);
    
    setTimeout(() => {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsExporting(false);
      toast({
        title: 'تم التصدير',
        description: `تم تصدير المحتوى كـ ${filename}`
      });
    }, 500);
  };

  const getWordCount = () => {
    return content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length;
  };

  const getCharacterCount = () => {
    return content.replace(/<[^>]*>/g, '').length;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            أدوات التصدير والمشاركة
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Content Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold">{getWordCount()}</div>
              <div className="text-xs text-muted-foreground">كلمة</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold">{getCharacterCount()}</div>
              <div className="text-xs text-muted-foreground">حرف</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold">{Math.ceil(getWordCount() / 200)}</div>
              <div className="text-xs text-muted-foreground">دقيقة قراءة</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <Badge variant="outline" className="text-xs">
                {language === 'ar' ? 'عربي' : 'English'}
              </Badge>
              <div className="text-xs text-muted-foreground mt-1">اللغة</div>
            </div>
          </div>

          <Tabs defaultValue="download" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="download">تحميل</TabsTrigger>
              <TabsTrigger value="share">مشاركة</TabsTrigger>
              <TabsTrigger value="print">طباعة</TabsTrigger>
            </TabsList>

            <TabsContent value="download" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={exportAsHTML}
                  disabled={isExporting}
                  className="w-full gap-2 h-12"
                  variant="outline"
                >
                  <Code className="h-4 w-4" />
                  تصدير كـ HTML
                </Button>
                
                <Button
                  onClick={exportAsText}
                  disabled={isExporting}
                  className="w-full gap-2 h-12"
                  variant="outline"
                >
                  <FileText className="h-4 w-4" />
                  تصدير كـ نص
                </Button>
                
                <Button
                  onClick={exportAsMarkdown}
                  disabled={isExporting}
                  className="w-full gap-2 h-12"
                  variant="outline"
                >
                  <File className="h-4 w-4" />
                  تصدير كـ Markdown
                </Button>
                
                <Button
                  onClick={() => {
                    // Generate PDF would require additional library
                    toast({
                      title: 'قريباً',
                      description: 'ميزة تصدير PDF ستكون متاحة قريباً'
                    });
                  }}
                  disabled={true}
                  className="w-full gap-2 h-12"
                  variant="outline"
                >
                  <File className="h-4 w-4" />
                  تصدير كـ PDF (قريباً)
                </Button>
              </div>
              
              {isExporting && (
                <div className="text-center text-sm text-muted-foreground">
                  جاري تحضير الملف للتحميل...
                </div>
              )}
            </TabsContent>

            <TabsContent value="share" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={copyToClipboard}
                  className="w-full gap-2 h-12"
                  variant="outline"
                >
                  <Copy className="h-4 w-4" />
                  نسخ النص
                </Button>
                
                <Button
                  onClick={shareContent}
                  className="w-full gap-2 h-12"
                  variant="outline"
                >
                  <Share2 className="h-4 w-4" />
                  مشاركة
                </Button>
                
                <Button
                  onClick={() => {
                    const subject = encodeURIComponent(title);
                    const body = encodeURIComponent(content.replace(/<[^>]*>/g, '').substring(0, 500) + '...');
                    window.open(`mailto:?subject=${subject}&body=${body}`);
                  }}
                  className="w-full gap-2 h-12"
                  variant="outline"
                >
                  <Mail className="h-4 w-4" />
                  إرسال بالبريد
                </Button>
                
                <Button
                  onClick={() => {
                    const text = encodeURIComponent(content.replace(/<[^>]*>/g, '').substring(0, 200));
                    window.open(`https://wa.me/?text=${text}`);
                  }}
                  className="w-full gap-2 h-12"
                  variant="outline"
                >
                  <Share2 className="h-4 w-4" />
                  واتساب
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="print" className="space-y-4">
              <div className="space-y-4">
                <Button
                  onClick={printContent}
                  className="w-full gap-2 h-12"
                  variant="outline"
                >
                  <Printer className="h-4 w-4" />
                  طباعة المحتوى
                </Button>
                
                <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">إعدادات الطباعة المقترحة:</h4>
                  <ul className="space-y-1 text-xs">
                    <li>• اتجاه الصفحة: عمودي</li>
                    <li>• حجم الورق: A4</li>
                    <li>• الهوامش: عادية (2.5 سم)</li>
                    <li>• حجم الخط: 12pt</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};