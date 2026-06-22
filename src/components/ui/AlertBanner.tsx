import React from 'react';

interface AlertBannerProps {
  type?: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ type = 'info', message, onClose, actionLabel, onAction }) => {
  const colors = {
    success: 'bg-green-50 border-green-100 text-green-700',
    error: 'bg-red-50 border-red-100 text-red-700',
    info: 'bg-blue-50 border-blue-100 text-blue-700'
  } as const;

  return (
    <div className={`w-full px-4 py-3 rounded-xl border ${colors[type]} flex items-center justify-between gap-4`}> 
      <div className="text-sm font-medium">{message}</div>
      <div className="flex items-center gap-2">
        {actionLabel && onAction && (
          <button onClick={onAction} className="px-3 py-1 rounded-full bg-white/90 text-sm font-semibold border border-gray-100 hover:opacity-90">
            {actionLabel}
          </button>
        )}
        {onClose && (
          <button onClick={onClose} className="text-sm font-bold text-gray-500 px-2 py-1">Close</button>
        )}
      </div>
    </div>
  );
};

export default AlertBanner;
