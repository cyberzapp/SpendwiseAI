import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 select-none';

    const variants = {
      primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs dark:bg-emerald-600 dark:hover:bg-emerald-500',
      secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100',
      outline: 'border border-slate-200 bg-transparent hover:bg-slate-100 text-slate-800 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-200',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 dark:hover:bg-slate-800 dark:text-slate-300',
      danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs dark:bg-rose-600 dark:hover:bg-rose-500',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
      md: 'h-9 px-4 text-sm rounded-lg gap-2',
      lg: 'h-11 px-5 text-base rounded-lg gap-2.5',
      icon: 'h-9 w-9 rounded-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
