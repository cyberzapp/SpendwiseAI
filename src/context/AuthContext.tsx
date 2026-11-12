'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isLiveFirebaseConfigured } from '@/lib/firebase/client';
import { UserProfile, Workspace } from '@/types';
import { DEMO_WORKSPACE } from '@/lib/demo-data';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  currentWorkspace: Workspace;
  workspaces: Workspace[];
  isDemoMode: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  toggleDemoMode: (enable: boolean) => void;
  switchWorkspace: (workspaceId: string) => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const DEMO_PROFILE: UserProfile = {
  uid: 'demo_user_01',
  email: 'founder@example.com',
  displayName: 'Alex Morgan',
  country: 'India',
  preferredCurrency: 'INR',
  timeZone: 'Asia/Kolkata',
  accountType: 'small_business',
  monthlyIncomeRange: '₹3,00,000 - ₹5,00,000',
  primaryGoals: ['Cash Flow Control', 'Runway Expansion', 'Budget Optimization'],
  budgetingPeriod: 'monthly',
  onboardingCompleted: true,
  createdAt: '2026-05-01T09:00:00Z',
  updatedAt: '2026-11-01T09:00:00Z',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(DEMO_PROFILE);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>(DEMO_WORKSPACE);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([DEMO_WORKSPACE]);
  // Default to Demo mode if live Firebase keys are not populated yet
  const [isDemoMode, setIsDemoMode] = useState<boolean>(!isLiveFirebaseConfigured);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // If not configured with production Firebase, provide immediate active demo experience
    if (!isLiveFirebaseConfigured) {
      setIsDemoMode(true);
      setProfile(DEMO_PROFILE);
      setCurrentWorkspace(DEMO_WORKSPACE);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setProfile(snap.data() as UserProfile);
          } else {
            // New user without doc yet
            const initialProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'Finance User',
              country: 'India',
              preferredCurrency: 'INR',
              timeZone: 'Asia/Kolkata',
              accountType: 'freelancer',
              onboardingCompleted: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, initialProfile);
            setProfile(initialProfile);
          }
          setIsDemoMode(false);
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        if (!isDemoMode) {
          setProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isDemoMode]);

  const login = async (email: string, pass: string) => {
    if (!isLiveFirebaseConfigured) {
      // Mock login for developer testing
      setIsDemoMode(true);
      setProfile({
        ...DEMO_PROFILE,
        email,
      });
      return;
    }
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signup = async (email: string, pass: string, name: string) => {
    if (!isLiveFirebaseConfigured) {
      setIsDemoMode(true);
      setProfile({
        ...DEMO_PROFILE,
        email,
        displayName: name,
        onboardingCompleted: false,
      });
      return;
    }
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const initialProfile: UserProfile = {
      uid: cred.user.uid,
      email,
      displayName: name,
      country: 'India',
      preferredCurrency: 'INR',
      timeZone: 'Asia/Kolkata',
      accountType: 'freelancer',
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', cred.user.uid), initialProfile);
    setProfile(initialProfile);
  };

  const loginWithGoogle = async () => {
    if (!isLiveFirebaseConfigured) {
      setIsDemoMode(true);
      return;
    }
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    if (isLiveFirebaseConfigured) {
      await firebaseSignOut(auth);
    }
    setUser(null);
    setProfile(null);
    setIsDemoMode(false);
  };

  const resetPassword = async (email: string) => {
    if (isLiveFirebaseConfigured) {
      await sendPasswordResetEmail(auth, email);
    }
  };

  const toggleDemoMode = (enable: boolean) => {
    setIsDemoMode(enable);
    if (enable) {
      setProfile(DEMO_PROFILE);
      setCurrentWorkspace(DEMO_WORKSPACE);
    }
  };

  const switchWorkspace = (workspaceId: string) => {
    const found = workspaces.find((w) => w.id === workspaceId);
    if (found) {
      setCurrentWorkspace(found);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (profile) {
      const updated = { ...profile, ...data, updatedAt: new Date().toISOString() };
      setProfile(updated);
      if (user && isLiveFirebaseConfigured) {
        await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        currentWorkspace,
        workspaces,
        isDemoMode,
        loading,
        login,
        signup,
        loginWithGoogle,
        logout,
        resetPassword,
        toggleDemoMode,
        switchWorkspace,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
