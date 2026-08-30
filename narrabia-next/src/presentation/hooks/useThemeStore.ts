import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const detectPreferredTheme = (): ThemeMode => {
  const persisted = window.localStorage.getItem('literary-theme');

  if (persisted === 'light' || persisted === 'dark') {
    return persisted;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
  toggleTheme: () => {
    const nextTheme: ThemeMode = get().theme === 'light' ? 'dark' : 'light';
    window.localStorage.setItem('literary-theme', nextTheme);
    set({ theme: nextTheme });
  },
  setTheme: (theme) => set({ theme }),
}));

export const detectAndApplyPreferredTheme = () => {
  useThemeStore.getState().setTheme(detectPreferredTheme());
};
