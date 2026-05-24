import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold">Quick Start / Help</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>
        <div className="space-y-3 text-sm text-gray-700">
          <p><strong>Local backend:</strong> Start your PHP server (XAMPP/Apache + MySQL) and import <em>database_setup.sql</em>.</p>
          <p><strong>Dev server:</strong> Run <code>npm run dev</code> and open the app in the browser.</p>
          <p><strong>Sample accounts:</strong> use <strong>admin</strong> and <strong>client</strong> seeded accounts for demoing roles.</p>
          <p><strong>Where to demo:</strong> Shop → add to cart → Checkout; Admin → Manage Staff → Add Account / Revoke.</p>
          <p className="text-xs text-gray-500">This modal is a quick reference for demonstrators; full docs are in the repo README.</p>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-100 font-semibold">Got it</button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
