import React from 'react';

export function Badge({ children, variant = 'success', className = '' }: { children: React.ReactNode, variant?: 'success' | 'warning' | 'danger' | 'info', className?: string }) {
  
  const variants = {
    success: 'border-[var(--color-primary)]/40 text-[var(--color-primary)] bg-[var(--color-primary)]/5',
    warning: 'border-yellow-500/40 text-yellow-500 bg-yellow-500/5',
    danger: 'border-orange-500/40 text-orange-500 bg-orange-500/5',
    info: 'border-[var(--color-accent)]/40 text-[var(--color-accent)] bg-[var(--color-accent)]/5',
  };

  return (
    <span className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded uppercase tracking-wider border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
