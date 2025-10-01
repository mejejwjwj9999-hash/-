import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { useCreateRegistrationRequest } from '@/hooks/useRegistrationRequests';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, LogIn, Mail, Lock, User, Phone, UserPlus, Eye, EyeOff, 
  ArrowRight, Fingerprint, Smartphone, Shield, Key, Send, Chrome,
  AlertCircle, CheckCircle, Zap, MapPin, GraduationCap, ChevronRight,
  ChevronLeft, Home, School, UserCheck, FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BiometricSetup } from './BiometricSetup';

const EnhancedMobileAuth = () => {
  const { user, loading, signIn, signInWithMagicLink, signInWithOAuth, signUp, resetPassword } = useAuth();
  const createRegistrationRequest = useCreateRegistrationRequest();
  const { 
    isSupported: biometricSupported, 
    isAvailable: biometricAvailable,
    checkBiometricAvailability,
    createPasskey,
    authenticateWithPasskey,
    getStoredCredentials
  } = useBiometricAuth();

  // States
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'forgot-password' | 'magic-link' | 'biometric-setup'>('login');
  const [registrationStep, setRegistrationStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [cooldownUntil, setCooldownUntil] = useState<Date | null>(null);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const { toast } = useToast();

  // Form data
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
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

  const [emailForAction, setEmailForAction] = useState('');

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

  // Initialize biometric check and load remembered data
  useEffect(() => {
    checkBiometricAvailability();
    
    // Load remembered email
    const rememberedEmail = localStorage.getItem('remembered_email');
    const rememberedCollege = localStorage.getItem('remembered_college');
    const rememberedDepartment = localStorage.getItem('remembered_department');
    
    if (rememberedEmail) {
      setLoginData(prev => ({ ...prev, email: rememberedEmail }));
      setRegisterData(prev => ({ 
        ...prev, 
        email: rememberedEmail,
        college: rememberedCollege || '',
        department: rememberedDepartment || ''
      }));
      setEmailForAction(rememberedEmail);
      setRememberMe(true);
    }

    // Check cooldown
    const savedCooldown = localStorage.getItem('auth_cooldown');
    if (savedCooldown) {
      const cooldownDate = new Date(savedCooldown);
      if (cooldownDate > new Date()) {
        setCooldownUntil(cooldownDate);
      }
    }

    // Load attempt count
    const savedAttempts = localStorage.getItem('auth_attempts');
    if (savedAttempts) {
      setAttemptCount(parseInt(savedAttempts, 10));
    }
  }, [checkBiometricAvailability]);

  // Cooldown timer
  useEffect(() => {
    if (cooldownUntil) {
      const timer = setInterval(() => {
        if (new Date() >= cooldownUntil) {
          setCooldownUntil(null);
          setAttemptCount(0);
          localStorage.removeItem('auth_cooldown');
          localStorage.removeItem('auth_attempts');
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [cooldownUntil]);

  // Handle attempt tracking
  const handleFailedAttempt = () => {
    const newCount = attemptCount + 1;
    setAttemptCount(newCount);
    localStorage.setItem('auth_attempts', newCount.toString());

    if (newCount >= 5) {
      const cooldownDate = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      setCooldownUntil(cooldownDate);
      localStorage.setItem('auth_cooldown', cooldownDate.toISOString());
      
      toast({
        title: 'تم تجاوز عدد المحاولات المسموح',
        description: 'يرجى المحاولة مرة أخرى بعد 15 دقيقة',
        variant: 'destructive'
      });
    }
  };

  const handleSuccessfulAuth = () => {
    setAttemptCount(0);
    setCooldownUntil(null);
    localStorage.removeItem('auth_attempts');
    localStorage.removeItem('auth_cooldown');
  };

  // Handle remember me
  const handleRememberMe = (email: string, college?: string, department?: string) => {
    if (rememberMe) {
      localStorage.setItem('remembered_email', email);
      if (college) localStorage.setItem('remembered_college', college);
      if (department) localStorage.setItem('remembered_department', department);
    } else {
      localStorage.removeItem('remembered_email');
      localStorage.removeItem('remembered_college');
      localStorage.removeItem('remembered_department');
    }
  };

  // Handle biometric setup completion
  const handleBiometricSetupComplete = () => {
    setBiometricEnabled(true);
    setCurrentView('login');
  };

  const handleBiometricSetupSkip = () => {
    setCurrentView('login');
  };

  // Auth handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldownUntil && new Date() < cooldownUntil) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error } = await signIn(loginData.email, loginData.password);
      if (error) {
        setError(error.message);
        handleFailedAttempt();
        toast({
          title: 'خطأ في تسجيل الدخول',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        handleSuccessfulAuth();
        handleRememberMe(loginData.email);
        toast({
          title: 'مرحباً بك',
          description: 'تم تسجيل الدخول بنجاح'
        });
      }
    } catch (err) {
      setError('حدث خطأ غير متوقع');
      handleFailedAttempt();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldownUntil && new Date() < cooldownUntil) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    // التحقق من صحة البيانات
    if (!registerData.firstName.trim() || !registerData.lastName.trim()) {
      setError('يرجى إدخال الاسم كاملاً');
      setIsLoading(false);
      return;
    }

    if (!registerData.phone.trim()) {
      setError('رقم الهاتف مطلوب');
      setIsLoading(false);
      return;
    }

    if (!registerData.address.trim()) {
      setError('عنوان السكن مطلوب');
      setIsLoading(false);
      return;
    }

    if (!registerData.studentId.trim()) {
      setError('رقم الطالب مطلوب');
      setIsLoading(false);
      return;
    }

    if (!registerData.college || !registerData.department || !registerData.specialization) {
      setError('يرجى اختيار الكلية والقسم والتخصص');
      setIsLoading(false);
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('كلمتا المرور غير متطابقتان');
      setIsLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      setIsLoading(false);
      return;
    }

    try {
      // البحث عن معرف البرنامج ومعرف القسم
      const selectedCollege = colleges.find(c => c.value === registerData.college);
      
      const requestData = {
        first_name: registerData.firstName.trim(),
        last_name: registerData.lastName.trim(),
        email: registerData.email.trim().toLowerCase(),
        phone: registerData.phone.trim(),
        address: registerData.address.trim(),
        student_id: registerData.studentId.trim(),
        college: registerData.college,
        department: registerData.department,
        specialization: registerData.specialization,
        program_id: selectedCollege?.program_id,
        department_id: selectedCollege?.department_id,
        academic_year: 1,
        semester: 1,
        password: registerData.password,
      };

      await createRegistrationRequest.mutateAsync(requestData);
      
      // إعادة تعيين النموذج
      setRegisterData({
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
      
      setSuccess('تم إرسال طلب التسجيل بنجاح! سيتم مراجعة طلبك من قبل الإدارة.');
      
      // Check if biometric is available and offer setup
      if (biometricSupported && biometricAvailable) {
        setCurrentView('biometric-setup');
      } else {
        setCurrentView('login');
      }
      
    } catch (err) {
      console.error('Registration error:', err);
      setError('حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error } = await signInWithMagicLink(emailForAction);
      if (error) {
        setError(error.message);
        toast({
          title: 'خطأ في إرسال الرابط',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        setSuccess('تم إرسال رابط تسجيل الدخول إلى بريدك الإلكتروني');
        toast({
          title: 'تم إرسال الرابط بنجاح',
          description: 'تحقق من بريدك الإلكتروني واضغط على الرابط لتسجيل الدخول'
        });
      }
    } catch (err) {
      setError('حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error } = await resetPassword(emailForAction);
      if (error) {
        setError(error.message);
        toast({
          title: 'خطأ في إرسال رابط الاستعادة',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        setSuccess('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني');
        toast({
          title: 'تم إرسال الرابط بنجاح',
          description: 'تحقق من بريدك الإلكتروني لإعادة تعيين كلمة المرور'
        });
      }
    } catch (err) {
      setError('حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await authenticateWithPasskey();
      if (result.success && result.data) {
        // In a real app, you would validate this with your backend
        // For now, we'll simulate success
        handleSuccessfulAuth();
        toast({
          title: 'تم تسجيل الدخول بنجاح',
          description: 'تم التحقق من هويتك باستخدام البصمة الحيوية'
        });
        // You would typically exchange the biometric proof for a session token
      } else {
        setError(result.error || 'فشل في المصادقة الحيوية');
        toast({
          title: 'خطأ في المصادقة الحيوية',
          description: result.error || 'فشل في التحقق من الهوية',
          variant: 'destructive'
        });
      }
    } catch (err) {
      setError('حدث خطأ في المصادقة الحيوية');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await signInWithOAuth(provider);
      if (error) {
        setError(error.message);
        toast({
          title: `خطأ في تسجيل الدخول عبر ${provider === 'google' ? 'Google' : 'Apple'}`,
          description: error.message,
          variant: 'destructive'
        });
      }
      // OAuth redirect will handle success
    } catch (err) {
      setError('حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground font-medium text-lg">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Redirect if authenticated
  if (user) {
    return <Navigate to="/student-portal" replace />;
  }

  // Cooldown message
  const getCooldownMessage = () => {
    if (!cooldownUntil) return null;
    const remaining = Math.ceil((cooldownUntil.getTime() - Date.now()) / 1000);
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const isInCooldown = cooldownUntil && new Date() < cooldownUntil;
  const storedBiometric = getStoredCredentials();

  // Show biometric setup if requested
  if (currentView === 'biometric-setup') {
    return (
      <BiometricSetup
        userEmail={registerData.email}
        userName={`${registerData.firstName} ${registerData.lastName}`}
        onComplete={handleBiometricSetupComplete}
        onSkip={handleBiometricSetupSkip}
      />
    );
  }

  const renderRegistrationSteps = () => {
    const steps = [
      { number: 1, title: 'المعلومات الشخصية', icon: User },
      { number: 2, title: 'معلومات الاتصال', icon: Phone },
      { number: 3, title: 'المعلومات الأكاديمية', icon: School },
      { number: 4, title: 'كلمة المرور والأمان', icon: Lock },
    ];
    
    return (
      <div className="flex items-center justify-between mb-6 px-2">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = registrationStep === step.number;
          const isCompleted = registrationStep > step.number;
          
          return (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                  transition-all duration-300
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-lg scale-110' 
                    : isCompleted 
                    ? 'bg-green-500 text-white' 
                    : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-xs mt-1 text-center leading-tight max-w-[60px]
                  ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground'}
                `}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 transition-colors duration-300
                  ${isCompleted ? 'bg-green-500' : 'bg-muted'}
                `} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden" dir="rtl">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-secondary/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:32px_32px] opacity-30"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md mx-auto border-0 shadow-2xl bg-background/95 backdrop-blur-lg">
          {/* Header */}
          <CardHeader className="text-center pb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-t-lg"></div>
            
            <div className="relative z-10">
              {/* College Logo */}
              <div className="w-20 h-20 mx-auto mb-4 bg-background rounded-2xl shadow-lg flex items-center justify-center p-2">
                <img 
                  src="/lovable-uploads/7a080d82-4fd9-48aa-954a-092838485834.png" 
                  alt="شعار كلية عيلول الجامعية" 
                  className="w-full h-full object-contain"
                />
              </div>

              <CardTitle className="text-2xl font-bold text-primary mb-2">
                {currentView === 'login' && 'تسجيل الدخول'}
                {currentView === 'register' && 'إنشاء حساب جديد'}
                {currentView === 'forgot-password' && 'استعادة كلمة المرور'}
                {currentView === 'magic-link' && 'دخول بدون كلمة مرور'}
              </CardTitle>
              
              <CardDescription className="text-muted-foreground">
                {currentView === 'login' && 'ادخل إلى بوابة الطالب الذكية'}
                {currentView === 'register' && 'قدم طلب التحاق لكلية عيلول الجامعية'}
                {currentView === 'forgot-password' && 'أدخل بريدك لاستعادة كلمة المرور'}
                {currentView === 'magic-link' && 'سنرسل لك رابط آمن للدخول'}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            {/* Cooldown Warning */}
            {isInCooldown && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-right">
                  تم تجاوز عدد المحاولات المسموح. المحاولة التالية خلال: {getCooldownMessage()}
                </AlertDescription>
              </Alert>
            )}

            {/* Success Message */}
            {success && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-right text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-right">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Login View */}
            {currentView === 'login' && (
              <div className="space-y-4">
                {/* Biometric Authentication */}
                {biometricSupported && biometricAvailable && storedBiometric && (
                  <div className="space-y-3">
                    <Button
                      onClick={handleBiometricAuth}
                      disabled={isLoading || isInCooldown}
                      className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-lg"
                    >
                      <Fingerprint className="mr-2 h-5 w-5" />
                      تسجيل الدخول بالبصمة الحيوية
                    </Button>
                    
                    <div className="flex items-center gap-2 text-xs text-academic-gray">
                      <Shield className="h-3 w-3" />
                      <span>محفوظ لـ: {storedBiometric.email}</span>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-academic-gray">أو</span>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-right block font-medium text-gray-700">
                      البريد الإلكتروني
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        className="pl-12 pr-4 py-3 text-right border-2 border-gray-200 focus:border-university-blue rounded-xl"
                        placeholder="أدخل بريدك الإلكتروني"
                        required
                        disabled={isInCooldown}
                        dir="rtl"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-right block font-medium text-gray-700">
                      كلمة المرور
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        className="pl-12 pr-12 py-3 text-right border-2 border-gray-200 focus:border-university-blue rounded-xl"
                        placeholder="أدخل كلمة المرور"
                        required
                        disabled={isInCooldown}
                        dir="rtl"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={isInCooldown}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Switch
                        checked={rememberMe}
                        onCheckedChange={setRememberMe}
                        disabled={isInCooldown}
                      />
                      <Label htmlFor="remember" className="text-sm text-academic-gray">
                        تذكرني
                      </Label>
                    </div>
                    
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => {
                        setEmailForAction(loginData.email);
                        setCurrentView('forgot-password');
                      }}
                      className="text-university-blue text-sm p-0 h-auto"
                      disabled={isInCooldown}
                    >
                      نسيت كلمة المرور؟
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-university-blue to-university-blue-dark hover:from-university-blue-dark hover:to-university-blue text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    disabled={isLoading || isInCooldown}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        جاري تسجيل الدخول...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-5 w-5" />
                        تسجيل الدخول
                      </>
                    )}
                  </Button>
                </form>

                {/* Alternative Sign-in Methods */}
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-academic-gray">أو</span>
                    </div>
                  </div>

                  {/* Magic Link */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEmailForAction(loginData.email);
                      setCurrentView('magic-link');
                    }}
                    className="w-full py-2 border-2 border-university-blue text-university-blue hover:bg-university-blue hover:text-white rounded-xl transition-all duration-300"
                    disabled={isInCooldown}
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    دخول بدون كلمة مرور
                  </Button>

                  {/* OAuth Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOAuthSignIn('google')}
                      className="py-2 border-2 border-gray-200 hover:border-red-400 hover:text-red-600 rounded-xl"
                      disabled={isLoading || isInCooldown}
                    >
                      <Chrome className="mr-1 h-4 w-4" />
                      Google
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOAuthSignIn('apple')}
                      className="py-2 border-2 border-gray-200 hover:border-gray-800 hover:text-gray-800 rounded-xl"
                      disabled={isLoading || isInCooldown}
                    >
                      <Smartphone className="mr-1 h-4 w-4" />
                      Apple
                    </Button>
                  </div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600">
                    ليس لديك حساب؟
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setCurrentView('register')}
                    className="text-university-blue hover:text-university-blue-dark font-semibold mt-1"
                    disabled={isInCooldown}
                  >
                    إنشاء حساب جديد
                    <ArrowRight className="mr-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Register View */}
            {currentView === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-right block text-sm font-medium text-gray-700">
                      الاسم الأول
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        value={registerData.firstName}
                        onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                        className="pl-10 pr-3 py-2 text-right text-sm border-2 border-gray-200 focus:border-university-blue rounded-lg"
                        placeholder="الاسم الأول"
                        required
                        disabled={isInCooldown}
                        dir="rtl"
                        autoComplete="given-name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-right block text-sm font-medium text-gray-700">
                      الاسم الأخير
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="lastName"
                        value={registerData.lastName}
                        onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                        className="pl-10 pr-3 py-2 text-right text-sm border-2 border-gray-200 focus:border-university-blue rounded-lg"
                        placeholder="الاسم الأخير"
                        required
                        disabled={isInCooldown}
                        dir="rtl"
                        autoComplete="family-name"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-right block text-sm font-medium text-gray-700">
                    البريد الإلكتروني
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      className="pl-10 pr-3 py-2 text-right text-sm border-2 border-gray-200 focus:border-university-blue rounded-lg"
                      placeholder="your@email.com"
                      required
                      disabled={isInCooldown}
                      dir="rtl"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-right block text-sm font-medium text-gray-700">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                      className="pl-10 pr-3 py-2 text-right text-sm border-2 border-gray-200 focus:border-university-blue rounded-lg"
                      placeholder="رقم الهاتف"
                      required
                      disabled={isInCooldown}
                      dir="rtl"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-right block text-sm font-medium text-gray-700">
                    عنوان السكن <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      value={registerData.address}
                      onChange={(e) => setRegisterData({...registerData, address: e.target.value})}
                      className="pl-10 pr-3 py-2 text-right text-sm border-2 border-gray-200 focus:border-university-blue rounded-lg"
                      placeholder="المدينة، الحي، الشارع"
                      required
                      disabled={isInCooldown}
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentId" className="text-right block text-sm font-medium text-gray-700">
                    رقم الطالب <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="studentId"
                      value={registerData.studentId}
                      onChange={(e) => setRegisterData({...registerData, studentId: e.target.value})}
                      className="pl-10 pr-3 py-2 text-right text-sm border-2 border-gray-200 focus:border-university-blue rounded-lg"
                      placeholder="رقم الطالب"
                      required
                      disabled={isInCooldown}
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="college" className="text-right block text-sm font-medium text-gray-700">
                    الكلية
                  </Label>
                  <Select 
                    value={registerData.college} 
                    onValueChange={(value) => setRegisterData({...registerData, college: value, department: ''})}
                    disabled={isInCooldown}
                  >
                    <SelectTrigger className="text-right text-sm border-2 border-gray-200 focus:border-university-blue rounded-lg">
                      <SelectValue placeholder="اختر الكلية" />
                    </SelectTrigger>
                    <SelectContent>
                      {colleges.map((college) => (
                        <SelectItem key={college.value} value={college.value} className="text-right">
                          {college.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {registerData.college && (
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-right block text-sm font-medium text-gray-700">
                      القسم <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={registerData.department} 
                      onValueChange={(value) => setRegisterData({...registerData, department: value, specialization: ''})}
                      disabled={isInCooldown}
                    >
                      <SelectTrigger className="text-right text-sm border-2 border-gray-200 focus:border-university-blue rounded-lg">
                        <SelectValue placeholder="اختر القسم" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments[registerData.college as keyof typeof departments]?.map((dept) => (
                          <SelectItem key={dept.value} value={dept.value} className="text-right">
                            {dept.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {registerData.department && (
                  <div className="space-y-2">
                    <Label htmlFor="specialization" className="text-right block text-sm font-medium text-gray-700">
                      التخصص <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={registerData.specialization} 
                      onValueChange={(value) => setRegisterData({...registerData, specialization: value})}
                      disabled={isInCooldown}
                    >
                      <SelectTrigger className="text-right text-sm border-2 border-gray-200 focus:border-university-blue rounded-lg">
                        <SelectValue placeholder="اختر التخصص" />
                      </SelectTrigger>
                      <SelectContent>
                        {specializations[registerData.department as keyof typeof specializations]?.map((spec) => (
                          <SelectItem key={spec} value={spec} className="text-right">
                            {spec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-right block text-sm font-medium text-gray-700">
                      كلمة المرور
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                        className="pl-10 pr-10 py-2 text-right text-sm border-2 border-gray-200 focus:border-university-blue rounded-lg"
                        placeholder="كلمة المرور"
                        required
                        disabled={isInCooldown}
                        dir="rtl"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={isInCooldown}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-right block text-sm font-medium text-gray-700">
                      تأكيد كلمة المرور
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                        className="pl-10 pr-10 py-2 text-right text-sm border-2 border-gray-200 focus:border-university-blue rounded-lg"
                        placeholder="تأكيد كلمة المرور"
                        required
                        disabled={isInCooldown}
                        dir="rtl"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={isInCooldown}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remember Me for Registration */}
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                    disabled={isInCooldown}
                  />
                  <Label htmlFor="remember-register" className="text-sm text-academic-gray">
                    تذكر بياناتي
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-3 bg-gradient-to-r from-university-blue to-university-blue-dark hover:from-university-blue-dark hover:to-university-blue text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  disabled={isLoading || isInCooldown}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      جاري إنشاء الحساب...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-5 w-5" />
                      إنشاء الحساب
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    لديك حساب بالفعل؟
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setCurrentView('login')}
                    className="text-university-blue hover:text-university-blue-dark font-semibold mt-1"
                    disabled={isInCooldown}
                  >
                    تسجيل الدخول
                    <ArrowRight className="mr-1 h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}

            {/* Magic Link View */}
            {currentView === 'magic-link' && (
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="magicEmail" className="text-right block font-medium text-gray-700">
                    البريد الإلكتروني
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="magicEmail"
                      type="email"
                      value={emailForAction}
                      onChange={(e) => setEmailForAction(e.target.value)}
                      className="pl-12 pr-4 py-3 text-right border-2 border-gray-200 focus:border-university-blue rounded-xl"
                      placeholder="أدخل بريدك الإلكتروني"
                      required
                      disabled={isLoading}
                      dir="rtl"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-xl shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      إرسال رابط الدخول
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setCurrentView('login')}
                    className="text-university-blue hover:text-university-blue-dark font-semibold"
                  >
                    العودة لتسجيل الدخول
                  </Button>
                </div>
              </form>
            )}

            {/* Forgot Password View */}
            {currentView === 'forgot-password' && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail" className="text-right block font-medium text-gray-700">
                    البريد الإلكتروني
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="resetEmail"
                      type="email"
                      value={emailForAction}
                      onChange={(e) => setEmailForAction(e.target.value)}
                      className="pl-12 pr-4 py-3 text-right border-2 border-gray-200 focus:border-university-blue rounded-xl"
                      placeholder="أدخل بريدك الإلكتروني"
                      required
                      disabled={isLoading}
                      dir="rtl"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-university-red to-red-600 hover:from-red-600 hover:to-university-red text-white font-bold rounded-xl shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Key className="mr-2 h-5 w-5" />
                      إرسال رابط الاستعادة
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setCurrentView('login')}
                    className="text-university-blue hover:text-university-blue-dark font-semibold"
                  >
                    العودة لتسجيل الدخول
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedMobileAuth;