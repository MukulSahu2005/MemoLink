import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// import { FileText, Bird, TvMinimalPlay, Link2, Brain, ChevronRight, Globe, ArrowUpRight } from 'lucide-react';
// import { FaGithub ,FaLinkedin,FaInstagram  } from "react-icons/fa";
import { Button } from '../components/ui/Button';
import { FileText, Bird, TvMinimalPlay, Link2, Brain, ChevronRight, Globe, ArrowUpRight, Code, Briefcase, Share2 } from 'lucide-react';


export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  const trustBadges = [
    { text: 'Zero-Knowledge Tokenized Delivery', icon: '🔐' },
    { text: 'Cryptographic Link Obfuscation', icon: '🔗' },
    { text: 'JWT Session Hardening', icon: '🛡️' }
  ];

  const features = [
    {
      icon: FileText,
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-500/5 border-blue-500/10',
      title: 'Documents',
      description: 'Rich markdown notes with instant full-text search capability.'
    },
    {
      icon: Bird,
      iconColor: 'text-sky-400',
      bgColor: 'bg-sky-500/5 border-sky-500/10',
      title: 'Tweets',
      description: 'Capture ideas, insights, and references directly from the stream.'
    },
    {
      icon: TvMinimalPlay,
      iconColor: 'text-red-400',
      bgColor: 'bg-red-500/5 border-red-500/10',
      title: 'YouTube',
      description: 'Bookmark and annotate core knowledge vectors in video assets.'
    },
    {
      icon: Link2,
      iconColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/5 border-emerald-500/10',
      title: 'Web Links',
      description: 'Archive any external reference URL obfuscated with secure tokens.'
    }
  ];

  return (
    <div className="relative min-h-screen bg-bg-base text-text-primary overflow-hidden flex flex-col font-sans">
      {/* Decorative Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand/5 blur-[120px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-brand/5 blur-[120px] pointer-events-none animate-float-reverse" />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-brand/10 p-2 rounded-xl border border-brand/20 group-hover:border-brand/40 transition-colors">
            <Brain className="w-6 h-6 text-brand" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text">
            MemoLink
          </span>
        </Link>

        {/* Use impoted buttons from buttons file */}
        <div className="flex items-center gap-4">
          <Link to="/signin">
            <Button variant="ghost" className="py-2.5 px-5">Sign In</Button>
          </Link>

          <Link to="/signup">
            <Button variant="primary" className="py-2.5 px-5">Initialize Node</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-grow max-w-6xl mx-auto px-6 flex flex-col items-center justify-center text-center mt-12 md:mt-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Trust Badges */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {trustBadges.map((badge, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 border border-brand/20 bg-brand/5 text-brand/80 font-mono text-[11px] px-3.5 py-1.5 rounded-full select-none"
              >
                <span>{badge.icon}</span>
                <span>{badge.text}</span>
              </span>
            ))}
          </motion.div>

          {/* Heading */}
          <motion.h1 
            variants={itemVariants} 
            className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mb-6 text-text-primary"
          >
            Your MemoLink, <br className="hidden sm:inline" />
            Completely <span className="text-brand">Encrypted</span> and Instantly <span className="text-brand">Shareable.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants} 
            className="font-sans text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl mb-10"
          >
            The sanctuary for your digital consciousness. Collect articles, bookmark references, and seamlessly broadcast knowledge vaults to the world.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-20 w-full sm:w-auto justify-center">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full sm:w-auto flex items-center justify-center gap-2">
                Initialize Node <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#features" className="w-full sm:w-auto">
              <Button variant="ghost" className="w-full sm:w-auto">
                View Architecture
              </Button>
            </a>
          </motion.div>

          {/* Features Grid */}
          <motion.section id="features" variants={itemVariants} className="w-full max-w-5xl mb-24">
            <div className="text-left mb-12">
              <span className="font-mono text-xs uppercase tracking-widest text-brand font-bold">SYSTEM METRIC</span>
              <h2 className="font-display text-3xl font-bold mt-1.5">Ecosystem Components</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, idx) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -4 }}
                    className={`p-6 rounded-card border text-left bg-bg-card/40 backdrop-blur-md transition-all duration-300 shadow-card-dark ${feature.bgColor}`}
                  >
                    <div className="flex items-center gap-3.5 mb-3">
                      <div className="p-2.5 rounded-xl bg-bg-base/80 border border-border-subtle">
                        <IconComponent className={`w-5 h-5 ${feature.iconColor}`} />
                      </div>
                      <h3 className="font-display text-lg font-bold">{feature.title}</h3>
                    </div>
                    <p className="font-sans text-sm text-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-border-subtle bg-bg-panel/40 backdrop-blur-md py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="font-mono text-xs uppercase tracking-widest text-brand font-bold">Architect</span>
            <p className="font-display text-lg font-bold mt-1 text-text-primary">Mukul Sahu</p>
            <p className="font-sans text-xs text-text-secondary mt-1">SaaS Engineering & UI/UX Craftsmanship</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 font-mono text-xs">
            <a href="https://github.com/MukulSahu2005/MemoLink" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-text-secondary hover:text-brand transition-colors">
              <Code className="w-3.5 h-3.5" /> GitHub <ArrowUpRight className="w-3 h-3 opacity-50" />
            </a>

            <a href="https://www.linkedin.com/in/mukul-s-65b282310/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-text-secondary hover:text-brand transition-colors">
              <Briefcase className="w-3.5 h-3.5" /> LinkedIn <ArrowUpRight className="w-3 h-3 opacity-50" />
            </a>
            <a href="https://mukul-sahu-portfolio.vercel.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-text-secondary hover:text-brand transition-colors">
              <Globe className="w-3.5 h-3.5" /> Portfolio <ArrowUpRight className="w-3 h-3 opacity-50" />
            </a>
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-text-secondary hover:text-brand transition-colors">
              <Share2 className="w-3.5 h-3.5" /> Instagram <ArrowUpRight className="w-3 h-3 opacity-50" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
