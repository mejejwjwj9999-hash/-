import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { useIsAdminFixed } from '@/hooks/useIsAdminFixed';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogIn, Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
interface LoginFormProps {
  onToggleMode: () => void;
}
const LoginForm: React.FC<LoginFormProps> = ({
  onToggleMode
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdminFixed(user?.id);
  // Redirect based on role when user is authenticated
  useEffect(() => {
    if (user && !isCheckingAdmin) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/student-portal');
      }
    }
  }, [user, isAdmin, isCheckingAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error } = await signIn(email, password);
      if (error) {
        setError(error.message);
        toast({
          title: 'خطأ في تسجيل الدخول',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'تم تسجيل الدخول بنجاح',
          description: 'جاري تحويلك...'
        });
        // Navigation will happen through useEffect
      }
    } catch (err) {
      setError('حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };
  return <Card className="w-full max-w-md mx-auto border-0 shadow-none bg-transparent">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-university-blue to-university-blue-dark shadow-lg">
            <LogIn className="w-10 h-10 text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-university-blue via-university-blue-light to-university-blue bg-clip-text text-transparent">
            تسجيل الدخول
          </CardTitle>
          <CardDescription className="text-gray-600">
            أدخل بياناتك للوصول إلى البوابة
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-right block">
              البريد الإلكتروني
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-academic-gray" />
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="pl-10 text-right" placeholder="أدخل بريدك الإلكتروني" required dir="rtl" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-right block">
              كلمة المرور
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-academic-gray" />
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 text-right" placeholder="كلمة المرور" required dir="rtl" />
            </div>
          </div>

          {error && <Alert variant="destructive">
              <AlertDescription className="text-right">
                {error}
              </AlertDescription>
            </Alert>}

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-university-blue to-university-blue-dark hover:from-university-blue-dark hover:to-university-blue text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
            disabled={loading}
          >
            {loading ? <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                جاري تسجيل الدخول...
              </> : (
                <>
                  <LogIn className="ml-2 h-5 w-5" />
                  تسجيل الدخول
                </>
              )}
          </Button>

          <div className="text-center pt-2">
            <div className="text-sm text-gray-600">
              ليس لديك حساب؟{' '}
              <button 
                type="button" 
                onClick={onToggleMode} 
                className="text-university-blue font-semibold hover:text-university-blue-light transition-colors"
              >
                إنشاء حساب جديد
              </button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>;
};
export default LoginForm;