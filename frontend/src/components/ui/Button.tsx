import type{ ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  isLoading?: boolean;
}

export const Button = ({
  children,
  className,
  variant = 'primary',
  isLoading = false,
  ...props
}: ButtonProps) => {
  const baseStyle = 'font-mono uppercase tracking-widest text-sm py-3 px-6 rounded-btn transition-colors duration-200 flex items-center justify-center gap-2 select-none focus:outline-none';
  
  const variants = {
    primary: 'bg-brand text-white hover:bg-brand-hover shadow-brand-glow focus:shadow-input-focus',
    ghost: 'border border-border-subtle text-text-primary bg-transparent hover:bg-border-subtle focus:bg-border-subtle',
    danger: 'bg-status-error/10 text-status-error border border-status-error/30 hover:bg-status-error/20 focus:bg-status-error/20',
  };

  return (
    <motion.button
      whileHover={props.disabled || isLoading ? {} : { scale: 1.02 }}
      whileTap={props.disabled || isLoading ? {} : { scale: 0.97 }}
      className={cn(baseStyle, variants[variant], className)}
      disabled={props.disabled || isLoading}
      {...(props as any)}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};
