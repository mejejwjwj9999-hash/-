import React from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { EnhancedLoginScreen } from './EnhancedLoginScreen';
import { MultiStepRegistration } from './MultiStepRegistration';
import { BiometricSetup } from './BiometricSetup';
import { useAuth } from './AuthProvider';
import { useEnhancedBiometricAuth } from '@/hooks/useEnhancedBiometricAuth';
import { useCreateRegistrationRequest } from '@/hooks/useRegistrationRequests';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';

type AuthView = 'welcome' | 'login' | 'register' | 'biometric-setup' | 'forgot-password' | 'magic-link';

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

const colleges = [
  { value: 'كلية الصيدلة', label: 'كلية الصيدلة', program_id: 'pharmacy', department_id: 'medical' },
  { value: 'كلية التمريض', label: 'كلية التمريض', program_id: 'nursing', department_id: 'medical' },
  { value: 'كلية القبالة', label: 'كلية القبالة', program_id: 'midwifery', department_id: 'medical' },
  { value: 'كلية تكنولوجيا المعلومات', label: 'كلية تكنولوجيا المعلومات', program_id: 'it', department_id: 'tech_science' },
  { value: 'كلية إدارة الأعمال', label: 'كلية إدارة الأعمال', program_id: 'business', department_id: 'admin_humanities' },
];

export const MobileAuthNavigation: React.FC = () => {
  const [currentView, setCurrentView] = React.useState<AuthView>('welcome');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [attemptCount, setAttemptCount] = React.useState(0);
  const [cooldownUntil, setCooldownUntil] = React.useState<Date | null>(null);
  const [registrationData, setRegistrationData] = React.useState<RegistrationData>({
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

  const { user, loading, signIn, signInWithMagicLink, signInWithOAuth, resetPassword } = useAuth();
  const { 
    isSupported: biometricSupported, 
    isAvailable: biometricAvailable,
    checkBiometricAvailability,
    authenticateWithPasskey,
    getBiometricTypesString
  } = useEnhancedBiometricAuth();
  const createRegistrationRequest = useCreateRegistrationRequest();
  const { toast } = useToast();

  // Initialize biometric check and load attempted data
  React.useEffect(() => {
    checkBiometricAvailability();
    
    // Load attempt count
    const savedAttempts = localStorage.getItem('auth_attempts');
    if (savedAttempts) {
      setAttemptCount(parseInt(savedAttempts, 10));
    }

    // Check cooldown
    const savedCooldown = localStorage.getItem('auth_cooldown');
    if (savedCooldown) {
      const cooldownDate = new Date(savedCooldown);
      if (cooldownDate > new Date()) {
        setCooldownUntil(cooldownDate);
      }
    }
  }, [checkBiometricAvailability]);

  // Cooldown timer
  React.useEffect(() => {
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

  const handleFailedAttempt = () => {
    const newCount = attemptCount + 1;
    setAttemptCount(newCount);
    localStorage.setItem('auth_attempts', newCount.toString());

    if (newCount >= 5) {
      const cooldownDate = new Date(Date.now() + 15 * 60 * 1000);
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

  const getCooldownMessage = () => {
    if (!cooldownUntil) return null;
    const remaining = Math.ceil((cooldownUntil.getTime() - Date.now()) / 1000);
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleLogin = async (email: string, password: string) => {
    if (cooldownUntil && new Date() < cooldownUntil) return;

    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await signIn(email, password);
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

  const handleBiometricLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await authenticateWithPasskey();
      if (result.success && result.data) {
        handleSuccessfulAuth();
        toast({
          title: 'تم تسجيل الدخول بنجاح',
          description: 'تم التحقق من هويتك باستخدام البصمة الحيوية'
        });
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

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
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
    } catch (err) {
      setError('حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistration = async (data: RegistrationData) => {
    if (cooldownUntil && new Date() < cooldownUntil) return;

    setIsLoading(true);
    setError('');
    setRegistrationData(data);

    try {
      const selectedCollege = colleges.find(c => c.value === data.college);
      
      const requestData = {
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        address: data.address.trim(),
        student_id: data.studentId.trim(),
        college: data.college,
        department: data.department,
        specialization: data.specialization,
        program_id: selectedCollege?.program_id,
        department_id: selectedCollege?.department_id,
        academic_year: 1,
        semester: 1,
        password: data.password,
      };

      await createRegistrationRequest.mutateAsync(requestData);
      
      toast({
        title: 'تم إرسال طلب التسجيل بنجاح!',
        description: 'سيتم مراجعة طلبك من قبل الإدارة.'
      });
      
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

  const handleForgotPassword = async (email: string) => {
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await resetPassword(email);
      if (error) {
        setError(error.message);
        toast({
          title: 'خطأ في إرسال رابط الاستعادة',
          description: error.message,
          variant: 'destructive'
        });
      } else {
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

  const handleMagicLink = async (email: string) => {
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await signInWithMagicLink(email);
      if (error) {
        setError(error.message);
        toast({
          title: 'خطأ في إرسال الرابط',
          description: error.message,
          variant: 'destructive'
        });
      } else {
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

  const handleBiometricSetupComplete = () => {
    setCurrentView('login');
    toast({
      title: 'تم إعداد المصادقة الحيوية بنجاح',
      description: 'يمكنك الآن تسجيل الدخول باستخدام البصمة الحيوية'
    });
  };

  const handleBiometricSetupSkip = () => {
    setCurrentView('login');
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

  const isInCooldown = cooldownUntil && new Date() < cooldownUntil;

  // Render current view
  switch (currentView) {
    case 'welcome':
      return (
        <WelcomeScreen
          onGetStarted={() => setCurrentView('register')}
          onLogin={() => setCurrentView('login')}
          onBiometricLogin={() => handleBiometricLogin()}
          onFaceIdLogin={() => handleBiometricLogin()}
          hasBiometric={biometricSupported && biometricAvailable}
          biometricError={!biometricSupported ? 'البصمة الحيوية غير مدعومة على هذا الجهاز' : !biometricAvailable ? `لم يتم تفعيل ${getBiometricTypesString() || 'البصمة الحيوية'} على جهازك. يرجى تفعيلها من إعدادات الجهاز` : undefined}
        />
      );

    case 'login':
      return (
        <EnhancedLoginScreen
          onBack={() => setCurrentView('welcome')}
          onLogin={handleLogin}
          onBiometricLogin={handleBiometricLogin}
          onOAuthLogin={handleOAuthLogin}
          onForgotPassword={handleForgotPassword}
          onMagicLink={handleMagicLink}
          isLoading={isLoading}
          error={error}
          cooldownTime={getCooldownMessage() || undefined}
          attemptCount={attemptCount}
        />
      );

    case 'register':
      return (
        <MultiStepRegistration
          onBack={() => setCurrentView('welcome')}
          onSubmit={handleRegistration}
          isLoading={isLoading}
          error={error}
        />
      );

    case 'biometric-setup':
      return (
        <BiometricSetup
          userEmail={registrationData.email}
          userName={`${registrationData.firstName} ${registrationData.lastName}`}
          onComplete={handleBiometricSetupComplete}
          onSkip={handleBiometricSetupSkip}
        />
      );

    default:
      return (
        <WelcomeScreen
          onGetStarted={() => setCurrentView('register')}
          onLogin={() => setCurrentView('login')}
          onBiometricLogin={() => handleBiometricLogin()}
          onFaceIdLogin={() => handleBiometricLogin()}
          hasBiometric={biometricSupported && biometricAvailable}
          biometricError={!biometricSupported ? 'البصمة الحيوية غير مدعومة على هذا الجهاز' : !biometricAvailable ? `لم يتم تفعيل ${getBiometricTypesString() || 'البصمة الحيوية'} على جهازك. يرجى تفعيلها من إعدادات الجهاز` : undefined}
        />
      );
  }
};