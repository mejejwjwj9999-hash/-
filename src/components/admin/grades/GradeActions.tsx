import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Upload, 
  FileSpreadsheet, 
  Printer,
  Mail,
  Settings,
  RefreshCw,
  Filter
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface GradeActionsProps {
  onExport?: (format: 'excel' | 'pdf' | 'csv') => void;
  onImport?: () => void;
  onPrint?: () => void;
  onEmail?: () => void;
  onRefresh?: () => void;
  loading?: boolean;
}

export const GradeActions: React.FC<GradeActionsProps> = ({
  onExport,
  onImport,
  onPrint,
  onEmail,
  onRefresh,
  loading = false
}) => {
  const { toast } = useToast();

  const handleExport = (format: 'excel' | 'pdf' | 'csv') => {
    toast({
      title: "جاري التصدير",
      description: `جاري تصدير البيانات بصيغة ${format.toUpperCase()}...`,
    });
    onExport?.(format);
  };

  const handleImport = () => {
    toast({
      title: "استيراد البيانات",
      description: "جاري فتح نافذة استيراد البيانات...",
    });
    onImport?.();
  };

  const handlePrint = () => {
    toast({
      title: "طباعة التقرير",
      description: "جاري تحضير التقرير للطباعة...",
    });
    onPrint?.();
  };

  const handleEmail = () => {
    toast({
      title: "إرسال عبر البريد",
      description: "جاري تحضير التقرير للإرسال...",
    });
    onEmail?.();
  };

  return (
    <div className="flex items-center gap-3">
      {/* زر التحديث */}
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-2"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        تحديث
      </Button>

      {/* قائمة التصدير */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            تصدير
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => handleExport('excel')}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            تصدير Excel
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('pdf')}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            تصدير PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('csv')}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            تصدير CSV
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            طباعة
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEmail}>
            <Mail className="w-4 h-4 mr-2" />
            إرسال بالبريد
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* زر الاستيراد */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleImport}
        className="flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        استيراد
      </Button>

      {/* إعدادات */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>
            <Filter className="w-4 h-4 mr-2" />
            إعدادات الفلترة
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="w-4 h-4 mr-2" />
            إعدادات العرض
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};