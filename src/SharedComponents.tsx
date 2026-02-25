
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, action }) => (
  <div className={`glass-panel rounded-xl p-6 transition-all duration-300 ${className}`}>
    {(title || action) && (
      <div className="flex justify-between items-center mb-6 border-b border-gold-500/10 pb-3 shrink-0">
        {title && <h3 className="text-gold-100 font-serif text-xl tracking-widest font-bold drop-shadow-sm">{title}</h3>}
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="text-gray-300 flex-1 min-h-0 relative">{children}</div>
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-5 py-2.5 rounded-lg font-bold transition-all duration-300 uppercase tracking-widest text-xs shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-gold-shine text-black hover:scale-105 shadow-gold-500/20 border border-gold-300/50",
    secondary: "bg-transparent border border-gold-600 text-gold-400 hover:bg-gold-500/10 hover:border-gold-300 hover:text-gold-200",
    danger: "bg-red-950/80 border border-red-900 text-red-400 hover:bg-red-900 hover:text-red-200",
    success: "bg-green-950/80 border border-green-900 text-green-400 hover:bg-green-900 hover:text-green-200",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5 shadow-none"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Badge: React.FC<{ status: string }> = ({ status }) => {
  let colorClass = "bg-gray-900/80 text-gray-400 border-gray-700";
  
  if (status.includes('PENDING')) colorClass = "bg-amber-950/40 text-amber-200 border-amber-800/60 shadow-[0_0_10px_rgba(245,158,11,0.1)]";
  if (status.includes('READY')) colorClass = "bg-emerald-950/40 text-emerald-300 border-emerald-800/60 shadow-[0_0_10px_rgba(16,185,129,0.1)]";
  if (status === 'DELIVERED') colorClass = "bg-blue-950/40 text-blue-300 border-blue-800/60 shadow-[0_0_10px_rgba(59,130,246,0.1)]";
  if (status === 'VIP') colorClass = "bg-purple-950/60 text-purple-200 border-purple-500/50 animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.2)]";
  if (status === 'ACTIVE') colorClass = "bg-gold-900/20 text-gold-300 border-gold-700/50";

  return (
    <span className={`px-2.5 py-1 rounded text-[10px] font-bold border tracking-wider uppercase backdrop-blur-sm ${colorClass}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <div className="relative group">
    <input 
      {...props}
      className={`w-full bg-zinc-900 border border-white/20 rounded-lg p-3 text-white placeholder-gray-500 focus:border-gold-500/80 focus:outline-none focus:ring-1 focus:ring-gold-500/50 transition-all duration-300 backdrop-blur-md shadow-inner ${props.className}`}
    />
    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gold-500/10 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 -z-10 blur-sm" />
  </div>
);
