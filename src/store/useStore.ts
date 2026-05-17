import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';

interface AppState {
  session: Session | null;
  user: User | null;
  setSession: (session: Session | null) => void;
  language: string;
  setLanguage: (lang: string) => void;
}

export const useStore = create<AppState>((set) => ({
  session: null,
  user: null,
  setSession: (session) => set({ session, user: session?.user || null }),
  language: 'sw',
  setLanguage: (lang) => set({ language: lang }),
}));
