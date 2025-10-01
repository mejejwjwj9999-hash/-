import React, { useState } from 'react';
import { useEnhancedBiometricAuth } from '@/hooks/useEnhancedBiometricAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Fingerprint, Shield, Smartphone, CheckCircle, AlertTriangle, 
  Eye, Lock, Zap, ArrowRight, Loader2, Sparkles, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface BiometricSetupProps {
  userEmail: string;
  userName: string;
  onComplete: () => void;
  onSkip: () => void;
}

export const BiometricSetup: React.FC<BiometricSetupProps> = ({
  userEmail,
  userName,
  onComplete,
  onSkip
}) => {
  const { 
    isSupported, 
    isAvailable, 
    createPasskey, 
    checkBiometricAvailability,
    getBiometricTypesString 
  } = useEnhancedBiometricAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    checkBiometricAvailability();
  }, [checkBiometricAvailability]);

  const handleSetupBiometric = async () => {
    setIsLoading(true);
    
    try {
      const result = await createPasskey(userEmail, userName);
      
      if (result.success) {
        setSetupComplete(true);
        toast({
          title: 'تم إعداد المصادقة الحيوية بنجاح',
          description: 'يمكنك الآن تسجيل الدخول باستخدام البصمة أو التعرف على الوجه'
        });
        
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else {
        toast({
          title: 'خطأ في إعداد المصادقة الحيوية',
          description: result.error || 'حدث خطأ غير متوقع',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'خطأ في إعداد المصادقة الحيوية',
        description: 'حدث خطأ غير متوقع أثناء الإعداد',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const biometricFeatures = [
    {
      icon: Fingerprint,
      title: 'بصمة الإصبع',
      description: 'تسجيل دخول سريع وآمن باستخدام بصمة الإصبع'
    },
    {
      icon: Eye,
      title: 'التعرف على الوجه',
      description: 'مصادقة متقدمة باستخدام تقنية التعرف على الوجه'
    },
    {
      icon: Shield,
      title: 'أمان متقدم',
      description: 'حماية إضافية لحسابك بتقنيات التشفير المتطورة'
    }
  ];

  if (setupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center p-4" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="border-emerald-200 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center relative"
              >
                <CheckCircle className="w-10 h-10 text-white" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="w-6 h-6 text-emerald-400" />
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <CardTitle className="text-2xl text-emerald-700 mb-2">
                  🎉 تم الإعداد بنجاح!
                </CardTitle>
                <CardDescription className="text-emerald-600 text-base leading-relaxed">
                  تم إعداد المصادقة الحيوية بنجاح. استمتع الآن بتسجيل دخول فائق السرعة والأمان!
                </CardDescription>
              </motion.div>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center p-4" dir="rtl">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl">المصادقة الحيوية غير مدعومة</CardTitle>
            <CardDescription>
              هذا الجهاز لا يدعم المصادقة الحيوية. يمكنك الاستمرار باستخدام كلمة المرور التقليدية.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={onSkip} className="w-full">
              الاستمرار بدون المصادقة الحيوية
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mobile-auth-bg flex items-center justify-center p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-mobile-auth-card backdrop-blur-md">
          <CardHeader className="text-center">
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center relative overflow-hidden"
            >
              <Fingerprint className="w-10 h-10 text-primary-foreground" />
              <motion.div
                animate={{ 
                  background: [
                    "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
                    "linear-gradient(225deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <CardTitle className="text-2xl mb-2">🔐 المصادقة الحيوية</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                قم بإعداد المصادقة الحيوية للحصول على تجربة دخول فائقة الأمان والسرعة
              </CardDescription>
            </motion.div>
            
            {isAvailable && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Badge variant="secondary" className="mx-auto mt-3 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border-emerald-300">
                  <Zap className="w-3 h-3 ml-1" />
                  متاح ومدعوم على هذا الجهاز
                  <Star className="w-3 h-3 mr-1" />
                </Badge>
              </motion.div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              {biometricFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-start space-x-3 space-x-reverse"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {!isAvailable && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    المصادقة الحيوية غير متاحة على هذا الجهاز. تأكد من تفعيل القفل بالبصمة أو كلمة المرور في إعدادات الجهاز.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="space-y-3"
            >
              <Button 
                onClick={handleSetupBiometric}
                disabled={!isAvailable || isLoading}
                className="w-full h-14 text-base bg-mobile-auth-button hover:bg-mobile-auth-button-hover text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                    جاري الإعداد...
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-5 h-5 ml-2" />
                    إعداد المصادقة الحيوية
                    <ArrowRight className="w-4 h-4 mr-2" />
                  </>
                )}
              </Button>

              <Button 
                variant="outline" 
                onClick={onSkip}
                className="w-full h-12 border-2 hover:bg-secondary/50"
              >
                التخطي لاحقاً
              </Button>
            </motion.div>

            {/* Security Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              <Alert className="bg-primary/5 border-primary/20">
                <Shield className="h-4 w-4 text-primary" />
                <AlertDescription className="text-xs text-primary/80">
                  <strong>ملاحظة أمنية:</strong> البيانات البيومترية محفوظة بشكل آمن على جهازك ولن يتم مشاركتها مع أي طرف ثالث.
                </AlertDescription>
              </Alert>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};