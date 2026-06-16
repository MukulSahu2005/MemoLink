import type{ HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'subtle' | 'online' | 'offline' | 'error';
}

export const Badge = ({ children, className, variant = 'brand', ...props }: BadgeProps) => {
  const baseStyle = 'inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-0.5 rounded-full select-none border font-medium';
  
  const variants = {
    brand: 'bg-brand/10 text-brand border-brand/20',
    subtle: 'bg-bg-base text-text-secondary border-border-subtle',
    online: 'bg-status-online/10 text-status-online border-status-online/30',
    offline: 'bg-status-offline/10 text-status-offline border-status-offline/30',
    error: 'bg-status-error/10 text-status-error border-status-error/30',
  };

  return (
    <span className={cn(baseStyle, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};
