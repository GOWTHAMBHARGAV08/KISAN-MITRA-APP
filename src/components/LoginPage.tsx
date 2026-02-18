import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import farmingBg from '@/assets/farming-bg.jpg';

const kisanmitraLogoUrl = '/lovable-uploads/273328c3-7e26-4565-9948-7f20159d8eb5.png';

export const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { display_name: formData.displayName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({
          title: 'Account created!',
          description: 'Please check your email to verify your account.',
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#1a4d2e] via-[#2d6a4f] to-[#1a4d2e] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-400/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-0 -left-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="card-farmer w-full max-w-md relative z-10 p-8 shadow-2xl border-white/10 bg-white/95 backdrop-blur-xl animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-tr from-green-50 to-emerald-50 rounded-[2rem] p-4 shadow-float flex items-center justify-center transform hover:rotate-6 transition-transform duration-500">
            <img
              src={kisanmitraLogoUrl}
              alt="KisanMitra Logo"
              className="w-full h-full object-contain drop-shadow-sm"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">KisanMitra</h1>
          <p className="text-muted-foreground font-medium text-sm">Empowering Every Farmer 🌱</p>
        </div>

        {/* Toggle */}
        <div className="flex mb-8 p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200/50">
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${isSignUp ? 'bg-white text-green-700 shadow-sm scale-[1.02]' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${!isSignUp ? 'bg-white text-green-700 shadow-sm scale-[1.02]' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Sign In
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div className="space-y-2 group">
              <Label htmlFor="displayName" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Full Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                <Input
                  id="displayName"
                  type="text"
                  placeholder="e.g. Ramu Kakkar"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="pl-12 h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all font-medium"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2 group">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-12 h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-12 pr-12 h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all font-medium"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#2FAE63] to-[#1F8A4C] hover:from-[#258e50] hover:to-[#186f3c] text-white font-bold text-lg shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 transition-all duration-300 transform hover:-translate-y-0.5" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              isSignUp ? 'Start Your Journey' : 'Welcome Back'
            )}
          </Button>
        </form>
      </div>

      <div className="absolute bottom-6 text-center text-xs text-white/40 font-medium">
        © 2026 KisanMitra. Empowering Indian Agriculture.
      </div>
    </div>
  );
};
