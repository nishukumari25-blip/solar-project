import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, AlertCircle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'primary' | 'warning'
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : variant === 'warning' ? 'amber' : 'primary'}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            disabled={isLoading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full shrink-0 ${variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
          {variant === 'danger' ? <AlertCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
        </div>
        <div>
          <p className="text-sm text-[#1F2937] leading-relaxed">{message}</p>
          <p className="text-xs text-[#64748B] mt-2 font-medium">This action cannot be undone and will be logged in the system audit trail.</p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
