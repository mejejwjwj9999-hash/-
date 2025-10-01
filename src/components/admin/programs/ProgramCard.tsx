import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Globe,
  GraduationCap,
  Users,
  Clock,
  BookOpen
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { DynamicAcademicProgram } from '@/hooks/useDynamicPrograms';
import { motion } from 'framer-motion';

interface ProgramCardProps {
  program: DynamicAcademicProgram;
  onEdit: (program: DynamicAcademicProgram) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (program: DynamicAcademicProgram) => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  onEdit,
  onDelete,
  onTogglePublish
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="hover:shadow-lg transition-all duration-300 border-2 group overflow-hidden"
        style={{
          borderColor: program.icon_color + '20',
        }}
      >
        {/* Header with gradient background */}
        <CardHeader 
          className="pb-3 relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${program.background_color} 0%, ${program.icon_color}15 100%)`
          }}
        >
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-start gap-3 flex-1">
              {/* Icon */}
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
                style={{ 
                  backgroundColor: program.icon_color,
                  color: 'white'
                }}
              >
                <GraduationCap className="w-6 h-6" />
              </div>

              {/* Title and Department */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1">
                  {program.title_ar}
                </h3>
                {program.title_en && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-1" dir="ltr">
                    {program.title_en}
                  </p>
                )}
                {program.department_ar && (
                  <Badge variant="secondary" className="text-xs">
                    {program.department_ar}
                  </Badge>
                )}
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-col gap-2 items-end">
              {program.is_featured && (
                <Badge className="bg-amber-500 text-white">مميز</Badge>
              )}
              {program.published_at ? (
                <Badge className="bg-green-500 text-white gap-1">
                  <Globe className="w-3 h-3" />
                  منشور
                </Badge>
              ) : (
                <Badge variant="secondary">مسودة</Badge>
              )}
              <Badge variant={program.is_active ? "default" : "outline"}>
                {program.is_active ? 'نشط' : 'غير نشط'}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {/* Description */}
          {program.summary_ar && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {program.summary_ar}
            </p>
          )}

          {/* Program Details */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">المدة</p>
                <p className="font-semibold">{program.duration_years} سنوات</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">الساعات</p>
                <p className="font-semibold">{program.credit_hours}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">الطلاب</p>
                <p className="font-semibold">{program.student_count || 0}</p>
              </div>
            </div>
          </div>

          {/* Degree Type */}
          <div className="flex items-center justify-between pt-3 border-t">
            <Badge variant="outline" className="text-xs">
              {program.degree_type === 'bachelor' && 'بكالوريوس'}
              {program.degree_type === 'master' && 'ماجستير'}
              {program.degree_type === 'doctorate' && 'دكتوراه'}
              {program.degree_type === 'diploma' && 'دبلوم'}
            </Badge>

            <div className="text-xs text-muted-foreground">
              الترتيب: {program.display_order}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 border-t">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onTogglePublish(program)}
              className="flex-1"
            >
              {program.published_at ? (
                <>
                  <EyeOff className="w-4 h-4 ml-2" />
                  إلغاء النشر
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 ml-2" />
                  نشر
                </>
              )}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(program)}
            >
              <Edit className="w-4 h-4" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent dir="rtl">
                <AlertDialogHeader>
                  <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
                  <AlertDialogDescription>
                    سيتم حذف البرنامج "{program.title_ar}" نهائياً ولا يمكن التراجع عن هذا الإجراء.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(program.id)}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    حذف
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};