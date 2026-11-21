import React from 'react';

export const StatusBadge = ({ status, size = 'sm' }) => {
  if (!status) return null;

  const normalized = String(status).toLowerCase();
  
  let colorStyle = 'bg-slate-100 text-slate-700 border-slate-200'; // Default Neutral

  if (
    normalized.includes('won') ||
    normalized.includes('done') ||
    normalized.includes('paid') ||
    normalized.includes('approved') ||
    normalized.includes('matched') ||
    normalized.includes('completed')
  ) {
    colorStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (
    normalized.includes('pending') ||
    normalized.includes('in progress') ||
    normalized.includes('due') ||
    normalized.includes('partially') ||
    normalized.includes('waiting') ||
    normalized.includes('negotiation') ||
    normalized.includes('contacted') ||
    normalized.includes('submitted') ||
    normalized.includes('applied') ||
    normalized.includes('sanctioned')
  ) {
    colorStyle = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (
    normalized.includes('delayed') ||
    normalized.includes('overdue') ||
    normalized.includes('stuck') ||
    normalized.includes('lost') ||
    normalized.includes('rejected') ||
    normalized.includes('mismatch') ||
    normalized.includes('cancelled')
  ) {
    colorStyle = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (
    normalized.includes('scheduled') ||
    normalized.includes('sent') ||
    normalized.includes('commissioned') ||
    normalized.includes('active') ||
    normalized.includes('issued') ||
    normalized.includes('new')
  ) {
    colorStyle = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (
    normalized.includes('closed') ||
    normalized.includes('not started') ||
    normalized.includes('draft') ||
    normalized.includes('not applicable')
  ) {
    colorStyle = 'bg-slate-100 text-slate-700 border-slate-200';
  }

  const sizeClasses = size === 'xs' 
    ? 'px-2 py-0.5 text-[11px]' 
    : size === 'md' 
    ? 'px-3 py-1 text-xs' 
    : 'px-2.5 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${sizeClasses} ${colorStyle}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {status}
    </span>
  );
};

export default StatusBadge;
