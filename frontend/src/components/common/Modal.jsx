import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl', // 'max-w-md' | 'max-w-xl' | 'max-w-2xl' | 'max-w-4xl'
  footer,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden transform transition-all flex flex-col max-h-[90vh]`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50/75 sticky top-0 z-10">
            <div>
              <h3 className="text-base font-semibold text-[#1F2937]">{title}</h3>
              {subtitle && <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#1F2937] hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-3.5 border-t border-[#E2E8F0] bg-slate-50 flex items-center justify-end gap-2.5 sticky bottom-0 z-10">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
