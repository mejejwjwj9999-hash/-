
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Database,
  Upload
} from 'lucide-react';

const EnhancedDatabaseOperations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [documentData, setDocumentData] = useState({
    document_name: '',
    document_type: 'certificate',
    status: 'active',
    is_official: false,
  });

  // إضافة مستند جديد مع التحقق من الحالات المسموحة
  const addDocumentMutation = useMutation({
    mutationFn: async (data: any) => {
      // التأكد من أن الحالة صالحة
      const validStatuses = ['active', 'inactive', 'pending', 'approved', 'rejected', 'expired', 'processing'];
      if (!validStatuses.includes(data.status)) {
        throw new Error(`حالة غير صالحة: ${data.status}. الحالات المسموحة: ${validStatuses.join(', ')}`);
      }

      const { data: result, error } = await supabase
        .from('documents')
        .insert([{
          document_name: data.document_name,
          document_type: data.document_type,
          file_path: '/placeholder/' + data.document_name,
          status: data.status,
          is_official: data.is_official,
          student_id: null // يجب تحديد معرف الطالب في التطبيق الحقيقي
        }])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم إضافة المستند بنجاح",
      });
      setDocumentData({
        document_name: '',
        document_type: 'certificate',
        status: 'active',
        is_official: false,
      });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (error: any) => {
      console.error('Error adding document:', error);
      toast({
        title: "فشل في الحفظ",
        description: error.message || "حدث خطأ أثناء إضافة المستند",
        variant: "destructive",
      });
    }
  });

  // اختبار الاتصال بقاعدة البيانات
  const testConnectionMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_key')
        .limit(1);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "نجح الاتصال",
        description: "الاتصال بقاعدة البيانات يعمل بشكل صحيح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "فشل الاتصال",
        description: "خطأ في الاتصال بقاعدة البيانات: " + error.message,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documentData.document_name.trim()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال اسم المستند",
        variant: "destructive",
      });
      return;
    }

    addDocumentMutation.mutate(documentData);
  };

  return (
    <div className="space-y-6">
      {/* اختبار الاتصال */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            اختبار الاتصال بقاعدة البيانات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => testConnectionMutation.mutate()}
            disabled={testConnectionMutation.isPending}
            className="w-full"
          >
            {testConnectionMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                جاري الاختبار...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 ml-2" />
                اختبار الاتصال
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* إضافة مستند تجريبي */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            إضافة مستند تجريبي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="document_name">اسم المستند</Label>
              <Input
                id="document_name"
                value={documentData.document_name}
                onChange={(e) => setDocumentData(prev => ({
                  ...prev,
                  document_name: e.target.value
                }))}
                placeholder="أدخل اسم المستند"
              />
            </div>

            <div>
              <Label htmlFor="document_type">نوع المستند</Label>
              <select
                id="document_type"
                value={documentData.document_type}
                onChange={(e) => setDocumentData(prev => ({
                  ...prev,
                  document_type: e.target.value
                }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="certificate">شهادة</option>
                <option value="transcript">كشف درجات</option>
                <option value="enrollment">إثبات قيد</option>
                <option value="other">أخرى</option>
              </select>
            </div>

            <div>
              <Label htmlFor="status">الحالة</Label>
              <select
                id="status"
                value={documentData.status}
                onChange={(e) => setDocumentData(prev => ({
                  ...prev,
                  status: e.target.value
                }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="pending">قيد الانتظار</option>
                <option value="approved">موافق عليه</option>
                <option value="rejected">مرفوض</option>
                <option value="expired">منتهي الصلاحية</option>
                <option value="processing">قيد المعالجة</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="is_official"
                type="checkbox"
                checked={documentData.is_official}
                onChange={(e) => setDocumentData(prev => ({
                  ...prev,
                  is_official: e.target.checked
                }))}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="is_official" className="text-sm">مستند رسمي</Label>
            </div>

            <Button 
              type="submit" 
              disabled={addDocumentMutation.isPending}
              className="w-full"
            >
              {addDocumentMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 ml-2" />
                  حفظ المستند
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedDatabaseOperations;
