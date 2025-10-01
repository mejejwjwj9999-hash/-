import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { Plus, Trash2, Briefcase, Edit, MapPin, DollarSign } from 'lucide-react';
import { ProgramFormData, CareerOpportunity } from './types';
import { IconSelector } from './IconSelector';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface CareerTabProps {
  formData: ProgramFormData;
  setFormData: (data: ProgramFormData | ((prev: ProgramFormData) => ProgramFormData)) => void;
}

const createEmptyCareer = (): CareerOpportunity => ({
  id: Date.now().toString(),
  title_ar: '',
  title_en: '',
  description_ar: '',
  description_en: '',
  sector: '',
  icon_name: 'briefcase',
  salary_range_ar: '',
  salary_range_en: '',
  job_locations: [],
  required_skills: [],
  order: 0
});

export const CareerTab: React.FC<CareerTabProps> = ({ formData, setFormData }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<CareerOpportunity | null>(null);
  const [careerData, setCareerData] = useState<CareerOpportunity>(createEmptyCareer());
  const [newSkill, setNewSkill] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const handleAddCareer = () => {
    setEditingCareer(null);
    setCareerData(createEmptyCareer());
    setIsDialogOpen(true);
  };

  const handleEditCareer = (career: CareerOpportunity) => {
    setEditingCareer(career);
    setCareerData({ ...career });
    setIsDialogOpen(true);
  };

  const handleSaveCareer = () => {
    if (!careerData.title_ar) return;

    setFormData(prev => {
      const newCareers = [...prev.career_opportunities_list];
      
      if (editingCareer) {
        const index = newCareers.findIndex(c => c.id === editingCareer.id);
        if (index !== -1) {
          newCareers[index] = careerData;
        }
      } else {
        careerData.order = newCareers.length;
        newCareers.push(careerData);
      }

      return { ...prev, career_opportunities_list: newCareers };
    });

    setIsDialogOpen(false);
  };

  const handleDeleteCareer = (careerId: string) => {
    setFormData(prev => ({
      ...prev,
      career_opportunities_list: prev.career_opportunities_list.filter(c => c.id !== careerId)
    }));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(formData.career_opportunities_list);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setFormData(prev => ({ ...prev, career_opportunities_list: updatedItems }));
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setCareerData(prev => ({
      ...prev,
      required_skills: [...(prev.required_skills || []), newSkill]
    }));
    setNewSkill('');
  };

  const removeSkill = (index: number) => {
    setCareerData(prev => ({
      ...prev,
      required_skills: prev.required_skills?.filter((_, i) => i !== index) || []
    }));
  };

  const addLocation = () => {
    if (!newLocation.trim()) return;
    setCareerData(prev => ({
      ...prev,
      job_locations: [...(prev.job_locations || []), newLocation]
    }));
    setNewLocation('');
  };

  const removeLocation = (index: number) => {
    setCareerData(prev => ({
      ...prev,
      job_locations: prev.job_locations?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            الفرص المهنية
          </h3>
          <p className="text-sm text-muted-foreground">إدارة الفرص المهنية المتاحة لخريجي البرنامج</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddCareer} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              إضافة فرصة مهنية
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCareer ? 'تحرير الفرصة المهنية' : 'إضافة فرصة مهنية جديدة'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* المعلومات الأساسية */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>المسمى الوظيفي بالعربية <span className="text-destructive">*</span></Label>
                  <Input
                    value={careerData.title_ar}
                    onChange={(e) => setCareerData(prev => ({ ...prev, title_ar: e.target.value }))}
                    placeholder="صيدلي مجتمعي"
                    dir="rtl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>المسمى الوظيفي بالإنجليزية</Label>
                  <Input
                    value={careerData.title_en}
                    onChange={(e) => setCareerData(prev => ({ ...prev, title_en: e.target.value }))}
                    placeholder="Community Pharmacist"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>القطاع</Label>
                  <Input
                    value={careerData.sector}
                    onChange={(e) => setCareerData(prev => ({ ...prev, sector: e.target.value }))}
                    placeholder="القطاع الخاص"
                    dir="rtl"
                  />
                </div>
                
                <IconSelector
                  selectedIcon={careerData.icon_name || 'briefcase'}
                  onIconSelect={(icon) => setCareerData(prev => ({ ...prev, icon_name: icon }))}
                  label="أيقونة الفرصة المهنية"
                />
              </div>

              {/* الوصف */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>وصف الوظيفة بالعربية</Label>
                  <Textarea
                    value={careerData.description_ar}
                    onChange={(e) => setCareerData(prev => ({ ...prev, description_ar: e.target.value }))}
                    placeholder="وصف تفصيلي للوظيفة ومتطلباتها..."
                    dir="rtl"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>وصف الوظيفة بالإنجليزية</Label>
                  <Textarea
                    value={careerData.description_en}
                    onChange={(e) => setCareerData(prev => ({ ...prev, description_en: e.target.value }))}
                    placeholder="Detailed job description and requirements..."
                    dir="ltr"
                    rows={3}
                  />
                </div>
              </div>

              {/* نطاق الراتب */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>نطاق الراتب بالعربية</Label>
                  <Input
                    value={careerData.salary_range_ar}
                    onChange={(e) => setCareerData(prev => ({ ...prev, salary_range_ar: e.target.value }))}
                    placeholder="500,000 - 800,000 ريال يمني"
                    dir="rtl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>نطاق الراتب بالإنجليزية</Label>
                  <Input
                    value={careerData.salary_range_en}
                    onChange={(e) => setCareerData(prev => ({ ...prev, salary_range_en: e.target.value }))}
                    placeholder="$500 - $800"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* المهارات المطلوبة */}
              <div className="space-y-2">
                <Label>المهارات المطلوبة</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="إضافة مهارة مطلوبة"
                    dir="rtl"
                  />
                  <Button type="button" onClick={addSkill}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {(careerData.required_skills || []).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* مواقع العمل */}
              <div className="space-y-2">
                <Label>مواقع العمل</Label>
                <div className="flex gap-2">
                  <Input
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="إضافة موقع عمل"
                    dir="rtl"
                  />
                  <Button type="button" onClick={addLocation}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {(careerData.job_locations || []).map((location, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      <MapPin className="w-3 h-3" />
                      {location}
                      <button
                        type="button"
                        onClick={() => removeLocation(index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* أزرار الحفظ */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleSaveCareer}>
                  {editingCareer ? 'تحديث' : 'إضافة'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* قائمة الفرص المهنية */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="career-opportunities">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {formData.career_opportunities_list.map((career, index) => (
                <Draggable key={career.id} draggableId={career.id} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Briefcase className="w-6 h-6 text-primary" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-lg">{career.title_ar}</h4>
                              {career.title_en && (
                                <p className="text-sm text-muted-foreground">{career.title_en}</p>
                              )}
                              
                              <div className="flex flex-wrap gap-2 mt-2">
                                {career.sector && (
                                  <Badge variant="secondary">{career.sector}</Badge>
                                )}
                                {career.salary_range_ar && (
                                  <Badge variant="outline" className="gap-1">
                                    <DollarSign className="w-3 h-3" />
                                    {career.salary_range_ar}
                                  </Badge>
                                )}
                              </div>
                              
                              {career.description_ar && (
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                  {career.description_ar}
                                </p>
                              )}
                              
                              {(career.required_skills?.length || 0) > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-muted-foreground mb-1">المهارات المطلوبة:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {career.required_skills?.slice(0, 3).map((skill, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                    {(career.required_skills?.length || 0) > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{(career.required_skills?.length || 0) - 3} أخرى
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCareer(career)}
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
                                  <AlertDialogTitle>حذف الفرصة المهنية</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    هل أنت متأكد من حذف "{career.title_ar}"؟ لا يمكن التراجع عن هذا الإجراء.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteCareer(career.id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
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

      {formData.career_opportunities_list.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Briefcase className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              لم يتم إضافة أي فرص مهنية بعد.<br />
              اضغط على "إضافة فرصة مهنية" لبدء الإضافة.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};