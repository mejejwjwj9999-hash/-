import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
  isLoading?: boolean;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }

    try {
      setError('');
      await onSubmit(email);
      setIsSubmitted(true);
    } catch (err) {
      setError('حدث خطأ أثناء إرسال رابط إعادة التعيين');
    }
  };

  const handleClose = () => {
    setEmail('');
    setIsSubmitted(false);
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-md mx-auto rounded-2xl border-0 bg-white shadow-2xl backdrop-blur-sm" dir="rtl">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl font-bold text-primary">
            إعادة تعيين كلمة المرور
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive" className="rounded-xl">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email" className="text-right font-medium">
                      البريد الإلكتروني
                    </Label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-xl border-2 focus:border-primary transition-colors"
                      placeholder="student@aylol.edu.ye"
                      required
                      dir="ltr"
                      disabled={isLoading}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading || !email.trim()} 
                    className="w-full h-12 font-semibold rounded-xl bg-mobile-auth-button hover:bg-mobile-auth-button-hover text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    ) : (
                      <ArrowRight className="w-4 h-4 ml-2" />
                    )}
                    إرسال رابط إعادة التعيين
                  </Button>
                </form>

                <div className="text-center">
                  <Button 
                    variant="ghost" 
                    onClick={handleClose}
                    className="text-sm text-muted-foreground hover:text-primary rounded-xl"
                  >
                    العودة لتسجيل الدخول
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-4"
              >
                <div className="w-20 h-20 mx-auto bg-emerald-50 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-primary">
                    تم إرسال الرابط بنجاح
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    تم إرسال رابط إعادة تعيين كلمة المرور إلى:<br />
                    <span className="font-medium text-primary" dir="ltr">{email}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    تأكد من فحص مجلد البريد المزعج إذا لم تجد الرسالة
                  </p>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleClose}
                    className="w-full h-12 font-semibold rounded-xl bg-mobile-auth-button hover:bg-mobile-auth-button-hover text-white"
                  >
                    العودة لتسجيل الدخول
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setIsSubmitted(false)}
                    className="w-full h-12 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    إرسال لبريد إلكتروني آخر
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};