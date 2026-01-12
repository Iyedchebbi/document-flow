import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAp9a2p4k-OtPKl9yKcMAWoZ2kaILH4z-A",
  authDomain: "docgen-a2d69.firebaseapp.com",
  projectId: "docgen-a2d69",
  storageBucket: "docgen-a2d69.firebasestorage.app",
  messagingSenderId: "510663623768",
  appId: "1:510663623768:web:42d3ccaa0b87c5c80ab62d",
  measurementId: "G-DLZQ5ZWFDL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);