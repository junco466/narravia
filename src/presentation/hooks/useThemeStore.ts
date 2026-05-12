import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const persisted = window.localStorage.getItem('literary-theme');

  if (persisted === 'light' || persisted === 'dark') {
    return persisted;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),
  toggleTheme: () => {
    const nextTheme: ThemeMode = get().theme === 'light' ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('literary-theme', nextTheme);
    }
    set({ theme: nextTheme });
  },
}));
