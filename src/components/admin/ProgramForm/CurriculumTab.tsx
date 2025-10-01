import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Plus, Edit, Trash2, BookOpen, Clock, GraduationCap } from 'lucide-react';
import { ProgramFormData, AcademicYear, CourseSubject } from './types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface CurriculumTabProps {
  formData: ProgramFormData;
  setFormData: (data: ProgramFormData | ((prev: ProgramFormData) => ProgramFormData)) => void;
}

const createEmptyYear = (yearNumber: number): AcademicYear => ({
  year_number: yearNumber,
  year_name_ar: `السنة ${yearNumber === 1 ? 'الأولى' : yearNumber === 2 ? 'الثانية' : yearNumber === 3 ? 'الثالثة' : yearNumber === 4 ? 'الرابعة' : yearNumber === 5 ? 'الخامسة' : `${yearNumber}`}`,
  year_name_en: `Year ${yearNumber}`,
  total_credit_hours: 0,
  subjects: [],
  semesters: []
});

const createEmptySubject = (): CourseSubject => ({
  id: Date.now().toString(),
  code: '',
  name_ar: '',
  name_en: '',
  credit_hours: 3,
  theory_hours: 2,
  practical_hours: 1,
  prerequisites: [],
  description_ar: '',
  description_en: '',
  order: 0
});

export const CurriculumTab: React.FC<CurriculumTabProps> = ({ formData, setFormData }) => {
  const [isYearDialogOpen, setIsYearDialogOpen] = useState(false);
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
  const [editingSubject, setEditingSubject] = useState<CourseSubject | null>(null);
  const [selectedYearIndex, setSelectedYearIndex] = useState<number>(0);
  const [yearData, setYearData] = useState<AcademicYear>(createEmptyYear(1));
  const [subjectData, setSubjectData] = useState<CourseSubject>(createEmptySubject());

  const handleAddYear = () => {
    const nextYearNumber = formData.yearly_curriculum.length + 1;
    setEditingYear(null);
    setYearData(createEmptyYear(nextYearNumber));
    setIsYearDialogOpen(true);
  };

  const handleEditYear = (year: AcademicYear, index: number) => {
    setEditingYear(year);
    setSelectedYearIndex(index);
    setYearData({ ...year });
    setIsYearDialogOpen(true);
  };

  const handleSaveYear = () => {
    if (!yearData.year_name_ar) return;

    setFormData(prev => {
      const newYears = [...prev.yearly_curriculum];
      
      if (editingYear) {
        newYears[selectedYearIndex] = yearData;
      } else {
        newYears.push(yearData);
      }

      return { ...prev, yearly_curriculum: newYears };
    });

    setIsYearDialogOpen(false);
  };

  const handleDeleteYear = (index: number) => {
    setFormData(prev => ({
      ...prev,
      yearly_curriculum: prev.yearly_curriculum.filter((_, i) => i !== index)
    }));
  };

  const handleAddSubject = (yearIndex: number) => {
    setEditingSubject(null);
    setSelectedYearIndex(yearIndex);
    setSubjectData(createEmptySubject());
    setIsSubjectDialogOpen(true);
  };

  const handleEditSubject = (subject: CourseSubject, yearIndex: number, subjectIndex: number) => {
    setEditingSubject(subject);
    setSelectedYearIndex(yearIndex);
    setSubjectData({ ...subject });
    setIsSubjectDialogOpen(true);
  };

  const handleSaveSubject = () => {
    if (!subjectData.name_ar || !subjectData.code) return;

    setFormData(prev => {
      const newYears = [...prev.yearly_curriculum];
      const targetYear = { ...newYears[selectedYearIndex] };
      
      if (editingSubject) {
        const subjectIndex = targetYear.subjects.findIndex(s => s.id === editingSubject.id);
        if (subjectIndex !== -1) {
          targetYear.subjects[subjectIndex] = subjectData;
        }
      } else {
        subjectData.order = targetYear.subjects.length;
        targetYear.subjects.push(subjectData);
      }

      // حساب إجمالي الساعات المعتمدة
      targetYear.total_credit_hours = targetYear.subjects.reduce((total, subject) => total + subject.credit_hours, 0);
      
      newYears[selectedYearIndex] = targetYear;
      return { ...prev, yearly_curriculum: newYears };
    });

    setIsSubjectDialogOpen(false);
  };

  const handleDeleteSubject = (yearIndex: number, subjectId: string) => {
    setFormData(prev => {
      const newYears = [...prev.yearly_curriculum];
      const targetYear = { ...newYears[yearIndex] };
      
      targetYear.subjects = targetYear.subjects.filter(s => s.id !== subjectId);
      targetYear.total_credit_hours = targetYear.subjects.reduce((total, subject) => total + subject.credit_hours, 0);
      
      newYears[yearIndex] = targetYear;
      return { ...prev, yearly_curriculum: newYears };
    });
  };

  const handleYearDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(formData.yearly_curriculum);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // تحديث أرقام السنوات
    const updatedItems = items.map((item, index) => ({
      ...item,
      year_number: index + 1
    }));

    setFormData(prev => ({ ...prev, yearly_curriculum: updatedItems }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">الخطة الدراسية</h3>
          <p className="text-sm text-muted-foreground">إدارة المنهج الدراسي سنة بسنة مع المواد والساعات المعتمدة</p>
        </div>
        
        <Dialog open={isYearDialogOpen} onOpenChange={setIsYearDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddYear} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              إضافة سنة دراسية
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingYear ? 'تحرير السنة الدراسية' : 'إضافة سنة دراسية جديدة'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>اسم السنة بالعربية <span className="text-destructive">*</span></Label>
                  <Input
                    value={yearData.year_name_ar}
                    onChange={(e) => setYearData(prev => ({ ...prev, year_name_ar: e.target.value }))}
                    placeholder="السنة الأولى"
                    dir="rtl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>اسم السنة بالإنجليزية</Label>
                  <Input
                    value={yearData.year_name_en}
                    onChange={(e) => setYearData(prev => ({ ...prev, year_name_en: e.target.value }))}
                    placeholder="First Year"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>رقم السنة</Label>
                <Input
                  type="number"
                  min="1"
                  value={yearData.year_number}
                  onChange={(e) => setYearData(prev => ({ ...prev, year_number: Number(e.target.value) }))}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsYearDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleSaveYear}>
                  {editingYear ? 'تحديث' : 'إضافة'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* حوار إضافة/تحرير المواد */}
      <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSubject ? 'تحرير المادة الدراسية' : 'إضافة مادة دراسية جديدة'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>رمز المادة <span className="text-destructive">*</span></Label>
                <Input
                  value={subjectData.code}
                  onChange={(e) => setSubjectData(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="CHEM101"
                  className="font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <Label>الساعات المعتمدة</Label>
                <Input
                  type="number"
                  min="1"
                  max="6"
                  value={subjectData.credit_hours}
                  onChange={(e) => setSubjectData(prev => ({ ...prev, credit_hours: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>اسم المادة بالعربية <span className="text-destructive">*</span></Label>
                <Input
                  value={subjectData.name_ar}
                  onChange={(e) => setSubjectData(prev => ({ ...prev, name_ar: e.target.value }))}
                  placeholder="الكيمياء العامة"
                  dir="rtl"
                />
              </div>
              
              <div className="space-y-2">
                <Label>اسم المادة بالإنجليزية</Label>
                <Input
                  value={subjectData.name_en}
                  onChange={(e) => setSubjectData(prev => ({ ...prev, name_en: e.target.value }))}
                  placeholder="General Chemistry"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الساعات النظرية</Label>
                <Input
                  type="number"
                  min="0"
                  value={subjectData.theory_hours}
                  onChange={(e) => setSubjectData(prev => ({ ...prev, theory_hours: Number(e.target.value) }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>الساعات العملية</Label>
                <Input
                  type="number"
                  min="0"
                  value={subjectData.practical_hours}
                  onChange={(e) => setSubjectData(prev => ({ ...prev, practical_hours: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>وصف المادة بالعربية</Label>
              <Textarea
                value={subjectData.description_ar}
                onChange={(e) => setSubjectData(prev => ({ ...prev, description_ar: e.target.value }))}
                placeholder="وصف مختصر للمادة وأهدافها..."
                dir="rtl"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>وصف المادة بالإنجليزية</Label>
              <Textarea
                value={subjectData.description_en}
                onChange={(e) => setSubjectData(prev => ({ ...prev, description_en: e.target.value }))}
                placeholder="Brief description of the subject and its objectives..."
                dir="ltr"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsSubjectDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveSubject}>
                {editingSubject ? 'تحديث' : 'إضافة'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* قائمة السنوات الدراسية */}
      <DragDropContext onDragEnd={handleYearDragEnd}>
        <Droppable droppableId="academic-years">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {formData.yearly_curriculum.map((year, yearIndex) => (
                <Draggable key={year.year_number} draggableId={year.year_number.toString()} index={yearIndex}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader {...provided.dragHandleProps}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <GraduationCap className="w-5 h-5 text-primary" />
                            <div>
                              <CardTitle className="text-lg">{year.year_name_ar}</CardTitle>
                              {year.year_name_en && (
                                <p className="text-sm text-muted-foreground">{year.year_name_en}</p>
                              )}
                            </div>
                            <Badge variant="secondary">
                              {year.total_credit_hours} ساعة معتمدة
                            </Badge>
                            <Badge variant="outline">
                              {year.subjects.length} مادة
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddSubject(yearIndex)}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              إضافة مادة
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditYear(year, yearIndex)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>حذف السنة الدراسية</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    هل أنت متأكد من حذف {year.year_name_ar} وجميع موادها؟ لا يمكن التراجع عن هذا الإجراء.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteYear(yearIndex)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        {year.subjects.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {year.subjects.map((subject, subjectIndex) => (
                              <div
                                key={subject.id}
                                className="p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
                                      <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">
                                        {subject.code}
                                      </code>
                                    </div>
                                    <h4 className="font-medium text-sm leading-tight mb-1">
                                      {subject.name_ar}
                                    </h4>
                                    {subject.name_en && (
                                      <p className="text-xs text-muted-foreground mb-2">
                                        {subject.name_en}
                                      </p>
                                    )}
                                    <div className="flex gap-2">
                                      <Badge variant="secondary" className="text-xs">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {subject.credit_hours} ساعة
                                      </Badge>
                                    </div>
                                  </div>

                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditSubject(subject, yearIndex, subjectIndex)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                    
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>حذف المادة</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            هل أنت متأكد من حذف مادة {subject.name_ar}؟
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDeleteSubject(yearIndex, subject.id)}
                                            className="bg-destructive hover:bg-destructive/90"
                                          >
                                            حذف
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-muted-foreground">
                            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>لم يتم إضافة أي مواد لهذه السنة بعد</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddSubject(yearIndex)}
                              className="mt-2"
                            >
                              إضافة أول مادة
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {formData.yearly_curriculum.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <GraduationCap className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              لم يتم إضافة أي سنوات دراسية بعد.<br />
              انقر على "إضافة سنة دراسية" لبدء بناء الخطة الدراسية.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};