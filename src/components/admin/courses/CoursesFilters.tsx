import React from 'react';
import { Search, Filter, X, Download, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CoursesFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (value: string) => void;
  selectedProgram: string;
  setSelectedProgram: (value: string) => void;
  selectedYear: string;
  setSelectedYear: (value: string) => void;
  selectedSemester: string;
  setSelectedSemester: (value: string) => void;
  departments: Array<{ id: string; name: { ar: string } }> | undefined;
  onRefresh: () => void;
  onExport: () => void;
}

export const CoursesFilters: React.FC<CoursesFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedDepartment,
  setSelectedDepartment,
  selectedProgram,
  setSelectedProgram,
  selectedYear,
  setSelectedYear,
  selectedSemester,
  setSelectedSemester,
  departments,
  onRefresh,
  onExport
}) => {
  const hasActiveFilters = selectedDepartment || selectedProgram || selectedYear || selectedSemester;

  const clearFilters = () => {
    setSelectedDepartment('');
    setSelectedProgram('');
    setSelectedYear('');
    setSelectedSemester('');
    setSearchTerm('');
  };

  const activeFiltersCount = [
    selectedDepartment,
    selectedProgram,
    selectedYear,
    selectedSemester
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* شريط البحث الرئيسي */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="ابحث عن مقرر بالاسم أو الكود..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 h-11"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 relative">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">تصفية متقدمة</span>
                {activeFiltersCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-4">
              <DropdownMenuLabel className="text-base font-bold mb-3">
                خيارات التصفية
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="mb-4" />
              
              <div className="space-y-4">
                {/* تصفية القسم */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">القسم</label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الأقسام" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">جميع الأقسام</SelectItem>
                      {departments?.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name.ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* تصفية السنة الدراسية */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">السنة الدراسية</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع السنوات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">جميع السنوات</SelectItem>
                      <SelectItem value="1">السنة الأولى</SelectItem>
                      <SelectItem value="2">السنة الثانية</SelectItem>
                      <SelectItem value="3">السنة الثالثة</SelectItem>
                      <SelectItem value="4">السنة الرابعة</SelectItem>
                      <SelectItem value="5">السنة الخامسة</SelectItem>
                      <SelectItem value="6">السنة السادسة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* تصفية الفصل */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">الفصل الدراسي</label>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الفصول" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">جميع الفصول</SelectItem>
                      <SelectItem value="1">الفصل الأول</SelectItem>
                      <SelectItem value="2">الفصل الثاني</SelectItem>
                      <SelectItem value="3">الفصل الصيفي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4 ml-2" />
                    إزالة جميع المرشحات
                  </Button>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            title="تحديث البيانات"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={onExport}
            title="تصدير البيانات"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* مؤشرات المرشحات النشطة */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">المرشحات النشطة:</span>
          {selectedDepartment && (
            <Badge variant="secondary" className="gap-1">
              قسم: {departments?.find(d => d.id === selectedDepartment)?.name.ar}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => setSelectedDepartment('')}
              />
            </Badge>
          )}
          {selectedYear && (
            <Badge variant="secondary" className="gap-1">
              السنة: {selectedYear}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => setSelectedYear('')}
              />
            </Badge>
          )}
          {selectedSemester && (
            <Badge variant="secondary" className="gap-1">
              الفصل: {selectedSemester}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => setSelectedSemester('')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
