
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';

interface Grade {
  id: string;
  course_id: string;
  midterm_grade?: number;
  coursework_grade?: number;
  final_grade?: number;
  total_grade?: number;
  letter_grade?: string;
  gpa_points?: number;
  status: string;
  academic_year: string;
  semester: string;
  created_at: string;
}

interface GradesTableProps {
  grades: Grade[];
}

const GradesTable = ({ grades }: GradesTableProps) => {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
      case 'A+':
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300';
      case 'A-':
      case 'B+':
        return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300';
      case 'B':
      case 'B-':
        return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300';
      case 'C+':
      case 'C':
        return 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300';
      default:
        return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800';
      case 'enrolled':
        return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800';
      case 'pending':
        return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتملة';
      case 'enrolled':
        return 'مسجلة';
      case 'pending':
        return 'معلقة';
      default:
        return status;
    }
  };

  if (!grades || grades.length === 0) {
    return (
      <Card className="border-0 shadow-lg rounded-2xl">
        <CardContent className="p-12 text-center">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">لا توجد درجات</h3>
          <p className="text-muted-foreground">لم يتم تسجيل أي درجات بعد</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {grades.map((grade) => (
        <Card key={grade.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-primary mb-2">
                  {/* سيتم عرض اسم المقرر من العلاقة مع جدول courses */}
                  مقرر دراسي - {grade.course_id}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                  <span>الفصل: {grade.semester}</span>
                  <span>•</span>
                  <span>السنة: {grade.academic_year}</span>
                </div>
                <Badge className={getStatusColor(grade.status)}>
                  {getStatusText(grade.status)}
                </Badge>
              </div>
              
              {/* Grade Details */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                {/* Grade Breakdown */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl">
                    <div className="text-xs font-medium text-blue-700 mb-1">أعمال السنة</div>
                    <div className="text-lg font-bold text-blue-800">
                      {grade.coursework_grade || '-'}
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl">
                    <div className="text-xs font-medium text-purple-700 mb-1">النصفي</div>
                    <div className="text-lg font-bold text-purple-800">
                      {grade.midterm_grade || '-'}
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl">
                    <div className="text-xs font-medium text-green-700 mb-1">النهائي</div>
                    <div className="text-lg font-bold text-green-800">
                      {grade.final_grade || '-'}
                    </div>
                  </div>
                </div>
                
                {/* Final Grade */}
                <div className="flex items-center gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl">
                    <div className="text-3xl font-bold text-primary">
                      {grade.total_grade?.toFixed(1) || '-'}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      النقاط: {grade.gpa_points || 0}
                    </div>
                  </div>
                  
                  {grade.letter_grade && (
                    <Badge className={`${getGradeColor(grade.letter_grade)} border text-lg px-4 py-2 font-bold`}>
                      {grade.letter_grade}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GradesTable;
