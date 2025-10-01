import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgramFormData } from './types';
import { EnhancedWysiwygEditor } from '@/components/admin/EnhancedWysiwygEditor';
import EnhancedImageUpload from '@/components/editors/EnhancedImageUpload';
import { useActiveAcademicDepartments } from '@/hooks/useAcademicDepartments';

interface BasicInfoTabProps {
  formData: ProgramFormData;
  setFormData: (data: ProgramFormData | ((prev: ProgramFormData) => ProgramFormData)) => void;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ formData, setFormData }) => {
  const { data: departments } = useActiveAcademicDepartments();

  return (
    <div className="space-y-6">
      {/* المعلومات الأساسية */}
      <Card>
        <CardHeader>
          <CardTitle>المعلومات الأساسية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="program_key">مفتاح البرنامج <span className="text-destructive">*</span></Label>
              <Input
                id="program_key"
                value={formData.program_key}
                onChange={(e) => setFormData(prev => ({ ...prev, program_key: e.target.value }))}
                placeholder="pharmacy, nursing, it, etc."
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">يُستخدم في الروابط والبرمجة (باللغة الإنجليزية فقط)</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="student_count">عدد الطلاب</Label>
              <Input
                id="student_count"
                type="number"
                value={formData.student_count || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, student_count: Number(e.target.value) }))}
                placeholder="85"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title_ar">العنوان بالعربية <span className="text-destructive">*</span></Label>
              <Input
                id="title_ar"
                value={formData.title_ar}
                onChange={(e) => setFormData(prev => ({ ...prev, title_ar: e.target.value }))}
                placeholder="كلية الصيدلة"
                dir="rtl"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title_en">العنوان بالإنجليزية</Label>
              <Input
                id="title_en"
                value={formData.title_en}
                onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                placeholder="College of Pharmacy"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary_ar">الوصف المختصر بالعربية</Label>
            <Textarea
              id="summary_ar"
              value={formData.summary_ar}
              onChange={(e) => setFormData(prev => ({ ...prev, summary_ar: e.target.value }))}
              placeholder="برنامج شامل ومتطور لإعداد صيادلة مؤهلين..."
              dir="rtl"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary_en">الوصف المختصر بالإنجليزية</Label>
            <Textarea
              id="summary_en"
              value={formData.summary_en}
              onChange={(e) => setFormData(prev => ({ ...prev, summary_en: e.target.value }))}
              placeholder="Comprehensive program to prepare qualified pharmacists..."
              dir="ltr"
              rows={3}
            />
          </div>

          {/* نبذة عن البرنامج */}
          <div className="space-y-2">
            <Label htmlFor="description_ar">نبذة عن البرنامج بالعربية</Label>
            <Textarea
              id="description_ar"
              value={formData.description_ar || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description_ar: e.target.value }))}
              placeholder="برنامج شامل لإعداد صيادلة مؤهلين قادرين على العمل في مختلف مجالات الصيدلة..."
              dir="rtl"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description_en">نبذة عن البرنامج بالإنجليزية</Label>
            <Textarea
              id="description_en"
              value={formData.description_en || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
              placeholder="A comprehensive program preparing qualified pharmacists across various pharmacy fields..."
              dir="ltr"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* تفاصيل الدراسة */}
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الدراسة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration_years">مدة الدراسة (سنوات)</Label>
              <Input
                id="duration_years"
                type="number"
                min="1"
                max="10"
                value={formData.duration_years}
                onChange={(e) => setFormData(prev => ({ ...prev, duration_years: Number(e.target.value) }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="credit_hours">الساعات المعتمدة</Label>
              <Input
                id="credit_hours"
                type="number"
                min="1"
                value={formData.credit_hours}
                onChange={(e) => setFormData(prev => ({ ...prev, credit_hours: Number(e.target.value) }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="degree_type">نوع الدرجة</Label>
              <Select value={formData.degree_type} onValueChange={(value) => setFormData(prev => ({ ...prev, degree_type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الدرجة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bachelor">بكالوريوس</SelectItem>
                  <SelectItem value="master">ماجستير</SelectItem>
                  <SelectItem value="doctorate">دكتوراه</SelectItem>
                  <SelectItem value="diploma">دبلوم</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="college_ar">الكلية بالعربية</Label>
              <Input
                id="college_ar"
                value={formData.college_ar}
                onChange={(e) => setFormData(prev => ({ ...prev, college_ar: e.target.value }))}
                placeholder="كلية الصيدلة"
                dir="rtl"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="college_en">الكلية بالإنجليزية</Label>
              <Input
                id="college_en"
                value={formData.college_en}
                onChange={(e) => setFormData(prev => ({ ...prev, college_en: e.target.value }))}
                placeholder="College of Pharmacy"
                dir="ltr"
              />
            </div>
          </div>

          {/* اختيار القسم الأكاديمي */}
          <div className="space-y-2">
            <Label htmlFor="department_select">القسم الأكاديمي <span className="text-destructive">*</span></Label>
            <Select 
              value={formData.department_ar} 
              onValueChange={(value) => {
                const selectedDept = departments?.find(d => d.name_ar === value);
                setFormData(prev => ({ 
                  ...prev, 
                  department_ar: value,
                  department_en: selectedDept?.name_en || ''
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر القسم الأكاديمي" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                {departments?.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name_ar}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: dept.icon_color }}
                      />
                      {dept.name_ar}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.department_en && (
              <p className="text-xs text-muted-foreground">
                {formData.department_en}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* نظرة عامة على البرنامج */}
      <Card>
        <CardHeader>
          <CardTitle>نظرة عامة على البرنامج</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>نظرة عامة بالعربية</Label>
            <EnhancedWysiwygEditor
              value={formData.program_overview_ar || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, program_overview_ar: value }))}
              placeholder="يهدف برنامج بكالوريوس الصيدلة في كلية أيلول الجامعية إلى إعداد صيادلة مؤهلين..."
            />
          </div>

          <div className="space-y-2">
            <Label>نظرة عامة بالإنجليزية</Label>
            <EnhancedWysiwygEditor
              value={formData.program_overview_en || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, program_overview_en: value }))}
              placeholder="The Bachelor of Pharmacy program aims to prepare qualified pharmacists..."
            />
          </div>
        </CardContent>
      </Card>

      {/* الصورة الرئيسية */}
      <Card>
        <CardHeader>
          <CardTitle>الصورة الرئيسية</CardTitle>
        </CardHeader>
        <CardContent>
          <EnhancedImageUpload
            onImageSelect={(url) => setFormData(prev => ({ ...prev, featured_image: url }))}
          />
        </CardContent>
      </Card>
    </div>
  );
};