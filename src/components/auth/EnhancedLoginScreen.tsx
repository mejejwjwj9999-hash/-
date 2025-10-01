import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Fingerprint, Eye, EyeOff, Lock, Mail, ArrowLeft, 
  Smartphone, Shield, Key, AlertCircle, Loader2, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import googleLogo from '@/assets/google-logo.png';
import appleLogo from '@/assets/apple-logo.png';
import aylolLogo from '/lovable-uploads/1e7453f8-59ac-4ef5-b07a-10c441c55aec.png';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface EnhancedLoginScreenProps {
  onBack: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onBiometricLogin: () => Promise<void>;
  onOAuthLogin: (provider: 'google' | 'apple') => Promise<void>;
  onForgotPassword: (email: string) => void;
  onMagicLink: (email: string) => void;
  isLoading: boolean;
  error: string;
  cooldownTime?: string;
  attemptCount?: number;
}

export const EnhancedLoginScreen: React.FC<EnhancedLoginScreenProps> = ({
  onBack,
  onLogin,
  onBiometricLogin,
  onOAuthLogin,
  onForgotPassword,
  onMagicLink,
  isLoading,
  error,
  cooldownTime,
  attemptCount = 0
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [activeMethod, setActiveMethod] = useState<'biometric' | 'password' | 'oauth'>('biometric');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  
  const { isAvailable: biometricAvailable, getStoredCredentials } = useBiometricAuth();
  const storedBiometric = getStoredCredentials();

  // Load remembered email
  useEffect(() => {
    const remembered = localStorage.getItem('remembered_email');
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(email, password);
    
    if (rememberMe) {
      localStorage.setItem('remembered_email', email);
    } else {
      localStorage.removeItem('remembered_email');
    }
  };

  const handleBiometricAuth = async () => {
    try {
      await onBiometricLogin();
    } catch (error) {
      console.error('Biometric auth error:', error);
    }
  };

  const isInCooldown = !!cooldownTime;

  return (
    <div className="min-h-screen bg-mobile-auth-bg flex items-center justify-center p-4 pb-8" dir="rtl">
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-2xl border-0 bg-mobile-auth-card backdrop-blur-md">
            <CardHeader className="text-center pb-6 pt-8">
              <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" size="sm" onClick={onBack} className="rounded-full w-10 h-10 p-0">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1 flex justify-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden bg-white shadow-lg border border-gray-100">
                    <img 
                      src={aylolLogo} 
                      alt="شعار كلية أيلول" 
                      className="w-14 h-14 object-contain"
                    />
                  </div>
                </div>
                <div className="w-10" />
              </div>
              
              <CardTitle className="text-2xl mb-3 font-bold">تسجيل الدخول</CardTitle>
              <p className="text-muted-foreground text-sm leading-relaxed">
                مرحباً بعودتك إلى كلية أيلول الجامعية
              </p>
            </CardHeader>

            <CardContent className="space-y-6 px-8 pb-8">
              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert variant="destructive" className="rounded-xl">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Cooldown Warning */}
              {isInCooldown && (
                <Alert className="border-aylol-gold bg-aylol-gold/5 rounded-xl">
                  <Shield className="h-4 w-4 text-aylol-gold" />
                  <AlertDescription className="text-aylol-gold">
                    لحماية حسابك، يُرجى الانتظار قبل المحاولة مرة أخرى: {cooldownTime}
                  </AlertDescription>
                </Alert>
              )}

              {/* Attempt Counter */}
              {attemptCount > 0 && attemptCount < 5 && (
                <div className="text-center">
                  <Badge variant="outline" className="text-xs rounded-full">
                    المحاولة {attemptCount} من 5
                  </Badge>
                </div>
              )}

              {/* Biometric Login (Priority) */}
              {biometricAvailable && storedBiometric && activeMethod === 'biometric' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto bg-mobile-auth-button rounded-3xl flex items-center justify-center shadow-xl">
                      <Fingerprint className="w-12 h-12 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg">المصادقة الحيوية</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        استخدم بصمتك أو وجهك لتسجيل الدخول السريع والآمن
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs rounded-full bg-emerald-50 text-emerald-700 border-emerald-200">
                      آمن وسريع
                    </Badge>
                  </div>

                  <Button 
                    onClick={handleBiometricAuth}
                    disabled={isLoading || isInCooldown}
                    className="w-full h-14 bg-mobile-auth-button hover:bg-mobile-auth-button-hover text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Fingerprint className="w-5 h-5 ml-2" />
                        تسجيل الدخول بالبصمة
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setActiveMethod('password')}
                      className="text-xs rounded-full"
                    >
                      استخدم البريد وكلمة المرور بدلاً من ذلك
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Password Login */}
              {(!biometricAvailable || !storedBiometric || activeMethod === 'password') && (
                <motion.form
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-right font-medium">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-xl border-2 focus:border-aylol-blue transition-colors"
                      placeholder="student@aylol.edu.ye"
                      required
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-right font-medium">كلمة المرور</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 pl-12 rounded-xl border-2 focus:border-aylol-blue transition-colors"
                        placeholder="أدخل كلمة المرور"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Switch 
                        checked={rememberMe} 
                        onCheckedChange={setRememberMe}
                        id="remember" 
                      />
                      <Label htmlFor="remember" className="font-medium">تذكرني</Label>
                    </div>
                    <Button 
                      type="button" 
                      variant="link" 
                      size="sm" 
                      onClick={() => setShowForgotPasswordModal(true)}
                      className="p-0 h-auto text-xs text-aylol-blue"
                    >
                      نسيت كلمة المرور؟
                    </Button>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading || isInCooldown} 
                    className="w-full h-12 font-semibold rounded-xl bg-mobile-auth-button hover:bg-mobile-auth-button-hover text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    ) : (
                      <Lock className="w-4 h-4 ml-2" />
                    )}
                    تسجيل الدخول
                  </Button>

                  {/* Switch to Biometric */}
                  {biometricAvailable && storedBiometric && (
                    <div className="text-center">
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setActiveMethod('biometric')}
                        className="text-xs rounded-full"
                      >
                        <Fingerprint className="w-3 h-3 ml-1" />
                        استخدم المصادقة الحيوية
                      </Button>
                    </div>
                  )}
                </motion.form>
              )}

              {/* Alternative Methods */}
              <div className="space-y-4">
                <div className="relative">
                  <Separator />
                  <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 text-center">
                    <span className="bg-white px-4 text-xs text-muted-foreground font-medium">
                      أو تسجيل الدخول باستخدام
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => onOAuthLogin('google')}
                    className="h-12 border-2 rounded-xl bg-white hover:bg-gray-50 transition-colors"
                    disabled={isLoading || isInCooldown}
                  >
                    <img src={googleLogo} alt="Google" className="h-4 w-4 ml-1" />
                    <span className="font-medium">Google</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => onOAuthLogin('apple')}
                    className="h-12 border-2 rounded-xl bg-white hover:bg-gray-50 transition-colors"
                    disabled={isLoading || isInCooldown}
                  >
                    <img src={appleLogo} alt="Apple" className="h-4 w-4 ml-1" />
                    <span className="font-medium">Apple</span>
                  </Button>
                </div>

                {/* Magic Link Option */}
                <Button 
                  variant="ghost" 
                  onClick={() => onMagicLink(email)}
                  disabled={!email || isLoading || isInCooldown}
                  className="w-full text-sm rounded-xl"
                >
                  <Mail className="w-4 h-4 ml-1" />
                  إرسال رابط تسجيل دخول سحري
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <ForgotPasswordModal
          isOpen={showForgotPasswordModal}
          onClose={() => setShowForgotPasswordModal(false)}
          onSubmit={async (email) => {
            await new Promise<void>((resolve) => {
              onForgotPassword(email);
              resolve();
            });
          }}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};