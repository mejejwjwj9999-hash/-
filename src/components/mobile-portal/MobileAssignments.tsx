import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, 
  Calendar, 
  Clock,
  AlertCircle,
  CheckCircle,
  Upload,
  ArrowLeft,
  FileText,
  Star,
  Loader2
} from 'lucide-react';
import { useStudentAssignments } from '@/hooks/useAssignmentsManagement';
import { useAuth } from '@/components/auth/AuthProvider';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import AssignmentUploadModal from './AssignmentUploadModal';

interface MobileAssignmentsProps {
  onBack?: () => void;
}

const MobileAssignments = ({ onBack }: MobileAssignmentsProps) => {
  const { profile } = useAuth();
  const { data: assignments, isLoading, error } = useStudentAssignments();
  
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('due_date');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [assignmentToUpload, setAssignmentToUpload] = useState<any>(null);

  const getAssignmentStatus = (assignment: any) => {
    const submission = assignment.assignment_submissions?.[0];
    if (!submission) {
      const dueDate = new Date(assignment.due_date);
      const now = new Date();
      return now > dueDate ? 'متأخر' : 'قيد التنفيذ';
    }
    return submission.status === 'graded' ? 'مكتمل' : 'مُسلم';
  };

  const filteredAssignments = assignments?.filter(assignment => {
    if (filter === 'all') return true;
    const status = getAssignmentStatus(assignment);
    if (filter === 'completed') return status === 'مكتمل';
    if (filter === 'submitted') return status === 'مُسلم';
    if (filter === 'pending') return status === 'قيد التنفيذ';
    if (filter === 'overdue') return status === 'متأخر';
    return true;
  }) || [];

  if (isLoading) {
    return (
      <div className="px-4 py-6 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-university-blue" />
          <span>جاري تحميل الواجبات...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6">
        <Card className="border-0 shadow-md bg-red-50">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-3 text-red-300" />
            <h3 className="font-medium text-red-800 mb-1">خطأ في تحميل الواجبات</h3>
            <p className="text-sm text-red-600">يرجى المحاولة مرة أخرى</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">الواجبات الدراسية</h1>
          <p className="text-sm text-gray-600">تابع واجباتك وقم بتسليمها</p>
        </div>
        {onBack && (
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 ml-1" />
            العودة
          </Button>
        )}
      </div>

      {/* Filters */}
      {assignments && assignments.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className="whitespace-nowrap"
          >
            الكل ({assignments.length})
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('pending')}
            className="whitespace-nowrap"
          >
            قيد التنفيذ ({assignments.filter(a => getAssignmentStatus(a) === 'قيد التنفيذ').length})
          </Button>
          <Button
            variant={filter === 'submitted' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('submitted')}
            className="whitespace-nowrap"
          >
            مُسلم ({assignments.filter(a => getAssignmentStatus(a) === 'مُسلم').length})
          </Button>
          <Button
            variant={filter === 'overdue' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('overdue')}
            className="whitespace-nowrap"
          >
            متأخر ({assignments.filter(a => getAssignmentStatus(a) === 'متأخر').length})
          </Button>
        </div>
      )}

      {/* Assignments List */}
      {filteredAssignments.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="p-8 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="font-medium text-gray-600 mb-2">لا توجد واجبات</h3>
            <p className="text-sm text-gray-500">ستظهر واجباتك الجديدة هنا</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredAssignments.map((assignment) => {
            const status = getAssignmentStatus(assignment);
            const submission = assignment.assignment_submissions?.[0];
            const isOverdue = new Date(assignment.due_date) < new Date() && !submission;
            const daysLeft = Math.ceil((new Date(assignment.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <Card 
                key={assignment.id} 
                className={`border-0 shadow-md cursor-pointer hover:shadow-lg transition-all duration-200 ${
                  isOverdue ? 'border-l-4 border-l-red-500' : 
                  submission ? 'border-l-4 border-l-green-500' : 
                  daysLeft <= 3 ? 'border-l-4 border-l-orange-500' : ''
                }`}
                onClick={() => setSelectedAssignment(selectedAssignment?.id === assignment.id ? null : assignment)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{assignment.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {assignment.courses?.course_name_ar} • {assignment.courses?.course_code}
                      </p>
                      {assignment.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-2">{assignment.description}</p>
                      )}
                    </div>
                    <Badge 
                      variant={
                        status === 'مكتمل' ? 'default' :
                        status === 'مُسلم' ? 'secondary' :
                        status === 'متأخر' ? 'destructive' : 'outline'
                      }
                      className="text-xs"
                    >
                      {status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(assignment.due_date), 'dd/MM/yyyy', { locale: ar })}
                        </span>
                      </div>
                      {!submission && daysLeft >= 0 && (
                        <div className={`flex items-center gap-1 ${daysLeft <= 3 ? 'text-orange-600' : 'text-green-600'}`}>
                          <Clock className="h-4 w-4" />
                          <span>
                            {daysLeft === 0 ? 'اليوم' : 
                             daysLeft === 1 ? 'غداً' : 
                             `${daysLeft} أيام`}
                          </span>
                        </div>
                      )}
                      {isOverdue && !submission && (
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertCircle className="h-4 w-4" />
                          <span>متأخر {Math.abs(daysLeft)} يوم</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {submission?.grade !== undefined && (
                        <Badge variant="outline" className="text-xs">
                          <Star className="h-3 w-3 ml-1" />
                          {submission.grade}/{assignment.max_grade || 100}
                        </Badge>
                      )}
                      <div className="text-xs text-gray-500">
                        {assignment.max_grade || 100} درجة
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedAssignment?.id === assignment.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 animate-in slide-in-from-top-2">
                      {assignment.instructions && (
                        <div className="mb-3">
                          <h4 className="font-medium text-sm text-gray-700 mb-1">تعليمات الواجب:</h4>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {assignment.instructions}
                          </p>
                        </div>
                      )}
                      
                      {submission ? (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">تم التسليم</span>
                          </div>
                          <div className="text-sm text-green-700 space-y-1">
                            <p>تاريخ التسليم: {format(new Date(submission.submitted_at), 'dd/MM/yyyy HH:mm', { locale: ar })}</p>
                            {submission.file_name && (
                              <p>الملف: {submission.file_name}</p>
                            )}
                            {submission.grade !== undefined && (
                              <p className="font-medium">الدرجة: {submission.grade} / {assignment.max_grade || 100}</p>
                            )}
                            {submission.feedback && (
                              <div className="mt-2">
                                <p className="font-medium">ملاحظات المدرس:</p>
                                <p className="text-green-600">{submission.feedback}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            disabled={isOverdue}
                            onClick={() => {
                              setAssignmentToUpload(assignment);
                              setShowUploadModal(true);
                            }}
                          >
                            <Upload className="h-4 w-4 ml-1" />
                            {isOverdue ? 'انتهت المهلة' : 'رفع الواجب'}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* مودال رفع الواجب */}
      <AssignmentUploadModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setAssignmentToUpload(null);
        }}
        assignment={assignmentToUpload}
        onUploadSuccess={() => {
          // تحديث بيانات الواجبات إذا لزم الأمر
          window.location.reload();
        }}
      />
    </div>
  );
};

export default MobileAssignments;