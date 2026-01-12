import React, { useState } from 'react';
import { UserProfile } from '../types';
import { updateUserProfile } from '../services/userService';

interface ProfileModalProps {
  user: UserProfile;
  onClose: () => void;
  onUpdate: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onUpdate }) => {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [photoURL, setPhotoURL] = useState(user.photoURL || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateUserProfile(user.uid, {
        displayName,
        photoURL
      });
      await onUpdate();
      onClose();
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  const avatarPreview = photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || user.email || 'User')}&background=F4C430&color=1A1A1A`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up relative text-rapid-black">
        <div className="bg-gray-50 border-b border-gray-100 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-rapid-black">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24 mb-4 group">
              <img 
                src={avatarPreview} 
                alt="Profile Preview" 
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-md ring-1 ring-gray-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || 'U')}&background=F4C430&color=1A1A1A`;
                }}
              />
            </div>
            <p className="text-sm text-gray-500 font-medium">{user.email}</p>
            <div className="mt-2 flex gap-2">
              <span className="px-3 py-1 bg-rapid-yellow/10 text-yellow-700 text-xs font-bold rounded-full uppercase tracking-wide border border-yellow-200">
                {user.plan} Plan
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wide border border-blue-100">
                {user.credits} Credits
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:border-rapid-yellow focus:ring-1 focus:ring-rapid-yellow outline-none transition-all text-rapid-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Photo URL</label>
            <input
              type="url"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="https://example.com/my-photo.jpg"
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:border-rapid-yellow focus:ring-1 focus:ring-rapid-yellow outline-none transition-all text-sm font-mono text-gray-600"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl text-rapid-black font-bold shadow-md transition-all flex justify-center items-center ${
                isLoading ? 'bg-gray-200 cursor-wait' : 'bg-rapid-yellow hover:bg-yellow-400'
              }`}
            >
              {isLoading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};