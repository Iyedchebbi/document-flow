import React from 'react';

export const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-md animate-fade-in">
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 mb-6">
           {/* Document Icon Animation */}
           <svg className="w-full h-full text-rapid-yellow animate-pulse-slow opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
             <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
           </svg>
           {/* Pen Animation */}
           <div className="absolute -right-2 bottom-0 animate-bounce">
             <svg className="w-10 h-10 text-rapid-black drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
               <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
             </svg>
           </div>
        </div>
        <h2 className="text-2xl font-bold text-rapid-black mb-2 tracking-wide">Drafting Document...</h2>
        <p className="text-gray-500 animate-pulse font-medium">Consulting legal templates & formatting</p>
      </div>
    </div>
  );
};