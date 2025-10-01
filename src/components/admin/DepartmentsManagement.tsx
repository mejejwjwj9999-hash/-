import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import DepartmentFormDialog from './departments/DepartmentFormDialog';
import DepartmentCard from './departments/DepartmentCard';
import { 
  useAcademicDepartments, 
  useCreateDepartment, 
  useUpdateDepartment, 
  useDeleteDepartment,
  AcademicDepartment 
} from '@/hooks/useAcademicDepartments';

const DepartmentsManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<AcademicDepartment | null>(null);
  
  // استخدام hooks قاعدة البيانات
  const { data: departments, isLoading } = useAcademicDepartments();
  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();
  const deleteDepartment = useDeleteDepartment();

  const handleSave = async (data: Partial<AcademicDepartment>) => {
    try {
      if (selectedDepartment) {
        await updateDepartment.mutateAsync({
          id: selectedDepartment.id,
          updates: data
        });
      } else {
        await createDepartment.mutateAsync(data as any);
      }
      setIsDialogOpen(false);
      setSelectedDepartment(null);
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  const handleEdit = (department: AcademicDepartment) => {
    setSelectedDepartment(department);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا القسم؟')) {
      try {
        await deleteDepartment.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting department:', error);
      }
    }
  };

  const handleToggleActive = async (id: string) => {
    const department = departments?.find(d => d.id === id);
    if (department) {
      try {
        await updateDepartment.mutateAsync({
          id,
          updates: { is_active: !department.is_active }
        });
      } catch (error) {
        console.error('Error toggling department status:', error);
      }
    }
  };

  const filteredDepartments = departments
    ? departments
        .filter(d =>
          d.name_ar?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.name_en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.department_key?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة الأقسام الأكاديمية</h2>
          <p className="text-muted-foreground">إدارة جميع الأقسام والكليات الأكاديمية</p>
        </div>
        <Button onClick={() => {
          setSelectedDepartment(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة قسم جديد
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="البحث عن قسم..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="text-2xl font-bold">{departments?.length || 0}</div>
          <div className="text-sm text-muted-foreground">إجمالي الأقسام</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {departments?.filter(d => d.is_active).length || 0}
          </div>
          <div className="text-sm text-muted-foreground">الأقسام النشطة</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-600">
            {departments?.filter(d => !d.is_active).length || 0}
          </div>
          <div className="text-sm text-muted-foreground">الأقسام غير النشطة</div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDepartments.map((department) => (
          <DepartmentCard
            key={department.id}
            department={department}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        ))}
      </div>

      {filteredDepartments.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          لا توجد أقسام تطابق معايير البحث
        </div>
      )}

      {/* Form Dialog */}
      <DepartmentFormDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setSelectedDepartment(null);
        }}
        department={selectedDepartment}
        onSave={handleSave}
      />
    </div>
  );
};

export default DepartmentsManagement;
