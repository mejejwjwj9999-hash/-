
import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, UserPlus, Mail, Lock, User, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RegisterFormProps {
  onToggleMode: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    college: '',
    department: '',
    studentId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signUp } = useAuth();
  const { toast } = useToast();

  const colleges = [
    { value: 'كلية الصيدلة', label: 'كلية الصيدلة' },
    { value: 'كلية التمريض', label: 'كلية التمريض' },
    { value: 'كلية القبالة', label: 'كلية القبالة' },
    { value: 'كلية تكنولوجيا المعلومات', label: 'كلية تكنولوجيا المعلومات' },
    { value: 'كلية إدارة الأعمال', label: 'كلية إدارة الأعمال' },
  ];

  const departments = {
    'كلية الصيدلة': ['الصيدلة'],
    'كلية التمريض': ['التمريض'],
    'كلية القبالة': ['القبالة'],
    'كلية تكنولوجيا المعلومات': ['تكنولوجيا المعلومات', 'البرمجة', 'الشبكات'],
    'كلية إدارة الأعمال': ['إدارة الأعمال', 'المحاسبة', 'التسويق'],
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('كلمتا المرور غير متطابقتان');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        college: formData.college,
        department: formData.department,
        student_id: formData.studentId,
        academic_year: 1,
        semester: 1,
      });
      
      if (error) {
        setError(error.message);
        toast({
          title: 'خطأ في إنشاء الحساب',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'تم إنشاء الحساب بنجاح',
          description: 'يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب',
        });
        onToggleMode();
      }
    } catch (err) {
      setError('حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-none bg-transparent">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-university-blue to-university-blue-dark shadow-lg">
            <UserPlus className="w-10 h-10 text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-university-blue via-university-blue-light to-university-blue bg-clip-text text-transparent">
            إنشاء حساب جديد
          </CardTitle>
          <CardDescription className="text-gray-600">
            أدخل بياناتك لإنشاء حساب في بوابة الطالب
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-right block">
                الاسم الأول
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-academic-gray" />
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="pl-10 text-right"
                  placeholder="الاسم الأول"
                  required
                  dir="rtl"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-right block">
                الاسم الأخير
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-academic-gray" />
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="pl-10 text-right"
                  placeholder="الاسم الأخير"
                  required
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="studentId" className="text-right block">
              رقم الطالب (اختياري)
            </Label>
            <Input
              id="studentId"
              value={formData.studentId}
              onChange={(e) => handleInputChange('studentId', e.target.value)}
              className="text-right"
              placeholder="أدخل رقم الطالب"
              dir="rtl"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-right block">
              البريد الإلكتروني
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-academic-gray" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="pl-10 text-right"
                placeholder="أدخل بريدك الإلكتروني"
                required
                dir="rtl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-right block">
              رقم الهاتف (اختياري)
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-academic-gray" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="pl-10 text-right"
                placeholder="أدخل رقم الهاتف"
                dir="rtl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="college" className="text-right block">
              الكلية
            </Label>
            <Select value={formData.college} onValueChange={(value) => handleInputChange('college', value)}>
              <SelectTrigger className="text-right">
                <SelectValue placeholder="اختر الكلية" />
              </SelectTrigger>
              <SelectContent>
                {colleges.map((college) => (
                  <SelectItem key={college.value} value={college.value}>
                    {college.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.college && (
            <div className="space-y-2">
              <Label htmlFor="department" className="text-right block">
                القسم
              </Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر القسم" />
                </SelectTrigger>
                <SelectContent>
                  {departments[formData.college as keyof typeof departments]?.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-right block">
                كلمة المرور
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-academic-gray" />
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 text-right"
                  placeholder="كلمة المرور"
                  required
                  dir="rtl"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-right block">
                تأكيد كلمة المرور
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-academic-gray" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="pl-10 text-right"
                  placeholder="تأكيد كلمة المرور"
                  required
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription className="text-right">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-university-blue to-university-blue-dark hover:from-university-blue-dark hover:to-university-blue text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                جاري إنشاء الحساب...
              </>
            ) : (
              <>
                <UserPlus className="ml-2 h-5 w-5" />
                إنشاء الحساب
              </>
            )}
          </Button>

          <div className="text-center pt-2">
            <div className="text-sm text-gray-600">
              لديك حساب بالفعل؟{' '}
              <button
                type="button"
                onClick={onToggleMode}
                className="text-university-blue font-semibold hover:text-university-blue-light transition-colors"
              >
                تسجيل الدخول
              </button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
