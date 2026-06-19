import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
};

export function Button({ children, variant = 'primary', fullWidth, className = '', ...props }: ButtonProps) {
  const base = "flex justify-center items-center gap-3 p-4 rounded-xl font-mono font-bold uppercase tracking-widest transition-all";
  
  const variants = {
    primary: "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]",
    secondary: "bg-slate-800 text-white hover:bg-slate-700 border border-slate-600",
    ghost: "text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${base} ${variants[variant]} ${widthClass} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
