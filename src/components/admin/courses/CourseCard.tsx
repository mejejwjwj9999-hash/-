import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  BookOpen,
  Clock,
  Users,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  User,
  Calendar,
  GraduationCap
} from 'lucide-react';
import { getDepartmentName, getProgramName } from '@/domain/academics';

interface CourseCardProps {
  course: any;
  enrollmentCount: number;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onViewDetails: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  enrollmentCount,
  onEdit,
  onDelete,
  onDuplicate,
  onViewDetails
}) => {
  return (
    <Card className="group hover:shadow-university transition-all duration-300 hover:-translate-y-1 border-0 shadow-soft overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
      
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* رأس البطاقة */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg mt-1">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {course.course_name_ar}
                  </h3>
                  {course.course_name_en && (
                    <p className="text-sm text-muted-foreground mt-1">{course.course_name_en}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                  {course.course_code}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Users className="h-3 w-3" />
                  {enrollmentCount} طالب
                </Badge>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onViewDetails} className="gap-2">
                  <Eye className="h-4 w-4" />
                  عرض التفاصيل
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onEdit} className="gap-2">
                  <Edit className="h-4 w-4" />
                  تعديل المقرر
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDuplicate} className="gap-2">
                  <Copy className="h-4 w-4" />
                  نسخ المقرر
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={onDelete} 
                  className="gap-2 text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  حذف المقرر
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* معلومات المقرر */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">الساعات</p>
                <p className="font-semibold text-foreground">{course.credit_hours} ساعة</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
              <User className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">المدرس</p>
                <p className="font-semibold text-foreground truncate">
                  {course.instructor_name || 'غير محدد'}
                </p>
              </div>
            </div>
          </div>

          {/* القسم والتخصص */}
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">القسم:</span>
              <span className="font-medium text-foreground">
                {getDepartmentName(course.department_id, 'ar')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">التخصص:</span>
              <span className="font-medium text-foreground">
                {getProgramName(course.program_id, 'ar')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">السنة والفصل:</span>
              <span className="font-medium text-foreground">
                السنة {course.academic_year} - الفصل {course.semester}
              </span>
            </div>
          </div>

          {/* الوصف */}
          {course.description && (
            <div className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg line-clamp-2">
              {course.description}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
