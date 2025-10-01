import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  FileText,
  CheckCircle,
  AlertTriangle,
  Upload,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import { useStudentAssignments } from '@/hooks/useAssignmentsManagement';
import { useAuth } from '@/components/auth/AuthProvider';
import AssignmentUploadModal from './AssignmentUploadModal';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const MobileAssignmentsEnhanced = () => {
  const { profile } = useAuth();
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const { 
    data: assignments = [], 
    isLoading, 
    error,
    refetch
  } = useStudentAssignments();

  const getAssignmentStatus = (assignment: any) => {
    const hasSubmission = assignment.assignment_submissions?.length > 0;
    const isOverdue = new Date(assignment.due_date) < new Date();
    
    if (hasSubmission) {
      const submission = assignment.assignment_submissions[0];
      if (submission.grade !== null) {
        return { type: 'graded', label: 'مصحح', color: 'bg-green-500' };
      }
      return { type: 'submitted', label: 'مُسلم', color: 'bg-blue-500' };
    }
    
    if (isOverdue) {
      return { type: 'overdue', label: 'متأخر', color: 'bg-red-500' };
    }
    
    return { type: 'pending', label: 'مطلوب', color: 'bg-orange-500' };
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24 && diffHours > 0) {
      return `باقي ${Math.floor(diffHours)} ساعة`;
    } else if (diffHours < 0) {
      return 'متأخر';
    }
    
    return format(date, 'dd/MM/yyyy', { locale: ar });
  };

  const handleUploadSuccess = () => {
    refetch();
    setShowUploadModal(false);
    setSelectedAssignment(null);
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4" dir="rtl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">الواجبات</h2>
          <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4" dir="rtl">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            حدث خطأ في تحميل الواجبات. يرجى المحاولة مرة أخرى.
          </AlertDescription>
        </Alert>
        <Button 
          onClick={() => refetch()} 
          variant="outline" 
          className="mt-4 w-full"
        >
          <RefreshCw className="h-4 w-4 ml-2" />
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="p-4" dir="rtl">
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">لا توجد واجبات</h3>
          <p className="text-muted-foreground mb-4">
            لم يتم تكليفك بأي واجبات حتى الآن
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 ml-2" />
            تحديث
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">الواجبات</h2>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {assignments.length} واجب
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Card className="text-center">
          <CardContent className="p-3">
            <div className="text-lg font-bold text-orange-600">
              {assignments.filter(a => getAssignmentStatus(a).type === 'pending').length}
            </div>
            <div className="text-xs text-muted-foreground">مطلوب</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-3">
            <div className="text-lg font-bold text-blue-600">
              {assignments.filter(a => getAssignmentStatus(a).type === 'submitted').length}
            </div>
            <div className="text-xs text-muted-foreground">مُسلم</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-3">
            <div className="text-lg font-bold text-green-600">
              {assignments.filter(a => getAssignmentStatus(a).type === 'graded').length}
            </div>
            <div className="text-xs text-muted-foreground">مصحح</div>
          </CardContent>
        </Card>
      </div>

      {/* قائمة الواجبات */}
      <div className="space-y-3">
        {assignments.map((assignment) => {
          const status = getAssignmentStatus(assignment);
          const hasSubmission = assignment.assignment_submissions?.length > 0;
          const submission = hasSubmission ? assignment.assignment_submissions[0] : null;
          
          return (
            <Card key={assignment.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{assignment.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {assignment.courses?.course_code}
                      </Badge>
                      <Badge className={`text-xs text-white ${status.color}`}>
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                  
                  {hasSubmission && submission?.grade !== null && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {submission.grade}/{assignment.max_grade || 100}
                      </div>
                      <div className="text-xs text-muted-foreground">درجة</div>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {assignment.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {assignment.description}
                  </p>
                )}
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">موعد التسليم:</span>
                    <span className={`font-medium ${
                      new Date(assignment.due_date) < new Date() ? 'text-red-600' : 'text-gray-800'
                    }`}>
                      {formatDueDate(assignment.due_date)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">الدرجة:</span>
                    <span className="font-medium">{assignment.max_grade || 100} درجة</span>
                  </div>
                  
                  {hasSubmission && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-muted-foreground">تم التسليم:</span>
                      <span className="font-medium text-green-600">
                        {format(new Date(submission.submitted_at), 'dd/MM/yyyy HH:mm', { locale: ar })}
                      </span>
                    </div>
                  )}
                </div>

                {/* عرض الملاحظات إذا كانت موجودة */}
                {submission?.feedback && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Eye className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">ملاحظات المدرس:</span>
                    </div>
                    <p className="text-sm text-blue-700">{submission.feedback}</p>
                  </div>
                )}
                
                {/* أزرار العمل */}
                <div className="flex gap-2">
                  {!hasSubmission && new Date(assignment.due_date) > new Date() && (
                    <Button
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setShowUploadModal(true);
                      }}
                      className="flex-1 gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      تسليم الواجب
                    </Button>
                  )}
                  
                  {hasSubmission && submission?.file_path && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        // فتح الملف المرفوع
                        window.open(`https://nzziqvjfymosjjbzkrma.supabase.co/storage/v1/object/public/course-files/${submission.file_path}`, '_blank');
                      }}
                      className="flex-1 gap-2"
                    >
                      <Download className="h-4 w-4" />
                      عرض الملف
                    </Button>
                  )}
                  
                  {hasSubmission && !submission?.grade && new Date(assignment.due_date) > new Date() && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setShowUploadModal(true);
                      }}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      تعديل التسليم
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* مودال رفع الواجب */}
      {selectedAssignment && (
        <AssignmentUploadModal
          isOpen={showUploadModal}
          onClose={() => {
            setShowUploadModal(false);
            setSelectedAssignment(null);
          }}
          assignment={selectedAssignment}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};

export default MobileAssignmentsEnhanced;