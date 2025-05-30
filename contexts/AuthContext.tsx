'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  plan: string | null;
  // Add other profile fields you need
}

export interface AppUser extends SupabaseUser {
  profile?: Profile | null;
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
  clearAllSessions: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    const fetchSessionAndProfile = async (currentSession: Session | null, isInitialLoad = false) => {
      console.log('fetchSessionAndProfile called:', { 
        hasSession: !!currentSession, 
        isInitialLoad, 
        userId: currentSession?.user?.id 
      });
      
      if (currentSession?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error.message);
          setUser({ ...currentSession.user, profile: null });
          setIsAdmin(false);
        } else {
          setUser({ ...currentSession.user, profile });
          setIsAdmin(profile?.plan === 'Admin');
        }
      } else {
        console.log('No session found, clearing user state');
        setUser(null);
        setIsAdmin(false);
      }
      setSession(currentSession);
      
      // Only set loading to false on initial load or if we haven't completed initial load yet
      if (isInitialLoad || !initialLoadComplete) {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    };

    console.log('AuthProvider useEffect running - getting initial session');
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Initial session retrieved:', { hasSession: !!currentSession });
      fetchSessionAndProfile(currentSession, true);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', { event, hasSession: !!currentSession });
        // Don't show loading state for subsequent auth changes after initial load
        await fetchSessionAndProfile(currentSession, false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      // Check if there's an active session before attempting to sign out
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          // If the error is "Auth session missing!", treat it as successful logout
          if (error.message === "Auth session missing!") {
            console.log('Session already cleared, proceeding with logout');
          } else {
            console.error('Error logging out:', error.message);
          }
        }
      } else {
        // No active session, just clear the local state
        console.log('No active session found, clearing local state');
      }
      
      // Manually clear the state regardless of whether signOut succeeded
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      
    } catch (error: any) {
      // Handle the specific "Auth session missing!" error gracefully
      if (error?.message === "Auth session missing!") {
        console.log('Session already cleared, proceeding with logout');
      } else {
        console.error('Logout failed:', error);
      }
      // Even if logout fails, clear the local state
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    }
  };

  const clearAllSessions = async () => {
    try {
      console.log('Clearing all sessions and local storage');
      
      // Clear Supabase session
      await supabase.auth.signOut();
      
      // Clear local storage items related to Supabase
      if (typeof window !== 'undefined') {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('sb-')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Also clear session storage
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith('sb-')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => sessionStorage.removeItem(key));
      }
      
      // Clear local state
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setInitialLoadComplete(false);
      
      console.log('All sessions cleared');
    } catch (error) {
      console.error('Error clearing sessions:', error);
    }
  };

  const value = { user, session, loading, isAdmin, logout, clearAllSessions };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 