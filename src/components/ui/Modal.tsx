import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, width = 'max-w-2xl' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm modal-backdrop"
        onClick={onClose}
      />
      {/* Content */}
      <div className={`relative w-full ${width} mx-4 bg-bg-secondary border border-border rounded-lg shadow-dropdown modal-content max-h-[85vh] flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-display font-semibold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors duration-150"
          >
            <X size={18} />
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {children}
        </div>
        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
