"use client";

import type { Profile } from "@larimar/types";
import type { Session } from "@supabase/supabase-js";
import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useEffectEvent,
  useState,
} from "react";
import { apiRequest } from "@/lib/api";
import {
  getSupabaseBrowserClient,
  isSupabaseBrowserConfigured,
} from "@/lib/supabase/browser";

type PasswordCredentials = {
  email: string;
  password: string;
};

type SignUpCredentials = PasswordCredentials & {
  fullName: string;
};

type AuthContextValue = {
  session: Session | null;
  profile: Profile | null;
  isReady: boolean;
  isAuthenticated: boolean;
  isConfigured: boolean;
  isAuthPanelOpen: boolean;
  openAuthPanel: () => void;
  closeAuthPanel: () => void;
  signInWithPassword: (credentials: PasswordCredentials) => Promise<void>;
  signUpWithPassword: (credentials: SignUpCredentials) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isConfigured = isSupabaseBrowserConfigured();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isAuthPanelOpen, setIsAuthPanelOpen] = useState(false);

  const syncProfile = useEffectEvent(async (nextSession: Session | null) => {
    if (!nextSession?.access_token) {
      setProfile(null);
      setIsReady(true);
      return;
    }

    try {
      const result = await apiRequest<{ profile: Profile }>("/api/me", {
        token: nextSession.access_token,
      });
      setProfile(result.profile);
    } catch {
      setProfile(null);
    } finally {
      setIsReady(true);
    }
  });

  useEffect(() => {
    if (!isConfigured) {
      setSession(null);
      setProfile(null);
      setIsReady(true);
      return;
    }

    let isMounted = true;
    const supabase = getSupabaseBrowserClient();

    void supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      setSession(data.session);
      startTransition(() => {
        void syncProfile(data.session);
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      startTransition(() => {
        void syncProfile(nextSession);
      });
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  async function signInWithPassword(credentials: PasswordCredentials) {
    if (!isConfigured) {
      throw new Error("Supabase auth is not configured.");
    }

    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword(credentials);

    if (error) {
      throw error;
    }

    setIsAuthPanelOpen(false);
  }

  async function signUpWithPassword(credentials: SignUpCredentials) {
    if (!isConfigured) {
      throw new Error("Supabase auth is not configured.");
    }

    const supabase = getSupabaseBrowserClient();
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          full_name: credentials.fullName,
        },
      },
    });

    if (error) {
      throw error;
    }
  }

  async function signInWithGoogle() {
    if (!isConfigured) {
      throw new Error("Supabase auth is not configured.");
    }

    const supabase = getSupabaseBrowserClient();
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      throw error;
    }
  }

  async function signOut() {
    if (!isConfigured) {
      setProfile(null);
      setSession(null);
      setIsAuthPanelOpen(false);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    setProfile(null);
    setIsAuthPanelOpen(false);
  }

  const value: AuthContextValue = {
    session,
    profile,
    isReady,
    isAuthenticated: Boolean(session),
    isConfigured,
    isAuthPanelOpen,
    openAuthPanel: () => setIsAuthPanelOpen(true),
    closeAuthPanel: () => setIsAuthPanelOpen(false),
    signInWithPassword,
    signUpWithPassword,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
