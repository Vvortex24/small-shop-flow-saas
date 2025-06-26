
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AnimatedBackground from '@/components/AnimatedBackground';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "خطأ في تسجيل الدخول",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "مرحباً بعودتك!",
            description: "تم تسجيل دخولك بنجاح",
          });
          navigate('/');
        }
      } else {
        if (!name.trim()) {
          toast({
            title: "خطأ",
            description: "يرجى إدخال اسمك الكامل",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
        const { error } = await signUp(email, password, name);
        if (error) {
          toast({
            title: "خطأ في إنشاء الحساب",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "تم إنشاء الحساب بنجاح!",
            description: "يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب",
          });
          setIsLogin(true);
        }
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl animate-fade-in">
          <CardHeader className="text-center space-y-6 pb-8">
            {/* Logo with glow effect */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 animate-pulse">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>
            
            {/* Title with gradient text */}
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {isLogin ? 'مرحباً بعودتك' : 'إنشاء حساب جديد'}
              </CardTitle>
              <p className="text-white/80 text-lg">
                {isLogin ? 'سجل دخولك إلى حساب مشايتك' : 'ابدأ في إدارة متجرك اليوم'}
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name field for registration */}
              {!isLogin && (
                <div className="space-y-2 animate-slide-up">
                  <Label htmlFor="name" className="text-white/90 font-medium">الاسم الكامل</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    className="backdrop-blur-md bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-white/40 transition-all duration-300"
                  />
                </div>
              )}
              
              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90 font-medium">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="backdrop-blur-md bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-white/40 transition-all duration-300"
                />
              </div>
              
              {/* Password field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90 font-medium">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="backdrop-blur-md bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-white/40 transition-all duration-300 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg shadow-lg shadow-blue-500/25 border-0 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري التحميل...
                  </div>
                ) : (
                  isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب'
                )}
              </Button>
            </form>
            
            {/* Toggle between login/register */}
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-white/80 hover:text-white transition-colors duration-300 font-medium underline decoration-white/40 hover:decoration-white/80"
              >
                {isLogin 
                  ? "ليس لديك حساب؟ سجل الآن" 
                  : "لديك حساب بالفعل؟ سجل دخولك"
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
