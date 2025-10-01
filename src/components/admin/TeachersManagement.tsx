import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users, 
  BookOpen,
  GraduationCap,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import AddTeacherModal from './AddTeacherModal';
import EditTeacherModal from './EditTeacherModal';

interface Teacher {
  id: string;
  user_id: string;
  teacher_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department_id?: string;
  specialization?: string;
  qualifications?: string;
  hire_date?: string;
  position?: string;
  office_location?: string;
  office_hours?: string;
  bio?: string;
  profile_image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const TeachersManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: teachers, isLoading } = useQuery({
    queryKey: ['admin-teachers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Teacher[];
    },
    staleTime: 1000 * 60 * 2,
  });

  const deleteTeacher = useMutation({
    mutationFn: async (teacherId: string) => {
      const { error } = await supabase
        .from('teacher_profiles')
        .update({ is_active: false })
        .eq('id', teacherId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-teachers'] });
      toast({
        title: 'تم إلغاء تفعيل المعلم',
        description: 'تم إلغاء تفعيل المعلم بنجاح',
      });
    },
    onError: (error) => {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إلغاء تفعيل المعلم',
        variant: 'destructive',
      });
    },
  });

  const activateTeacher = useMutation({
    mutationFn: async (teacherId: string) => {
      const { error } = await supabase
        .from('teacher_profiles')
        .update({ is_active: true })
        .eq('id', teacherId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-teachers'] });
      toast({
        title: 'تم تفعيل المعلم',
        description: 'تم تفعيل المعلم بنجاح',
      });
    },
    onError: (error) => {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تفعيل المعلم',
        variant: 'destructive',
      });
    },
  });

  const filteredTeachers = teachers?.filter(teacher =>
    `${teacher.first_name} ${teacher.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.teacher_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">إدارة المعلمين</h2>
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* العنوان وأزرار الإجراءات */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">إدارة المعلمين</h2>
            <p className="text-muted-foreground">إدارة بيانات وصلاحيات المعلمين</p>
          </div>
        </div>
        
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إضافة معلم جديد
        </Button>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي المعلمين</p>
                <p className="text-xl font-bold">{teachers?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">نشط</p>
                <p className="text-xl font-bold">
                  {teachers?.filter(t => t.is_active).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">أقسام مختلفة</p>
                <p className="text-xl font-bold">
                  {new Set(teachers?.map(t => t.department_id).filter(Boolean)).size || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">غير نشط</p>
                <p className="text-xl font-bold">
                  {teachers?.filter(t => !t.is_active).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* شريط البحث */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="البحث بالاسم، رقم المعلم، أو البريد الإلكتروني..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* قائمة المعلمين */}
      <div className="grid gap-4">
        {filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher) => (
            <Card key={teacher.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <GraduationCap className="h-8 w-8 text-primary" />
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {teacher.first_name} {teacher.last_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          رقم المعلم: {teacher.teacher_id}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{teacher.email}</span>
                        </div>
                        {teacher.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{teacher.phone}</span>
                          </div>
                        )}
                        {teacher.position && (
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            <span>{teacher.position}</span>
                          </div>
                        )}
                        {teacher.office_location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{teacher.office_location}</span>
                          </div>
                        )}
                      </div>

                      {teacher.specialization && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">التخصص:</span>
                          <Badge variant="secondary">{teacher.specialization}</Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={teacher.is_active ? 'secondary' : 'destructive'}>
                      {teacher.is_active ? 'نشط' : 'غير نشط'}
                    </Badge>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingTeacher(teacher)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    {teacher.is_active ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteTeacher.mutate(teacher.id)}
                        disabled={deleteTeacher.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => activateTeacher.mutate(teacher.id)}
                        disabled={activateTeacher.isPending}
                      >
                        تفعيل
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا توجد نتائج</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'لم يتم العثور على معلمين مطابقين لبحثك' : 'لا يوجد معلمون مسجلون'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* مودالات */}
      <AddTeacherModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      
      {editingTeacher && (
        <EditTeacherModal
          teacher={editingTeacher}
          isOpen={!!editingTeacher}
          onClose={() => setEditingTeacher(null)}
        />
      )}
    </div>
  );
};

export default TeachersManagement;