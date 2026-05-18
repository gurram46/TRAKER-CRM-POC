import React, { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose, duration = 3000 }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Small delay for enter animation
      requestAnimationFrame(() => setShow(true));
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 200);
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <div
        className={`flex items-center gap-3 bg-status-success/15 border border-status-success/30 backdrop-blur-md rounded-lg px-5 py-3.5 shadow-dropdown transition-all duration-200
          ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
      >
        <CheckCircle size={18} className="text-status-success flex-shrink-0" />
        <span className="text-sm font-body font-medium text-status-success">{message}</span>
        <button
          onClick={() => { setShow(false); setTimeout(onClose, 200); }}
          className="ml-2 text-status-success/60 hover:text-status-success transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
