import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Smartphone, Shield, Fingerprint, Eye, Lock, Zap, BookOpen, Calendar, DollarSign, FileText, Scan } from 'lucide-react';
import { motion } from 'framer-motion';
import aylolLogo from '/lovable-uploads/1e7453f8-59ac-4ef5-b07a-10c441c55aec.png';
interface WelcomeScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onBiometricLogin?: () => void;
  onFaceIdLogin?: () => void;
  hasBiometric: boolean;
  biometricError?: string;
}
export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onLogin,
  onBiometricLogin,
  onFaceIdLogin,
  hasBiometric,
  biometricError
}) => {
  const features = [{
    icon: BookOpen,
    title: 'المقررات',
    description: 'تصفح مقرراتك الأكاديمية'
  }, {
    icon: Calendar,
    title: 'الجدول',
    description: 'مواعيد المحاضرات'
  }, {
    icon: GraduationCap,
    title: 'الدرجات',
    description: 'متابعة معدلك التراكمي'
  }, {
    icon: DollarSign,
    title: 'المالية',
    description: 'الرسوم والمدفوعات'
  }];
  return <div className="min-h-screen bg-mobile-auth-bg flex items-center justify-center p-4 overflow-hidden" dir="rtl">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <motion.div initial={{
        opacity: 0,
        y: -30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 rounded-2xl flex items-center justify-center overflow-hidden bg-white shadow-xl border border-gray-100">
            <img src={aylolLogo} alt="شعار كلية أيلول" className="w-20 h-20 object-contain" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-foreground leading-tight">
              مرحباً بك في
            </h1>
            <h2 className="text-lg font-semibold text-aylol-blue">
              كلية أيلول الجامعية
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed px-2">
              بوابتك الذكية للتعليم الجامعي
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.2
      }} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {features.map((feature, index) => <motion.div key={index} initial={{
            opacity: 0,
            scale: 0.8
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            delay: 0.4 + index * 0.1,
            duration: 0.5
          }} className="bg-mobile-auth-card rounded-xl p-3 border border-white/20 shadow-lg backdrop-blur-md">
                <div className="text-center space-y-1">
                  <div className="w-8 h-8 mx-auto bg-aylol-blue/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-aylol-blue" />
                  </div>
                  <h3 className="font-semibold text-xs text-gray-800 leading-tight">{feature.title}</h3>
                  <p className="text-xs text-gray-600 leading-tight">{feature.description}</p>
                </div>
              </motion.div>)}
          </div>
        </motion.div>

        {/* Biometric Badge */}
        {hasBiometric && <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 0.6,
        delay: 0.6
      }} className="text-center">
            
          </motion.div>}
        
        {/* Biometric Error Message */}
        {biometricError && <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 0.6,
        delay: 0.6
      }} className="text-center">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-700 leading-relaxed">
                <span className="font-medium">تنبيه:</span> {biometricError}
              </p>
            </div>
          </motion.div>}

        {/* Action Buttons */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.4
      }} className="space-y-3">
          <Button onClick={onGetStarted} className="w-full h-12 text-sm font-semibold bg-mobile-auth-button hover:bg-mobile-auth-button-hover shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl text-white">
            <Smartphone className="w-4 h-4 ml-2" />
            إنشاء حساب جديد
            <Zap className="w-4 h-4 mr-2" />
          </Button>

          <Button variant="outline" onClick={onLogin} className="w-full h-10 text-sm border-2 border-gray-200 bg-white hover:bg-gray-50 rounded-xl font-medium transition-all duration-300">
            <Lock className="w-4 h-4 ml-2" />
            لدي حساب بالفعل
          </Button>

          {/* Biometric Authentication Buttons */}
          {hasBiometric && <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.8
        }} className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={onBiometricLogin} className="h-10 border-2 border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/90 text-emerald-700 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2">
                <Fingerprint className="w-4 h-4" />
                <span className="text-xs">البصمة</span>
              </Button>

              <Button variant="outline" onClick={onFaceIdLogin} className="h-10 border-2 border-blue-200 bg-blue-50/70 hover:bg-blue-100/90 text-blue-700 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2">
                <Scan className="w-4 h-4" />
                <span className="text-xs">بصمة الوجه</span>
              </Button>
            </motion.div>}
        </motion.div>

        {/* Footer */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 0.8,
        delay: 0.8
      }} className="text-center text-xs text-muted-foreground px-4">
          <p className="leading-relaxed">
            بالمتابعة، فإنك توافق على 
            <span className="text-aylol-blue font-medium underline cursor-pointer mx-1">شروط الخدمة</span>
            و
            <span className="text-aylol-blue font-medium underline cursor-pointer mx-1">سياسة الخصوصية</span>
          </p>
        </motion.div>
      </div>
    </div>;
};