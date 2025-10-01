
import React, { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-university-blue via-university-blue-light to-university-blue-dark">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--university-gold)) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, hsl(var(--university-blue-light)) 0%, transparent 50%),
                           radial-gradient(circle at 40% 20%, hsl(var(--secondary)) 0%, transparent 50%)`
        }}></div>
        
        {/* Animated circles */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-university-gold/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-university-blue-light/10 rounded-full blur-3xl animate-breathe"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-sm bg-white/95 rounded-2xl shadow-2xl p-2">
          {isLogin ? (
            <LoginForm onToggleMode={toggleMode} />
          ) : (
            <RegisterForm onToggleMode={toggleMode} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
