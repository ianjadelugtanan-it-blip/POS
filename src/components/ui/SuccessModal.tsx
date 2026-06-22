import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-cascade">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-charcoal/60 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-2 border-sand/30 overflow-hidden">

        {/* Texture Overlay */}
        <div className="texture-overlay absolute inset-0 opacity-10 pointer-events-none" />
        
        <div className="relative p-8 text-center">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-text-light hover:text-sienna transition-colors rounded-full hover:bg-parchment"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="mx-auto w-20 h-20 bg-olive/10 rounded-full flex items-center justify-center mb-6 animate-tag-swing">
            <CheckCircle2 className="w-10 h-10 text-olive" />
          </div>

          {/* Text Content */}
          <h3 className="text-2xl font-bold text-brown mb-3 tracking-tight leading-tight">
            {title}
          </h3>
          <p className="text-text-muted mb-8 leading-relaxed">
            {message}
          </p>

          {/* Action Button */}
          <button 
            onClick={onClose}
            className="w-full btn-primary py-3.5 shadow-lg shadow-sienna/20 hover:shadow-sienna/40 transition-all"
          >
            Got it, thanks!
          </button>
        </div>

        {/* Decorative bottom bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-sienna via-olive to-rust" />
      </div>
    </div>
  );
};
