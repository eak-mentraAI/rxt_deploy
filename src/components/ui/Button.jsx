import React from 'react';
import { motion } from 'framer-motion';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  onClick,
  disabled = false,
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-rxt-red-primary focus:ring-offset-2';

  const variants = {
    primary: 'bg-gradient-to-r from-rxt-red-primary to-rxt-red-light text-white hover:from-rxt-red-dark hover:to-rxt-red-primary shadow-sm hover:shadow-md disabled:opacity-50',
    secondary: 'bg-white text-rxt-red-primary border-2 border-rxt-red-primary hover:bg-rxt-red-50 disabled:opacity-50',
    ghost: 'bg-transparent text-slate-600 hover:text-rxt-red-primary hover:bg-slate-50 disabled:opacity-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md disabled:opacity-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-xl',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </motion.button>
  );
}
