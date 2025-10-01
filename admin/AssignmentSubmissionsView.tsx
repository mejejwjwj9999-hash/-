import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  XCircle,
  FileText,
  Calendar,
  Search,
  Eye,
  Download,
  MessageSquare,
  Award,
  AlertCircle
} from 'lucide-react';
import { Assignment } from '@/types/course';
import { useAssignmentSubmissions, useGradeSubmission } from '@/hooks/useAssignmentsManagement';
import { useToast } from '@/hooks/use-toast';

interface AssignmentSubmissionsViewProps {
  assignment: Assignment;
  open: boolean;
  onClose: () => void;
}

const AssignmentSubmissionsView: React.FC<AssignmentSubmissionsViewProps> = ({
  assignment,
  open,
  onClose
}) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [gradingSubmission, setGradingSubmission] = useState<any>(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');

  const { 
    data: submissions = [], 
    isLoading, 
    error 
  } = useAssignmentSubmissions(assignment.id);

  const gradeMutation = useGradeSubmission();

  // تصفية التسليمات
  const filteredSubmissions = submissions.filter(submission => {
    const fullName = `${submission.student_profiles?.first_name || ''} ${submission.student_profiles?.last_name || ''}`.trim();
    const matchesSearch = !searchQuery || 
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.student_profiles?.student_id?.includes(searchQuery);
    
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'submitted') return matchesSearch && submission.status === 'submitted';
    if (selectedTab === 'graded') return matchesSearch && submission.status === 'graded';
    if (selectedTab === 'pending') return matchesSearch && submission.status === 'pending';
    
    return matchesSearch;
  });

  // إحصائيات التسليمات
  const stats = {
    total: submissions.length,
    submitted: submissions.filter(s => s.status === 'submitted').length,
    graded: submissions.filter(s => s.status === 'graded').length,
    pending: submissions.filter(s => s.status === 'pending').length,
    average: submissions.filter(s => s.grade).reduce((acc, s) => acc + (s.grade || 0), 0) / submissions.filter(s => s.grade).length || 0
  };

  const handleGradeSubmission = (submission: any) => {
    if (!grade || !feedback) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال الدرجة والملاحظات',
        variant: 'destructive'
      });
      return;
    }

    gradeMutation.mutate({
      submissionId: submission.id,
      grade: parseFloat(grade),
      feedback
    }, {
      onSuccess: () => {
        setGradingSubmission(null);
        setGrade('');
        setFeedback('');
        toast({
          title: 'تم تقييم التسليم',
          description: 'تم حفظ الدرجة والملاحظات بنجاح'
        });
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-500';
      case 'graded': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'submitted': return 'مُسلم';
      case 'graded': return 'مُقيم';
      case 'pending': return 'قيد المراجعة';
      default: return 'غير محدد';
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto" dir="rtl">
          <div className="p-8 text-center">
            <div className="animate-pulse">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p>جاري تحميل التسليمات...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            تسليمات الواجب: {assignment.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-3">
                <div className="text-center">
                  <Users className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-xs text-muted-foreground">إجمالي</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="text-center">
                  <CheckCircle2 className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold">{stats.submitted}</div>
                  <div className="text-xs text-muted-foreground">مُسلم</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="text-center">
                  <Award className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold">{stats.graded}</div>
                  <div className="text-xs text-muted-foreground">مُقيم</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="text-center">
                  <Clock className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold">{stats.pending}</div>
                  <div className="text-xs text-muted-foreground">قيد المراجعة</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="text-center">
                  <Award className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold">{stats.average.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">متوسط الدرجات</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* أدوات التصفية */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث بالاسم أو رقم الطالب..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="submitted">مُسلم</TabsTrigger>
                <TabsTrigger value="graded">مُقيم</TabsTrigger>
                <TabsTrigger value="pending">قيد المراجعة</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* قائمة التسليمات */}
          <ScrollArea className="h-[400px]">
            {filteredSubmissions.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد تسليمات</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? 'لم يتم العثور على تسليمات تطابق البحث' : 'لم يقم أي طالب بتسليم هذا الواجب بعد'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredSubmissions.map((submission) => (
                  <Card key={submission.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">
                              {`${submission.student_profiles?.first_name || ''} ${submission.student_profiles?.last_name || ''}`.trim() || 'غير محدد'}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {submission.student_profiles?.student_id || 'غير محدد'}
                            </Badge>
                            <Badge className={`text-xs text-white ${getStatusColor(submission.status)}`}>
                              {getStatusLabel(submission.status)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">تاريخ التسليم:</span>
                                <span className="font-medium">
                                  {new Date(submission.submitted_at).toLocaleDateString('ar-SA')}
                                </span>
                              </div>
                              {submission.grade && (
                                <div className="flex items-center gap-2">
                                  <Award className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">الدرجة:</span>
                                  <span className="font-medium text-green-600">
                                    {submission.grade} / {assignment.max_grade || 100}
                                  </span>
                                </div>
                              )}
                            </div>

                            {submission.submission_text && (
                              <div>
                                <p className="text-muted-foreground mb-1">النص المُسلم:</p>
                                <p className="text-sm bg-gray-50 p-2 rounded border line-clamp-2">
                                  {submission.submission_text}
                                </p>
                              </div>
                            )}
                          </div>

                          {submission.feedback && (
                            <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                              <div className="flex items-center gap-2 mb-1">
                                <MessageSquare className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-800">ملاحظات الأستاذ:</span>
                              </div>
                              <p className="text-sm text-blue-700">{submission.feedback}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {submission.file_path && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(submission.file_path, '_blank')}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setGradingSubmission(submission);
                              setGrade(submission.grade?.toString() || '');
                              setFeedback(submission.feedback || '');
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* مودال التقييم */}
          {gradingSubmission && (
            <Dialog open={!!gradingSubmission} onOpenChange={() => setGradingSubmission(null)}>
              <DialogContent className="max-w-md" dir="rtl">
                <DialogHeader>
                  <DialogTitle>تقييم تسليم الطالب</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">الطالب:</label>
                    <p className="text-sm text-muted-foreground">
                      {`${gradingSubmission.student_profiles?.first_name || ''} ${gradingSubmission.student_profiles?.last_name || ''}`.trim()} ({gradingSubmission.student_profiles?.student_id})
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      الدرجة (من {assignment.max_grade || 100}):
                    </label>
                    <Input
                      type="number"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="0"
                      min="0"
                      max={assignment.max_grade || 100}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">الملاحظات:</label>
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="اكتب ملاحظاتك على التسليم..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleGradeSubmission(gradingSubmission)}
                      disabled={gradeMutation.isPending}
                      className="flex-1"
                    >
                      {gradeMutation.isPending ? 'جاري الحفظ...' : 'حفظ التقييم'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setGradingSubmission(null)}
                      className="flex-1"
                    >
                      إلغاء
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentSubmissionsView;