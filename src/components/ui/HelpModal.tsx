import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-[var(--border)]">
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Help & FAQ</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">Close</button>
        </div>
        <div className="space-y-4 text-sm text-gray-600">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <strong className="block text-gray-900 mb-1">How do I place an order?</strong>
            <p>Simply sign in, browse our collection, add your favorite finds to your cart, and proceed to checkout.</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <strong className="block text-gray-900 mb-1">Do you offer Cash on Delivery?</strong>
            <p>Yes! We currently support Cash on Delivery (COD) as our primary payment method.</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <strong className="block text-gray-900 mb-1">How do I check my orders?</strong>
            <p>Once you are signed in, you can view your order history and status under the "My Orders" section.</p>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button onClick={onClose} className="px-6 py-3 rounded-xl bg-[var(--brown)] text-white hover:bg-[var(--sienna)] font-bold transition-all w-full">
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
