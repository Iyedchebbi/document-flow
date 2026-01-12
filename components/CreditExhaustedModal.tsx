import React from 'react';

interface CreditExhaustedModalProps {
  onClose: () => void;
  onUpgrade: () => void;
  isLoading: boolean;
}

export const CreditExhaustedModal: React.FC<CreditExhaustedModalProps> = ({ onClose, onUpgrade, isLoading }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up relative text-center">
        
        {/* Decorative Top Pattern */}
        <div className="h-2 bg-rapid-yellow w-full"></div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 pb-6">
          <div className="mx-auto w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-6 shadow-sm relative group border border-yellow-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-rapid-yellow group-hover:scale-110 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
             <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-bounce">
              0
            </div>
          </div>

          <h2 className="text-2xl font-bold text-rapid-black mb-2">Out of Credits</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            You've used all your free credits. Upgrade to <span className="text-rapid-yellow font-bold">Pro</span> to continue generating.
          </p>

          <div className="space-y-3">
            <button 
              onClick={onUpgrade}
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-rapid-black text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 transform active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? 'Processing...' : 'Get More Credits'}
            </button>
            
            <button 
              onClick={onClose}
              className="w-full py-3 px-4 text-gray-500 hover:text-rapid-black transition-colors text-sm font-medium"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};