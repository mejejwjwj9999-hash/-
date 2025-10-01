import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, EyeOff, GraduationCap } from 'lucide-react';

interface DepartmentCardProps {
  department: any;
  onEdit: (department: any) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

const DepartmentCard = ({ department, onEdit, onDelete, onToggleActive }: DepartmentCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow" dir="rtl">
      <CardHeader 
        className="pb-3"
        style={{ 
          backgroundColor: department.background_color,
          borderTopLeftRadius: '0.5rem',
          borderTopRightRadius: '0.5rem'
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: department.icon_color + '20' }}
            >
              <GraduationCap 
                className="w-6 h-6" 
                style={{ color: department.icon_color }}
              />
            </div>
            <div>
              <CardTitle className="text-xl">{department.name_ar}</CardTitle>
              {department.name_en && (
                <p className="text-sm text-muted-foreground" dir="ltr">{department.name_en}</p>
              )}
            </div>
          </div>
          <Badge variant={department.is_active ? 'default' : 'secondary'}>
            {department.is_active ? 'نشط' : 'غير نشط'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {department.description_ar && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {department.description_ar}
          </p>
        )}

        {department.head_of_department_ar && (
          <div className="text-sm">
            <span className="font-semibold">رئيس القسم: </span>
            <span>{department.head_of_department_ar}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {department.contact_email && (
            <span className="flex items-center gap-1" dir="ltr">
              📧 {department.contact_email}
            </span>
          )}
          {department.contact_phone && (
            <span className="flex items-center gap-1" dir="ltr">
              📞 {department.contact_phone}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-xs text-muted-foreground">
            الترتيب: {department.display_order}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onToggleActive(department.id)}
            >
              {department.is_active ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(department)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(department.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentCard;
