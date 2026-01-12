import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, increment, collection, addDoc, getDocs, query, orderBy, deleteDoc, writeBatch } from 'firebase/firestore';
import { UserProfile, GeneratedDocument } from '../types';
import { User } from 'firebase/auth';

export const initializeUserProfile = async (user: User): Promise<UserProfile> => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  } else {
    // New user: Create profile with 5 free credits
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      credits: 5,
      plan: 'free',
    };
    
    await setDoc(userRef, {
      ...newProfile,
      createdAt: new Date().toISOString()
    });
    
    return newProfile;
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  return null;
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, data);
};

export const deductCredit = async (uid: string): Promise<boolean> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) return false;
  
  const userData = userSnap.data() as UserProfile;
  
  if (userData.credits > 0) {
    await updateDoc(userRef, {
      credits: increment(-1)
    });
    return true;
  }
  
  return false;
};

export const addCredits = async (uid: string, amount: number): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    credits: increment(amount),
    plan: 'pro' // Upgrade plan status as well for the mock
  });
};

export const saveDocument = async (uid: string, docData: GeneratedDocument): Promise<string> => {
  try {
    const docsRef = collection(db, 'users', uid, 'documents');
    const docWithTimestamp = {
      ...docData,
      createdAtTimestamp: new Date() // Use server timestamp logic or simple date for ordering
    };
    const docRef = await addDoc(docsRef, docWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error("Error saving document:", error);
    throw error;
  }
};

export const getUserDocuments = async (uid: string): Promise<GeneratedDocument[]> => {
  try {
    const docsRef = collection(db, 'users', uid, 'documents');
    const q = query(docsRef, orderBy('createdAtTimestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as GeneratedDocument));
  } catch (error) {
    console.error("Error fetching documents:", error);
    // Fallback if index is missing or error
    return [];
  }
};

export const deleteDocument = async (uid: string, docId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'users', uid, 'documents', docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

export const deleteAllUserDocuments = async (uid: string): Promise<void> => {
  try {
    const docsRef = collection(db, 'users', uid, 'documents');
    const snapshot = await getDocs(docsRef);
    
    if (snapshot.empty) return;

    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  } catch (error) {
    console.error("Error deleting all documents:", error);
    throw error;
  }
};