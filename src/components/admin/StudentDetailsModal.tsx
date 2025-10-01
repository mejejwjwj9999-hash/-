
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  GraduationCap, 
  Building,
  BookOpen,
  Clock
} from 'lucide-react';

interface Student {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  college: string;
  department: string;
  academic_year: number;
  semester: number;
  admission_date: string;
  status: string;
  created_at: string;
}

interface StudentDetailsModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  student,
  isOpen,
  onClose,
}) => {
  if (!student) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'نشط', className: 'bg-green-100 text-green-800 border-green-200' },
      inactive: { label: 'غير نشط', className: 'bg-gray-100 text-gray-800 border-gray-200' },
      suspended: { label: 'معلق', className: 'bg-red-100 text-red-800 border-red-200' },
      graduated: { label: 'متخرج', className: 'bg-blue-100 text-blue-800 border-blue-200' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            تفاصيل الطالب
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header with student info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{student.first_name} {student.last_name}</h3>
                  <p className="text-muted-foreground">رقم الطالب: {student.student_id}</p>
                </div>
                {getStatusBadge(student.status)}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                معلومات التواصل
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">البريد الإلكتروني</label>
                  <p className="mt-1">{student.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">رقم الهاتف</label>
                  <p className="mt-1">{student.phone || 'غير متوفر'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                المعلومات الأكاديمية
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">الكلية</label>
                  <p className="mt-1 flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    {student.college}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">القسم</label>
                  <p className="mt-1 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    {student.department}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">السنة الدراسية</label>
                  <p className="mt-1">السنة {student.academic_year}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">الفصل الدراسي</label>
                  <p className="mt-1">الفصل {student.semester}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates Information */}
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                التواريخ المهمة
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">تاريخ القبول</label>
                  <p className="mt-1 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {formatDate(student.admission_date)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">تاريخ التسجيل في النظام</label>
                  <p className="mt-1 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {formatDate(student.created_at)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailsModal;
