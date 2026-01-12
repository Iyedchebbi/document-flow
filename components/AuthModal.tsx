import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeUserProfile } from '../services/userService';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await initializeUserProfile(userCredential.user);
      }
      onSuccess();
    } catch (err: any) {
      console.error(err);
      let msg = 'Authentication failed.';
      if (err.code === 'auth/email-already-in-use') msg = 'Email already in use.';
      if (err.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
      if (err.code === 'auth/weak-password') msg = 'Password should be at least 6 characters.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up relative text-rapid-black">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-rapid-yellow rounded-full flex items-center justify-center mx-auto mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rapid-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
               </svg>
            </div>
            <h2 className="text-2xl font-bold text-rapid-black tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              {isLogin ? 'Enter your details to access your docs.' : 'Join to start generating professional documents.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-rapid-yellow focus:ring-1 focus:ring-rapid-yellow outline-none transition-all text-rapid-black placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-rapid-yellow focus:ring-1 focus:ring-rapid-yellow outline-none transition-all text-rapid-black placeholder-gray-400"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-rapid-black font-bold shadow-md transition-all ${
                loading ? 'bg-gray-200 cursor-wait' : 'bg-rapid-yellow hover:bg-yellow-400 hover:shadow-lg'
              }`}
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            {isLogin ? "New here? " : "Already joined? "}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-rapid-black font-bold hover:underline"
            >
              {isLogin ? 'Create Account' : 'Log In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};