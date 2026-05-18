import React, { useState, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import Modal from './Modal';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientPhone?: string;
  defaultMessage: string;
  onSend: () => void;
}

const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  recipientPhone,
  defaultMessage,
  onSend,
}) => {
  const [message, setMessage] = useState(defaultMessage);

  useEffect(() => {
    setMessage(defaultMessage);
  }, [defaultMessage]);

  const handleSend = () => {
    onSend();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Send via WhatsApp"
      width="max-w-lg"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-body text-text-secondary border border-border rounded-md hover:bg-bg-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="flex items-center gap-2 px-4 py-2 text-sm font-body font-medium text-white bg-[#25D366] hover:bg-[#1DA851] rounded-md transition-colors"
          >
            <Send size={14} />
            Send via WhatsApp
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Recipient Info */}
        <div className="flex items-center gap-3 bg-bg-primary border border-border rounded-md p-3">
          <div className="w-10 h-10 rounded-full bg-[#25D366]/15 flex items-center justify-center">
            <MessageCircle size={18} className="text-[#25D366]" />
          </div>
          <div>
            <p className="text-sm font-body font-medium text-text-primary">{recipientName}</p>
            {recipientPhone && (
              <p className="text-xs font-mono text-text-secondary">{recipientPhone}</p>
            )}
          </div>
        </div>

        {/* Message Template */}
        <div>
          <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">
            Message Template
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="w-full bg-bg-primary border border-border rounded-md py-3 px-3 text-sm font-body text-text-primary resize-none leading-relaxed"
          />
        </div>

        {/* Template hint */}
        <p className="text-[11px] font-body text-text-muted">
          💡 You can edit the message above before sending. The message will be queued for delivery via WhatsApp Business API.
        </p>
      </div>
    </Modal>
  );
};

export default WhatsAppModal;
