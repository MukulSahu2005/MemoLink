import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion }from 'framer-motion';
import type{ Variants} from 'framer-motion';
import { Brain, Eye, EyeOff, Code, Workflow, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from 'sonner';


export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      toast.error('All fields are required.');
      return;
    }

    setIsLoading(true);
    try {
      await login(identifier.trim(), password);
      toast.success('System Authenticated. Entry Granted.');
      navigate('/dashboard');
    } 
    catch (err: any) {
      toast.error(err?.message || 'Authorization failed. Check security credentials.');
    } 
    finally {
      setIsLoading(false);
    }
  };

  // const handleGoogleSignIn = () => {
  //   const base = import.meta.env.VITE_API_BASE_URL ?? '';
  //   const url = `${base}/api/v1/auth/google`;

  //   // redirect to backend OAuth placeholder
  //   window.location.href = url;
  // };

    //direct connected to test
  const handleGoogleSignIn = () => {
    window.location.href = "https://memolink-js1f.onrender.com/api/v1/auth/google";
  };
  const pageVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } 
    },
  };

  const fieldVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
    }),
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-6 relative font-sans">
      
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-brand/5 blur-[100px] pointer-events-none" />
      
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
          {/* Subtle decoration inside panel */}
          <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-brand/5 blur-2xl" />
          
          <div className="relative z-10">
            <div className="bg-brand/10 p-3 rounded-2xl w-fit border border-brand/20 mb-8">
              <Brain className="w-10 h-10 text-brand" />
            </div>
            
            <h2 className="font-display text-3xl font-extrabold leading-tight text-text-primary">
              Welcome back <br />
              to your <span className="text-brand">MemoLink.</span>
            </h2>
            
            <p className="font-sans text-sm text-text-secondary leading-relaxed mt-4">
              The sanctuary for your digital consciousness. Reconnect with your mapped knowledge.
            </p>
          </div>

          <div className="relative z-10 mt-12 md:mt-0 pt-8 border-t border-border-subtle flex items-center gap-6 text-text-secondary/40">
            <Code className="w-5 h-5 hover:text-brand transition-colors cursor-help" aria-label="Cryptographic Structuring" />
            <Workflow className="w-5 h-5 hover:text-brand transition-colors cursor-help" aria-label="Context Mapping" />
            <TrendingUp className="w-5 h-5 hover:text-brand transition-colors cursor-help" aria-label="Knowledge Scaling" />
          </div>
        </div>

        {/* Right 60% Form Panel */}
        <div className="md:col-span-6 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl font-bold text-text-primary">Authenticate Identity</h3>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-brand/80 bg-brand/5 border border-brand/20 px-2 py-0.5 rounded mt-2 inline-block">
              ⚡ LEVEL 4 ENCRYPTION ACTIVE ⚡
            </span>
          </div>

          {/* <div className="flex justify-center mb-4">
            <Button variant="ghost" className="w-full max-w-sm" onClick={handleGoogleSignIn} type='button'>
              Sign in with Google
            </Button>
          </div> */}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
              <Input
                label="Email or Username_"
                type="text"
                placeholder="you@example.com or node_identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </motion.div>

            <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
              <Input
                label="Password Key_"
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
            </motion.div>

            <motion.div
              custom={2}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center justify-between font-mono text-[11px] select-none"
            >
              <label className="flex items-center gap-2 text-text-secondary cursor-pointer hover:text-text-primary transition-colors">
                <input
                  type="checkbox"
                  className="rounded border-border-subtle bg-bg-panel text-brand focus:ring-brand focus:ring-offset-0 focus:outline-none w-3.5 h-3.5"
                />
                Stay Persistent
              </label>
              
              <button
                type="button"
                onClick={() => toast.info('Key recovery protocol: Please contact administrator.')}
                className="text-brand hover:underline"
              >
                Recover Key?
              </button>
            </motion.div>

            <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible" className="mt-2">
              <Button type="submit" isLoading={isLoading} className="w-full py-4 text-sm tracking-widest font-bold">
                Authorize Entry →
              </Button>
            </motion.div>
          </form>

          <div className="my-6 flex items-center justify-center gap-3">
            <div className="flex-grow border-t border-border-subtle" />
            <span className="font-mono text-xs text-text-secondary/40 select-none">OR</span>
            <div className="flex-grow border-t border-border-subtle" />
          </div>
          
          {/* Initialize with google */}
          <Button
            variant="ghost"
            onClick={handleGoogleSignIn} type='button'
            className="w-full flex items-center justify-center gap-2 border border-border-subtle py-3 hover:bg-border-subtle"
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
            Initialize with Google
          </Button>

          <p className="text-center font-sans text-xs text-text-secondary mt-8">
            New node?{' '}
            <Link to="/signup" className="text-brand font-semibold hover:underline">
              Join the ecosystem
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
