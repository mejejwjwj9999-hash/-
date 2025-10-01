import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import AddTeacherMobileModal from './modals/AddTeacherMobileModal';
import { 
  Users, 
  Search, 
  Plus, 
  GraduationCap, 
  Mail, 
  Phone,
  Edit,
  Trash2,
  UserCheck,
  Filter,
  BookOpen
} from 'lucide-react';

const AdminMobileTeachers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ['teachers-mobile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = (teacher.first_name + ' ' + teacher.last_name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.department_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && teacher.is_active) ||
      (filterStatus === "inactive" && !teacher.is_active);
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 pb-20">
        <div className="text-center py-8">
          <div className="w-12 h-12 border-4 border-university-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-academic-gray">جاري تحميل بيانات المدرسين...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Enhanced Header */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-100/50 to-emerald-200/50 rounded-3xl flex items-center justify-center shadow-elegant animate-scale-in">
          <GraduationCap className="h-10 w-10 text-emerald-600" />
        </div>
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-emerald-600 mb-1">إدارة المدرسين</h1>
          <p className="text-academic-gray font-medium">إدارة شاملة لبيانات أعضاء هيئة التدريس</p>
        </div>
      </div>

      {/* Search, Filter and Add */}
      <div className="space-y-3 animate-fade-in">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-academic-gray h-4 w-4" />
            <Input
              placeholder="البحث عن مدرس..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 text-right border-emerald-200 focus:border-emerald-400"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="border-emerald-200 hover:bg-emerald-50"
            onClick={() => setFilterStatus(filterStatus === "all" ? "active" : filterStatus === "active" ? "inactive" : "all")}
          >
            <Filter className="h-4 w-4 text-emerald-600" />
          </Button>
        </div>
        
        <Button 
          onClick={() => setShowAddModal(true)}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-elegant hover:shadow-large transition-all duration-300"
        >
          <Plus className="h-4 w-4 ml-2" />
          إضافة مدرس جديد
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 animate-fade-in">
        <Card className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-emerald-100/40 border-0 shadow-elegant hover:shadow-large transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300"></div>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{teachers.length}</div>
            <div className="text-xs text-academic-gray">إجمالي المدرسين</div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden bg-gradient-to-br from-white via-green-50/30 to-green-100/40 border-0 shadow-elegant hover:shadow-large transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-green-400 to-green-300"></div>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {teachers.filter(t => t.is_active === true).length}
            </div>
            <div className="text-xs text-academic-gray">نشط</div>
          </CardContent>
        </Card>
      </div>

      {/* Teachers List */}
      <div className="space-y-4 animate-fade-in">
        {filteredTeachers.length === 0 ? (
          <Card className="border-0 shadow-elegant">
            <CardContent className="text-center py-12">
              <GraduationCap className="h-16 w-16 text-academic-gray/50 mx-auto mb-4" />
              <h3 className="font-semibold text-emerald-600 mb-2">
                {searchTerm ? 'لا توجد نتائج للبحث' : 'لا يوجد مدرسين مسجلين'}
              </h3>
              <p className="text-academic-gray text-sm">
                {searchTerm ? "جرب البحث بمصطلحات أخرى" : "ابدأ بإضافة مدرس جديد"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTeachers.map((teacher, index) => (
            <Card 
              key={teacher.id} 
              className="border-0 shadow-elegant hover:shadow-large transition-all duration-300 hover-scale"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-100/50 to-emerald-200/50 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft">
                    <span className="text-emerald-600 font-bold text-lg">
                      {teacher.first_name?.charAt(0) || 'م'}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-emerald-600 text-base">
                          {teacher.first_name} {teacher.last_name}
                        </h3>
                        <p className="text-sm text-academic-gray">
                          {teacher.email || 'بريد إلكتروني غير محدد'}
                        </p>
                      </div>
                      <Badge 
                        variant="outline"
                        className={`text-xs shadow-soft ${
                          teacher.is_active 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {teacher.is_active ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      {teacher.department_id && (
                        <div className="flex items-center gap-2 text-sm text-academic-gray">
                          <BookOpen className="h-4 w-4 text-emerald-600" />
                          <span className="font-medium">القسم:</span>
                          <span className="text-emerald-600">{teacher.department_id}</span>
                        </div>
                      )}
                      
                      {teacher.email && (
                        <div className="flex items-center gap-2 text-sm text-academic-gray">
                          <Mail className="h-4 w-4 text-emerald-600" />
                          <span className="font-medium">البريد:</span>
                          <span className="text-emerald-600 truncate">{teacher.email}</span>
                        </div>
                      )}
                      
                      {teacher.phone && (
                        <div className="flex items-center gap-2 text-sm text-academic-gray">
                          <Phone className="h-4 w-4 text-emerald-600" />
                          <span className="font-medium">الهاتف:</span>
                          <span className="text-emerald-600">{teacher.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-emerald-50/50 rounded-xl p-3 mb-4">
                      <div className="text-xs text-academic-gray">
                        <span className="font-medium">تاريخ التسجيل:</span> {new Date(teacher.created_at).toLocaleDateString('ar-SA')}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-xs border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
                      >
                        <Edit className="h-3 w-3 ml-1" />
                        تعديل
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-xs border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
                      >
                        <UserCheck className="h-3 w-3 ml-1" />
                        تفاصيل
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modals */}
      <AddTeacherMobileModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
};

export default AdminMobileTeachers;