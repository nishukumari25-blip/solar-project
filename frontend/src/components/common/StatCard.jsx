import React from 'react';
import { useNavigate } from 'react-router-dom';

export const StatCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  color = 'blue', // 'blue' | 'amber' | 'emerald' | 'rose' | 'teal' | 'navy'
  targetPath,
  alertCount,
}) => {
  const navigate = useNavigate();

  const colorStyles = {
    blue: 'border-l-4 border-l-blue-500 bg-blue-50 text-blue-600',
    amber: 'border-l-4 border-l-amber-500 bg-amber-50 text-amber-600',
    emerald: 'border-l-4 border-l-emerald-500 bg-emerald-50 text-emerald-600',
    rose: 'border-l-4 border-l-rose-500 bg-rose-50 text-rose-600',
    teal: 'border-l-4 border-l-[#0F9D8A] bg-teal-50 text-[#0F9D8A]',
    navy: 'border-l-4 border-l-[#163A5F] bg-slate-100 text-[#163A5F]',
  };

  const handleClick = () => {
    if (targetPath) navigate(targetPath);
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm transition-all hover:shadow-md cursor-pointer ${colorStyles[color]?.split(' ')[0]}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">{title}</span>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorStyles[color]?.split(' ').slice(1).join(' ')}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline justify-between">
        <div className="text-2xl font-bold tracking-tight text-[#1F2937]">{value}</div>
        {alertCount !== undefined && alertCount > 0 && (
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 animate-pulse">
            {alertCount} Delayed
          </span>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-1 flex items-center text-xs text-[#64748B]">
          {trend && <span className="font-medium mr-1 text-emerald-600">{trend}</span>}
          <span>{subtext}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
