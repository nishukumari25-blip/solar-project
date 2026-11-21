import React from 'react';

export const Card = ({ children, className = '', title, subtitle, headerAction }) => {
  return (
    <div className={`bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50/50">
          <div>
            {title && <h3 className="text-sm font-semibold text-[#1F2937]">{title}</h3>}
            {subtitle && <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
};

export default Card;
