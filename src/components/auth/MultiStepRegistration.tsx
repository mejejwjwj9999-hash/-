import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, ArrowRight, User, Mail, Lock, Phone, 
  MapPin, GraduationCap, BookOpen, UserCheck, 
  Eye, EyeOff, AlertCircle, CheckCircle, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  college: string;
  department: string;
  specialization: string;
  studentId: string;
}

interface MultiStepRegistrationProps {
  onBack: () => void;
  onSubmit: (data: RegistrationData) => Promise<void>;
  isLoading: boolean;
  error: string;
}

const colleges = [
  { value: 'كلية الصيدلة', label: 'كلية الصيدلة', program_id: 'pharmacy', department_id: 'medical' },
  { value: 'كلية التمريض', label: 'كلية التمريض', program_id: 'nursing', department_id: 'medical' },
  { value: 'كلية القبالة', label: 'كلية القبالة', program_id: 'midwifery', department_id: 'medical' },
  { value: 'كلية تكنولوجيا المعلومات', label: 'كلية تكنولوجيا المعلومات', program_id: 'it', department_id: 'tech_science' },
  { value: 'كلية إدارة الأعمال', label: 'كلية إدارة الأعمال', program_id: 'business', department_id: 'admin_humanities' },
];

const departments = {
  'كلية الصيدلة': [
    { value: 'الصيدلة', label: 'الصيدلة' }
  ],
  'كلية التمريض': [
    { value: 'التمريض', label: 'التمريض' }
  ],
  'كلية القبالة': [
    { value: 'القبالة', label: 'القبالة' }
  ],
  'كلية تكنولوجيا المعلومات': [
    { value: 'تكنولوجيا المعلومات', label: 'تكنولوجيا المعلومات' },
    { value: 'البرمجة', label: 'هندسة البرمجيات' },
    { value: 'الشبكات', label: 'شبكات الحاسوب' },
    { value: 'أمن المعلومات', label: 'أمن المعلومات' }
  ],
  'كلية إدارة الأعمال': [
    { value: 'إدارة الأعمال', label: 'إدارة الأعمال' },
    { value: 'المحاسبة', label: 'المحاسبة' },
    { value: 'التسويق', label: 'التسويق' },
    { value: 'الاقتصاد', label: 'الاقتصاد' }
  ],
};

const specializations = {
  'الصيدلة': ['صيدلة إكلينيكية', 'صيدلة صناعية', 'صيدلة مجتمعية'],
  'التمريض': ['تمريض عام', 'تمريض الطوارئ', 'تمريض الأطفال', 'تمريض النساء والولادة'],
  'القبالة': ['قبالة عامة', 'رعاية الأمومة والطفولة'],
  'تكنولوجيا المعلومات': ['تطوير الويب', 'تطوير التطبيقات', 'الذكاء الاصطناعي'],
  'البرمجة': ['تطوير البرمجيات', 'برمجة قواعد البيانات', 'برمجة الألعاب'],
  'الشبكات': ['إدارة الشبكات', 'أمن الشبكات', 'شبكات لاسلكية'],
  'أمن المعلومات': ['أمن الأنظمة', 'التحقق الرقمي', 'الأمن السيبراني'],
  'إدارة الأعمال': ['إدارة مشاريع', 'إدارة موارد بشرية', 'إدارة مالية'],
  'المحاسبة': ['محاسبة مالية', 'محاسبة إدارية', 'التدقيق'],
  'التسويق': ['تسويق رقمي', 'تسويق دولي', 'بحوث التسويق'],
  'الاقتصاد': ['اقتصاد كلي', 'اقتصاد جزئي', 'اقتصاد دولي']
};

export const MultiStepRegistration: React.FC<MultiStepRegistrationProps> = ({
  onBack,
  onSubmit,
  isLoading,
  error
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    college: '',
    department: '',
    specialization: '',
    studentId: '',
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const stepTitles = [
    'المعلومات الشخصية',
    'معلومات الاتصال',
    'المعلومات الأكاديمية',
    'تأمين الحساب'
  ];

  const stepIcons = [User, Phone, GraduationCap, Lock];

  const validateStep = (step: number): string | null => {
    switch (step) {
      case 1:
        if (!data.firstName.trim()) return 'الاسم الأول مطلوب';
        if (!data.lastName.trim()) return 'الاسم الأخير مطلوب';
        if (!data.email.trim()) return 'البريد الإلكتروني مطلوب';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'البريد الإلكتروني غير صحيح';
        break;
      case 2:
        if (!data.phone.trim()) return 'رقم الهاتف مطلوب';
        if (!data.address.trim()) return 'العنوان مطلوب';
        if (!data.studentId.trim()) return 'الرقم الجامعي مطلوب';
        break;
      case 3:
        if (!data.college) return 'يرجى اختيار الكلية';
        if (!data.department) return 'يرجى اختيار القسم';
        if (!data.specialization) return 'يرجى اختيار التخصص';
        break;
      case 4:
        if (data.password.length < 6) return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
        if (data.password !== data.confirmPassword) return 'كلمتا المرور غير متطابقتان';
        break;
    }
    return null;
  };

  const handleNext = () => {
    const error = validateStep(currentStep);
    if (!error && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateStep(currentStep);
    if (!error) {
      await onSubmit(data);
    }
  };

  const updateData = (field: keyof RegistrationData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const renderStepContent = () => {
    const stepError = validateStep(currentStep);

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">الاسم الأول</Label>
                <Input
                  id="firstName"
                  value={data.firstName}
                  onChange={(e) => updateData('firstName', e.target.value)}
                  placeholder="محمد"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">الاسم الأخير</Label>
                <Input
                  id="lastName"
                  value={data.lastName}
                  onChange={(e) => updateData('lastName', e.target.value)}
                  placeholder="أحمد"
                  className="h-11"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => updateData('email', e.target.value)}
                placeholder="student@example.com"
                className="h-11"
                dir="ltr"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                value={data.phone}
                onChange={(e) => updateData('phone', e.target.value)}
                placeholder="+967 xxx xxx xxx"
                className="h-11"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">العنوان</Label>
              <Input
                id="address"
                value={data.address}
                onChange={(e) => updateData('address', e.target.value)}
                placeholder="صنعاء، اليمن"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId">الرقم الجامعي</Label>
              <Input
                id="studentId"
                value={data.studentId}
                onChange={(e) => updateData('studentId', e.target.value)}
                placeholder="2024001"
                className="h-11"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>الكلية</Label>
              <Select value={data.college} onValueChange={(value) => {
                updateData('college', value);
                updateData('department', '');
                updateData('specialization', '');
              }}>
                <SelectTrigger className="h-11">
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

            {data.college && (
              <div className="space-y-2">
                <Label>القسم</Label>
                <Select value={data.department} onValueChange={(value) => {
                  updateData('department', value);
                  updateData('specialization', '');
                }}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="اختر القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments[data.college as keyof typeof departments]?.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {data.department && (
              <div className="space-y-2">
                <Label>التخصص</Label>
                <Select value={data.specialization} onValueChange={(value) => updateData('specialization', value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="اختر التخصص" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations[data.department as keyof typeof specializations]?.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={data.password}
                  onChange={(e) => updateData('password', e.target.value)}
                  placeholder="6 أحرف على الأقل"
                  className="h-11 pl-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={data.confirmPassword}
                  onChange={(e) => updateData('confirmPassword', e.target.value)}
                  placeholder="كرر كلمة المرور"
                  className="h-11 pl-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-mobile-auth-bg flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-xl border-0 bg-mobile-auth-card backdrop-blur-md">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="sm" onClick={currentStep === 1 ? onBack : handlePrevious}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="text-center">
                  <CardTitle className="text-lg">إنشاء حساب جديد</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    الخطوة {currentStep} من {totalSteps}
                  </p>
                </div>
                <div className="w-8" />
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                  {stepTitles[currentStep - 1]}
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step Content */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={handlePrevious} className="flex-1 ml-2">
                    <ArrowLeft className="w-4 h-4 ml-1" />
                    السابق
                  </Button>
                )}

                {currentStep < totalSteps ? (
                  <Button 
                    onClick={handleNext}
                    className="flex-1 bg-mobile-auth-button hover:bg-mobile-auth-button-hover text-white"
                    disabled={!!validateStep(currentStep)}
                  >
                    التالي
                    <ArrowRight className="w-4 h-4 mr-1" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit}
                    disabled={isLoading || !!validateStep(currentStep)}
                    className="flex-1 bg-mobile-auth-button hover:bg-mobile-auth-button-hover text-white"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin ml-1" />
                    ) : (
                      <CheckCircle className="w-4 h-4 ml-1" />
                    )}
                    إرسال الطلب
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};