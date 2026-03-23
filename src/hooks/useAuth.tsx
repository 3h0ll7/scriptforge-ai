import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { hasActiveProSubscription } from "@/lib/subscription";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  subscription_tier: "free" | "pro";
  subscription_start_date: string | null;
  subscription_end_date: string | null;
}

interface UsageData {
  generation_count: number;
  month_year: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  usage: UsageData | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshUsage: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizeProfile(profile: Profile): Profile {
  if (hasActiveProSubscription(profile)) {
    return profile;
  }

  return {
    ...profile,
    subscription_tier: "free",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  const getCurrentMonthYear = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  };

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (data) setProfile(normalizeProfile(data as Profile));
  };

  const fetchUsage = async (userId: string) => {
    const monthYear = getCurrentMonthYear();
    const { data } = await supabase
      .from("usage_tracking")
      .select("*")
      .eq("user_id", userId)
      .eq("month_year", monthYear)
      .single();
    if (data) {
      setUsage({ generation_count: data.generation_count, month_year: data.month_year });
    } else {
      setUsage({ generation_count: 0, month_year: monthYear });
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  const refreshUsage = async () => {
    if (user) await fetchUsage(user.id);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
            fetchUsage(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setUsage(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchUsage(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setUsage(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, usage, loading, signOut, refreshProfile, refreshUsage }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
