import React from 'react';

export function GlassCard({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`glass-card relative overflow-hidden border-slate-700/50 ${className}`}>
       {children}
    </div>
  );
}
