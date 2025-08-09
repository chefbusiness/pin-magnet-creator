import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  plan_type: 'free' | 'starter' | 'pro' | 'business';
  pins_generated_this_month: number;
  monthly_limit: number;
  subscription_status: 'active' | 'inactive' | 'cancelled';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  is_super_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  canGeneratePins: () => boolean;
  getRemainingPins: () => number;
  isSuperAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data as UserProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };
 
  const checkAndSyncSubscription = async () => {
    try {
      const { error } = await supabase.functions.invoke('check-subscription');
      if (error) {
        console.warn('check-subscription error', error);
      }
      if (user) {
        await fetchProfile(user.id);
      }
    } catch (e) {
      console.warn('check-subscription failed', e);
    }
  };
 
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const processPendingCheckout = async () => {
    try {
      const pendingPlan = localStorage.getItem('pendingPlan');
      if (pendingPlan && user) {
        const { data, error } = await supabase.functions.invoke('create-checkout', { body: { plan: pendingPlan } });
        if (!error && data?.url) {
          localStorage.removeItem('pendingPlan');
          window.location.href = data.url;
        }
      }
    } catch (e) {
      console.warn('processPendingCheckout failed', e);
    }
  };
 
   useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetch and subscription sync to avoid blocking
          setTimeout(() => {
            fetchProfile(session.user.id);
            checkAndSyncSubscription();
            processPendingCheckout();
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
        setTimeout(() => {
          checkAndSyncSubscription();
          processPendingCheckout();
        }, 0);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      toast({
        title: "Error de inicio de sesión",
        description: error.message,
        variant: "destructive",
      });
    }
    
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        }
      }
    });
    
    if (error) {
      toast({
        title: "Error de registro",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "¡Registro exitoso!",
        description: "Revisa tu email para confirmar tu cuenta.",
      });
    }
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
  };

  const canGeneratePins = () => {
    if (!profile) return false; // Requiere cuenta y suscripción activa
    if (profile.is_super_admin) return true; // Super admins ilimitado
    // Debe tener suscripción activa
    const isActive = profile.subscription_status === 'active';
    const remaining = (profile.monthly_limit || 0) - (profile.pins_generated_this_month || 0);
    return isActive && remaining > 0;
  };

  const getRemainingPins = () => {
    if (!profile) return 0; // Sin cuenta => 0
    if (profile.is_super_admin) return 999999; // Super admins ilimitado
    const remaining = Math.max(0, (profile.monthly_limit || 0) - (profile.pins_generated_this_month || 0));
    return remaining;
  };

  const isSuperAdmin = () => {
    return profile?.is_super_admin ?? false;
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    canGeneratePins,
    getRemainingPins,
    isSuperAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};