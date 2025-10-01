import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AddStudentMobileModal from "./modals/AddStudentMobileModal";
import EditStudentMobileModal from "./modals/EditStudentMobileModal";
import DeleteStudentMobileModal from "./modals/DeleteStudentMobileModal";
import { 
  Users, 
  Search, 
  Plus, 
  Eye, 
  Edit,
  Phone,
  Mail,
  UserCircle,
  Trash2,
  Filter,
  BookOpen,
  GraduationCap
} from "lucide-react";

const AdminMobileStudents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["admin-students"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || student.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleEditStudent = (student: any) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const handleDeleteStudent = (student: any) => {
    setSelectedStudent(student);
    setShowDeleteModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-university-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">جاري تحميل بيانات الطلاب...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Enhanced Header */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-university-blue/10 to-university-blue/20 rounded-3xl flex items-center justify-center shadow-elegant animate-scale-in">
          <Users className="h-10 w-10 text-university-blue" />
        </div>
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-university-blue mb-1">إدارة الطلاب</h1>
          <p className="text-academic-gray font-medium">نظام شامل لإدارة بيانات الطلاب</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-4 animate-fade-in">
        <Card className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-blue-100/40 border-0 shadow-elegant hover:shadow-large transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-university-blue via-university-blue-light to-university-blue"></div>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-university-blue">{students.length}</div>
            <div className="text-xs text-academic-gray">إجمالي الطلاب</div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden bg-gradient-to-br from-white via-green-50/30 to-green-100/40 border-0 shadow-elegant hover:shadow-large transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-green-400 to-green-300"></div>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {students.filter(s => s.status === 'active').length}
            </div>
            <div className="text-xs text-academic-gray">طالب نشط</div>
          </CardContent>
        </Card>
      </div>

      {/* Search, Filter and Add */}
      <div className="space-y-3 animate-fade-in">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-academic-gray h-4 w-4" />
            <Input
              placeholder="البحث في الطلاب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 text-right border-university-blue/20 focus:border-university-blue"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="border-university-blue/20 hover:bg-university-blue/10"
            onClick={() => setFilterStatus(filterStatus === "all" ? "active" : "all")}
          >
            <Filter className="h-4 w-4 text-university-blue" />
          </Button>
        </div>
        
        <Button 
          onClick={() => setShowAddModal(true)}
          className="w-full bg-gradient-to-r from-university-blue to-university-blue-dark hover:from-university-blue-dark hover:to-university-blue text-white shadow-elegant hover:shadow-large transition-all duration-300"
        >
          <Plus className="h-4 w-4 ml-2" />
          إضافة طالب جديد
        </Button>
      </div>

      {/* Students List */}
      <div className="space-y-4 animate-fade-in">
        {filteredStudents.length === 0 ? (
          <Card className="border-0 shadow-elegant">
            <CardContent className="text-center py-12">
              <UserCircle className="h-16 w-16 text-academic-gray/50 mx-auto mb-4" />
              <h3 className="font-semibold text-university-blue mb-2">
                {searchTerm ? "لم يتم العثور على طلاب" : "لا توجد بيانات طلاب"}
              </h3>
              <p className="text-academic-gray text-sm">
                {searchTerm ? "جرب البحث بمصطلحات أخرى" : "ابدأ بإضافة طالب جديد"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredStudents.map((student, index) => (
            <Card 
              key={student.id} 
              className="border-0 shadow-elegant hover:shadow-large transition-all duration-300 hover-scale"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-university-blue/10 to-university-blue/20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft">
                    <span className="text-university-blue font-bold text-lg">
                      {student.first_name?.charAt(0) || 'ط'}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-university-blue text-base">
                          {student.first_name && student.last_name ? `${student.first_name} ${student.last_name}` : 'غير محدد'}
                        </h3>
                        <p className="text-sm text-academic-gray">
                          رقم الطالب: {student.student_id || 'غير محدد'}
                        </p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs shadow-soft ${
                          student.status === 'active' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {student.status === 'active' ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {student.email && (
                        <div className="flex items-center gap-2 text-sm text-academic-gray">
                          <Mail className="h-4 w-4 text-university-blue" />
                          <span className="truncate">{student.email}</span>
                        </div>
                      )}
                      {student.phone && (
                        <div className="flex items-center gap-2 text-sm text-academic-gray">
                          <Phone className="h-4 w-4 text-university-blue" />
                          <span>{student.phone}</span>
                        </div>
                      )}
                      {student.college && (
                        <div className="flex items-center gap-2 text-sm text-academic-gray">
                          <BookOpen className="h-4 w-4 text-university-blue" />
                          <span className="truncate">{student.college}</span>
                        </div>
                      )}
                      {student.department && (
                        <div className="flex items-center gap-2 text-sm text-academic-gray">
                          <GraduationCap className="h-4 w-4 text-university-blue" />
                          <span className="truncate">{student.department}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-university-blue/5 rounded-xl p-3 mb-4">
                      <div className="grid grid-cols-2 gap-2 text-xs text-academic-gray">
                        <div>
                          <span className="font-medium">السنة:</span> {student.academic_year || 'غير محدد'}
                        </div>
                        <div>
                          <span className="font-medium">الفصل:</span> {student.semester === 1 ? 'الأول' : student.semester === 2 ? 'الثاني' : 'غير محدد'}
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium">الحالة:</span> {student.status || 'نشط'}
                        </div>
                        <div className="col-span-2 text-xs text-academic-gray/70">
                          <span className="font-medium">تاريخ التسجيل:</span> {new Date(student.created_at).toLocaleDateString('ar-SA')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-xs border-university-blue/20 hover:bg-university-blue/10 hover:border-university-blue/40 transition-all duration-200"
                        onClick={() => handleEditStudent(student)}
                      >
                        <Edit className="h-3 w-3 ml-1" />
                        تعديل
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                        onClick={() => handleDeleteStudent(student)}
                      >
                        <Trash2 className="h-3 w-3 ml-1" />
                        حذف
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
      <AddStudentMobileModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
      
      <EditStudentMobileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        student={selectedStudent}
      />
      
      <DeleteStudentMobileModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        student={selectedStudent}
      />
    </div>
  );
};

export default AdminMobileStudents;