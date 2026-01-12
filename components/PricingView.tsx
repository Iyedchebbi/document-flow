import React from 'react';

interface PricingViewProps {
  onUpgrade: () => void;
  userPlan?: 'free' | 'pro';
}

export const PricingView: React.FC<PricingViewProps> = ({ onUpgrade, userPlan }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 animate-fade-in relative z-10">
      <div className="text-center mb-16">
        <span className="text-rapid-yellow font-bold tracking-wider uppercase text-xs mb-4 inline-block px-3 py-1 bg-yellow-50 rounded-full border border-yellow-100">Plans & Pricing</span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-rapid-black mb-6 tracking-tight">Simple, Transparent Pricing</h2>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">Choose the perfect plan for your document generation needs. <br className="hidden md:block"/> No hidden fees, cancel anytime.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
        {/* Free Plan */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-soft hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col relative overflow-hidden h-full group">
          <div className="mb-4">
            <span className="text-sm font-bold tracking-wider text-slate-400 uppercase">Starter</span>
            <h3 className="text-3xl font-bold text-rapid-black mt-1">Free</h3>
          </div>
          <div className="mb-6 flex items-baseline">
            <span className="text-5xl font-extrabold text-rapid-black">$0</span>
            <span className="text-slate-400 font-medium ml-2">/month</span>
          </div>
          <ul className="space-y-4 mb-10 flex-grow">
            <li className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </span>
              <span className="text-slate-600 font-medium">5 Credits per month</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </span>
              <span className="text-slate-600 font-medium">Standard Templates</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </span>
              <span className="text-slate-600 font-medium">Basic Support</span>
            </li>
          </ul>
          <button className="w-full py-4 rounded-2xl bg-slate-50 text-slate-500 font-bold cursor-default border border-slate-200 hover:bg-slate-100 transition-colors">
            {userPlan === 'free' ? 'Current Plan' : 'Free Plan'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-rapid-black rounded-3xl p-8 border border-rapid-black shadow-2xl flex flex-col relative overflow-hidden text-white transform md:-translate-y-6 hover:-translate-y-8 transition-all duration-500 group">
          {/* Shine effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          
          <div className="absolute top-0 right-0 bg-rapid-yellow text-rapid-black text-xs font-bold px-4 py-2 rounded-bl-xl z-10">POPULAR</div>
          <div className="mb-4 relative z-10">
            <span className="text-sm font-bold tracking-wider text-slate-400 uppercase">Professional</span>
            <h3 className="text-3xl font-bold text-white mt-1">Pro Plan</h3>
          </div>
          <div className="mb-6 flex items-baseline relative z-10">
            <span className="text-5xl font-extrabold text-white">$5</span>
            <span className="text-slate-400 font-medium ml-2">/month</span>
          </div>
          <ul className="space-y-4 mb-10 flex-grow relative z-10">
            <li className="flex items-center gap-3">
              <div className="bg-rapid-yellow rounded-full p-1 flex-shrink-0">
                <svg className="w-3 h-3 text-rapid-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <span className="text-gray-200 font-medium">50 Credits per month</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-rapid-yellow rounded-full p-1 flex-shrink-0">
                <svg className="w-3 h-3 text-rapid-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <span className="text-gray-200 font-medium">Priority Generation</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-rapid-yellow rounded-full p-1 flex-shrink-0">
                <svg className="w-3 h-3 text-rapid-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <span className="text-gray-200 font-medium">Priority Support</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-rapid-yellow rounded-full p-1 flex-shrink-0">
                <svg className="w-3 h-3 text-rapid-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <span className="text-gray-200 font-medium">Document History</span>
            </li>
          </ul>
          <button 
            onClick={onUpgrade}
            disabled={userPlan === 'pro'}
            className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg relative z-10 ${
              userPlan === 'pro' 
              ? 'bg-slate-700 text-slate-300 cursor-default' 
              : 'bg-rapid-yellow text-rapid-black hover:bg-yellow-400 shadow-yellow-500/20 hover:shadow-yellow-500/40 active:scale-95'
            }`}
          >
            {userPlan === 'pro' ? 'Current Plan' : 'Get Access Pro Plan'}
          </button>
        </div>
      </div>
    </div>
  );
};