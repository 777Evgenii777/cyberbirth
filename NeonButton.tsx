import React from 'react';
import { Loader2 } from 'lucide-react';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const NeonButton: React.FC<NeonButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  icon, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden px-6 py-3 rounded-lg font-bold uppercase tracking-widest transition-all duration-300 transform hover:scale-105 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-transparent border border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)] hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:text-cyan-100",
    secondary: "bg-transparent border border-purple-500 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)] hover:bg-purple-500/10 hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:text-purple-100",
    danger: "bg-transparent border border-red-500 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)] hover:bg-red-500/10 hover:shadow-[0_0_20px_rgba(239,68,68,0.6)] hover:text-red-100"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : icon}
      <span>{children}</span>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite]"></div>
    </button>
  );
};

export default NeonButton;