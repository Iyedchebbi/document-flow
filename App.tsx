import React, { useState, useCallback, useEffect } from 'react';
import { AppStep, GeneratedDocument, SignatureData, UserProfile } from './types';
import { generateDocumentContent } from './services/geminiService';
import { DocumentView } from './components/DocumentView';
import { SignaturePad } from './components/SignaturePad';
import { LoadingOverlay } from './components/LoadingOverlay';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { CreditExhaustedModal } from './components/CreditExhaustedModal';
import { HistoryView } from './components/HistoryView';
import { PricingView } from './components/PricingView';
import { auth } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { initializeUserProfile, getUserProfile, deductCredit, addCredits, saveDocument } from './services/userService';

const EXAMPLE_PROMPTS = [
  "Resignation letter effective in 2 weeks",
  "Freelance web design contract",
  "Letter of recommendation",
  "Non-Disclosure Agreement (NDA)",
  "Consulting Invoice"
];

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.IDLE);
  const [prompt, setPrompt] = useState('');
  const [generatedDoc, setGeneratedDoc] = useState<GeneratedDocument | null>(null);
  const [signature, setSignature] = useState<SignatureData | null>(null);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  
  // Auth & User State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Monitor Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setIsLoadingUser(true);
      if (currentUser) {
        try {
          const profile = await initializeUserProfile(currentUser);
          setUserProfile(profile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserProfile(null);
      }
      setIsLoadingUser(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (auth.currentUser) {
      const profile = await getUserProfile(auth.currentUser.uid);
      if (profile) setUserProfile(profile);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    if (!userProfile) {
      setIsAuthModalOpen(true);
      return;
    }

    if (userProfile.credits <= 0) {
      setIsCreditModalOpen(true);
      return;
    }

    setStep(AppStep.GENERATING);
    try {
      const doc = await generateDocumentContent(prompt);
      
      const success = await deductCredit(userProfile.uid);
      if (success) {
        // Save document to history
        await saveDocument(userProfile.uid, doc);
        
        await refreshProfile();
        setGeneratedDoc(doc);
        setStep(AppStep.PREVIEW);
      } else {
        throw new Error("Credit deduction failed");
      }

    } catch (error) {
      console.error(error);
      alert('Failed to generate document. Please try again.');
      setStep(AppStep.IDLE);
    }
  };

  const handleUpgrade = async () => {
    if (!userProfile) {
      setIsAuthModalOpen(true);
      return;
    }
    
    setIsUpgrading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
      await addCredits(userProfile.uid, 10);
      await refreshProfile();
      setIsCreditModalOpen(false);
      alert("Successfully upgraded to Pro! 50 credits added.");
    } catch (error) {
      console.error("Upgrade failed:", error);
      alert("Something went wrong with the upgrade.");
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleSignatureSave = (dataUrl: string) => {
    setSignature({
      dataUrl,
      timestamp: new Date().toISOString()
    });
    setIsSignatureModalOpen(false);
  };

  const handleDocumentUpdate = (updatedDoc: GeneratedDocument) => {
    setGeneratedDoc(updatedDoc);
  };

  const handleReset = useCallback(() => {
    setStep(AppStep.IDLE);
    setPrompt('');
    setGeneratedDoc(null);
    setSignature(null);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    handleReset();
  };

  const getAvatarUrl = () => {
    if (userProfile?.photoURL) return userProfile.photoURL;
    const name = userProfile?.displayName || userProfile?.email || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F4C430&color=0F172A`;
  };

  // Handler for History Selection
  const handleSelectFromHistory = (doc: GeneratedDocument) => {
    setGeneratedDoc(doc);
    setStep(AppStep.PREVIEW);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-rapid-bg text-rapid-black selection:bg-rapid-yellow selection:text-black">
      
      {/* Abstract Background Blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-rapid-yellow/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 animate-blob"></div>
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/2 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-purple-100/30 rounded-full blur-[80px] translate-y-1/3 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className={`absolute inset-0 transition-all duration-300 ${step === AppStep.IDLE && !window.scrollY ? 'bg-transparent' : 'glass-morphism border-b border-white/20'}`}></div>
            
            <div className="relative z-10 flex items-center gap-2 cursor-pointer group" onClick={handleReset}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rapid-yellow to-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-500/20 transition-transform group-hover:scale-105">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                 </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-rapid-black">Document Flow</span>
            </div>

            <div className="relative z-10 flex items-center gap-8">
               <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
                  <button onClick={handleReset} className={`hover:text-rapid-black transition-colors relative ${step === AppStep.IDLE ? 'text-rapid-black font-semibold' : ''}`}>
                    Home
                    {step === AppStep.IDLE && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-rapid-yellow rounded-full"></span>}
                  </button>
                  <button onClick={() => setStep(AppStep.HISTORY)} className={`hover:text-rapid-black transition-colors relative ${step === AppStep.HISTORY ? 'text-rapid-black font-semibold' : ''}`}>
                    History
                    {step === AppStep.HISTORY && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-rapid-yellow rounded-full"></span>}
                  </button>
                  <button onClick={() => setStep(AppStep.PRICING)} className={`hover:text-rapid-black transition-colors relative ${step === AppStep.PRICING ? 'text-rapid-black font-semibold' : ''}`}>
                    Pricing
                    {step === AppStep.PRICING && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-rapid-yellow rounded-full"></span>}
                  </button>
               </nav>

              {isLoadingUser ? (
                <div className="h-10 w-24 bg-slate-200 animate-pulse rounded-full"></div>
              ) : userProfile ? (
                <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                  {/* Credits */}
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200 shadow-sm backdrop-blur-sm">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-rapid-black font-bold text-sm">{userProfile.credits}</span>
                      <span className="text-slate-400 text-xs font-semibold uppercase">Credits</span>
                  </div>

                  {/* Profile */}
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsProfileModalOpen(true)}
                      className="group relative"
                    >
                      <img 
                        src={getAvatarUrl()} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md transition-transform group-hover:scale-105"
                      />
                    </button>
                    
                    <button 
                      onClick={handleLogout}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                      title="Log Out"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-6 py-2.5 rounded-full bg-rapid-black text-white font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 text-sm"
                >
                  Sign In
                </button>
              )}
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col relative z-10 pt-20">
        
        {step === AppStep.IDLE && (
          <div className="flex flex-col items-center justify-center flex-grow px-6 py-20 relative">
             
             <div className="max-w-4xl mx-auto text-center z-10 animate-slide-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 border border-yellow-100 mb-8 animate-fade-in">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                  </span>
                  <span className="text-xs font-bold text-yellow-700 uppercase tracking-wide">AI-Powered Generation 2.0</span>
                </div>

                <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-rapid-black mb-8 leading-[1.1] tracking-tight">
                  Intelligent Documents, <br />
                  <span className="text-gradient-gold relative">
                    Effortless Flow.
                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-yellow-300/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                       <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                    </svg>
                  </span>
                </h1>
                
                <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                  Transform your business operations with our next-gen drafting engine. 
                  Create professional contracts, invoices, and letters in seconds.
                </p>

                {/* Input Area */}
                <div className="max-w-2xl mx-auto relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-white rounded-2xl shadow-glass flex items-center p-2 border border-slate-100 transition-transform focus-within:scale-[1.01]">
                    <div className="flex-grow relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe the document you need..."
                        className="w-full pl-12 pr-4 py-4 text-lg text-rapid-black placeholder-slate-400 bg-transparent focus:outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                      />
                    </div>
                    <button
                      onClick={handleGenerate}
                      disabled={!prompt.trim()}
                      className="px-8 py-3.5 bg-rapid-black text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 whitespace-nowrap flex items-center gap-2"
                    >
                      <span>Generate</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Example Tags */}
                <div className="mt-10 flex flex-wrap justify-center gap-3 animate-fade-in delay-200">
                  <span className="text-sm font-semibold text-slate-400 mr-2">Popular:</span>
                  {EXAMPLE_PROMPTS.slice(0, 3).map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPrompt(example)}
                      className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-full text-xs font-semibold text-slate-600 hover:border-rapid-yellow hover:text-rapid-black hover:bg-white transition-all shadow-sm"
                    >
                      {example}
                    </button>
                  ))}
                </div>
             </div>
          </div>
        )}

        {step === AppStep.GENERATING && <LoadingOverlay />}

        {step === AppStep.PREVIEW && generatedDoc && (
          <div className="w-full py-8 px-4 md:px-0">
            <DocumentView 
              document={generatedDoc}
              signature={signature}
              onOpenSignature={() => setIsSignatureModalOpen(true)}
              onReset={handleReset}
              onUpdate={handleDocumentUpdate}
            />
          </div>
        )}

        {step === AppStep.HISTORY && (
          userProfile ? (
            <HistoryView userId={userProfile.uid} onSelectDocument={handleSelectFromHistory} />
          ) : (
             <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
               <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                 </svg>
               </div>
               <h2 className="text-3xl font-bold text-rapid-black mb-4">Authentication Required</h2>
               <p className="text-slate-500 mb-8 max-w-md text-center">Please log in to your account to view your securely stored document history.</p>
               <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="px-8 py-3 bg-rapid-yellow text-rapid-black font-bold rounded-full hover:bg-yellow-400 shadow-glow transition-all"
               >
                 Log In / Sign Up
               </button>
             </div>
          )
        )}

        {step === AppStep.PRICING && (
          <PricingView 
            onUpgrade={handleUpgrade} 
            userPlan={userProfile?.plan} 
          />
        )}
      </main>

      {/* Signature Modal */}
      {isSignatureModalOpen && (
        <SignaturePad 
          onSave={handleSignatureSave}
          onCancel={() => setIsSignatureModalOpen(false)}
        />
      )}

      {/* Authentication Modal */}
      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => setIsAuthModalOpen(false)}
        />
      )}

      {/* Profile Modal */}
      {isProfileModalOpen && userProfile && (
        <ProfileModal 
          user={userProfile}
          onClose={() => setIsProfileModalOpen(false)}
          onUpdate={refreshProfile}
        />
      )}

      {/* Out of Credits Modal */}
      {isCreditModalOpen && (
        <CreditExhaustedModal 
          onClose={() => setIsCreditModalOpen(false)}
          onUpgrade={handleUpgrade}
          isLoading={isUpgrading}
        />
      )}

      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm no-print relative z-10 border-t border-slate-100 bg-white/50 backdrop-blur-sm">
        <p>&copy; {new Date().getFullYear()} Document Flow. Engineered for Excellence.</p>
      </footer>

    </div>
  );
};

export default App;