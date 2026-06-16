import type{ InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, startAdornment, endAdornment, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label className="font-mono text-xs uppercase tracking-widest text-text-secondary select-none">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full rounded-btn overflow-hidden border-2 border-transparent focus-within:border-brand transition-all duration-200 shadow-sm bg-white text-text-dark">
          {startAdornment && (
            <div className="flex items-center justify-center pl-4 pr-1 text-text-secondary/60 font-mono text-sm select-none">
              {startAdornment}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              "w-full bg-transparent px-4 py-3 font-mono text-sm focus:outline-none placeholder:text-text-secondary/40 text-text-dark",
              startAdornment && "pl-1",
              endAdornment && "pr-12",
              className
            )}
            {...props}
          />
          {endAdornment && (
            <div className="absolute right-3 flex items-center justify-center text-text-secondary/60 cursor-pointer select-none">
              {endAdornment}
            </div>
          )}
        </div>
        {error && (
          <span className="font-mono text-xs text-status-error">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
