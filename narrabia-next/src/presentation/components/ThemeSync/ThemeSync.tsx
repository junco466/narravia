'use client';

import { useEffect } from 'react';
import { detectAndApplyPreferredTheme, useThemeStore } from '@/presentation/hooks/useThemeStore';

export const ThemeSync = () => {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    detectAndApplyPreferredTheme();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return null;
};
