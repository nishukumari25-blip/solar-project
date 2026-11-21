import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'whatsapp' | 'danger' | 'ghost' | 'teal'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  className = '',
  disabled = false,
  onClick,
  type = 'button',
}) => {
  let variantStyles = 'bg-[#163A5F] text-white hover:bg-[#112a45] shadow-sm';

  if (variant === 'secondary') {
    variantStyles = 'bg-white text-[#1F2937] border border-[#E2E8F0] hover:bg-slate-50 shadow-sm';
  } else if (variant === 'blue') {
    variantStyles = 'bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm';
  } else if (variant === 'whatsapp') {
    variantStyles = 'bg-[#25D366] text-white hover:bg-[#20ba5a] shadow-sm';
  } else if (variant === 'danger') {
    variantStyles = 'bg-[#DC2626] text-white hover:bg-red-700 shadow-sm';
  } else if (variant === 'teal') {
    variantStyles = 'bg-[#0F9D8A] text-white hover:bg-[#0c7d6e] shadow-sm';
  } else if (variant === 'amber') {
    variantStyles = 'bg-[#F4B740] text-slate-900 hover:bg-[#e0a42f] shadow-sm';
  } else if (variant === 'ghost') {
    variantStyles = 'text-[#64748B] hover:text-[#1F2937] hover:bg-slate-100';
  }

  const sizeStyles = size === 'sm'
    ? 'px-2.5 py-1.5 text-xs'
    : size === 'lg'
    ? 'px-5 py-2.5 text-base'
    : 'px-3.5 py-2 text-sm';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles} ${sizeStyles} ${className}`}
    >
      {Icon && <Icon className={`w-4 h-4 mr-1.5 ${children ? '' : 'mr-0'}`} />}
      {children}
    </button>
  );
};

export default Button;
