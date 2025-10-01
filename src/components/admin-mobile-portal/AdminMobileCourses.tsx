import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AddCourseMobileModal from "./modals/AddCourseMobileModal";
import { 
  BookOpen, 
  Search, 
  Plus, 
  Eye, 
  Edit,
  Clock,
  Users,
  Filter,
  GraduationCap,
  Calendar
} from "lucide-react";

const AdminMobileCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCollege, setFilterCollege] = useState("all");

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("course_code", { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.course_name_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCollege = filterCollege === "all" || course.college === filterCollege;
    
    return matchesSearch && matchesCollege;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-university-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">جاري تحميل المقررات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Enhanced Header */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-100/50 to-green-200/50 rounded-3xl flex items-center justify-center shadow-elegant animate-scale-in">
          <BookOpen className="h-10 w-10 text-green-600" />
        </div>
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-green-600 mb-1">إدارة المقررات</h1>
          <p className="text-academic-gray font-medium">نظام شامل لإدارة المقررات الدراسية</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-4 animate-fade-in">
        <Card className="relative overflow-hidden bg-gradient-to-br from-white via-green-50/30 to-green-100/40 border-0 shadow-elegant hover:shadow-large transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-green-400 to-green-300"></div>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{courses.length}</div>
            <div className="text-xs text-academic-gray">إجمالي المقررات</div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-blue-100/40 border-0 shadow-elegant hover:shadow-large transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300"></div>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {courses.reduce((total, course) => total + (course.credit_hours || 0), 0)}
            </div>
            <div className="text-xs text-academic-gray">إجمالي الساعات</div>
          </CardContent>
        </Card>
      </div>

      {/* Search, Filter and Add */}
      <div className="space-y-3 animate-fade-in">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-academic-gray h-4 w-4" />
            <Input
              placeholder="البحث في المقررات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 text-right border-green-200 focus:border-green-400"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="border-green-200 hover:bg-green-50"
            onClick={() => setFilterCollege(filterCollege === "all" ? "كلية تقنية المعلومات" : "all")}
          >
            <Filter className="h-4 w-4 text-green-600" />
          </Button>
        </div>
        
        <Button 
          onClick={() => setShowAddModal(true)}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-elegant hover:shadow-large transition-all duration-300"
        >
          <Plus className="h-4 w-4 ml-2" />
          إضافة مقرر جديد
        </Button>
      </div>

      {/* Courses List */}
      <div className="space-y-4 animate-fade-in">
        {filteredCourses.length === 0 ? (
          <Card className="border-0 shadow-elegant">
            <CardContent className="text-center py-12">
              <BookOpen className="h-16 w-16 text-academic-gray/50 mx-auto mb-4" />
              <h3 className="font-semibold text-green-600 mb-2">
                {searchTerm ? "لم يتم العثور على مقررات" : "لا توجد مقررات"}
              </h3>
              <p className="text-academic-gray text-sm">
                {searchTerm ? "جرب البحث بمصطلحات أخرى" : "ابدأ بإضافة مقرر جديد"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCourses.map((course, index) => (
            <Card 
              key={course.id} 
              className="border-0 shadow-elegant hover:shadow-large transition-all duration-300 hover-scale"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-green-600 text-base mb-1">
                        {course.course_name_ar}
                      </h3>
                      <p className="text-sm text-academic-gray mb-2">
                        كود المقرر: <span className="font-medium text-green-600">{course.course_code}</span>
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 shadow-soft">
                      نشط
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-academic-gray">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span className="font-medium">الساعات:</span>
                      <span className="text-green-600">{course.credit_hours}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-academic-gray">
                      <GraduationCap className="h-4 w-4 text-green-600" />
                      <span className="font-medium">القسم:</span>
                      <span className="text-green-600 truncate">{course.department}</span>
                    </div>
                  </div>
                  
                  <div className="bg-green-50/50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-academic-gray">
                      <BookOpen className="h-4 w-4 text-green-600" />
                      <span className="font-medium">الكلية:</span>
                      <span className="text-green-600">{course.college}</span>
                    </div>
                    {course.academic_year && (
                      <div className="flex items-center gap-2 text-sm text-academic-gray">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="font-medium">العام الدراسي:</span>
                        <span className="text-green-600">{course.academic_year}</span>
                      </div>
                    )}
                    {course.semester && (
                      <div className="flex items-center gap-2 text-sm text-academic-gray">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="font-medium">الفصل:</span>
                        <span className="text-green-600">
                          {course.semester === 1 ? 'الأول' : course.semester === 2 ? 'الثاني' : course.semester}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-xs border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                    >
                      <Eye className="h-3 w-3 ml-1" />
                      عرض التفاصيل
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-xs border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                    >
                      <Edit className="h-3 w-3 ml-1" />
                      تعديل
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modals */}
      <AddCourseMobileModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
};

export default AdminMobileCourses;