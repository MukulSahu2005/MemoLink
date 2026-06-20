import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Eye, EyeOff, Check, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from 'sonner';

// const cn = (...classes: Array<string | false | undefined | null>) =>
//   classes.filter(Boolean).join(' ');
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));

}
export default function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Strength score: 0 to 4
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    if (!password) {
      setStrength(0);
      return;
    }
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
    setStrength(score);
  }, [password]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password || !confirmPassword) {
      toast.error('All fields are required.');
      return;
    }

    if (username.length < 3) {
      toast.error('Username must be at least 3 characters.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await signup(username.trim(), password, email ? email.trim() : undefined);
      toast.success('Node crystallized. Please login to authenticate.');
      navigate('/signin');
    } catch (err: any) {
      toast.error(err?.message || 'Bootstrap failed. Contact administrator.');
    } finally {
      setIsLoading(false);
    }
  };

  // const handleGoogleSignUp = () => {
  //   const base = import.meta.env.VITE_API_BASE_URL ?? '';
  //   const url = `${base}/api/v1/auth/google`;
  //   window.location.href = url;
  // };

  //direct connected to test
  const handleGoogleSignUp = () => {
    window.location.href = "https://memolink-js1f.onrender.com/api/v1/auth/google";
  };
  const getStrengthColor = (score: number) => {
    if (score === 1) return 'bg-status-error';
    if (score === 2) return 'bg-amber-500';
    if (score === 3) return 'bg-yellow-400';
    if (score === 4) return 'bg-status-online';
    return 'bg-text-secondary/20';
  };

  const getStrengthLabel = (score: number) => {
    if (score === 1) return 'WEAK';
    if (score === 2) return 'FAIR';
    if (score === 3) return 'STRONG';
    if (score === 4) return 'SECURE';
    return 'EMPTY';
  };

  const easeCurve = [0.22, 1, 0.36, 1] as const;

  const pageVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: easeCurve } 
    },
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.08, duration: 0.4, ease: easeCurve },
    }),
  };

  const isMatched = password && confirmPassword && password === confirmPassword;

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-6 relative font-sans">
      {/* Background decoration */}
      <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-brand/5 blur-[100px] pointer-events-none" />

      {/* Header Link */}
      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center gap-2 group">
          <Brain className="w-5 h-5 text-brand group-hover:scale-110 transition-transform" />
          <span className="font-display font-bold text-lg text-text-primary">MemoLink</span>
        </Link>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={pageVariants}
        className="w-full max-w-5xl rounded-card overflow-hidden shadow-card-dark bg-bg-card grid grid-cols-1 md:grid-cols-10 border border-border-subtle"
      >
        {/* Left 40% Hero Panel */}
        <div className="md:col-span-4 bg-bg-panel p-8 md:p-12 flex flex-col justify-between border-r border-border-subtle relative overflow-hidden">
          <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-brand/5 blur-2xl" />
          
          <div className="relative z-10">
            <div className="bg-brand/10 p-3 rounded-2xl w-fit border border-brand/20 mb-8">
              <Brain className="w-10 h-10 text-brand" />
            </div>
            
            <h2 className="font-display text-3xl font-extrabold leading-tight text-text-primary">
              Begin your journey <br />
              into your <span className="text-brand">MemoLink.</span>
            </h2>
            
            <p className="font-sans text-sm text-text-secondary leading-relaxed mt-4">
              Map your knowledge. Own your thoughts. Build your digital mind palace.
            </p>
          </div>

          <div className="relative z-10 mt-12 md:mt-0 pt-8 border-t border-border-subtle flex items-center gap-2 text-brand font-mono text-[10px] tracking-widest font-bold">
            <Sparkles className="w-4 h-4 animate-pulse" />
            INITIALIZE PERSONAL NODE
          </div>
        </div>

        {/* Right 60% Form Panel */}
        <div className="md:col-span-6 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl font-bold text-text-primary">Initialize Node</h3>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-brand/80 bg-brand/5 border border-brand/20 px-2 py-0.5 rounded mt-2 inline-block">
              🧬 CREATE YOUR NEURAL ANCHOR 🧬
            </span>
          </div>
          

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
              <Input
                label="Choose Node Identifier (Username)_"
                type="text"
                placeholder="node_identifier"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                startAdornment={<span className="text-brand">@</span>}
                required
              />
            </motion.div>

            <motion.div custom={0.5} variants={fieldVariants} initial="hidden" animate="visible">
              <Input
                label="Email (optional)_"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>

            <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible" className="flex flex-col gap-1.5">
              <Input
                label="Set Password Key_"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none hover:text-brand transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
              
              {/* Strength Meter */}
              <div className="flex flex-col gap-1 font-mono text-[10px] mt-1 select-none">
                <div className="flex items-center justify-between text-text-secondary">
                  <span>KEY STRENGTH_</span>
                  <span className={cn(strength > 0 && "font-bold text-text-primary")}>
                    {getStrengthLabel(strength)}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        strength >= step ? getStrengthColor(strength) : "bg-border-subtle"
                      )}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
              <Input
                label="Confirm Password Key_"
                type="password"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                endAdornment={
                  isMatched ? (
                    <Check className="w-4 h-4 text-status-online" />
                  ) : confirmPassword ? (
                    <AlertCircle className="w-4 h-4 text-status-error" />
                  ) : null
                }
              />
            </motion.div>

            <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible" className="mt-4">
              <Button type="submit" isLoading={isLoading} className="w-full py-4 text-sm tracking-widest font-bold">
                Bootstrap Node →
              </Button>
            </motion.div>
          </form>

          {/* <div className="flex justify-center mt-4 mb-4">
            <Button variant="ghost" className="w-full max-w-sm" onClick={handleGoogleSignUp}>
              Sign up with Google
            </Button>
          </div> */}

            {/* Initialize with google */}
          <Button
            variant="ghost"
            onClick={handleGoogleSignUp} type='button'
            className="w-full mt-6 flex items-center justify-center gap-2 border border-border-subtle py-3 hover:bg-border-subtle"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
              Sign up with Google
          </Button>


          <p className="text-center font-sans text-xs text-text-secondary mt-8">
            Already mapped?{' '}
            <Link to="/signin" className="text-brand font-semibold hover:underline">
              Authenticate here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
