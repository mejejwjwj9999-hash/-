import React from 'react';
import { useActiveAcademicDepartments } from '@/hooks/useAcademicDepartments';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface DepartmentSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({
  value,
  onChange,
  label = "القسم الأكاديمي",
  placeholder = "اختر القسم",
  required = false
}) => {
  const { data: departments, isLoading } = useActiveAcademicDepartments();

  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-destructive mr-1">*</span>}
      </Label>
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={isLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder={isLoading ? "جاري التحميل..." : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {departments?.map((dept) => (
            <SelectItem key={dept.id} value={dept.id}>
              {dept.name_ar}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
