import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Calendar, 
  FileText, 
  Users, 
  Clock, 
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Upload,
  Download,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useAdminAssignments, useCreateAssignment, useUpdateAssignment, useDeleteAssignment } from '@/hooks/useAssignmentsManagement';
import { Assignment } from '@/types/course';
import { useToast } from '@/hooks/use-toast';
import AssignmentCreationModal from './AssignmentCreationModal';
import AssignmentSubmissionsView from './AssignmentSubmissionsView';

const AssignmentsManagement = () => {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { 
    data: assignments = [], 
    isLoading, 
    error 
  } = useAdminAssignments();

  const createMutation = useCreateAssignment();
  const updateMutation = useUpdateAssignment();
  const deleteMutation = useDeleteAssignment();

  // تصفية الواجبات
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.courses?.course_name_ar.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'active') return matchesSearch && assignment.status === 'active';
    if (selectedTab === 'completed') return matchesSearch && assignment.status === 'completed';
    if (selectedTab === 'overdue') return matchesSearch && new Date(assignment.due_date) < new Date();
    
    return matchesSearch;
  });

  // إحصائيات الواجبات
  const stats = {
    total: assignments.length,
    active: assignments.filter(a => a.status === 'active').length,
    completed: assignments.filter(a => a.status === 'completed').length,
    overdue: assignments.filter(a => new Date(a.due_date) < new Date()).length,
  };

  const handleDeleteAssignment = (assignment: Assignment) => {
    if (window.confirm(`هل أنت متأكد من حذف واجب "${assignment.title}"؟`)) {
      deleteMutation.mutate(assignment.id);
    }
  };

  const getStatusColor = (assignment: Assignment) => {
    if (assignment.status === 'completed') return 'bg-green-500';
    if (new Date(assignment.due_date) < new Date()) return 'bg-red-500';
    return 'bg-blue-500';
  };

  const getStatusLabel = (assignment: Assignment) => {
    if (assignment.status === 'completed') return 'مكتمل';
    if (new Date(assignment.due_date) < new Date()) return 'متأخر';
    return 'نشط';
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p>جاري تحميل الواجبات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-destructive mb-2">خطأ في تحميل الواجبات</h3>
        <p className="text-muted-foreground">يرجى المحاولة مرة أخرى</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة الواجبات</h1>
          <p className="text-muted-foreground">إدارة واجبات المقررات الدراسية</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          إنشاء واجب جديد
        </Button>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الواجبات</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الواجبات النشطة</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الواجبات المكتملة</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الواجبات المتأخرة</p>
                <p className="text-2xl font-bold">{stats.overdue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* أدوات التصفية والبحث */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="البحث في الواجبات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-shrink-0">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="active">نشط</TabsTrigger>
                <TabsTrigger value="completed">مكتمل</TabsTrigger>
                <TabsTrigger value="overdue">متأخر</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* قائمة الواجبات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredAssignments.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا توجد واجبات</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'لم يتم العثور على واجبات تطابق البحث' : 'لم يتم إنشاء أي واجبات بعد'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  إنشاء أول واجب
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredAssignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{assignment.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {assignment.courses?.course_code || 'غير محدد'}
                      </Badge>
                      <Badge 
                        className={`text-xs text-white ${getStatusColor(assignment)}`}
                      >
                        {getStatusLabel(assignment)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setShowSubmissionsModal(true);
                      }}
                      className="h-8 w-8"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAssignment(assignment)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {assignment.description || 'لا يوجد وصف'}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">تاريخ التسليم:</span>
                    <span className="font-medium">
                      {new Date(assignment.due_date).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">الدرجة:</span>
                    <span className="font-medium">{assignment.max_grade || 100} درجة</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">التسليمات:</span>
                    <span className="font-medium">
                      {(assignment as any).submissionCount || 0} تسليم
                      {(assignment as any).pendingCount > 0 && (
                        <Badge variant="secondary" className="mr-1 text-xs">
                          {(assignment as any).pendingCount} بانتظار التقييم
                        </Badge>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">أنشئ في:</span>
                    <span className="font-medium">
                      {new Date(assignment.created_at).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* مودال إنشاء واجب جديد */}
      <AssignmentCreationModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={(data) => {
          createMutation.mutate(data);
          setShowCreateModal(false);
        }}
      />

      {/* مودال عرض التسليمات */}
      {selectedAssignment && (
        <AssignmentSubmissionsView
          assignment={selectedAssignment}
          open={showSubmissionsModal}
          onClose={() => {
            setShowSubmissionsModal(false);
            setSelectedAssignment(null);
          }}
        />
      )}
    </div>
  );
};

export default AssignmentsManagement;